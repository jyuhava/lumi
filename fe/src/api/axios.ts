import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Ubah kembali ke https://lumine.syntaf.com/api saat production
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // --- SAAS TENANT INJECTION ---
        let tenant = 'rs-pelita';

        // 1. Cek apakah ada tenant yang sedang login tersimpan di localStorage
        const storedUserstr = localStorage.getItem('user');
        if (storedUserstr) {
            try {
                const parsedUser = JSON.parse(storedUserstr);
                if (parsedUser && parsedUser.tenant_subdomain) {
                    tenant = parsedUser.tenant_subdomain;
                }
            } catch (e) { }
        } else {
            // 2. Jika belum login (misal halaman awal), ambil dari URL sbg fallback 
            const hostname = window.location.hostname;
            const parts = hostname.split('.');

            if (hostname.endsWith('.localhost')) {
                tenant = parts[0] || 'rs-pelita';
            } else if (parts.length >= 3 && hostname !== 'localhost' && hostname !== '127.0.0.1') {
                tenant = parts[0] || 'rs-pelita';
            }
        }

        config.headers['X-Tenant'] = tenant;
        // -----------------------------

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Handle 401 responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.group('API Error Details')
        console.error('URL:', error.config?.url)
        console.error('Method:', error.config?.method?.toUpperCase())
        console.error('Status:', error.response?.status)
        console.error('Data:', error.response?.data)

        if (error.response?.status === 422) {
            console.error('Validation Errors:', error.response.data.errors)
        }
        console.groupEnd()

        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }

        // --- SAAS: Handle Blocked Tenant ---
        if (error.response?.status === 403 && error.response?.data?.message?.includes('suspend')) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/suspended'
        }
        // -----------------------------------

        return Promise.reject(error)
    }
)

export default api
