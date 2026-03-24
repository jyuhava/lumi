<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';

const router = useRouter();

const tenants = ref([]);
const stats = ref({
  total_tenants: 0,
  active_tenants: 0,
  total_users: 0,
  estimated_mrr: 0
});
const loading = ref(true);
const isSubmitting = ref(false);

const adminUser = ref(JSON.parse(localStorage.getItem('saas_user') || '{}'));

// Modal state
const showModal = ref(false);
const isEditing = ref(false);
const form = ref({
    id: null,
    name: '',
    subdomain: '',
    plan: 'basic',
    status: 'active',
    pic_name: '',
    pic_email: '',
    pic_username: '',
    pic_password: ''
});

const handleLogout = async () => {
    try {
        await api.post('/saas/logout');
    } catch(e) {}
    
    localStorage.removeItem('saas_token');
    localStorage.removeItem('saas_user');
    router.push('/login');
};

const API_BASE = 'http://localhost:8001/api/saas/tenants';

const fetchDashboardData = async () => {
    loading.value = true;
    try {
        const res = await api.get('/saas/tenants');
        tenants.value = res.data.data;
        stats.value = res.data.stats;
    } catch (error) {
        console.error("Error fetching admin stats", error);
    } finally {
        loading.value = false;
    }
};

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
};

// Modal Actions
const openAddModal = () => {
    isEditing.value = false;
    form.value = { id: null, name: '', subdomain: '', plan: 'basic', status: 'active' };
    showModal.value = true;
};

