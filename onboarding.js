let currentStep = 1;
let selectedIdType = 'aadhaar';
let map, marker;
let pendingLocation = { lat: 12.9716, lng: 77.5946 };
let photoData = null;
let idFrontData = null;
let idBackData = null;

const ID_LABELS = {
    aadhaar: 'Aadhaar Number',
    pan: 'PAN Number',
    driving: 'Driving License Number'
};

document.addEventListener('DOMContentLoaded', () => {
    const session = UserStore.getSessionUser();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }
    document.getElementById('obEmail').value = session.email;
    const profile = UserStore.getUserProfile();
    if (profile) hydrateFromProfile(profile);
    if (UserStore.isProfileComplete(profile)) {
        document.getElementById('finishBtn').innerHTML = '<i class="fas fa-check"></i> Save Changes';
    }
});

function hydrateFromProfile(p) {
    if (p.phone) document.getElementById('obPhone').value = p.phone.replace(/^\+91/, '');
    if (p.fullName) document.getElementById('obName').value = p.fullName;
    if (p.idType) selectIdType(p.idType, document.querySelector(`.id-chip[data-id="${p.idType}"]`));
    if (p.idNumber) document.getElementById('obIdNumber').value = p.idNumber;
    if (p.flatNo) document.getElementById('obFlat').value = p.flatNo;
    if (p.address) document.getElementById('obAddress').value = p.address;
    if (p.landmark) document.getElementById('obLandmark').value = p.landmark;
    if (p.city) document.getElementById('obCity').value = p.city;
    if (p.pincode) document.getElementById('obPincode').value = p.pincode;
    if (p.photoData) setPhotoPreview(p.photoData);
    if (p.idFrontData) setDocPreview('idFrontPreview', 'idFrontZone', 'idFrontInner', p.idFrontData);
    if (p.idBackData) setDocPreview('idBackPreview', 'idBackZone', 'idBackInner', p.idBackData);
    if (p.location) pendingLocation = { lat: p.location.lat, lng: p.location.lng };
    photoData = p.photoData || null;
    idFrontData = p.idFrontData || null;
    idBackData = p.idBackData || null;
}

function goToStep(n) {
    document.querySelectorAll('.onboard-step').forEach(s => s.classList.remove('active'));
    document.getElementById('step' + n).classList.add('active');
    document.querySelectorAll('.step-dot').forEach(d => {
        d.classList.toggle('active', parseInt(d.dataset.step) <= n);
        d.classList.toggle('done', parseInt(d.dataset.step) < n);
    });
    currentStep = n;
    if (n === 4) setTimeout(initMap, 100);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function savePartial(data) {
    const session = UserStore.getSessionUser();
    UserStore.saveUserProfile({ email: session.email, ...data });
}

function goToStep2(e) {
    e.preventDefault();
    const phone = document.getElementById('obPhone').value.trim();
    if (!/^[6-9]\d{9}$/.test(phone)) {
        showToast('Enter a valid 10-digit mobile number');
        return;
    }
    savePartial({
        phone: '+91 ' + phone,
        whatsappUpdates: document.getElementById('obWhatsapp').checked
    });
    goToStep(2);
}

function goToStep3(e) {
    e.preventDefault();
    if (!photoData) {
        showToast('Please add your profile photo');
        return;
    }
    savePartial({
        fullName: document.getElementById('obName').value.trim(),
        photoData
    });
    goToStep(3);
}

function goToStep4(e) {
    e.preventDefault();
    if (!idFrontData) {
        showToast('Please upload front side of your ID');
        return;
    }
    savePartial({
        idType: selectedIdType,
        idNumber: document.getElementById('obIdNumber').value.trim(),
        idFrontData,
        idBackData
    });
    goToStep(4);
}

function selectIdType(type, btn) {
    selectedIdType = type;
    document.querySelectorAll('.id-chip').forEach(c => c.classList.remove('active'));
    if (btn) btn.classList.add('active');
    document.getElementById('idNumberLabel').textContent = ID_LABELS[type];
    const placeholders = { aadhaar: 'XXXX XXXX XXXX', pan: 'ABCDE1234F', driving: 'KA-01-XXXX-XXXX' };
    document.getElementById('obIdNumber').placeholder = placeholders[type];
}

function readFileAsDataURL(file, cb) {
    const reader = new FileReader();
    reader.onload = () => cb(reader.result);
    reader.readAsDataURL(file);
}

function previewPhoto(input) {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
        showToast('Photo must be under 3MB');
        return;
    }
    readFileAsDataURL(file, data => {
        photoData = data;
        setPhotoPreview(data);
    });
}

function setPhotoPreview(data) {
    const img = document.getElementById('photoPreview');
    const ph = document.getElementById('photoPlaceholder');
    img.src = data;
    img.hidden = false;
    ph.style.display = 'none';
    document.getElementById('photoZone').classList.add('has-photo');
}

function previewDoc(input, previewId, zoneId) {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
        showToast('File must be under 5MB');
        return;
    }
    readFileAsDataURL(file, data => {
        if (previewId === 'idFrontPreview') idFrontData = data;
        else idBackData = data;
        const innerId = previewId === 'idFrontPreview' ? 'idFrontInner' : 'idBackInner';
        setDocPreview(previewId, zoneId, innerId, data);
    });
}

function setDocPreview(previewId, zoneId, innerId, data) {
    const img = document.getElementById(previewId);
    const inner = document.getElementById(innerId);
    img.src = data;
    img.hidden = false;
    inner.style.display = 'none';
    document.getElementById(zoneId).classList.add('has-file');
}

