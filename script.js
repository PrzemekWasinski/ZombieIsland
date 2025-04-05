//Firebase config is usually here but only I get to see it
const firebaseConfig = {
    apiKey: "AIzaSyCSbCntLC7jgeoNm2WnyGT6heDKO0Q0fxs",
    authDomain: "zombieisland-9e620.firebaseapp.com",
    databaseURL: "https://zombieisland-9e620-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "zombieisland-9e620",
    storageBucket: "zombieisland-9e620.firebasestorage.app",
    messagingSenderId: "712542178570",
    appId: "1:712542178570:web:968006b772725a38b87ef3",
    measurementId: "G-BTK92JL0SG"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

function clearMessages() {
    document.getElementById('loginError').textContent = '';
    document.getElementById('forgotPasswordError').textContent = '';
    document.getElementById('forgotPasswordSuccess').textContent = '';
}

function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'none';
    clearMessages();
}

function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('forgotPasswordForm').style.display = 'none';
    clearMessages();
}

function showForgotPassword() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'block';
    clearMessages();
}

async function resetPassword() {
    const email = document.getElementById('forgotEmail').value;
    const errorDiv = document.getElementById('forgotPasswordError');
    const successDiv = document.getElementById('forgotPasswordSuccess');
    errorDiv.textContent = '';
    successDiv.textContent = '';

    if (!email) {
        errorDiv.textContent = 'Please enter your email';
        return;
    }

    try {
        await auth.sendPasswordResetEmail(email);
        successDiv.textContent = 'Password reset link sent. Check your inbox and spam.';
        document.getElementById('forgotEmail').value = '';
    } catch (error) {
        errorDiv.textContent = error.message;
    }
}

async function register() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const characterClass = document.getElementById('characterClass').value;
    const errorDiv = document.getElementById('registerError');

    if (!username || !email || !password || !confirmPassword || !characterClass) {
        errorDiv.textContent = 'Please fill in all fields';
        return;
    }

    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match';
        return;
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await database.ref('users/' + userCredential.user.uid).set({ 
            username, 
            email, 
            characterClass, 
            gold: 100, 
            inventory: [], 
            level: 1 });
        alert('Registration successful!');
        showLogin();
    } catch (error) {
        errorDiv.textContent = error.message;
    }
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const userSnapshot = await database.ref('users/' + userCredential.user.uid).once('value');
        const userData = userSnapshot.val();

        if (!userData) throw new Error('User data not found');

        document.getElementById('authSection').style.display = 'none';
        document.getElementById('gameSection').style.display = 'block';
    } catch (error) {
        errorDiv.textContent = error.message;
    }
}

function logout() {
    auth.signOut().then(showLogin).catch(console.error);
}

auth.onAuthStateChanged(user => {
    if (user) {
        database.ref('users/' + user.uid).once('value').then(snapshot => {
            if (!snapshot.exists()) return auth.signOut();

            document.getElementById('authSection').style.display = 'none';
            document.getElementById('gameSection').style.display = 'block';
        });
    } else {
        showLogin();
    }
});
