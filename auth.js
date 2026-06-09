function requireCustomerAuth(redirectToLogin = true) {
    if (typeof UserStore === 'undefined') return false;
    const session = UserStore.getSessionUser();
    if (!session) {
        if (redirectToLogin) window.location.href = 'login.html';
        return false;
    }
    return true;
}

function requireOnboardingComplete() {
    if (!requireCustomerAuth()) return false;
    if (!UserStore.isProfileComplete(UserStore.getUserProfile())) {
        window.location.href = 'onboarding.html';
        return false;
    }
    return true;
}

function redirectAfterLogin() {
    const profile = UserStore.getUserProfile();
    if (UserStore.isProfileComplete(profile)) {
        window.location.href = 'dashboard.html';
    } else {
        window.location.href = 'onboarding.html';
    }
}

function updateAuthNavbar() {
    const loginLink = document.querySelector('.nav-auth-slot');
    if (!loginLink || typeof UserStore === 'undefined') return;

    const session = UserStore.getSessionUser();
    if (session) {
        const name = UserStore.getDisplayName();
        const complete = UserStore.isProfileComplete(UserStore.getUserProfile());
        loginLink.innerHTML = complete
            ? `<a href="dashboard.html" class="nav-user-pill"><i class="fas fa-user-circle"></i> ${name}</a>`
            : `<a href="onboarding.html" class="nav-user-pill nav-user-pill--warn"><i class="fas fa-exclamation-circle"></i> Complete Profile</a>`;
        loginLink.classList.add('logged-in');
    } else {
        loginLink.innerHTML = '<a href="login.html" class="login-btn">Login</a>';
        loginLink.classList.remove('logged-in');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof UserStore !== 'undefined') updateAuthNavbar();
});

if (typeof window !== 'undefined') {
    window.Auth = {
        requireCustomerAuth,
        requireOnboardingComplete,
        redirectAfterLogin,
        updateAuthNavbar
    };
}
