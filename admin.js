// Admin Credentials
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'hiphop-never-die';

// Data Management
let customers = JSON.parse(localStorage.getItem('meca_customers')) || [
    { id: 1, name: 'Samsung Vina', code: 'SAM-01' },
    { id: 2, name: 'Honda Vietnam', code: 'HON-05' }
];

let products = JSON.parse(localStorage.getItem('meca_products')) || [
    { id: 1, product_code: 'SHAFT-001', name: 'Trục Truyền Động', material: 'S45C', customer_id: '1', stages: ['Phay CNC', 'Nhiệt luyện', 'Mài', 'Kiểm tra QC'], image_url: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=400' },
    { id: 2, product_code: 'GEAR-X25', name: 'Bánh Răng Côn', material: '40Cr', customer_id: '2', stages: ['Tiện', 'Phay răng', 'Kiểm tra QC'], image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400' }
];

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initDashboard();
});

// --- Auth Logic ---
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

    if (localStorage.getItem('meca_admin_auth') === 'true') {
        showDashboard();
    }
}

function showDashboard() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    renderAll();
}

window.logout = () => {
    localStorage.removeItem('meca_admin_auth');
    window.location.reload();
};

// --- Dashboard & Navigation ---
function initDashboard() {
    // Product Image Preview
    const imageInput = document.getElementById('prod-image-file');
    const previewImg = document.getElementById('preview-img');
    const uploadPlaceholder = document.getElementById('upload-placeholder');

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                previewImg.src = event.target.result;
                previewImg.classList.remove('hidden');
                uploadPlaceholder.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    // Product Form Submit
    document.getElementById('product-form').addEventListener('submit', handleProductSubmit);

    // Customer Form Submit
    document.getElementById('customer-form').addEventListener('submit', handleCustomerSubmit);
}

window.switchTab = (tab) => {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.getElementById(`tab-${tab}`).classList.remove('hidden');

    document.querySelectorAll('aside button').forEach(b => b.classList.remove('nav-active'));
    document.getElementById(`nav-${tab}`).classList.add('nav-active');
};

// --- Rendering Logic ---
function renderAll() {
    renderCustomerSelect();
    renderProductList();
    renderCustomerList();
}

function renderCustomerSelect() {
    const select = document.getElementById('prod-customer');
    const currentVal = select.value;
    select.innerHTML = '<option value="">Chọn khách hàng...</option>' +
        customers.map(c => `<option value="${c.id}" ${c.id == currentVal ? 'selected' : ''}>${c.name}</option>`).join('');
}

