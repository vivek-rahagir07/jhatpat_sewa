const REQUESTS_KEY = 'jhatpat_service_requests';

const AREA_COORDS = {
    koramangala: { lat: 12.9352, lng: 77.6245, label: 'Koramangala' },
    indiranagar: { lat: 12.9784, lng: 77.6408, label: 'Indiranagar' },
    whitefield: { lat: 12.9698, lng: 77.7499, label: 'Whitefield' },
    jayanagar: { lat: 12.9250, lng: 77.5838, label: 'Jayanagar' },
    hsr: { lat: 12.9121, lng: 77.6446, label: 'HSR Layout' },
    marathahalli: { lat: 12.9591, lng: 77.6974, label: 'Marathahalli' },
    btm: { lat: 12.9166, lng: 77.6101, label: 'BTM Layout' },
    default: { lat: 12.9716, lng: 77.5946, label: 'Bangalore' }
};

const SERVICE_META = {
    grocery: { label: 'Grocery', icon: 'fa-shopping-cart', color: '#059669' },
    bill: { label: 'Bill Payment', icon: 'fa-bolt', color: '#f59e0b' },
    cyber: { label: 'Cyber Cafe', icon: 'fa-laptop', color: '#1a96fc' },
    more: { label: 'More Services', icon: 'fa-cogs', color: '#7c3aed' }
};

function getRequests() {
    try {
        return JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]');
    } catch {
        return [];
    }
}

function saveRequests(requests) {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

function resolveLocation(address = '') {
    const lower = address.toLowerCase();
    for (const [key, coords] of Object.entries(AREA_COORDS)) {
        if (key !== 'default' && lower.includes(key.replace('hsr', 'hsr'))) {
            return jitterCoords(coords);
        }
        if (key !== 'default' && lower.includes(coords.label.toLowerCase())) {
            return jitterCoords(coords);
        }
    }
    if (lower.includes('hsr')) return jitterCoords(AREA_COORDS.hsr);
    if (lower.includes('btm')) return jitterCoords(AREA_COORDS.btm);
    return jitterCoords(AREA_COORDS.default);
}

function jitterCoords(base) {
    return {
        lat: base.lat + (Math.random() - 0.5) * 0.008,
        lng: base.lng + (Math.random() - 0.5) * 0.008,
        area: base.label
    };
}

function addServiceRequest(data) {
    const location = data.location || resolveLocation(data.address || '');
    const request = {
        id: 'REQ-' + Date.now().toString(36).toUpperCase(),
        type: data.type,
        serviceName: data.serviceName,
        customerName: data.customerName || 'Customer',
        phone: data.phone || '—',
        address: data.address || location.area,
        location,
        status: 'pending',
        amount: data.amount || 0,
        items: data.items || [],
        details: data.details || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const requests = getRequests();
    requests.unshift(request);
    saveRequests(requests);
    return request;
}

function updateRequestStatus(id, status) {
    const requests = getRequests();
    const idx = requests.findIndex(r => r.id === id);
    if (idx === -1) return null;
    requests[idx].status = status;
    requests[idx].updatedAt = new Date().toISOString();
    saveRequests(requests);
    return requests[idx];
}

function seedDemoRequestsIfEmpty() {
    if (getRequests().length > 0) return;

    const demos = [
        { type: 'grocery', serviceName: 'Grocery Delivery', customerName: 'Rahul Sharma', phone: '+91 9876543210', address: '42, 5th Block, Koramangala, Bangalore', amount: 485, items: ['🥔 Potato ×2', '🥛 Amul Milk ×1', '🍅 Tomato ×1'], status: 'pending' },
        { type: 'bill', serviceName: 'BESCOM Electricity', customerName: 'Priya Patel', phone: '+91 9988776655', address: 'Indiranagar 100ft Road, Bangalore', amount: 2340, details: 'Consumer ID: 1234567890', status: 'in-progress' },
        { type: 'cyber', serviceName: 'PAN Card Application', customerName: 'Amit Kumar', phone: '+91 9123456789', address: 'HSR Layout Sector 2, Bangalore', amount: 150, details: 'New PAN application with doorstep pickup', status: 'pending' },
        { type: 'more', serviceName: 'Home Repairs — Plumbing', customerName: 'Neha Singh', phone: '+91 9765432109', address: 'Jayanagar 4th Block, Bangalore', amount: 0, details: 'Kitchen tap leakage', status: 'assigned' },
        { type: 'grocery', serviceName: 'Grocery Delivery', customerName: 'Vikas Yadav', phone: '+91 9654321098', address: 'Whitefield ITPL Road, Bangalore', amount: 892, items: ['🍚 Basmati Rice ×1', '🫘 Toor Dal ×1', '🍪 Parle-G ×2'], status: 'completed' },
        { type: 'bill', serviceName: 'Jio Prepaid Recharge', customerName: 'Sneha Reddy', phone: '+91 9543210987', address: 'Marathahalli Bridge, Bangalore', amount: 299, details: 'Mobile: 9876543210', status: 'completed' },
        { type: 'cyber', serviceName: 'Print & Scan', customerName: 'Karthik N', phone: '+91 9432109876', address: 'BTM Layout 2nd Stage, Bangalore', amount: 75, details: '15 pages B&W A4', status: 'in-progress' },
        { type: 'more', serviceName: 'Courier & Parcel', customerName: 'Ananya Das', phone: '+91 9321098765', address: 'Koramangala 1st Block, Bangalore', amount: 40, details: 'Document delivery to MG Road', status: 'pending' }
    ];

    demos.forEach((d, i) => {
        const loc = resolveLocation(d.address);
        const req = {
            id: 'REQ-DEMO' + (i + 1),
            ...d,
            location: loc,
            createdAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
            updatedAt: new Date(Date.now() - i * 1800000).toISOString()
        };
        const requests = getRequests();
        requests.push(req);
        saveRequests(requests);
    });
}

if (typeof window !== 'undefined') {
    window.RequestsStore = {
        getRequests,
        addServiceRequest,
        updateRequestStatus,
        seedDemoRequestsIfEmpty,
        resolveLocation,
        SERVICE_META,
        AREA_COORDS
    };
}
