const BILL_CATEGORIES = [
    { id: 'electricity', name: 'Electricity', icon: 'fa-bolt', color: '#f59e0b', bg: '#fef3c7' },
    { id: 'mobile-prepaid', name: 'Mobile Prepaid', icon: 'fa-mobile-alt', color: '#3b82f6', bg: '#dbeafe' },
    { id: 'mobile-postpaid', name: 'Mobile Postpaid', icon: 'fa-sim-card', color: '#6366f1', bg: '#e0e7ff' },
    { id: 'dth', name: 'DTH', icon: 'fa-tv', color: '#8b5cf6', bg: '#ede9fe' },
    { id: 'water', name: 'Water', icon: 'fa-tint', color: '#06b6d4', bg: '#cffafe' },
    { id: 'gas', name: 'Gas', icon: 'fa-fire', color: '#ef4444', bg: '#fee2e2' },
    { id: 'broadband', name: 'Broadband', icon: 'fa-wifi', color: '#10b981', bg: '#d1fae5' },
    { id: 'landline', name: 'Landline', icon: 'fa-phone', color: '#64748b', bg: '#f1f5f9' },
    { id: 'fastag', name: 'FASTag', icon: 'fa-car', color: '#0ea5e9', bg: '#e0f2fe' },
    { id: 'insurance', name: 'Insurance', icon: 'fa-shield-alt', color: '#14b8a6', bg: '#ccfbf1' },
    { id: 'credit-card', name: 'Credit Card', icon: 'fa-credit-card', color: '#ec4899', bg: '#fce7f3' },
    { id: 'education', name: 'Education', icon: 'fa-graduation-cap', color: '#a855f7', bg: '#f3e8ff' }
];

