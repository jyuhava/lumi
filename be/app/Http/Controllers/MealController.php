<?php

namespace App\Http\Controllers;

use App\Models\Meal;
use App\Models\MealItem;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class MealController extends Controller
{
    /**
     * Get meals for a specific patient and date range.
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,id',
            'date' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $meals = Meal::with(['items.food'])
            ->where('patient_id', $request->patient_id)
            ->where('date', $request->date)
            ->get();
            
        // Group by meal_type for easier frontend consumption
        $dailyIntake = [
            'breakfast' => $meals->firstWhere('meal_type', 'breakfast'),
            'lunch' => $meals->firstWhere('meal_type', 'lunch'),
            'dinner' => $meals->firstWhere('meal_type', 'dinner'),
            'snack' => $meals->firstWhere('meal_type', 'snack'),
        ];
        
        $totals = $this->calculateDailyTotals($meals);

        return response()->json([
            'meals' => $dailyIntake,
            'totals' => $totals
        ]);
    }

    /**
     * Store or update a meal and its items (Food Recall / Daily log).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,id',
            'date' => 'required|date',
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
            // Find or create the meal session for this patient, date, and type
            $meal = Meal::updateOrCreate(
                [
                    'patient_id' => $data['patient_id'],
                    'date' => $data['date'],
                    'meal_type' => $data['meal_type']
                ]
            );

            // Re-sync all items for this meal type
            // Determine IDs to keep
            $providedItemIds = collect($data['items'])->pluck('id')->filter()->toArray();
            
            // Delete items that belong to the meal but are not in the provided list
            MealItem::where('meal_id', $meal->id)
                ->whereNotIn('id', $providedItemIds)
                ->delete();

            // Create or update items
            foreach ($data['items'] as $item) {
                if (isset($item['id'])) {
                    // Update existing
                    MealItem::where('id', $item['id'])
                        ->where('meal_id', $meal->id)
                        ->update([
                            'food_id' => $item['food_id'],
                            'quantity' => $item['quantity']
                        ]);
                } else {
                    // Create new
                    MealItem::create([
                        'meal_id' => $meal->id,
                        'food_id' => $item['food_id'],
                        'quantity' => $item['quantity']
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Meal logged successfully',
                'meal' => $meal->load('items.food')
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to log meal: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Delete an entire meal session
     */
    public function destroy($id)
    {
        $meal = Meal::findOrFail($id);
        $meal->delete();

        return response()->json(['message' => 'Meal deleted successfully']);
    }
    
    /**
     * Calculate Macro & Micro totals for the day
     */
    protected function calculateDailyTotals($meals)
    {
        $totals = [
            'energy' => 0,
            'protein' => 0,
            'fat' => 0,
            'carbohydrate' => 0,
            'fiber' => 0,
            'sugar' => 0,
            'sodium' => 0,
            'calcium' => 0,
            'iron' => 0,
            'vitamin_a' => 0,
            'vitamin_b' => 0,
            'vitamin_c' => 0,
        ];

        foreach ($meals as $meal) {
            foreach ($meal->items as $item) {
                if (!$item->food) continue;
                
                $ratio = $item->quantity / 100; // Since macros are per 100g
                
                $totals['energy'] += $item->food->energy * $ratio;
                $totals['protein'] += $item->food->protein * $ratio;
                $totals['fat'] += $item->food->fat * $ratio;
                $totals['carbohydrate'] += $item->food->carbohydrate * $ratio;
                $totals['fiber'] += $item->food->fiber * $ratio;
                $totals['sugar'] += $item->food->sugar * $ratio;
                $totals['sodium'] += $item->food->sodium * $ratio;
                $totals['calcium'] += $item->food->calcium * $ratio;
                $totals['iron'] += $item->food->iron * $ratio;
                $totals['vitamin_a'] += $item->food->vitamin_a * $ratio;
                $totals['vitamin_b'] += $item->food->vitamin_b * $ratio;
                $totals['vitamin_c'] += $item->food->vitamin_c * $ratio;
            }
        }
        
        // Format to 2 decimal places
        foreach ($totals as $key => $val) {
            $totals[$key] = round($val, 2);
        }

        return $totals;
    }
}