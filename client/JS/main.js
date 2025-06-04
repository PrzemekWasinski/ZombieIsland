import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { startGame } from './game.js';

// Replace with your real project values:
const supabase = createClient('https://rrfmavvwcgcglfmdftdq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyZm1hdnZ3Y2djZ2xmbWRmdGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDg3ODEsImV4cCI6MjA2NDYyNDc4MX0.q4wYUbtBl4eXaa1g75dgQ-EAuEItptUvOZgAHp6PW4k');

const loginScreen = document.getElementById('login-screen');
const registerScreen = document.getElementById('register-screen');
const gameScreen = document.getElementById('game-screen');

// Navigation
document.getElementById('go-register').onclick = (e) => {
  e.preventDefault();
  loginScreen.style.display = 'none';
  registerScreen.style.display = 'block';
};

document.getElementById('go-login').onclick = (e) => {
  e.preventDefault();
  registerScreen.style.display = 'none';
  loginScreen.style.display = 'block';
};

// Register
document.getElementById('register-button').onclick = async () => {
  const username = document.getElementById("register-username").value;  
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  // Step 1: Sign up user
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return alert(error.message);

  const user = data.user;

  if (user) {
    const { error: insertError } = await supabase.from('Characters').insert({
      id: user.id,
      username: username, // or prompt for username
      level: 1,
      gold: 0
    });

    if (insertError) {
      console.error('Failed to insert character:', insertError);
    }
  }

  alert("Registered! You can now log in.");
  registerScreen.style.display = 'none';
  loginScreen.style.display = 'block';
};


// Login
document.getElementById('login-button').onclick = async () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);

  const token = data.session.access_token;
  const userId = data.user.id;

  // Switch to game
  loginScreen.style.display = 'none';
  gameScreen.style.display = 'block';

  // Start game and pass user ID + token
  startGame({ userId, token });
};
