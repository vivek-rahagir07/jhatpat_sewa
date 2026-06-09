const GROCERY_PRODUCTS = [
    { id: 1,  name: 'Potato (Aloo)',      emoji: '🥔', weight: '1 kg',   price: 30,  mrp: 38,  cat: 'vegetables', discount: 21 },
    { id: 2,  name: 'Tomato',              emoji: '🍅', weight: '500 g',  price: 25,  mrp: 32,  cat: 'vegetables', discount: 22 },
    { id: 3,  name: 'Onion (Pyaz)',        emoji: '🧅', weight: '1 kg',   price: 35,  mrp: 42,  cat: 'vegetables', discount: 17 },
    { id: 4,  name: 'Green Chilli',        emoji: '🌶️', weight: '250 g',  price: 15,  mrp: 18,  cat: 'vegetables', discount: 17 },
    { id: 5,  name: 'Carrot (Gajar)',      emoji: '🥕', weight: '500 g',  price: 40,  mrp: 50,  cat: 'vegetables', discount: 20 },
    { id: 6,  name: 'Cauliflower',         emoji: '🥦', weight: '1 pc',   price: 30,  mrp: 38,  cat: 'vegetables', discount: 21 },
    { id: 7,  name: 'Apple',               emoji: '🍎', weight: '1 kg',   price: 180, mrp: 220, cat: 'fruits', discount: 18 },
    { id: 8,  name: 'Banana',              emoji: '🍌', weight: '1 dozen', price: 50, mrp: 60,  cat: 'fruits', discount: 17 },
    { id: 9,  name: 'Mango (Aam)',         emoji: '🥭', weight: '1 kg',   price: 120, mrp: 150, cat: 'fruits', discount: 20 },
    { id: 10, name: 'Grapes (Angoor)',     emoji: '🍇', weight: '500 g',  price: 80,  mrp: 95,  cat: 'fruits', discount: 16 },
    { id: 11, name: 'Amul Milk',           emoji: '🥛', weight: '1 ltr',  price: 68,  mrp: 72,  cat: 'dairy', discount: 6 },
    { id: 12, name: 'Paneer',              emoji: '🧀', weight: '200 g',  price: 90,  mrp: 105, cat: 'dairy', discount: 14 },
    { id: 13, name: 'Curd (Dahi)',         emoji: '🥣', weight: '400 g',  price: 40,  mrp: 48,  cat: 'dairy', discount: 17 },
    { id: 14, name: 'Eggs',                emoji: '🥚', weight: '12 pcs', price: 80,  mrp: 90,  cat: 'dairy', discount: 11 },
    { id: 15, name: 'Bread',               emoji: '🍞', weight: '400 g',  price: 45,  mrp: 50,  cat: 'dairy', discount: 10 },
    { id: 16, name: 'Basmati Rice',        emoji: '🍚', weight: '5 kg',   price: 420, mrp: 480, cat: 'staples', discount: 13 },
    { id: 17, name: 'Toor Dal',            emoji: '🫘', weight: '1 kg',   price: 160, mrp: 185, cat: 'staples', discount: 14 },
    { id: 18, name: 'Sunflower Oil',       emoji: '🫙', weight: '1 ltr',  price: 140, mrp: 165, cat: 'staples', discount: 15 },
    { id: 19, name: 'Sugar (Cheeni)',      emoji: '🧂', weight: '1 kg',   price: 45,  mrp: 50,  cat: 'staples', discount: 10 },
    { id: 20, name: 'Atta (Wheat Flour)',  emoji: '🌾', weight: '5 kg',   price: 250, mrp: 280, cat: 'staples', discount: 11 },
    { id: 21, name: 'Maggi Noodles',       emoji: '🍜', weight: '4 pack', price: 56,  mrp: 64,  cat: 'snacks', discount: 13 },
    { id: 22, name: 'Parle-G Biscuits',    emoji: '🍪', weight: '800 g',  price: 80,  mrp: 90,  cat: 'snacks', discount: 11 },
    { id: 23, name: 'Chips (Lays)',        emoji: '🥔', weight: '90 g',   price: 30,  mrp: 35,  cat: 'snacks', discount: 14 },
    { id: 24, name: 'Namkeen Mix',         emoji: '🥜', weight: '400 g',  price: 120, mrp: 140, cat: 'snacks', discount: 14 },
];

const GROCERY_CATS = [
    { id: 'all', label: 'All', icon: '🏪', color: '#059669', bg: '#ecfdf5' },
    { id: 'vegetables', label: 'Veggies', icon: '🥬', color: '#059669', bg: '#ecfdf5' },
    { id: 'fruits', label: 'Fruits', icon: '🍎', color: '#ea580c', bg: '#fff7ed' },
    { id: 'dairy', label: 'Dairy', icon: '🥛', color: '#2563eb', bg: '#eff6ff' },
    { id: 'staples', label: 'Staples', icon: '🍚', color: '#7c3aed', bg: '#f5f3ff' },
    { id: 'snacks', label: 'Snacks', icon: '🍪', color: '#db2777', bg: '#fdf2f8' },
];

