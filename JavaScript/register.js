function register() {

    const username = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const phone = document.getElementById("register-phone").value;
    const password = document.getElementById("register-password").value;
    const confirm_password = document.getElementById("register-confirm-password").value;    

    const userDetails = {Username: username,
                                Email: email,
                                Phone: phone,
                                Password: password,
                                Score: 0};

    const storageDetails = JSON.parse(localStorage.getItem(username));
                           
    if (!username && !username.value || !email && !email.value || !phone && !phone.value || !password && !password.value || !confirm_password && confirm_password.value) {
        document.getElementById("message").innerText = "All fields must be filled!"
    } else if (storageDetails) {
        document.getElementById("message").innerText = "Account already exists!"
    } else if (new String(password).valueOf() != new String(confirm_password).valueOf()) {
        document.getElementById("message").innerText = "Passwords don't match!"
    } else if (new String(password).valueOf() == new String(confirm_password).valueOf()) {
        localStorage.setItem(username, JSON.stringify(userDetails));
        document.getElementById("message").innerText = ""
    }
}