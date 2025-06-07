import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { startGame } from './game.js';
import { config } from './config.js';

// Replace with your real project values:
const supabase = createClient(config.URL, config.API_KEY);

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
  const username = document.getElementById("register-username").value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;

  //Step 1: Check if username already exists
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

  //Step 2: Proceed to register new user
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    console.error("Signup error:", error.message);
    return alert(error.message);
  }

  const user = data.user;

  if (user) {
    //Step 3: Insert new character with unique username
    const { error: insertError } = await supabase.from('Characters').insert({
      id: user.id,
      username: username,
      level: 1,
      gold: 0
    });

    if (insertError) {
      console.error('Failed to insert character:', insertError.message);
      return alert("Failed to create character.");
    }
  }

  alert("Registered successfully! You can now log in.");
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
