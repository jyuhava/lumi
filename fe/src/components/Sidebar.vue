<template>
  <!-- Mobile Overlay Backdrop -->
  <div 
    v-show="isOpen" 
    @click="$emit('close-sidebar')"
    class="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm transition-opacity"
  ></div>

  <aside 
    :class="[
      'bg-[#16200B] text-white transition-all duration-300 flex flex-col z-40 shadow-2xl h-full shrink-0 absolute md:relative',
      isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 w-64 md:w-20'
    ]"
  >
    <!-- Logo Area -->
    <div class="h-16 flex items-center justify-center px-4 border-b border-white/5 bg-[#1b2711]">
      <div class="flex items-center space-x-3 overflow-hidden whitespace-nowrap w-full" :class="isOpen ? 'justify-start' : 'justify-center'">
        <div class="flex items-center justify-center flex-shrink-0">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#739b1a] to-[#4a6825] flex items-center justify-center shadow-[0_0_15px_rgba(115,155,26,0.3)]">
            <ion-icon name="medical" class="text-white text-lg"></ion-icon>
          </div>
        </div>
        <div v-show="isOpen" class="flex flex-col animate-fade-in">
          <h1 class="font-bold text-lg tracking-wide text-white leading-tight font-serif">Lumine<span class="text-[#bcdd5a]">.</span></h1>
          <p class="text-[10px] text-gray-400 font-medium tracking-wider">by Syntaf</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 py-4 overflow-y-auto scrollbar-thin">
      <template v-for="(group, groupIndex) in menus" :key="groupIndex">
        <div class="px-3 mt-4 mb-2 first:mt-0" v-show="isOpen && group.title">
          <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-2 mb-1">{{ group.title }}</p>
        </div>
        
        <ul class="space-y-1.5 px-3">
          <template v-for="(item, index) in group.items" :key="index">
            
            <!-- Item non-dropdown -->
            <li v-if="!item.children">
              <router-link
                :to="item.path"
                class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 group relative"
                :class="[
                  $route.path === item.path 
                    ? 'bg-[#2b3c19] text-white shadow-inner border border-white/5' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                ]"
              >
                <!-- Active Indicator Dot -->
                <div 
                  v-if="$route.path === item.path" 
                  class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#bcdd5a] rounded-r-full shadow-[0_0_10px_rgba(188,221,90,0.5)]"
                ></div>

                <ion-icon 
                  :name="item.icon" 
                  class="text-xl flex-shrink-0 transition-colors duration-300"
                  :class="$route.path === item.path ? 'text-[#bcdd5a]' : 'group-hover:text-white'"
                ></ion-icon>
                
                <span v-show="isOpen" class="tracking-wide font-medium truncate" :class="$route.path === item.path ? 'font-semibold text-white' : ''">
                  {{ item.label }}
                </span>
                
                <!-- Tooltip for collapsed sidebar -->
                <div 
                  v-show="!isOpen" 
                  class="absolute left-[calc(100%+12px)] bg-[#1b2711] text-white px-3 py-2 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50 border border-white/10"
                >
                  {{ item.label }}
                </div>
              </router-link>
            </li>

            <!-- Item Dropdown -->
            <li v-else>
              <button
                @click="toggleMenu(item)"
                class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-300 group relative"
                :class="[
                  isActiveParent(item) || item.isOpen
                    ? 'bg-white/5 text-white' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                ]"
              >
                <!-- Active Indicator Line mapping for Parent -->
                <div 
                  v-if="isActiveParent(item) && !isOpen" 
                  class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#bcdd5a] rounded-r-full shadow-[0_0_10px_rgba(188,221,90,0.5)] opacity-50"
                ></div>

                <div class="flex items-center space-x-3 w-[calc(100%-20px)]">
                  <ion-icon 
                    :name="item.icon" 
                    class="text-xl flex-shrink-0 transition-colors duration-300"
                    :class="isActiveParent(item) ? 'text-[#bcdd5a]' : 'group-hover:text-white'"
                  ></ion-icon>
                  
                  <span v-show="isOpen" class="tracking-wide font-medium truncate" :class="isActiveParent(item) ? 'font-semibold text-white' : ''">
                    {{ item.label }}
                  </span>
                </div>
                
                <ion-icon 
                   v-show="isOpen" 
                   :name="item.isOpen ? 'chevron-up-outline' : 'chevron-down-outline'" 
                   class="transition-transform duration-300 flex-shrink-0 text-gray-500 group-hover:text-white"
                ></ion-icon>

                <!-- Tooltip for collapsed sidebar -->
                <div 
                  v-show="!isOpen" 
                  class="absolute left-[calc(100%+12px)] bg-[#1b2711] text-white px-3 py-2 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50 border border-white/10"
                >
                  {{ item.label }}
                </div>
              </button>

              <!-- Dropdown Content -->
              <div v-show="isOpen && item.isOpen" class="mt-1 mb-1.5 space-y-0.5 overflow-hidden animate-slide-down">
                <router-link
                  v-for="child in item.children"
                  :key="child.path"
                  :to="child.path"
                  class="flex items-center space-x-3 pl-11 pr-3 py-2.5 rounded-lg text-xs transition-all duration-200 relative group/child"
                  :class="[
                    $route.path.startsWith(child.path)
                      ? 'text-white bg-[#1b2711]/50' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  ]"
                >
                  <!-- Active Indicator relative to child -->
                  <div 
                    v-if="$route.path.startsWith(child.path)" 
                    class="absolute left-[22px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#bcdd5a] rounded-full shadow-[0_0_5px_rgba(188,221,90,0.5)]"
                  ></div>
                  <div 
                    v-else 
                    class="absolute left-[23.5px] top-1/2 -translate-y-1/2 w-[3px] h-[3px] bg-gray-500 rounded-full group-hover/child:bg-gray-400"
                  ></div>

                  <span class="tracking-wide truncate" :class="$route.path.startsWith(child.path) ? 'font-bold' : 'font-medium'">
                    {{ child.label }}
                  </span>
                </router-link>
              </div>
            </li>

          </template>
        </ul>
      </template>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close-sidebar'])

