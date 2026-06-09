const USER_PROFILE_KEY = 'jhatpat_user_profile';
const USER_SESSION_KEY = 'jhatpat_user';

function getSessionUser() {
    try {
        const raw = sessionStorage.getItem(USER_SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function setSessionUser(user) {
    sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
}

function clearSessionUser() {
    sessionStorage.removeItem(USER_SESSION_KEY);
}

function getUserProfile() {
    try {
        return JSON.parse(localStorage.getItem(USER_PROFILE_KEY) || 'null');
    } catch {
        return null;
    }
}

function saveUserProfile(profile) {
    const existing = getUserProfile() || {};
    const merged = {
        ...existing,
        ...profile,
        updatedAt: new Date().toISOString()
    };
    if (!merged.createdAt) merged.createdAt = new Date().toISOString();
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(merged));
    return merged;
}

function isProfileComplete(profile) {
    if (!profile) return false;
    return !!(
        profile.fullName &&
        profile.phone &&
        profile.photoData &&
        profile.idType &&
        profile.idFrontData &&
        profile.address &&
        profile.location &&
        profile.location.lat &&
        profile.location.lng
    );
}

function loginCustomer(email, password) {
    const users = getRegisteredUsers();
    const key = email.trim().toLowerCase();
    const existing = users[key];

    if (existing && existing.password !== password) {
        return { ok: false, error: 'Invalid email or password' };
    }

    if (!existing) {
        users[key] = {
            email: key,
            password,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('jhatpat_registered_users', JSON.stringify(users));
    }

    setSessionUser({ email: key });
    const profile = getUserProfile();
    if (profile && profile.email !== key) {
        localStorage.removeItem(USER_PROFILE_KEY);
    }
    return { ok: true, needsOnboarding: !isProfileComplete(getUserProfile()) };
}

function getRegisteredUsers() {
    try {
        return JSON.parse(localStorage.getItem('jhatpat_registered_users') || '{}');
    } catch {
        return {};
    }
}

function logoutCustomer() {
    clearSessionUser();
}

function getDisplayName() {
    const profile = getUserProfile();
    if (profile?.fullName) return profile.fullName.split(' ')[0];
    const session = getSessionUser();
    if (session?.email) return session.email.split('@')[0];
    return 'User';
}

function getFormattedAddress() {
    const p = getUserProfile();
    if (!p) return '';
    const parts = [p.flatNo, p.address, p.landmark, p.city, p.pincode].filter(Boolean);
    return parts.join(', ');
}

if (typeof window !== 'undefined') {
    window.UserStore = {
        getSessionUser,
        setSessionUser,
        clearSessionUser,
        getUserProfile,
        saveUserProfile,
        isProfileComplete,
        loginCustomer,
        logoutCustomer,
        getDisplayName,
        getFormattedAddress
    };
}
