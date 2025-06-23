// DOM Elements
const loginIcon = document.getElementById('loginIcon');
const modalOverlay = document.getElementById('modalOverlay');
const authModal = document.getElementById('authModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const successMessage = document.getElementById('successMessage');
const successBtn = document.getElementById('successBtn');
const successTitle = document.getElementById('successTitle');
const successText = document.getElementById('successText');

// Modal State
let isLoginMode = true;

// Event Listeners
if (loginIcon) {
    loginIcon.addEventListener('click', openModal);
}
if (closeModal) {
    closeModal.addEventListener('click', closeModalHandler);
}
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModalHandler();
        }
    });
}
if (showRegister) {
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        switchToRegister();
    });
}
if (showLogin) {
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        switchToLogin();
    });
}
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}
if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
}
if (successBtn) {
    successBtn.addEventListener('click', closeSuccessMessage);
}

// Keyboard event for closing modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
        closeModalHandler();
    }
});

// Modal Functions
function openModal() {
    if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            const firstInput = isLoginMode ? 
                document.getElementById('loginEmail') : 
                document.getElementById('registerName');
            if (firstInput) firstInput.focus();
        }, 300);
    }
}

function closeModalHandler() {
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            resetForms();
            if (!isLoginMode) {
                switchToLogin();
            }
        }, 300);
    } else {
        // For login.html, redirect to index.html
        window.location.href = 'index.html';
    }
}

function switchToLogin() {
    isLoginMode = true;
    if (modalTitle) modalTitle.textContent = 'Login';
    if (loginForm) loginForm.classList.remove('hidden');
    if (registerForm) registerForm.classList.add('hidden');
    resetForms();
}

function switchToRegister() {
    isLoginMode = false;
    if (modalTitle) modalTitle.textContent = 'Register';
    if (loginForm) loginForm.classList.add('hidden');
    if (registerForm) registerForm.classList.remove('hidden');
    resetForms();
}

function resetForms() {
    const inputs = document.querySelectorAll('.auth-form input');
    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('error');
    });
    
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.textContent = '';
    });
    
    const submitBtns = document.querySelectorAll('.submit-btn');
    submitBtns.forEach(btn => {
        btn.disabled = false;
        btn.textContent = btn.closest('#loginForm') ? 'Login' : 'Register';
    });
}

// Validation Functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validatePhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

function validateName(name) {
    return name.trim().length >= 2;
}

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(inputId + 'Error');
    if (input && errorElement) {
        input.classList.add('error');
        errorElement.textContent = message;
        input.addEventListener('input', function clearError() {
            input.classList.remove('error');
            errorElement.textContent = '';
            input.removeEventListener('input', clearError);
        });
    }
}

function showSuccess(title, message) {
    if (successTitle && successText) {
        successTitle.textContent = title;
        successText.textContent = message;
        successMessage.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeSuccessMessage() {
    if (successMessage) {
        successMessage.classList.remove('active');
        document.body.style.overflow = 'auto';
        closeModalHandler();
    }
}

// Form Handlers
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;
    let isValid = true;
    
    if (!email) {
        showError('loginEmail', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('loginEmail', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!password) {
        showError('loginPassword', 'Password is required');
        isValid = false;
    } else if (!validatePassword(password)) {
        showError('loginPassword', 'Password must be at least 6 characters long');
        isValid = false;
    }
    
    if (!isValid) return;
    
    const submitBtn = e.target.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';
    
    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            showSuccess('Welcome back!', `Login successful. Welcome back, ${user.name}!`);
        } else {
            showError('loginPassword', 'Invalid email or password');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
        }
    }, 1500);
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName')?.value.trim();
    const email = document.getElementById('registerEmail')?.value.trim();
    const phone = document.getElementById('registerPhone')?.value.trim();
    const password = document.getElementById('registerPassword')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;
    const agreeTerms = document.getElementById('agreeTerms')?.checked;
    let isValid = true;
    
    if (!name) {
        showError('registerName', 'Full name is required');
        isValid = false;
    } else if (!validateName(name)) {
        showError('registerName', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    if (!email) {
        showError('registerEmail', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('registerEmail', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!phone) {
        showError('registerPhone', 'Phone number is required');
        isValid = false;
    } else if (!validatePhone(phone)) {
        showError('registerPhone', 'Please enter a valid 10-digit phone number');
        isValid = false;
    }
    
    if (!password) {
        showError('registerPassword', 'Password is required');
        isValid = false;
    } else if (!validatePassword(password)) {
        showError('registerPassword', 'Password must be at least 6 characters long');
        isValid = false;
    }
    
    if (!confirmPassword) {
        showError('confirmPassword', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    if (!agreeTerms) {
        alert('Please agree to the Terms and Conditions');
        isValid = false;
    }
    
    if (!isValid) return;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
        showError('registerEmail', 'An account with this email already exists');
        return;
    }
    
    const submitBtn = e.target.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating Account...';
    
    setTimeout(() => {
        const newUser = {
            id: Date.now(),
            name,
            email,
            phone,
            password
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register';
        showSuccess('Account Created!', `Welcome, ${name}! Your account has been created successfully.`);
    }, 1500);
}