let groceryCart = {};
let activeCat = 'all';
let searchQuery = '';

function getCartStats() {
    const ids = Object.keys(groceryCart);
    const count = ids.reduce((s, id) => s + groceryCart[id], 0);
    const total = ids.reduce((s, id) => {
        const p = GROCERY_PRODUCTS.find(x => x.id == id);
        return s + p.price * groceryCart[id];
    }, 0);
    return { count, total, ids };
}

function renderCategoryChips() {
    const el = document.getElementById('groceryCatScroll');
    el.innerHTML = GROCERY_CATS.map(c => `
        <button class="cat-chip ${activeCat === c.id ? 'active' : ''}" data-cat="${c.id}"
            style="--chip-color:${c.color}; --chip-bg:${c.bg}" onclick="setGroceryCat('${c.id}', this)">
            <span class="chip-icon">${c.icon}</span>
            <span class="chip-label">${c.label}</span>
        </button>
    `).join('');
}

function setGroceryCat(cat, btn) {
    activeCat = cat;
    document.querySelectorAll('#groceryCatScroll .cat-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    renderProducts();
}

function getFilteredProducts() {
    let list = GROCERY_PRODUCTS;
    if (activeCat !== 'all') list = list.filter(p => p.cat === activeCat);
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(q) || p.cat.includes(q));
    }
    return list;
}

function renderProducts() {
    const grid = document.getElementById('groceryGrid');
    const filtered = getFilteredProducts();

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#888;padding:40px;">No products found</p>';
        return;
    }

    grid.innerHTML = filtered.map(p => {
        const qty = groceryCart[p.id] || 0;
        return `
        <div class="blinkit-card" data-id="${p.id}">
            ${p.discount ? `<span class="discount-tag">${p.discount}% OFF</span>` : ''}
            <span class="eta-tag"><i class="fas fa-bolt"></i> 10 min</span>
            <div class="product-img">${p.emoji}</div>
            <h4>${p.name}</h4>
            <div class="weight">${p.weight}</div>
            <div class="price-row">
                <span class="price">₹${p.price}</span>
                <span class="mrp">₹${p.mrp}</span>
            </div>
            <button class="blinkit-add-btn" id="gadd-${p.id}" onclick="groceryAdd(${p.id})" style="${qty > 0 ? 'display:none' : ''}">ADD</button>
            <div class="blinkit-qty" id="gqty-${p.id}" style="${qty > 0 ? 'display:flex' : ''}">
                <button onclick="groceryChangeQty(${p.id}, -1)">−</button>
                <span id="gqn-${p.id}">${qty}</span>
                <button onclick="groceryChangeQty(${p.id}, 1)">+</button>
            </div>
        </div>`;
    }).join('');
}

function groceryAdd(id) {
    groceryCart[id] = 1;
    syncProductUI(id);
    updateGroceryCartUI();
    showGroceryToast('Added to cart');
}

function groceryChangeQty(id, delta) {
    groceryCart[id] = (groceryCart[id] || 0) + delta;
    if (groceryCart[id] <= 0) delete groceryCart[id];
    syncProductUI(id);
    updateGroceryCartUI();
}

function syncProductUI(id) {
    const qty = groceryCart[id] || 0;
    const addBtn = document.getElementById('gadd-' + id);
    const qtyEl = document.getElementById('gqty-' + id);
    const numEl = document.getElementById('gqn-' + id);
    if (!addBtn) return;
    addBtn.style.display = qty > 0 ? 'none' : '';
    qtyEl.style.display = qty > 0 ? 'flex' : 'none';
    if (numEl) numEl.textContent = qty;
}

