// Admin Credentials
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'hiphop-never-die';

// Use the global supabase client initialized in supabase-config.js
const supabaseClient = window.mecaSupabase;
let customers = [
    { id: 1, name: 'Samsung Vina', code: 'SAM-01' },
    { id: 2, name: 'Honda Vietnam', code: 'HON-05' }
];

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initDashboard();
});

function initAuth() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;

        if (user === ADMIN_USER && pass === ADMIN_PASS) {
            localStorage.setItem('meca_admin_auth', 'true');
            showDashboard();
        } else {
            document.getElementById('login-error').classList.remove('hidden');
        }
    });

    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('meca_admin_auth');
        window.location.reload();
    });

    if (localStorage.getItem('meca_admin_auth') === 'true') {
        showDashboard();
    }
}

function showDashboard() {
    document.getElementById('login-modal').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    document.body.classList.remove('flex', 'items-center', 'justify-center');
    document.body.classList.add('bg-slate-900', 'p-10');
}

function initDashboard() {
    renderCustomerSelect();
    renderAdminProductList();

    const productForm = document.getElementById('product-form');
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            id: document.getElementById('item-id').value || Date.now(),
            product_code: document.getElementById('prod-code').value,
            name: document.getElementById('prod-name').value,
            material: document.getElementById('prod-material').value,
            customer_id: document.getElementById('prod-customer').value,
            image_url: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=400' // Mock image
        };

        console.log('Saving product:', formData);
        alert('Sản phẩm đã được lưu (Chế độ Mock)!');
        productForm.reset();
        document.getElementById('item-id').value = '';
    });
}

function renderCustomerSelect() {
    const select = document.getElementById('prod-customer');
    select.innerHTML = '<option value="">Chọn khách hàng...</option>' +
        customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

function renderAdminProductList() {
    const list = document.getElementById('admin-product-list');
    // Using mock data for list display
    const mockProds = [
        { id: 1, product_code: 'SHAFT-001', name: 'Trục Truyền Động', material: 'S45C', customer: 'Samsung Vina' },
        { id: 2, product_code: 'GEAR-X25', name: 'Bánh Răng Côn', material: '40Cr', customer: 'Honda Vietnam' }
    ];

    list.innerHTML = mockProds.map(p => `
        <div class="glass-card p-4 rounded-xl flex justify-between items-center transition-all hover:bg-slate-800/50">
            <div class="flex gap-4 items-center">
                <div class="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center text-blue-400 font-bold">
                    ${p.product_code.slice(0, 1)}
                </div>
                <div>
                    <h3 class="font-bold text-white">${p.name}</h3>
                    <p class="text-xs text-slate-500">${p.product_code} | ${p.material} | KH: ${p.customer}</p>
                </div>
            </div>
            <div class="flex gap-2">
                <button class="p-2 hover:bg-blue-500/20 rounded-lg text-blue-400" onclick="editProduct(${p.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button class="p-2 hover:bg-red-500/20 rounded-lg text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

window.editProduct = (id) => {
    // Fill form with mock data logic
    console.log('Editing product:', id);
    document.getElementById('item-id').value = id;
    document.getElementById('prod-code').value = 'SHAFT-001';
    document.getElementById('prod-name').value = 'Trục Truyền Động';
    document.getElementById('prod-material').value = 'S45C';
    document.getElementById('prod-customer').value = '1';
};