const BILLERS = {
    electricity: [
        { id: 'bescom', name: 'BESCOM Karnataka', state: 'Karnataka' },
        { id: 'mseb', name: 'MSEB Maharashtra', state: 'Maharashtra' },
        { id: 'tneb', name: 'TNEB Tamil Nadu', state: 'Tamil Nadu' },
        { id: 'uppcl', name: 'UPPCL Uttar Pradesh', state: 'Uttar Pradesh' },
        { id: 'bses', name: 'BSES Delhi', state: 'Delhi' },
        { id: 'tsspdcl', name: 'TSSPDCL Telangana', state: 'Telangana' },
        { id: 'apdcl', name: 'APDCL Assam', state: 'Assam' },
        { id: 'cesc', name: 'CESC West Bengal', state: 'West Bengal' }
    ],
    'mobile-prepaid': [
        { id: 'jio', name: 'Jio Prepaid', operator: 'Jio' },
        { id: 'airtel', name: 'Airtel Prepaid', operator: 'Airtel' },
        { id: 'vi', name: 'Vi Prepaid', operator: 'Vi' },
        { id: 'bsnl', name: 'BSNL Prepaid', operator: 'BSNL' }
    ],
    'mobile-postpaid': [
        { id: 'jio-post', name: 'Jio Postpaid', operator: 'Jio' },
        { id: 'airtel-post', name: 'Airtel Postpaid', operator: 'Airtel' },
        { id: 'vi-post', name: 'Vi Postpaid', operator: 'Vi' },
        { id: 'bsnl-post', name: 'BSNL Postpaid', operator: 'BSNL' }
    ],
    dth: [
        { id: 'tatasky', name: 'Tata Play', operator: 'Tata Play' },
        { id: 'airtel-dth', name: 'Airtel Digital TV', operator: 'Airtel' },
        { id: 'dish', name: 'Dish TV', operator: 'Dish TV' },
        { id: 'd2h', name: 'D2H', operator: 'Videocon' },
        { id: 'sun', name: 'Sun Direct', operator: 'Sun Direct' }
    ],
    water: [
        { id: 'bwssb', name: 'BWSSB Bangalore', state: 'Karnataka' },
        { id: 'mcgm', name: 'MCGM Mumbai', state: 'Maharashtra' },
        { id: 'djb', name: 'Delhi Jal Board', state: 'Delhi' },
        { id: 'hmwssb', name: 'HMWSSB Hyderabad', state: 'Telangana' }
    ],
    gas: [
        { id: 'igl', name: 'IGL Delhi', state: 'Delhi' },
        { id: 'mahanagar', name: 'Mahanagar Gas Mumbai', state: 'Maharashtra' },
        { id: 'adani', name: 'Adani Gas', state: 'Gujarat' },
        { id: 'hpcl', name: 'HP Gas (LPG)', state: 'All India' }
    ],
    broadband: [
        { id: 'jio-fiber', name: 'JioFiber', operator: 'Jio' },
        { id: 'airtel-bb', name: 'Airtel Broadband', operator: 'Airtel' },
        { id: 'act', name: 'ACT Fibernet', operator: 'ACT' },
        { id: 'bsnl-bb', name: 'BSNL Broadband', operator: 'BSNL' }
    ],
    landline: [
        { id: 'bsnl-ll', name: 'BSNL Landline', operator: 'BSNL' },
        { id: 'airtel-ll', name: 'Airtel Landline', operator: 'Airtel' },
        { id: 'mtnl', name: 'MTNL Delhi/Mumbai', operator: 'MTNL' }
    ],
    fastag: [
        { id: 'paytm-fastag', name: 'Paytm FASTag', operator: 'Paytm' },
        { id: 'icici-fastag', name: 'ICICI FASTag', operator: 'ICICI' },
        { id: 'hdfc-fastag', name: 'HDFC FASTag', operator: 'HDFC' },
        { id: 'sbi-fastag', name: 'SBI FASTag', operator: 'SBI' }
    ],
    insurance: [
        { id: 'lic', name: 'LIC of India', type: 'Life' },
        { id: 'hdfc-life', name: 'HDFC Life', type: 'Life' },
        { id: 'icici-pru', name: 'ICICI Prudential', type: 'Life' },
        { id: 'sbi-life', name: 'SBI Life', type: 'Life' }
    ],
    'credit-card': [
        { id: 'hdfc-cc', name: 'HDFC Bank', bank: 'HDFC' },
        { id: 'icici-cc', name: 'ICICI Bank', bank: 'ICICI' },
        { id: 'sbi-cc', name: 'SBI Card', bank: 'SBI' },
        { id: 'axis-cc', name: 'Axis Bank', bank: 'Axis' }
    ],
    education: [
        { id: 'cbse', name: 'CBSE Fees', type: 'Board' },
        { id: 'state-board', name: 'State Board Fees', type: 'Board' },
        { id: 'college', name: 'College/University', type: 'Higher Ed' }
    ]
};

const RECHARGE_AMOUNTS = [99, 149, 199, 239, 299, 399, 499, 599, 749, 999];

const FIELD_CONFIG = {
    electricity: { label: 'Consumer Number', placeholder: 'Enter 10-12 digit consumer ID', type: 'text', minLen: 6 },
    'mobile-prepaid': { label: 'Mobile Number', placeholder: '10-digit mobile number', type: 'tel', minLen: 10 },
    'mobile-postpaid': { label: 'Mobile Number', placeholder: '10-digit postpaid number', type: 'tel', minLen: 10 },
    dth: { label: 'Subscriber ID', placeholder: 'Enter DTH subscriber ID', type: 'text', minLen: 8 },
    water: { label: 'Connection Number', placeholder: 'Enter water connection ID', type: 'text', minLen: 6 },
    gas: { label: 'Consumer Number', placeholder: 'Enter gas consumer number', type: 'text', minLen: 6 },
    broadband: { label: 'Account / Landline No.', placeholder: 'Enter broadband account number', type: 'text', minLen: 8 },
    landline: { label: 'Landline Number', placeholder: 'STD code + number', type: 'tel', minLen: 8 },
    fastag: { label: 'Vehicle Number', placeholder: 'e.g. KA01AB1234', type: 'text', minLen: 6 },
    insurance: { label: 'Policy Number', placeholder: 'Enter policy number', type: 'text', minLen: 6 },
    'credit-card': { label: 'Last 4 Digits of Card', placeholder: 'XXXX', type: 'text', minLen: 4 },
    education: { label: 'Registration / Roll No.', placeholder: 'Enter student ID', type: 'text', minLen: 4 }
};