function initMap() {
    if (map) {
        map.invalidateSize();
        marker.setLatLng([pendingLocation.lat, pendingLocation.lng]);
        return;
    }
    map = L.map('onboardMap', { zoomControl: false }).setView([pendingLocation.lat, pendingLocation.lng], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const pinIcon = L.divIcon({
        className: 'map-pin-marker',
        html: '<div class="pin-bounce"><i class="fas fa-map-marker-alt"></i></div>',
        iconSize: [36, 48],
        iconAnchor: [18, 48]
    });

    marker = L.marker([pendingLocation.lat, pendingLocation.lng], { draggable: true, icon: pinIcon }).addTo(map);

    marker.on('dragend', () => {
        const pos = marker.getLatLng();
        pendingLocation = { lat: pos.lat, lng: pos.lng };
        reverseGeocode(pos.lat, pos.lng);
    });

    map.on('click', e => {
        marker.setLatLng(e.latlng);
        pendingLocation = { lat: e.latlng.lat, lng: e.latlng.lng };
        reverseGeocode(e.latlng.lat, e.latlng.lng);
    });
}

function useCurrentLocation() {
    if (!navigator.geolocation) {
        showToast('Geolocation not supported on this device');
        return;
    }
    showToast('Fetching your location...');
    navigator.geolocation.getCurrentPosition(
        pos => {
            pendingLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            if (map) {
                map.setView([pendingLocation.lat, pendingLocation.lng], 17);
                marker.setLatLng([pendingLocation.lat, pendingLocation.lng]);
            }
            reverseGeocode(pendingLocation.lat, pendingLocation.lng);
            showToast('Location updated!');
        },
        () => showToast('Could not get location. Please allow GPS access or pin manually.'),
        { enableHighAccuracy: true, timeout: 12000 }
    );
}

async function reverseGeocode(lat, lng) {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
        );
        const data = await res.json();
        if (!data.address) return;
        const a = data.address;
        const street = [a.house_number, a.road, a.neighbourhood, a.suburb].filter(Boolean).join(', ');
        if (street) document.getElementById('obAddress').value = street;
        if (a.postcode) document.getElementById('obPincode').value = a.postcode;
        const city = a.city || a.town || a.village || a.county || '';
        if (city) document.getElementById('obCity').value = city;
    } catch {
        /* silent — user can fill manually */
    }
}

function searchAddress() {
    const wrap = document.getElementById('searchWrap');
    wrap.style.display = wrap.style.display === 'none' ? 'block' : 'none';
    if (wrap.style.display === 'block') document.getElementById('mapSearch').focus();
}

let searchTimeout;
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('mapSearch');
    if (!input) return;
    input.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => runSearch(input.value.trim()), 400);
    });
});

async function runSearch(q) {
    const resultsEl = document.getElementById('searchResults');
    if (!q || q.length < 3) {
        resultsEl.innerHTML = '';
        return;
    }
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q + ', India')}&limit=5`,
            { headers: { 'Accept-Language': 'en' } }
        );
        const items = await res.json();
        resultsEl.innerHTML = items.map((item, i) =>
            `<button type="button" class="search-result-item" onclick="pickSearchResult(${item.lat}, ${item.lon}, '${escapeAttr(item.display_name)}')">${item.display_name}</button>`
        ).join('') || '<p class="search-empty">No results found</p>';
    } catch {
        resultsEl.innerHTML = '<p class="search-empty">Search unavailable</p>';
    }
}

function escapeAttr(s) {
    return s.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function pickSearchResult(lat, lng, name) {
    pendingLocation = { lat: parseFloat(lat), lng: parseFloat(lng) };
    if (map) {
        map.setView([pendingLocation.lat, pendingLocation.lng], 17);
        marker.setLatLng([pendingLocation.lat, pendingLocation.lng]);
    }
    document.getElementById('obAddress').value = name.split(',')[0];
    document.getElementById('searchResults').innerHTML = '';
    document.getElementById('mapSearch').value = '';
    document.getElementById('searchWrap').style.display = 'none';
    reverseGeocode(pendingLocation.lat, pendingLocation.lng);
}

function completeOnboarding(e) {
    e.preventDefault();
    const btn = document.getElementById('finishBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    const session = UserStore.getSessionUser();
    const profile = {
        email: session.email,
        phone: '+91 ' + document.getElementById('obPhone').value.trim(),
        fullName: document.getElementById('obName').value.trim(),
        photoData,
        idType: selectedIdType,
        idNumber: document.getElementById('obIdNumber').value.trim(),
        idFrontData,
        idBackData,
        flatNo: document.getElementById('obFlat').value.trim(),
        address: document.getElementById('obAddress').value.trim(),
        landmark: document.getElementById('obLandmark').value.trim(),
        city: document.getElementById('obCity').value.trim(),
        pincode: document.getElementById('obPincode').value.trim(),
        location: {
            lat: pendingLocation.lat,
            lng: pendingLocation.lng,
            area: document.getElementById('obAddress').value.trim()
        },
        onboardingComplete: true,
        completedAt: new Date().toISOString()
    };

    const wasComplete = UserStore.isProfileComplete(UserStore.getUserProfile());
    UserStore.saveUserProfile(profile);
    showToast(wasComplete ? 'Profile updated!' : 'Profile complete! Welcome to Jhatpat Sewa');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
}

function showToast(msg) {
    const t = document.getElementById('onboardToast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
}
