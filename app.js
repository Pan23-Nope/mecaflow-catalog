// Use the global supabase client initialized in supabase-config.js
const supabaseClient = window.mecaSupabase;

// Mock Data for Initial UI Rendering
const mockProducts = [
    {
        id: 1,
        product_code: 'SHAFT-001',
        name: 'Trục Truyền Động S45C',
        material: 'Thép S45C',
        image_url: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=400',
        customer: { name: 'Samsung Vina', code: 'SAM-01' }
    },
    {
        id: 2,
        product_code: 'GEAR-X25',
        name: 'Bánh Răng Côn 25 Răng',
        material: 'Thép Hợp Kim 40Cr',
        image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400',
        customer: { name: 'Honda Vietnam', code: 'HON-05' }
    },
    {
        id: 3,
        product_code: 'HOUSING-AL',
        name: 'Vỏ Động Cơ Nhôm',
        material: 'Nhôm A6061',
        image_url: 'https://images.unsplash.com/photo-1504917595217-d4dc5f649776?auto=format&fit=crop&q=80&w=400',
        customer: { name: 'Samsung Vina', code: 'SAM-01' }
    }
];

document.addEventListener('DOMContentLoaded', async () => {
    initSupabase();
    await renderApp();
});

function initSupabase() {
    if (SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
        supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
}

async function renderApp() {
    const products = await fetchProducts();
    renderProducts(products);
    renderCustomerFilters(products);
}

async function fetchProducts() {
    if (supabaseClient && !supabaseClient.supabaseUrl.includes('your-project-ref')) {
        const { data, error } = await supabaseClient
            .from('products')
            .select(`
                *,
                customers ( name, code )
            `);
        if (!error) return data;
    }
    return mockProducts; // Fallback to mock data
}

function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = products.map(p => `
        <div class="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 group cursor-pointer" data-customer="${p.customer.name}">
            <div class="h-48 overflow-hidden relative">
                <img src="${p.image_url}" alt="${p.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                <div class="absolute top-3 left-3 bg-blue-500/90 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    ${p.product_code}
                </div>
            </div>
            <div class="p-5">
                <div class="text-xs text-blue-400 font-medium mb-1 uppercase tracking-widest">${p.customer.name}</div>
                <h3 class="text-lg font-bold text-white mb-2 leading-tight">${p.name}</h3>
                <div class="flex flex-col gap-2 mt-4 text-sm text-slate-400">
                    <div class="flex justify-between items-center border-b border-slate-700/50 pb-2">
                        <span>Vật liệu:</span>
                        <span class="text-slate-200 font-medium">${p.material}</span>
                    </div>
                    <div class="flex justify-between items-center pt-1">
                        <span>Mã KH:</span>
                        <span class="text-slate-200 font-medium">${p.customer.code}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderCustomerFilters(products) {
    const customers = [...new Set(products.map(p => p.customer.name))];
    const container = document.getElementById('customer-tabs');
    const existingButtons = container.innerHTML;

    container.innerHTML = existingButtons + customers.map(c => `
        <button class="px-6 py-2 rounded-full glass-card text-slate-400 hover:text-white hover:border-slate-500 transition-all font-medium filter-btn" data-customer="${c}">
            ${c}
        </button>
    `).join('');

    // Filter Logic
    const buttons = document.querySelectorAll('.filter-btn, #customer-tabs button:first-child');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => {
                b.classList.remove('text-blue-400', 'border-blue-500/50');
                b.classList.add('text-slate-400');
            });
            btn.classList.add('text-blue-400', 'border-blue-500/50');
            btn.classList.remove('text-slate-400');

            const filter = btn.getAttribute('data-customer');
            const cards = document.querySelectorAll('#product-grid > div');
            cards.forEach(card => {
                if (!filter || card.getAttribute('data-customer') === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}
