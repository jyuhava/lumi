<?php

namespace App\Http\Controllers;

use App\Models\NutritionPlan;
use App\Models\NutritionPlanItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class NutritionPlanController extends Controller
{
    /**
     * Display a listing of nutrition plans.
     */
    public function index(Request $request)
    {
        $query = NutritionPlan::with('patient');

        if ($request->filled('patient_id')) {
            $query->where('patient_id', $request->patient_id);
        }

        return response()->json($query->latest()->get());
    }

    /**
     * Store a newly created nutrition plan.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,id',
            'plan_name' => 'required|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $plan = NutritionPlan::create($validator->validated());

        return response()->json($plan, 201);
    }

    /**
     * Display the specified nutrition plan with its nested items.
     */
    public function show($id)
    {
        $plan = NutritionPlan::with(['patient', 'items.food'])->findOrFail($id);

        // Group items by day_of_week then by meal_type
        $grouped = [];
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        $mealTypes = ['breakfast', 'snack', 'lunch', 'dinner'];

        foreach ($days as $day) {
            $grouped[$day] = [];
            foreach ($mealTypes as $mt) {
                $grouped[$day][$mt] = [];
            }
        }

        foreach ($plan->items as $item) {
            if (isset($grouped[$item->day_of_week][$item->meal_type])) {
                $grouped[$item->day_of_week][$item->meal_type][] = $item;
            }
        }

        return response()->json([
            'plan' => $plan,
            'grouped_items' => $grouped
        ]);
    }

    /**
     * Update/Sync the items for a specific day and meal in the plan.
     */
    public function updateItems(Request $request, $id)
    {
        $plan = NutritionPlan::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'day_of_week' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'meal_type' => 'required|in:breakfast,lunch,dinner,snack',
            'items' => 'required|array',
            'items.*.food_id' => 'required|exists:foods,id',
            'items.*.quantity' => 'required|numeric|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        DB::beginTransaction();
        try {
            // Determine IDs to keep
            $providedItemIds = collect($data['items'])->pluck('id')->filter()->toArray();
            
            // Delete items that belong to the plan matching this day & meal type but are not in the provided list
            NutritionPlanItem::where('plan_id', $plan->id)
                ->where('day_of_week', $data['day_of_week'])
                ->where('meal_type', $data['meal_type'])
                ->whereNotIn('id', $providedItemIds)
                ->delete();

            // Create or update items
            foreach ($data['items'] as $item) {
                if (isset($item['id'])) {
                    // Update existing
                    NutritionPlanItem::where('id', $item['id'])
                        ->where('plan_id', $plan->id)
                        ->update([
                            'food_id' => $item['food_id'],
                            'quantity' => $item['quantity']
                        ]);
                } else {
                    // Create new
                    NutritionPlanItem::create([
                        'plan_id' => $plan->id,
                        'food_id' => $item['food_id'],
                        'day_of_week' => $data['day_of_week'],
                        'meal_type' => $data['meal_type'],
                        'quantity' => $item['quantity']
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Plan items updated successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update plan items: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified plan.
     */
    public function destroy($id)
    {
        $plan = NutritionPlan::findOrFail($id);
        $plan->delete(); // Items cascade delete handled by DB or Eloquent events

        return response()->json(['message' => 'Plan deleted successfully']);
    }
}