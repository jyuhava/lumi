<template>
  <AdminLayout>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center space-x-3 mb-2">
        <router-link to="/stock-opname" class="text-gray-400 hover:text-gray-600">
          <ion-icon name="arrow-back" class="text-2xl"></ion-icon>
        </router-link>
        <h2 class="text-2xl font-bold text-gray-900">History Transaksi Stok</h2>
      </div>
      <p class="text-gray-600">Riwayat pembelian dan pemakaian stok</p>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div class="grid grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tipe Transaksi
          </label>
          <select
            v-model="filters.type"
            @change="fetchHistory"
            class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Semua</option>
            <option value="in">Pembelian</option>
            <option value="out">Pemakaian</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Dari Tanggal
          </label>
          <input
            v-model="filters.start_date"
            @change="fetchHistory"
            type="date"
            class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Sampai Tanggal
          </label>
          <input
            v-model="filters.end_date"
            @change="fetchHistory"
            type="date"
            class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div class="flex items-end">
          <button
            @click="resetFilters"
            class="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Reset Filter
          </button>
        </div>
      </div>
    </div>

    <!-- History Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
        <p class="mt-4 text-gray-600">Memuat data...</p>
      </div>

      <div v-else-if="transactions.length === 0" class="p-12 text-center">
        <ion-icon name="document-text-outline" class="text-6xl text-gray-300 mb-4"></ion-icon>
        <p class="text-gray-600">Tidak ada transaksi ditemukan</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No. Transaksi
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipe
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Item
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Harga
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catatan
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="transaction in transactions" :key="transaction.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ transaction.transaction_number }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatDate(transaction.transaction_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'px-3 py-1 text-xs font-medium rounded-full',
                    transaction.type === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ transaction.type === 'in' ? 'Pembelian' : 'Pemakaian' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ transaction.supplier?.name || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ transaction.items?.length || 0 }} item
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                <span v-if="transaction.total_amount > 0">
                  Rp {{ formatPrice(transaction.total_amount) }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                {{ transaction.notes || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="viewDetail(transaction)"
                  class="text-indigo-600 hover:text-indigo-900"
                >
                  <ion-icon name="eye-outline" class="text-xl"></ion-icon>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Detail Modal -->
    <TransitionRoot appear :show="isDetailModalOpen" as="template">
      <Dialog as="div" @close="closeDetailModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-bold text-gray-900 mb-4">
                  Detail Transaksi
                </DialogTitle>

                <div v-if="selectedTransaction" class="space-y-4">
                  <!-- Transaction Info -->
                  <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div class="text-xs text-gray-500">No. Transaksi</div>
                      <div class="font-medium">{{ selectedTransaction.transaction_number }}</div>
                    </div>
                    <div>
                      <div class="text-xs text-gray-500">Tanggal</div>
                      <div class="font-medium">{{ formatDate(selectedTransaction.transaction_date) }}</div>
                    </div>
                    <div>
                      <div class="text-xs text-gray-500">Tipe</div>
                      <div>
                        <span 
                          :class="[
                            'px-2 py-1 text-xs font-medium rounded-full',
                            selectedTransaction.type === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          ]"
                        >
                          {{ selectedTransaction.type === 'in' ? 'Pembelian' : 'Pemakaian' }}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div class="text-xs text-gray-500">Supplier</div>
                      <div class="font-medium">{{ selectedTransaction.supplier?.name || '-' }}</div>
                    </div>
                    <div class="col-span-2">
                      <div class="text-xs text-gray-500">Catatan</div>
                      <div class="font-medium">{{ selectedTransaction.notes || '-' }}</div>
                    </div>
                  </div>

                  <!-- Items Table -->
                  <div>
                    <h4 class="font-semibold mb-2">Detail Item</h4>
                    <table class="min-w-full divide-y divide-gray-200 border">
                      <thead class="bg-gray-50">
                        <tr>
                          <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Produk</th>
                          <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Jumlah</th>
                          <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Stok Sebelum</th>
                          <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Stok Sesudah</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200">
                        <tr v-for="item in selectedTransaction.items" :key="item.id">
                          <td class="px-4 py-2 text-sm">{{ item.product?.name }}</td>
                          <td class="px-4 py-2 text-sm font-medium">{{ item.quantity }}</td>
                          <td class="px-4 py-2 text-sm">{{ item.stock_before }}</td>
                          <td class="px-4 py-2 text-sm font-bold">{{ item.stock_after }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="mt-6 flex justify-between items-center">
                  <div class="flex space-x-2">
                    <button
                      @click="exportToExcel"
                      class="inline-flex items-center space-x-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                    >
                      <ion-icon name="document-text-outline" class="text-xl"></ion-icon>
                      <span>Export Excel</span>
                    </button>
                    <button
                      @click="exportToPDF"
                      class="inline-flex items-center space-x-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                    >
                      <ion-icon name="document-outline" class="text-xl"></ion-icon>
                      <span>Export PDF</span>
                    </button>
                  </div>
                  <button
                    @click="closeDetailModal"
                    class="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                  >
                    Tutup
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import AdminLayout from '@/components/AdminLayout.vue'
import api from '@/api/axios'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface Product {
  id: number
  name: string
}

interface Supplier {
  id: number
  name: string
}

interface TransactionItem {
  id: number
  product_id: number
  quantity: number
  stock_before: number
  stock_after: number
  product?: Product
}

interface Transaction {
  id: number
  transaction_number: string
  type: 'in' | 'out'
  transaction_date: string
  supplier_id: number | null
  notes: string | null
  total_amount: number
  supplier?: Supplier
  items?: TransactionItem[]
}

const transactions = ref<Transaction[]>([])
const loading = ref(false)
const isDetailModalOpen = ref(false)
const selectedTransaction = ref<Transaction | null>(null)

const filters = ref({
  type: '',
  start_date: '',
  end_date: ''
})

const fetchHistory = async () => {
  loading.value = true
  try {
    const params: any = {}
    if (filters.value.type) params.type = filters.value.type
    if (filters.value.start_date) params.start_date = filters.value.start_date
    if (filters.value.end_date) params.end_date = filters.value.end_date

    const response = await api.get('/stock-transactions', { params })
    if (response.data.success) {
      transactions.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching history:', error)
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filters.value = {
    type: '',
    start_date: '',
    end_date: ''
  }
  fetchHistory()
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const viewDetail = (transaction: Transaction) => {
  selectedTransaction.value = transaction
  isDetailModalOpen.value = true
}

const closeDetailModal = () => {
  isDetailModalOpen.value = false
  selectedTransaction.value = null
}

const exportToExcel = () => {
  if (!selectedTransaction.value) return

  const transaction = selectedTransaction.value
  
  // Prepare data for Excel
  const worksheetData = [
    ['DETAIL TRANSAKSI STOK'],
    [],
    ['No. Transaksi', transaction.transaction_number],
    ['Tanggal', formatDate(transaction.transaction_date)],
    ['Tipe', transaction.type === 'in' ? 'Pembelian' : 'Pemakaian'],
    ['Supplier', transaction.supplier?.name || '-'],
    ['Catatan', transaction.notes || '-'],
    [],
    ['DETAIL ITEM'],
    ['Produk', 'Jumlah', 'Stok Sebelum', 'Stok Sesudah'],
  ]

  // Add items
  transaction.items?.forEach(item => {
    worksheetData.push([
      item.product?.name || '',
      item.quantity,
      item.stock_before,
      item.stock_after
    ])
  })

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet(worksheetData)

  // Set column widths
  ws['!cols'] = [
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 15 }
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'Transaksi')
  
  // Generate binary string
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  
  // Create blob
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  
  // Create download link
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Transaksi_${transaction.transaction_number}.xlsx`
  
  // Trigger download
  document.body.appendChild(link)
  link.click()
  
  // Cleanup
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

const exportToPDF = () => {
  if (!selectedTransaction.value) return

  const transaction = selectedTransaction.value
  const doc = new jsPDF()

  // Title
  doc.setFontSize(16)
  doc.text('DETAIL TRANSAKSI STOK', 14, 15)

  // Transaction Info
  doc.setFontSize(10)
  let yPos = 30
  doc.text(`No. Transaksi: ${transaction.transaction_number}`, 14, yPos)
  yPos += 7
  doc.text(`Tanggal: ${formatDate(transaction.transaction_date)}`, 14, yPos)
  yPos += 7
  doc.text(`Tipe: ${transaction.type === 'in' ? 'Pembelian' : 'Pemakaian'}`, 14, yPos)
  yPos += 7
  doc.text(`Supplier: ${transaction.supplier?.name || '-'}`, 14, yPos)
  yPos += 7
  doc.text(`Catatan: ${transaction.notes || '-'}`, 14, yPos)
  yPos += 10

  // Items Table
  const tableData = transaction.items?.map(item => [
    item.product?.name || '',
    item.quantity.toString(),
    item.stock_before.toString(),
    item.stock_after.toString()
  ]) || []

  autoTable(doc, {
    startY: yPos,
    head: [['Produk', 'Jumlah', 'Stok Sebelum', 'Stok Sesudah']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
  })

  // Download
  const filename = `Transaksi_${transaction.transaction_number}.pdf`
  doc.save(filename)
}

onMounted(() => {
  fetchHistory()
})
</script>
