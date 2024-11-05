function register() {

    const username = document.getElementById("register-username").value; //Get all of the user's inputs
    const email = document.getElementById("register-email").value;
    const phone = document.getElementById("register-phone").value;
    const password = document.getElementById("register-password").value;
    const confirm_password = document.getElementById("register-confirm-password").value;    

    const userDetails = {Username: username, //Store the details in JSON format
                                     Email: email,
                                     Phone: phone,
                                     Password: password,
                                     Score: 0}; 

    const storageDetails = JSON.parse(localStorage.getItem(username)); //Search local storager for a user with the same username

    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //Email and phone number reg ex
    const phoneReg = /^((\(?0\d{4}\)?\s?\d{3}\s?\d{3})|(\(?0\d{3}\)?\s?\d{3}\s?\d{4})|(\(?0\d{2}\)?\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/
                     
    document.getElementById("error-message").innerText = "" //Reset messages
    document.getElementById("success-message").innerText = ""
    if (!username && !username.value || !email && !email.value || !phone && !phone.value || !password && !password.value || !confirm_password && confirm_password.value) { //If one of the fields are empty
        document.getElementById("error-message").innerText = "All fields must be filled!" //Return an error
    } else if (storageDetails) { //If a user with the same username was found
        document.getElementById("error-message").innerText = "Account already exists!" //Return an error
    } else if (new String(password).valueOf() != new String(confirm_password).valueOf()) { //If the passwords don't match
        document.getElementById("error-message").innerText = "Passwords don't match!" //Return an error
    } else if (!emailReg.test(email)) { //If the email isn't valid
        document.getElementById("error-message").innerText = "Invalid email!" //Return an error
    } else if (!phoneReg.test(phone)) { //If the phone number isn't valid
    document.getElementById("error-message").innerText = "Invalid phone number!" //Return an error
    } else if (new String(password).valueOf() == new String(confirm_password).valueOf() && email) { //If all tests passed
        localStorage.setItem(username, JSON.stringify(userDetails)); //Set the user's username and details in local storage
        document.getElementById("success-message").innerText = "Register Successful, please login" //Give the user a confirmation
    }
}