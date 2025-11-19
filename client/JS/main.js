import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { startGame } from './game.js';

const supabase = createClient(
	"https://rrfmavvwcgcglfmdftdq.supabase.co",
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyZm1hdnZ3Y2djZ2xmbWRmdGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDg3ODEsImV4cCI6MjA2NDYyNDc4MX0.q4wYUbtBl4eXaa1g75dgQ-EAuEItptUvOZgAHp6PW4k"
);

const loginScreen = document.getElementById('login-screen');
const registerScreen = document.getElementById('register-screen');
const resetPasswordScreen = document.getElementById('reset-password-screen');
const updatePasswordScreen = document.getElementById('update-password-screen');
const gameScreen = document.getElementById('game-screen');

//Navigation
document.getElementById('go-register').onclick = (e) => {
	e.preventDefault();
	loginScreen.style.display = 'none';
	registerScreen.style.display = 'flex';
};

document.getElementById('go-login').onclick = (e) => {
	e.preventDefault();
	registerScreen.style.display = 'none';
	resetPasswordScreen.style.display = 'none';
	loginScreen.style.display = 'flex';
};

document.getElementById('forgot-password').onclick = (e) => {
	e.preventDefault();
	loginScreen.style.display = 'none';
	resetPasswordScreen.style.display = 'flex';
};

document.getElementById('back-to-login').onclick = (e) => {
	e.preventDefault();
	resetPasswordScreen.style.display = 'none';
	loginScreen.style.display = 'flex';
};

//Register
document.getElementById('register-button').onclick = async () => {
	const username = document.getElementById("register-username").value.trim();
	const email = document.getElementById('register-email').value.trim();
	const password = document.getElementById('register-password').value;
	const confirmPassword = document.getElementById('register-confirm-password').value;

	//Check if passwords match
	if (password !== confirmPassword) {
		return alert("Passwords do not match. Please try again.");
	}

	//Check if username already exists
	const { data: existingUser, error: fetchError } = await supabase
		.from("Characters")
		.select("username")
		.eq("username", username)
		.maybeSingle();

	if (fetchError) {
		console.error("Fetch error:", fetchError.message);
		return alert("Something went wrong. Try again.");
	}

	if (existingUser) {
		return alert("Username already exists. Choose a different one.");
	}

	//Proceed to register new user
	const { data, error } = await supabase.auth.signUp({ email, password });
	if (error) {
		console.error("Signup error:", error.message);
		return alert(error.message);
	}

	const user = data.user;

	if (user) {
		//You can try to edit this but RLS in my DB will reject any new users with stats that are different from this.
		const { error: insertError } = await supabase.from('Characters').insert({ 
			id: user.id,
			username: username,
			level: 1,
			gold: 0,
			health: 100,
			mapX: 393,
			mapY: 724,
			inBoat: false
		});

		if (insertError) {
			console.error('Failed to insert character:', insertError.message);
			return alert("Failed to create character.");
		}
	}

	alert("Registered successfully! You can now log in.");
	registerScreen.style.display = 'none';
	loginScreen.style.display = 'flex';
};

//Check if credentials are saved on page load
window.addEventListener('DOMContentLoaded', () => {
	const savedEmail = localStorage.getItem('rememberedEmail');
	const savedPassword = localStorage.getItem('rememberedPassword');

	if (savedEmail && savedPassword) {
		document.getElementById('login-email').value = savedEmail;
		document.getElementById('login-password').value = savedPassword;
		document.getElementById('remember-me').checked = true;
	}
});

//Login
document.getElementById('login-button').onclick = async () => {
	const email = document.getElementById('login-email').value;
	const password = document.getElementById('login-password').value;
	const rememberMe = document.getElementById('remember-me').checked;

	const { data, error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) return alert(error.message);

	//Handle Remember Me
	if (rememberMe) {
		localStorage.setItem('rememberedEmail', email);
		localStorage.setItem('rememberedPassword', password);
	} else {
		localStorage.removeItem('rememberedEmail');
		localStorage.removeItem('rememberedPassword');
	}

	const token = data.session.access_token;
	const userId = data.user.id;

	//Switch to game
	document.body.classList.add('game-active');
	loginScreen.style.display = 'none';
	gameScreen.style.display = 'block';

	//Start game and pass user ID + token
	startGame({ userId, token });
};

//Reset Password
document.getElementById('reset-password-button').onclick = async () => {
	const email = document.getElementById('reset-email').value.trim();

	if (!email) {
		return alert('Please enter your email address.');
	}

	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: 'https://www.zombieisland.online'
	});

	if (error) {
		return alert(error.message);
	}

	alert('Password reset email sent! Please check your inbox.');
	resetPasswordScreen.style.display = 'none';
	loginScreen.style.display = 'flex';
};

//Check for password reset token on page load
window.addEventListener('DOMContentLoaded', async () => {
	//Check URL hash for recovery token
	const hash = window.location.hash;
	console.log('URL hash:', hash); // Debug log

	if (hash) {
		const hashParams = new URLSearchParams(hash.substring(1));
		const accessToken = hashParams.get('access_token');
		const type = hashParams.get('type');

		console.log('Type:', type, 'Access Token:', accessToken ? 'present' : 'missing'); // Debug log

		if (type === 'recovery' && accessToken) {
			//User clicked the reset password link from email
			loginScreen.style.display = 'none';
			registerScreen.style.display = 'none';
			resetPasswordScreen.style.display = 'none';
			updatePasswordScreen.style.display = 'flex';
		}
	}
});

//Update Password (after clicking email link)
document.getElementById('update-password-button').onclick = async () => {
	const newPassword = document.getElementById('new-password').value;
	const confirmPassword = document.getElementById('confirm-password').value;

	if (!newPassword || !confirmPassword) {
		return alert('Please fill in both password fields.');
	}

	if (newPassword !== confirmPassword) {
		return alert('Passwords do not match.');
	}

	if (newPassword.length < 6) {
		return alert('Password must be at least 6 characters long.');
	}

	const { error } = await supabase.auth.updateUser({
		password: newPassword
	});

	if (error) {
		return alert(error.message);
	}

	alert('Password updated successfully! You can now log in with your new password.');
	updatePasswordScreen.style.display = 'none';
	loginScreen.style.display = 'flex';

	//Clear the URL hash
	window.location.hash = '';
};