let currentCategory = null;
let currentBiller = null;
let fetchedBill = null;

function getRecentPayments() {
    try {
        return JSON.parse(localStorage.getItem('jhatpat_recent_bills') || '[]');
    } catch {
        return [];
    }
}

function saveRecentPayment(payment) {
    const recent = getRecentPayments().filter(r => r.id !== payment.id);
    recent.unshift(payment);
    localStorage.setItem('jhatpat_recent_bills', JSON.stringify(recent.slice(0, 6)));
}

function renderCategories(filter = '') {
    const grid = document.getElementById('bill-category-grid');
    const q = filter.toLowerCase().trim();
    const filtered = q
        ? BILL_CATEGORIES.filter(c => c.name.toLowerCase().includes(q))
        : BILL_CATEGORIES;

    grid.innerHTML = filtered.map(cat => `
        <button class="bill-cat-tile" data-category="${cat.id}" style="--cat-color:${cat.color}; --cat-bg:${cat.bg}">
            <span class="bill-cat-icon"><i class="fas ${cat.icon}"></i></span>
            <span class="bill-cat-name">${cat.name}</span>
        </button>
    `).join('');

    grid.querySelectorAll('.bill-cat-tile').forEach(btn => {
        btn.addEventListener('click', () => openPaymentFlow(btn.dataset.category));
    });
}

function renderRecentPayments() {
    const section = document.getElementById('recent-payments');
    const list = document.getElementById('recent-list');
    const recent = getRecentPayments();

    if (recent.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';
    list.innerHTML = recent.map(r => {
        const cat = BILL_CATEGORIES.find(c => c.id === r.category);
        return `
            <button class="recent-item" data-category="${r.category}" data-biller="${r.billerId}" data-account="${r.account}">
                <span class="recent-icon" style="background:${cat?.bg || '#eee'}; color:${cat?.color || '#333'}">
                    <i class="fas ${cat?.icon || 'fa-receipt'}"></i>
                </span>
                <span class="recent-info">
                    <strong>${r.billerName}</strong>
                    <small>${r.account}</small>
                </span>
                <span class="recent-amount">₹${r.amount}</span>
            </button>
        `;
    }).join('');

    list.querySelectorAll('.recent-item').forEach(btn => {
        btn.addEventListener('click', () => {
            openPaymentFlow(btn.dataset.category, btn.dataset.biller, btn.dataset.account);
        });
    });
}

function showView(viewId) {
    document.querySelectorAll('.bill-view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}

function openPaymentFlow(categoryId, prefillBillerId = null, prefillAccount = null) {
    currentCategory = BILL_CATEGORIES.find(c => c.id === categoryId);
    currentBiller = null;
    fetchedBill = null;

    const billers = BILLERS[categoryId] || [];
    const field = FIELD_CONFIG[categoryId];

    document.getElementById('flow-category-name').textContent = currentCategory.name;
    document.getElementById('flow-category-icon').innerHTML = `<i class="fas ${currentCategory.icon}"></i>`;
    document.getElementById('flow-category-icon').style.background = currentCategory.bg;
    document.getElementById('flow-category-icon').style.color = currentCategory.color;

    const billerSelect = document.getElementById('biller-select');
    billerSelect.innerHTML = '<option value="">Select Biller</option>' +
        billers.map(b => `<option value="${b.id}">${b.name}</option>`).join('');

    if (prefillBillerId) billerSelect.value = prefillBillerId;

    document.getElementById('account-label').textContent = field.label;
    const accountInput = document.getElementById('account-input');
    accountInput.placeholder = field.placeholder;
    accountInput.type = field.type;
    accountInput.value = prefillAccount || '';

    const isRecharge = categoryId === 'mobile-prepaid' || categoryId === 'dth';
    document.getElementById('recharge-amounts').style.display = isRecharge ? 'flex' : 'none';
    document.getElementById('custom-amount-group').style.display = isRecharge ? 'flex' : 'none';

    if (isRecharge) {
        renderRechargeAmounts();
        document.getElementById('fetch-bill-btn').innerHTML = '<i class="fas fa-arrow-right"></i> Continue';
    } else {
        document.getElementById('fetch-bill-btn').innerHTML = '<i class="fas fa-search"></i> Fetch Bill';
    }

    resetFlowSteps();
    showView('payment-flow');
    goToStep(1);
}

function renderRechargeAmounts() {
    const container = document.getElementById('recharge-amounts');
    container.innerHTML = RECHARGE_AMOUNTS.map(amt =>
        `<button type="button" class="amount-chip" data-amount="${amt}">₹${amt}</button>`
    ).join('');

    container.querySelectorAll('.amount-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            container.querySelectorAll('.amount-chip').forEach(c => c.classList.remove('selected'));
            chip.classList.add('selected');
            document.getElementById('custom-amount').value = chip.dataset.amount;
        });
    });
}

