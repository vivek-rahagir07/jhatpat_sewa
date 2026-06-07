const MORE_SERVICES = [
    { id: 'courier', name: 'Courier & Parcel', icon: 'fa-box', color: '#7c3aed', bg: '#f5f3ff', price: 'From ₹40' },
    { id: 'ticket', name: 'Ticket Booking', icon: 'fa-ticket-alt', color: '#2563eb', bg: '#eff6ff', price: '₹50 fee' },
    { id: 'insurance', name: 'Insurance Premium', icon: 'fa-shield-alt', color: '#059669', bg: '#ecfdf5', price: 'Instant' },
    { id: 'repair', name: 'Home Repairs', icon: 'fa-tools', color: '#ea580c', bg: '#fff7ed', price: 'On visit' },
    { id: 'laundry', name: 'Laundry & Iron', icon: 'fa-tshirt', color: '#06b6d4', bg: '#cffafe', price: 'From ₹30' },
    { id: 'medicine', name: 'Medicine Delivery', icon: 'fa-pills', color: '#ef4444', bg: '#fee2e2', price: '30 min' },
    { id: 'rental', name: 'Bike / Car Rental', icon: 'fa-motorcycle', color: '#64748b', bg: '#f1f5f9', price: 'Hourly' },
    { id: 'custom', name: 'Custom Request', icon: 'fa-magic', color: '#db2777', bg: '#fdf2f8', price: 'Quote' },
];

const MORE_SERVICE_DETAILS = {
    courier: { desc: 'Doorstep pickup & secure city-wide delivery', eta: 'Same day', rating: '4.8' },
    ticket: { desc: 'Train, bus & flight reservations made easy', eta: '15 mins', rating: '4.7' },
    insurance: { desc: 'LIC & health insurance premium payments', eta: 'Instant', rating: '4.9' },
    repair: { desc: 'Verified electricians, plumbers & carpenters', eta: '1-2 hrs', rating: '4.6' },
    laundry: { desc: 'Wash, iron & dry-clean with pickup', eta: '24 hrs', rating: '4.7' },
    medicine: { desc: 'Prescription & OTC medicine delivery', eta: '30 mins', rating: '4.8' },
    rental: { desc: 'Two-wheeler & car rentals for your trips', eta: '1 hr', rating: '4.5' },
    custom: { desc: 'Tell us what you need — we make it happen', eta: 'Varies', rating: '4.8' },
};

const MORE_DOCS = {
    courier: ['Sender & receiver address', 'Package weight & dimensions', 'Contents description'],
    ticket: ['Travel date & time', 'Source & destination', 'Passenger ID proof', 'Class preference'],
    insurance: ['Policy number', 'Company name', 'Premium amount', 'Policyholder ID'],
    repair: ['Type of repair needed', 'Photo of issue (optional)', 'Preferred visit time', 'Full address'],
    laundry: ['Number of items', 'Wash / iron / dry-clean', 'Pickup address & time'],
    medicine: ['Prescription photo (if needed)', 'Medicine names', 'Delivery address'],
    rental: ['Vehicle type', 'Duration needed', 'Driving license', 'Pickup location'],
    custom: []
};

let selectedMoreService = null;

function renderMoreTiles() {
    const grid = document.getElementById('moreTileGrid');
    grid.innerHTML = MORE_SERVICES.map(s => `
        <button class="svc-tile" onclick="openMoreBooking('${s.id}')">
            <span class="svc-tile-icon" style="background:${s.bg}; color:${s.color}"><i class="fas ${s.icon}"></i></span>
            <span class="svc-tile-name">${s.name}</span>
            <span class="svc-tile-price">${s.price}</span>
        </button>
    `).join('');
}

function renderMoreCards() {
    const grid = document.getElementById('moreServiceGrid');
    grid.innerHTML = MORE_SERVICES.filter(s => s.id !== 'custom').map(s => {
        const d = MORE_SERVICE_DETAILS[s.id];
        return `
        <div class="service-app-card" style="--svc-color:${s.color}" onclick="openMoreBooking('${s.id}')">
            <div class="svc-icon" style="background:${s.bg}; color:${s.color}"><i class="fas ${s.icon}"></i></div>
            <div class="svc-body">
                <h4>${s.name}</h4>
                <p>${d.desc}</p>
                <div class="svc-meta">
                    <span class="rating"><i class="fas fa-star"></i> ${d.rating}</span>
                    <span><i class="fas fa-clock"></i> ${d.eta}</span>
                </div>
                <div class="svc-footer">
                    <span class="svc-price">${s.price}</span>
                    <button class="svc-book-btn" style="background:${s.color}" onclick="event.stopPropagation(); openMoreBooking('${s.id}')">Book</button>
                </div>
            </div>
        </div>`;
    }).join('');
}

function openMoreBooking(serviceId) {
    selectedMoreService = MORE_SERVICES.find(s => s.id === serviceId);
    const details = MORE_SERVICE_DETAILS[serviceId];
    document.getElementById('moreSheetTitle').textContent = selectedMoreService.name;
    document.getElementById('moreSheetSub').textContent = details.desc + ' · ' + selectedMoreService.price;
    document.getElementById('moreServiceSelect').value = serviceId;
    showMoreDocs(serviceId);
    document.getElementById('moreBookingSheet').classList.add('open');
}

function closeMoreBooking() {
    document.getElementById('moreBookingSheet').classList.remove('open');
}

function showMoreDocs(val) {
    const box = document.getElementById('moreDocChecklist');
    const list = document.getElementById('moreDocList');
    const items = MORE_DOCS[val] || [];
    if (items.length === 0) {
        box.style.display = 'none';
        return;
    }
    list.innerHTML = items.map(d => `<li><i class="fas fa-check-circle"></i>${d}</li>`).join('');
    box.style.display = 'block';
}

function submitMoreRequest(e) {
    e.preventDefault();
    closeMoreBooking();
    document.getElementById('moreSuccessOverlay').classList.add('open');
    document.getElementById('moreSuccessService').textContent = selectedMoreService?.name || 'Service';
}

function closeMoreSuccess() {
    document.getElementById('moreSuccessOverlay').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
    renderMoreTiles();
    renderMoreCards();
    document.getElementById('moreServiceSelect').addEventListener('change', e => showMoreDocs(e.target.value));
});
