document.addEventListener('DOMContentLoaded', () => {
    if (!UserStore.getSessionUser()) {
        window.location.href = 'login.html';
        return;
    }
    if (!UserStore.isProfileComplete(UserStore.getUserProfile())) {
        window.location.href = 'onboarding.html';
        return;
    }
    renderDashboard();
});

function renderDashboard() {
    const profile = UserStore.getUserProfile();
    const hour = new Date().getHours();
    let greeting = 'Good evening';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 17) greeting = 'Good afternoon';

    document.getElementById('dashGreeting').textContent =
        `${greeting}, ${UserStore.getDisplayName()}!`;

    const addr = UserStore.getFormattedAddress() || profile.address || 'Set your address';
    document.getElementById('dashAddress').textContent =
        addr.length > 42 ? addr.slice(0, 42) + '…' : addr;

    document.getElementById('dashName').textContent = profile.fullName || '—';
    document.getElementById('dashPhone').textContent = profile.phone || '—';

    const avatar = document.getElementById('dashAvatar');
    if (profile.photoData) {
        avatar.src = profile.photoData;
    } else {
        avatar.src = 'data:image/svg+xml,' + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#e0f2fe"/><text x="50" y="58" text-anchor="middle" font-size="40" fill="#1a96fc">?</text></svg>'
        );
    }

    renderOrders(profile);
}

function renderOrders(profile) {
    const container = document.getElementById('dashOrders');
    const requests = typeof RequestsStore !== 'undefined' ? RequestsStore.getRequests() : [];
    const mine = requests.filter(r =>
        r.phone === profile.phone ||
        r.customerName === profile.fullName
    ).slice(0, 5);

    const active = mine.filter(r => r.status !== 'completed' && r.status !== 'cancelled');
    document.getElementById('orderCount').textContent =
        active.length ? `${active.length} active` : 'All done';

    if (mine.length === 0) return;

    const meta = RequestsStore.SERVICE_META;
    container.innerHTML = mine.map(r => {
        const m = meta[r.type] || { label: r.serviceName, icon: 'fa-box', color: '#1a96fc' };
        const statusClass = r.status === 'completed' ? 'done' : r.status === 'in-progress' ? 'progress' : 'pending';
        return `
            <div class="dash-order-card">
                <div class="dash-order-icon" style="background:${m.color}20;color:${m.color}">
                    <i class="fas ${m.icon}"></i>
                </div>
                <div class="dash-order-body">
                    <strong>${r.serviceName}</strong>
                    <span>${r.id} · ${formatDate(r.createdAt)}</span>
                </div>
                <span class="dash-order-status dash-order-status--${statusClass}">${formatStatus(r.status)}</span>
            </div>`;
    }).join('');
}

function formatDate(iso) {
    const d = new Date(iso);
    const now = new Date();
    const diff = (now - d) / 3600000;
    if (diff < 1) return 'Just now';
    if (diff < 24) return Math.floor(diff) + 'h ago';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function formatStatus(s) {
    const map = { pending: 'Pending', 'in-progress': 'On the way', assigned: 'Assigned', completed: 'Delivered', cancelled: 'Cancelled' };
    return map[s] || s;
}

function logoutUser() {
    UserStore.logoutCustomer();
    window.location.href = 'login.html';
}
