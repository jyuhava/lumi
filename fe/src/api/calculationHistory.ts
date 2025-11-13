import axios from './axios'

export interface CalculationHistoryData {
  calculator_type: string
  method: string
  inputs: Record<string, any>
  results: Record<string, any>
  notes?: string
}

export interface CalculationHistory extends CalculationHistoryData {
  id: number
  user_id: number
  created_at: string
  updated_at: string
}

export const calculationHistoryApi = {
  getHistory(params?: { calculator_type?: string; method?: string; page?: number }) {
    return axios.get<{ data: CalculationHistory[]; meta: any }>('/calculation-history', { params })
  },

  saveHistory(data: CalculationHistoryData) {
    return axios.post<{ message: string; data: CalculationHistory }>('/calculation-history', data)
  },

  getDetail(id: number) {
    return axios.get<CalculationHistory>(`/calculation-history/${id}`)
  },

  deleteHistory(id: number) {
    return axios.delete<{ message: string }>(`/calculation-history/${id}`)
  },

  deleteAll(calculator_type?: string) {
    return axios.delete<{ message: string }>('/calculation-history', {
      params: { calculator_type }
    })
  }
}