function renderProductList() {
    const list = document.getElementById('admin-product-list');
    list.innerHTML = products.map(p => {
        const customer = customers.find(c => c.id == p.customer_id) || { name: 'N/A' };
        return `
            <div class="glass-card p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all hover:bg-slate-800/40 border-white/5 group">
                <div class="flex gap-6 items-center">
                    <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 border border-white/5">
                        <img src="${p.image_url}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    </div>
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-[10px] font-bold uppercase tracking-widest text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">${p.product_code}</span>
                            <span class="text-xs text-slate-500">${customer.name}</span>
                        </div>
                        <h3 class="font-bold text-white text-lg">${p.name}</h3>
                        <p class="text-sm text-slate-400">Vật liệu: ${p.material}</p>
                    </div>
                </div>
                <div class="flex gap-3 w-full md:w-auto">
                    <button class="flex-1 md:flex-none px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all text-sm font-bold flex items-center justify-center gap-2" onclick="editProduct(${p.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Sửa
                    </button>
                    <button class="flex-1 md:flex-none px-4 py-2 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400 hover:text-white transition-all text-sm font-bold flex items-center justify-center gap-2" onclick="deleteProduct(${p.id})">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Xóa
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function renderCustomerList() {
    const list = document.getElementById('admin-customer-list');
    list.innerHTML = customers.map(c => `
        <div class="glass-card p-6 rounded-2xl flex justify-between items-center transition-all hover:bg-slate-800/40 border-white/5">
            <div>
                <h3 class="font-bold text-white text-lg">${c.name}</h3>
                <p class="text-sm text-blue-400 uppercase tracking-widest font-semibold">${c.code}</p>
            </div>
            <div class="flex gap-2">
                <button class="p-2 hover:bg-blue-500/20 rounded-xl text-blue-400 transition-colors" onclick="editCustomer(${c.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button class="p-2 hover:bg-red-500/20 rounded-xl text-red-400 transition-colors" onclick="deleteCustomer(${c.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

// --- Form Handlers ---
async function handleProductSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('item-id').value;
    const previewImg = document.getElementById('preview-img');

    const productData = {
        id: id ? parseInt(id) : Date.now(),
        product_code: document.getElementById('prod-code').value,
        name: document.getElementById('prod-name').value,
        material: document.getElementById('prod-material').value,
        customer_id: document.getElementById('prod-customer').value,
        stages: document.getElementById('prod-stages').value.split(',').map(s => s.trim()).filter(s => s !== ''),
        image_url: previewImg.src || 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=400'
    };

    if (id) {
        const index = products.findIndex(p => p.id == id);
        products[index] = productData;
    } else {
        products.push(productData);
    }

    saveData();
    renderProductList();
    resetForm();
    alert('Sản phẩm đã được lưu!');
}

async function handleCustomerSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('cust-id').value;

    const customerData = {
        id: id ? parseInt(id) : Date.now(),
        name: document.getElementById('cust-name').value,
        code: document.getElementById('cust-code').value
    };

    if (id) {
        const index = customers.findIndex(c => c.id == id);
        customers[index] = customerData;
    } else {
        customers.push(customerData);
    }

    saveData();
    renderAll();
    e.target.reset();
    document.getElementById('cust-id').value = '';
    document.getElementById('customer-form-title').innerText = 'Thêm Khách Hàng';
    alert('Thông tin đối tác đã được lưu!');
}

// --- Actions ---
window.editProduct = (id) => {
    const p = products.find(p => p.id == id);
    if (!p) return;

    document.getElementById('item-id').value = p.id;
    document.getElementById('prod-code').value = p.product_code;
    document.getElementById('prod-name').value = p.name;
    document.getElementById('prod-material').value = p.material;
    document.getElementById('prod-customer').value = p.customer_id;
    document.getElementById('prod-stages').value = p.stages ? p.stages.join(', ') : '';

    const previewImg = document.getElementById('preview-img');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    previewImg.src = p.image_url;
    previewImg.classList.remove('hidden');
    uploadPlaceholder.classList.add('hidden');

    document.getElementById('product-form-title').innerText = 'Chỉnh Sửa Sản Phẩm';
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.deleteProduct = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        products = products.filter(p => p.id != id);
        saveData();
        renderProductList();
    }
};

window.editCustomer = (id) => {
    const c = customers.find(c => c.id == id);
    if (!c) return;

    document.getElementById('cust-id').value = c.id;
    document.getElementById('cust-name').value = c.name;
    document.getElementById('cust-code').value = c.code;

    document.getElementById('customer-form-title').innerText = 'Chỉnh Sửa Đối Tác';
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.deleteCustomer = (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa khách hàng này? Lưu ý: Sản phẩm của khách hàng này sẽ không hiển thị đúng.')) {
        customers = customers.filter(c => c.id != id);
        saveData();
        renderAll();
    }
};

function resetForm() {
    document.getElementById('product-form').reset();
    document.getElementById('item-id').value = '';
    document.getElementById('product-form-title').innerText = 'Thêm Sản Phẩm Mới';
    document.getElementById('preview-img').classList.add('hidden');
    document.getElementById('upload-placeholder').classList.remove('hidden');
}

function saveData() {
    localStorage.setItem('meca_customers', JSON.stringify(customers));
    localStorage.setItem('meca_products', JSON.stringify(products));
}