function resetFlowSteps() {
    document.getElementById('bill-preview').style.display = 'none';
    document.getElementById('fetch-bill-btn').style.display = 'inline-flex';
    document.getElementById('pay-bill-btn').style.display = 'none';
    document.getElementById('custom-amount').value = '';
    document.getElementById('fetch-loader').style.display = 'none';
    document.querySelectorAll('.amount-chip').forEach(c => c.classList.remove('selected'));
}

function goToStep(step) {
    document.querySelectorAll('.flow-step').forEach((el, i) => {
        el.classList.toggle('active', i + 1 === step);
        el.classList.toggle('done', i + 1 < step);
    });
    document.querySelectorAll('.step-indicator .step-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i + 1 === step);
        dot.classList.toggle('done', i + 1 < step);
    });
}

function simulateFetchBill() {
    const billerId = document.getElementById('biller-select').value;
    const account = document.getElementById('account-input').value.trim();
    const categoryId = currentCategory.id;
    const field = FIELD_CONFIG[categoryId];

    if (!billerId) {
        showToast('Please select a biller');
        return;
    }
    if (account.length < field.minLen) {
        showToast(`Please enter a valid ${field.label.toLowerCase()}`);
        return;
    }

    const billers = BILLERS[categoryId];
    currentBiller = billers.find(b => b.id === billerId);

    const isRecharge = categoryId === 'mobile-prepaid' || categoryId === 'dth';
    let amount;

    if (isRecharge) {
        amount = parseInt(document.getElementById('custom-amount').value, 10);
        if (!amount || amount < 10) {
            showToast('Please select or enter a recharge amount');
            return;
        }
    } else {
        amount = Math.floor(Math.random() * 4000) + 200;
    }

    const loader = document.getElementById('fetch-loader');
    const fetchBtn = document.getElementById('fetch-bill-btn');
    loader.style.display = 'flex';
    fetchBtn.disabled = true;

    setTimeout(() => {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 15) + 1);

        fetchedBill = {
            billerName: currentBiller.name,
            account,
            amount,
            dueDate: dueDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            customerName: 'Customer',
            billId: 'JP' + Date.now().toString().slice(-8)
        };

        if (!isRecharge) {
            const names = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Neha Singh', 'Vikas Yadav'];
            fetchedBill.customerName = names[Math.floor(Math.random() * names.length)];
        }

        document.getElementById('preview-biller').textContent = fetchedBill.billerName;
        document.getElementById('preview-account').textContent = fetchedBill.account;
        document.getElementById('preview-customer').textContent = isRecharge ? '—' : fetchedBill.customerName;
        document.getElementById('preview-due').textContent = isRecharge ? 'Instant' : fetchedBill.dueDate;
        document.getElementById('preview-amount').textContent = '₹' + fetchedBill.amount.toLocaleString('en-IN');

        document.getElementById('bill-preview').style.display = 'block';
        fetchBtn.style.display = 'none';
        document.getElementById('pay-bill-btn').style.display = 'inline-flex';
        loader.style.display = 'none';
        fetchBtn.disabled = false;

        goToStep(2);
    }, 1500);
}