const route = useRoute()

const menus = ref([
  {
    title: 'Utama',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: 'grid-outline' }
    ]
  },
  {
    title: 'Pelayanan Pasien',
    items: [
      { path: '/nutritional-visits', label: 'Buku Register', icon: 'document-text-outline' },
      { 
        label: 'Skrining & Edukasi', 
        icon: 'analytics-outline',
        isOpen: false,
        children: [
          { path: '/calculator-v1', label: 'Kalkulator Klinis (v1)' },
          { path: '/calculator', label: 'Kalkulator Klinis Baru' },
          { path: '/calculator/history', label: 'Riwayat Skrining' },
        ]
      }
    ]
  },
  {
    title: 'Manajemen Data',
    items: [
      { 
        label: 'Inventori Taktis', 
        icon: 'cube-outline',
        isOpen: false,
        children: [
          { path: '/products', label: 'Indeks Produk' },
          { path: '/categories', label: 'Kategori Produk' },
          { path: '/suppliers', label: 'Mitra Pengadaan' },
          { path: '/stock-opname', label: 'Evaluasi Stok' },
        ]
      },
      { 
        label: 'Manajemen Tim', 
        icon: 'people-outline',
        isOpen: false,
        children: [
          { path: '/employees', label: 'Tenaga Gizi' },
          { path: '/shifts', label: 'Manajemen Shift' },
          { path: '/scheduler', label: 'Penjadwalan' },
          { path: '/leave-requests', label: 'Pengajuan Cuti' },
        ]
      },
      { path: '/diets', label: 'Master Diet', icon: 'restaurant-outline' },
    ]
  },
  {
    title: 'Sistem',
    items: [
      { path: '/reports', label: 'Laporan', icon: 'bar-chart-outline' },
      { path: '/settings', label: 'Konfigurasi', icon: 'settings-outline' },
    ]
  }
])

const toggleMenu = (item: any) => {
  item.isOpen = !item.isOpen
}

// Check if any child matches current path
const isActiveParent = (item: any) => {
  if (!item.children) return false
  return item.children.some((child: any) => route.path.startsWith(child.path))
}

// Auto open menus based on current route on mount/change
const checkActiveMenu = () => {
  menus.value.forEach(group => {
    group.items.forEach(item => {
      if (item.children) {
        if (isActiveParent(item)) {
          item.isOpen = true
        }
      }
    })
  })
}

watch(() => route.path, checkActiveMenu)
onMounted(checkActiveMenu)

</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
}
.scrollbar-thin:hover::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

@keyframes slide-down {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-down {
  animation: slide-down 0.2s ease-out forwards;
}
</style>
