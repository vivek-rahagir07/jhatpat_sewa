let adminMap = null;
let mapMarkers = [];
let activeFilter = 'all';
let activeStatus = 'all';
let selectedRequestId = null;

const STATUS_LABELS = {
    pending: { label: 'Pending', class: 'status-pending' },
    assigned: { label: 'Assigned', class: 'status-assigned' },
    'in-progress': { label: 'In Progress', class: 'status-progress' },
    completed: { label: 'Completed', class: 'status-completed' },
    cancelled: { label: 'Cancelled', class: 'status-cancelled' }
};

function checkAdminAuth() {
    if (sessionStorage.getItem('jhatpat_admin') !== 'true') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function logoutAdmin() {
    sessionStorage.removeItem('jhatpat_admin');
    window.location.href = 'login.html';
}

function formatTime(iso) {
    const d = new Date(iso);
    const now = new Date();
    const diff = (now - d) / 60000;
    if (diff < 60) return Math.floor(diff) + 'm ago';
    if (diff < 1440) return Math.floor(diff / 60) + 'h ago';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function getFilteredRequests() {
    let list = RequestsStore.getRequests();
    if (activeFilter !== 'all') list = list.filter(r => r.type === activeFilter);
    if (activeStatus !== 'all') list = list.filter(r => r.status === activeStatus);
    const q = (document.getElementById('adminSearch')?.value || '').toLowerCase().trim();
    if (q) {
        list = list.filter(r =>
            r.customerName.toLowerCase().includes(q) ||
            r.phone.includes(q) ||
            r.address.toLowerCase().includes(q) ||
            r.serviceName.toLowerCase().includes(q) ||
            r.id.toLowerCase().includes(q)
        );
    }
    return list;
}

function renderStats() {
    const all = RequestsStore.getRequests();
    document.getElementById('statTotal').textContent = all.length;
    document.getElementById('statPending').textContent = all.filter(r => r.status === 'pending').length;
    document.getElementById('statProgress').textContent = all.filter(r => r.status === 'in-progress' || r.status === 'assigned').length;
    document.getElementById('statCompleted').textContent = all.filter(r => r.status === 'completed').length;
    document.getElementById('statRevenue').textContent = '₹' + all.filter(r => r.status === 'completed').reduce((s, r) => s + (r.amount || 0), 0).toLocaleString('en-IN');
    document.getElementById('notifBadge').textContent = all.filter(r => r.status === 'pending').length || '';
}

function renderRequestsTable() {
    const tbody = document.getElementById('requestsTableBody');
    const requests = getFilteredRequests();

    if (requests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-row">No requests found</td></tr>';
        return;
    }

    tbody.innerHTML = requests.map(r => {
        const meta = RequestsStore.SERVICE_META[r.type] || {};
        const st = STATUS_LABELS[r.status] || STATUS_LABELS.pending;
        return `
        <tr class="request-row ${selectedRequestId === r.id ? 'selected' : ''}" onclick="selectRequest('${r.id}')">
            <td><span class="req-id">${r.id}</span></td>
            <td>
                <span class="type-badge" style="background:${meta.color}20;color:${meta.color}">
                    <i class="fas ${meta.icon}"></i> ${meta.label}
                </span>
            </td>
            <td>
                <strong>${r.customerName}</strong><br>
                <small>${r.phone}</small>
            </td>
            <td class="addr-cell">${r.address}</td>
            <td>${r.amount ? '₹' + r.amount.toLocaleString('en-IN') : '—'}</td>
            <td><span class="status-pill ${st.class}">${st.label}</span></td>
            <td>${formatTime(r.createdAt)}</td>
        </tr>`;
    }).join('');
}

function renderRecentList() {
    const el = document.getElementById('recentRequestsList');
    const requests = RequestsStore.getRequests().slice(0, 5);

    el.innerHTML = requests.map(r => {
        const meta = RequestsStore.SERVICE_META[r.type] || {};
        const st = STATUS_LABELS[r.status] || STATUS_LABELS.pending;
        return `
        <div class="recent-req-card" onclick="selectRequest('${r.id}')">
            <div class="recent-req-icon" style="background:${meta.color}20;color:${meta.color}">
                <i class="fas ${meta.icon}"></i>
            </div>
            <div class="recent-req-info">
                <strong>${r.customerName}</strong>
                <span>${r.serviceName}</span>
                <small><i class="fas fa-map-marker-alt"></i> ${r.location?.area || 'Bangalore'}</small>
            </div>
            <span class="status-pill ${st.class}">${st.label}</span>
        </div>`;
    }).join('');
}

let mapContainerId = 'adminMap';

function initMap(containerId) {
    if (typeof L === 'undefined') return;
    const id = containerId || mapContainerId;
    const mapEl = document.getElementById(id);
    if (!mapEl) return;

    if (adminMap) {
        adminMap.remove();
        adminMap = null;
        mapMarkers = [];
    }

    mapContainerId = id;
    mapEl.innerHTML = '';
    adminMap = L.map(id, { zoomControl: true }).setView([12.9716, 77.5946], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(adminMap);

    setTimeout(() => adminMap?.invalidateSize(), 300);
}

function updateMapMarkers() {
    if (!adminMap) initMap();
    if (!adminMap) return;

    mapMarkers.forEach(m => adminMap.removeLayer(m));
    mapMarkers = [];

    const requests = getFilteredRequests().filter(r => r.location?.lat);

    requests.forEach(r => {
        const meta = RequestsStore.SERVICE_META[r.type] || { color: '#666' };
        const icon = L.divIcon({
            className: 'map-pin-custom',
            html: `<div class="map-pin" style="background:${meta.color}"><i class="fas ${meta.icon}"></i></div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 36]
        });

        const marker = L.marker([r.location.lat, r.location.lng], { icon })
            .addTo(adminMap)
            .bindPopup(`
                <div class="map-popup">
                    <strong>${r.customerName}</strong><br>
                    ${r.serviceName}<br>
                    <small>${r.address}</small><br>
                    <span class="status-pill ${STATUS_LABELS[r.status]?.class}">${STATUS_LABELS[r.status]?.label}</span>
                </div>
            `);

        marker.on('click', () => selectRequest(r.id));
        mapMarkers.push(marker);
    });

    if (requests.length > 1) {
        const group = L.featureGroup(mapMarkers);
        adminMap.fitBounds(group.getBounds().pad(0.15));
    } else if (requests.length === 1) {
        adminMap.setView([requests[0].location.lat, requests[0].location.lng], 14);
    }
}

function selectRequest(id) {
    selectedRequestId = id;
    const r = RequestsStore.getRequests().find(x => x.id === id);
    if (!r) return;

    renderRequestsTable();

    const meta = RequestsStore.SERVICE_META[r.type] || {};
    const st = STATUS_LABELS[r.status] || STATUS_LABELS.pending;
    const panel = document.getElementById('detailPanel');

    panel.innerHTML = `
        <div class="detail-header">
            <span class="type-badge large" style="background:${meta.color}20;color:${meta.color}">
                <i class="fas ${meta.icon}"></i> ${meta.label}
            </span>
            <span class="status-pill ${st.class}">${st.label}</span>
        </div>
        <h3>${r.serviceName}</h3>
        <p class="detail-id">${r.id} · ${formatTime(r.createdAt)}</p>

        <div class="detail-section">
            <h4><i class="fas fa-user"></i> Customer</h4>
            <p><strong>${r.customerName}</strong></p>
            <p><a href="tel:${r.phone}">${r.phone}</a></p>
        </div>

        <div class="detail-section">
            <h4><i class="fas fa-map-marker-alt"></i> Location</h4>
            <p>${r.address}</p>
            <p class="coords"><i class="fas fa-crosshairs"></i> ${r.location?.area || 'Bangalore'} · ${r.location?.lat?.toFixed(4)}, ${r.location?.lng?.toFixed(4)}</p>
            <button class="detail-action-btn" onclick="focusOnMap('${r.id}')"><i class="fas fa-map"></i> Show on Map</button>
        </div>

        ${r.amount ? `<div class="detail-section"><h4><i class="fas fa-rupee-sign"></i> Amount</h4><p class="detail-amount">₹${r.amount.toLocaleString('en-IN')}</p></div>` : ''}

        ${r.items?.length ? `<div class="detail-section"><h4><i class="fas fa-list"></i> Items</h4><ul class="detail-items">${r.items.map(i => `<li>${i}</li>`).join('')}</ul></div>` : ''}

        ${r.details ? `<div class="detail-section"><h4><i class="fas fa-info-circle"></i> Details</h4><p>${r.details}</p></div>` : ''}

        <div class="detail-actions">
            ${r.status === 'pending' ? `<button class="action-btn assign" onclick="setStatus('${r.id}','assigned')"><i class="fas fa-user-check"></i> Assign</button>` : ''}
            ${r.status === 'assigned' || r.status === 'pending' ? `<button class="action-btn progress" onclick="setStatus('${r.id}','in-progress')"><i class="fas fa-play"></i> Start</button>` : ''}
            ${r.status !== 'completed' && r.status !== 'cancelled' ? `<button class="action-btn complete" onclick="setStatus('${r.id}','completed')"><i class="fas fa-check"></i> Complete</button>` : ''}
            ${r.status !== 'completed' && r.status !== 'cancelled' ? `<button class="action-btn cancel" onclick="setStatus('${r.id}','cancelled')"><i class="fas fa-times"></i> Cancel</button>` : ''}
            <a href="tel:${r.phone}" class="action-btn call"><i class="fas fa-phone"></i> Call</a>
            <a href="https://wa.me/${r.phone.replace(/\D/g,'')}" target="_blank" class="action-btn whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</a>
        </div>
    `;

    panel.classList.add('open');
    document.getElementById('detailOverlay').classList.add('open');

    if (adminMap && r.location?.lat) {
        adminMap.setView([r.location.lat, r.location.lng], 15);
        mapMarkers.forEach(m => {
            const latlng = m.getLatLng();
            if (Math.abs(latlng.lat - r.location.lat) < 0.0001) m.openPopup();
        });
    }
}

function closeDetail() {
    selectedRequestId = null;
    document.getElementById('detailPanel').classList.remove('open');
    document.getElementById('detailOverlay').classList.remove('open');
    renderRequestsTable();
}

function focusOnMap(id) {
    switchAdminTab('map');
    setTimeout(() => {
        selectRequest(id);
        updateMapMarkers();
    }, 400);
}

function setStatus(id, status) {
    RequestsStore.updateRequestStatus(id, status);
    refreshDashboard();
    selectRequest(id);
    showAdminToast('Status updated to ' + STATUS_LABELS[status].label);
}

function setFilter(type, el) {
    activeFilter = type;
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    refreshDashboard();
}

function setStatusFilter(status, el) {
    activeStatus = status;
    document.querySelectorAll('.status-chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    refreshDashboard();
}

function switchAdminTab(tab) {
    document.querySelectorAll('.admin-nav-item').forEach(n => n.classList.toggle('active', n.dataset.tab === tab));
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.toggle('active', t.id === 'tab-' + tab));

    const titles = { dashboard: 'Dashboard', requests: 'All Requests', map: 'Live Map' };
    const titleEl = document.getElementById('pageTitle');
    if (titleEl) titleEl.textContent = titles[tab] || 'Dashboard';

    const mapId = tab === 'map' ? 'adminMapFull' : 'adminMap';
    setTimeout(() => {
        initMap(mapId);
        updateMapMarkers();
        adminMap?.invalidateSize();
    }, tab === 'map' ? 200 : 100);
}

function refreshDashboard() {
    renderStats();
    renderRequestsTable();
    renderRecentList();
    if (adminMap) updateMapMarkers();
}

function showAdminToast(msg) {
    const t = document.getElementById('adminToast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

document.addEventListener('DOMContentLoaded', () => {
    if (!checkAdminAuth()) return;

    RequestsStore.seedDemoRequestsIfEmpty();
    refreshDashboard();
    initMap();
    updateMapMarkers();

    document.getElementById('adminSearch').addEventListener('input', refreshDashboard);

    document.querySelectorAll('.admin-nav-item').forEach(item => {
        item.addEventListener('click', () => switchAdminTab(item.dataset.tab));
    });

    window.addEventListener('storage', e => {
        if (e.key === 'jhatpat_service_requests') refreshDashboard();
    });
});