function openPaymentModal() {
    if (!fetchedBill) return;
    document.getElementById('pay-amount-display').textContent = '₹' + fetchedBill.amount.toLocaleString('en-IN');
    document.getElementById('pay-biller-display').textContent = fetchedBill.billerName;
    document.getElementById('payment-modal').classList.add('open');
}

function closePaymentModal() {
    document.getElementById('payment-modal').classList.remove('open');
}

function processPayment(method) {
    closePaymentModal();

    const overlay = document.getElementById('payment-processing');
    overlay.classList.add('open');

    setTimeout(() => {
        overlay.classList.remove('open');

        const txnId = 'TXN' + Date.now().toString().slice(-10);
        document.getElementById('success-txn').textContent = txnId;
        document.getElementById('success-amount').textContent = '₹' + fetchedBill.amount.toLocaleString('en-IN');
        document.getElementById('success-biller').textContent = fetchedBill.billerName;
        document.getElementById('success-method').textContent = method;

        saveRecentPayment({
            id: currentCategory.id + '-' + currentBiller.id + '-' + fetchedBill.account,
            category: currentCategory.id,
            billerId: currentBiller.id,
            billerName: currentBiller.name,
            account: fetchedBill.account,
            amount: fetchedBill.amount
        });

        showView('success-view');
        renderRecentPayments();
    }, 2000);
}

function showToast(msg) {
    const toast = document.getElementById('bill-toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

function filterBillers(query) {
    const q = query.toLowerCase().trim();
    if (!q) {
        renderCategories();
        return;
    }

    const matchingCategories = new Set();
    Object.entries(BILLERS).forEach(([catId, billers]) => {
        if (billers.some(b => b.name.toLowerCase().includes(q))) {
            matchingCategories.add(catId);
        }
    });

    BILL_CATEGORIES.forEach(cat => {
        if (cat.name.toLowerCase().includes(q)) matchingCategories.add(cat.id);
    });

    const grid = document.getElementById('bill-category-grid');
    const cats = BILL_CATEGORIES.filter(c => matchingCategories.has(c.id));

    if (cats.length === 0) {
        grid.innerHTML = '<p class="no-results">No billers found. Try a different search.</p>';
        return;
    }

    grid.innerHTML = cats.map(cat => `
        <button class="bill-cat-tile" data-category="${cat.id}" style="--cat-color:${cat.color}; --cat-bg:${cat.bg}">
            <span class="bill-cat-icon"><i class="fas ${cat.icon}"></i></span>
            <span class="bill-cat-name">${cat.name}</span>
        </button>
    `).join('');

    grid.querySelectorAll('.bill-cat-tile').forEach(btn => {
        btn.addEventListener('click', () => openPaymentFlow(btn.dataset.category));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderRecentPayments();

    document.getElementById('bill-search').addEventListener('input', e => {
        filterBillers(e.target.value);
    });

    document.getElementById('back-to-home').addEventListener('click', () => {
        showView('bill-home');
        renderCategories();
    });

    document.getElementById('back-from-success').addEventListener('click', () => {
        showView('bill-home');
        renderCategories();
    });

    document.getElementById('fetch-bill-btn').addEventListener('click', simulateFetchBill);

    document.getElementById('pay-bill-btn').addEventListener('click', openPaymentModal);

    document.getElementById('close-payment-modal').addEventListener('click', closePaymentModal);

    document.querySelectorAll('.pay-method-btn').forEach(btn => {
        btn.addEventListener('click', () => processPayment(btn.dataset.method));
    });

    document.getElementById('payment-modal').addEventListener('click', e => {
        if (e.target.id === 'payment-modal') closePaymentModal();
    });
});
