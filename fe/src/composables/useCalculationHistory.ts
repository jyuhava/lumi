import { ref } from 'vue'
import { calculationHistoryApi, type CalculationHistoryData } from '@/api/calculationHistory'

export function useCalculationHistory() {
  const saving = ref(false)
  const error = ref<string | null>(null)

  const saveCalculation = async (data: CalculationHistoryData) => {
    try {
      saving.value = true
      error.value = null
      await calculationHistoryApi.saveHistory(data)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal menyimpan riwayat perhitungan'
      console.error('Failed to save calculation history:', err)
      return false
    } finally {
      saving.value = false
    }
  }

  return {
    saving,
    error,
    saveCalculation
  }
}