const openEditModal = (tenant) => {
    isEditing.value = true;
    form.value = { ...tenant };
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

// Form Action: Insert / Update
const submitForm = async () => {
    isSubmitting.value = true;
    try {
        const url = isEditing.value ? `/saas/tenants/${form.value.id}` : `/saas/tenants`;
        
        let payload = {
            name: form.value.name,
            subdomain: form.value.subdomain,
            plan: form.value.plan,
            status: form.value.status
        };

        if(!isEditing.value) {
            payload = {
                ...payload,
                pic_name: form.value.pic_name,
                pic_email: form.value.pic_email,
                pic_username: form.value.pic_username,
                pic_password: form.value.pic_password
            };
        }

        const res = isEditing.value ? await api.put(url, payload) : await api.post(url, payload);

        await fetchDashboardData();
        closeModal();
        alert(res.data.message);
    } catch (error) {
        if(error.response?.data?.errors) {
            const firstError = Object.values(error.response.data.errors)[0][0];
            alert("Error Validasi: " + firstError);
        } else {
            console.error(error);
            alert(error.response?.data?.message || "Gagal menghubungi server");
        }
    } finally {
        isSubmitting.value = false;
    }
};

// Block/Unblock toggle
const toggleStatus = async (id) => {
    if(!confirm("Yakin ingin mengubah status akses tenant ini?")) return;
    
    try {
        await api.patch(`/saas/tenants/${id}/toggle-status`);
        fetchDashboardData();
    } catch (error) {
        console.error("Error toggling status", error);
    }
};

const deleteTenant = async (id) => {
    if(!confirm("BAHAYA: Anda yakin menghapus tenant ini beserta seluruh datanya?")) return;
    
    try {
        await api.delete(`/saas/tenants/${id}`);
        fetchDashboardData();
    } catch (error) {
        console.error("Error deleting", error);
    }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar SaaS Admin -->
    <aside class="w-64 bg-[#111827] text-white flex flex-col">
      <div class="h-16 flex items-center justify-center border-b border-gray-800">
        <h1 class="text-xl font-bold tracking-widest uppercase">LUMINE <span class="text-emerald-500">SaaS</span></h1>
      </div>
      <nav class="flex-1 p-4 space-y-2">
        <a href="#" class="flex items-center gap-3 px-4 py-2.5 bg-emerald-600 rounded-lg text-white font-medium">Dashboard</a>
      </nav>
      <div class="p-4 mt-auto border-t border-gray-800">
        <button @click="handleLogout" class="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm text-red-400 hover:text-white hover:bg-red-600 rounded-lg transition-colors">
            Logout Master
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col relative">
      <header class="h-16 bg-white border-b border-gray-200 flex items-center px-8 justify-between shadow-sm z-10">
        <h2 class="text-xl font-bold text-gray-800">Overview Panel</h2>
        <div class="flex items-center gap-4">
          <span class="text-sm font-semibold text-gray-600">Halo, {{ adminUser.name || 'Master' }}</span>
        </div>
      </header>

      <div v-if="loading" class="p-8 flex justify-center items-center h-full">
        <p class="text-gray-500 font-medium animate-pulse">Menghubungkan ke Pusat Data Server...</p>
      </div>

      <div v-else class="p-8 pb-20">
        <div class="grid grid-cols-3 gap-6 mb-8">
            <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p class="text-sm text-gray-500 font-medium">Total Klien (Rumah Sakit)</p>
                <div class="flex items-end gap-2 mt-2">
                    <p class="text-3xl font-bold text-gray-900">{{ stats.total_tenants }}</p>
                    <p class="text-xs text-emerald-600 font-medium mb-1">{{ stats.active_tenants }} Kontrak Aktif</p>
                </div>
            </div>
            <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p class="text-sm text-gray-500 font-medium">Total Akun Nakes (Seluruh RS)</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.total_users }}</p>
            </div>
            <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm group">
                <p class="text-sm text-gray-500 font-medium">Estimasi Pendapatan Kotor (MRR)</p>
                <p class="text-3xl font-bold text-emerald-600 mt-2 blur-sm group-hover:blur-none transition-all duration-300">{{ formatRupiah(stats.estimated_mrr) }}</p>
            </div>
        </div>

        <div class="flex justify-between items-center mb-4 mt-8">
            <h3 class="text-lg font-bold text-gray-800">Daftar Instalasi Klien</h3>
            <button @click="openAddModal" class="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition shadow-sm">+ Register Klien Baru</button>
        </div>

        <div class="bg-white border border-gray-200 rounded-xl overflow-visible shadow-sm">
          <table class="w-full text-left text-sm text-gray-500">
            <thead class="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th class="px-6 py-4">Nama Instansi</th>
                <th class="px-6 py-4">Sistem Subdomain</th>
                <th class="px-6 py-4">Plan Berlangganan</th>
                <th class="px-6 py-4">Status Layanan</th>
                <th class="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="tenant in tenants" :key="tenant.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 font-bold text-gray-900 flex items-center gap-3">
                    <div class="w-8 h-8 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        {{ tenant.name.charAt(0) }}
                    </div>
                    {{ tenant.name }}
                </td>
                <td class="px-6 py-4"><span class="bg-gray-100 px-2 py-1 rounded text-gray-700 font-mono text-xs border border-gray-200">https://{{ tenant.subdomain }}.lumine.com</span></td>
                <td class="px-6 py-4">
                    <span v-if="tenant.plan === 'premium'" class="bg-purple-100 text-purple-700 px-2 py-1 rounded-md font-bold text-xs uppercase tracking-wide">Premium</span>
                    <span v-else class="bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-bold text-xs uppercase tracking-wide">Basic</span>
                </td>
                <td class="px-6 py-4">
                  <span v-if="tenant.status === 'active'" class="flex w-max items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-full text-xs">
                    <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Aktif
                  </span>
                  <span v-else class="flex w-max items-center gap-1.5 text-red-600 font-bold bg-red-50 px-2 py-1 rounded-full text-xs">
                    <div class="w-1.5 h-1.5 rounded-full bg-red-500"></div> Suspend
                  </span>
                </td>
                <td class="px-6 py-4 text-right font-medium">
                    <button @click="openEditModal(tenant)" class="text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                    <button @click="toggleStatus(tenant.id)" :class="tenant.status === 'active' ? 'text-amber-600 hover:text-amber-800 mr-4' : 'text-emerald-600 hover:text-emerald-800 mr-4'">
                        {{ tenant.status === 'active' ? 'Blokir' : 'Buka Blokir' }}
                    </button>
                    <!-- Tombol Hapus hanya visibilitas Super Admin (opsional utk proteksi) -->
                    <button @click="deleteTenant(tenant.id)" class="text-red-600 hover:text-red-800">Hapus</button>
                </td>
              </tr>
              
              <tr v-if="tenants.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-gray-400 font-medium">Belum ada klien yang terdaftar.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- MODAL FORM -->
      <div v-if="showModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 class="font-bold text-gray-800 text-lg">{{ isEditing ? 'Edit Data Klien' : 'Registrasi Klien Baru' }}</h3>
                <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-xl font-bold">&times;</button>
            </div>
            
            <form @submit.prevent="submitForm" class="p-6">
                <div class="mb-4">
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Nama Instansi / RS</label>
                    <input v-model="form.name" type="text" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Cth: RS Medika Sentosa">
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Subdomain Web</label>
                    <div class="flex items-center">
                        <input v-model="form.subdomain" type="text" required pattern="[A-Za-z0-9\-]+" class="w-full border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="rs-medika">
                        <div class="bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg px-3 py-2 text-sm text-gray-500 font-mono">.lumine.com</div>
                    </div>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Paket Langganan</label>
                    <select v-model="form.plan" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                        <option value="basic">Basic (Rp 1.000.000/bln)</option>
                        <option value="premium">Premium (Rp 2.500.000/bln)</option>
                        <option value="enterprise">Enterprise (Custom)</option>
                    </select>
                </div>

                <div v-if="!isEditing" class="mt-8 mb-4 border-t border-gray-100 pt-6">
                    <h4 class="font-bold text-gray-800 text-md mb-4 border-l-4 border-emerald-500 pl-2">Data PIC (Akun Nakes Pertama)</h4>
                    
                    <div class="mb-4">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap PIC</label>
                        <input v-model="form.pic_name" type="text" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Cth: Dr. Budi Santoso">
                    </div>
                    
                    <div class="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1">Email PIC</label>
                            <input v-model="form.pic_email" type="email" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="budi@rs.com">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-1">Username Login</label>
                            <input v-model="form.pic_username" type="text" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="drbudi">
                        </div>
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Password Default</label>
                        <input v-model="form.pic_password" type="text" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Minimal 6 karakter">
                        <p class="text-xs text-gray-500 mt-1">Nakes ini dapat mengubah passwordnya nanti dari dalam aplikasi.</p>
                    </div>
                </div>

                <div class="mb-6" :class="{'mt-4 border-t border-gray-100 pt-6': isEditing}">
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Status Sistem</label>
                    <div class="flex gap-4">
                        <label class="flex items-center gap-2 text-sm cursor-pointer">
                            <input type="radio" v-model="form.status" value="active" class="text-emerald-500 focus:ring-emerald-500"> Aktif
                        </label>
                        <label class="flex items-center gap-2 text-sm cursor-pointer text-red-600">
                            <input type="radio" v-model="form.status" value="suspended" class="text-red-500 focus:ring-red-500"> Suspended
                        </label>
                    </div>
                </div>

                <div class="flex justify-end gap-3">
                    <button type="button" @click="closeModal" class="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition">Batal</button>
                    <button type="submit" :disabled="isSubmitting" class="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition">
                        {{ isSubmitting ? 'Menyimpan...' : 'Simpan Klien' }}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </main>
  </div>
</template>