function updateGroceryCartUI() {
    const { count, total, ids } = getCartStats();
    const bar = document.getElementById('stickyCartBar');
    const page = document.querySelector('.grocery-page');

    if (count > 0) {
        bar.classList.add('visible');
        page.classList.add('has-sticky-cart');
        document.getElementById('stickyCartCount').textContent = count + ' item' + (count > 1 ? 's' : '');
        document.getElementById('stickyCartTotal').textContent = '₹' + total;
    } else {
        bar.classList.remove('visible');
        page.classList.remove('has-sticky-cart');
    }

    const list = document.getElementById('groceryCartList');
    const footer = document.getElementById('groceryCartFooter');

    if (ids.length === 0) {
        list.innerHTML = '<div class="drawer-empty"><i class="fas fa-shopping-basket"></i><p>Your cart is empty</p></div>';
        footer.style.display = 'none';
    } else {
        list.innerHTML = ids.map(id => {
            const p = GROCERY_PRODUCTS.find(x => x.id == id);
            return `
            <div class="drawer-item">
                <span class="drawer-item-emoji">${p.emoji}</span>
                <div class="drawer-item-info">
                    <h4>${p.name}</h4>
                    <small>${p.weight}</small>
                </div>
                <div class="drawer-item-qty">
                    <button onclick="groceryChangeQty(${id}, -1)">−</button>
                    <span>${groceryCart[id]}</span>
                    <button onclick="groceryChangeQty(${id}, 1)">+</button>
                </div>
                <span class="drawer-item-price">₹${p.price * groceryCart[id]}</span>
            </div>`;
        }).join('');
        footer.style.display = 'block';
        document.getElementById('groceryCartTotal').textContent = '₹' + total;
    }
}

function toggleGroceryCart() {
    document.getElementById('groceryDrawer').classList.toggle('open');
    document.getElementById('groceryOverlay').classList.toggle('open');
}

function openGroceryCheckout() {
    if (typeof UserStore !== 'undefined') {
        if (!UserStore.getSessionUser()) {
            showGroceryToast('Please login to checkout');
            setTimeout(() => { window.location.href = 'login.html'; }, 1200);
            return;
        }
        if (!UserStore.isProfileComplete(UserStore.getUserProfile())) {
            showGroceryToast('Complete your profile first');
            setTimeout(() => { window.location.href = 'onboarding.html'; }, 1200);
            return;
        }
    }
    toggleGroceryCart();
    const { ids, total } = getCartStats();
    const summary = document.getElementById('checkoutSummary');
    summary.innerHTML = ids.map(id => {
        const p = GROCERY_PRODUCTS.find(x => x.id == id);
        return `<div class="preview-row"><span>${p.emoji} ${p.name} × ${groceryCart[id]}</span><strong>₹${p.price * groceryCart[id]}</strong></div>`;
    }).join('') + `<div class="preview-amount-row"><span>Total</span><strong class="preview-amount">₹${total}</strong></div>`;
    prefillGroceryCheckout();
    document.getElementById('checkoutSheet').classList.add('open');
}

function prefillGroceryCheckout() {
    if (typeof UserStore === 'undefined') return;
    const p = UserStore.getUserProfile();
    if (!p) return;
    if (p.fullName) document.getElementById('grocery-name').value = p.fullName;
    if (p.phone) document.getElementById('grocery-phone').value = p.phone;
    const addr = UserStore.getFormattedAddress();
    if (addr) document.getElementById('grocery-address').value = addr;
}

function updateGroceryLocationLabel() {
    const btn = document.querySelector('.app-location-btn');
    if (!btn || typeof UserStore === 'undefined') return;
    const p = UserStore.getUserProfile();
    if (p && UserStore.isProfileComplete(p)) {
        const short = p.flatNo || p.address?.split(',')[0] || 'Home';
        btn.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${short} <i class="fas fa-chevron-down"></i>`;
        btn.onclick = () => { window.location.href = 'onboarding.html'; };
    }
}

function closeGroceryCheckout() {
    document.getElementById('checkoutSheet').classList.remove('open');
}

function placeGroceryOrder(e) {
    e.preventDefault();
    const { ids, total } = getCartStats();
    const name = document.getElementById('grocery-name').value.trim();
    const phone = document.getElementById('grocery-phone').value.trim();
    const address = document.getElementById('grocery-address').value.trim();
    const items = ids.map(id => {
        const p = GROCERY_PRODUCTS.find(x => x.id == id);
        return `${p.emoji} ${p.name} × ${groceryCart[id]}`;
    });

    if (window.RequestsStore) {
        const profile = typeof UserStore !== 'undefined' ? UserStore.getUserProfile() : null;
        RequestsStore.addServiceRequest({
            type: 'grocery',
            serviceName: 'Grocery Delivery',
            customerName: name,
            phone,
            address,
            amount: total,
            items,
            location: profile?.location || undefined
        });
    }

    closeGroceryCheckout();
    document.getElementById('orderSuccessOverlay').classList.add('open');
    document.getElementById('successOrderTotal').textContent = '₹' + total;
    groceryCart = {};
    renderProducts();
    updateGroceryCartUI();
}

function closeOrderSuccess() {
    document.getElementById('orderSuccessOverlay').classList.remove('open');
}

function showGroceryToast(msg) {
    const t = document.getElementById('groceryToast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    renderCategoryChips();
    renderProducts();
    updateGroceryLocationLabel();

    document.getElementById('grocerySearch').addEventListener('input', e => {
        searchQuery = e.target.value;
        renderProducts();
    });
});
