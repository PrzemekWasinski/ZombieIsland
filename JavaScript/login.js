function login(event) {
    event.preventDefault();

    const username = document.getElementById("login-username").value; //Get username and password
    const password = document.getElementById("login-password").value; 

    const storageDetails = JSON.parse(localStorage.getItem(username)); //Get user's details

    document.getElementById("error-message").innerText = "" //Reset both messages
    document.getElementById("success-message").innerText = ""

   if (!password || !username) { //If one of the fields are empty
    document.getElementById("error-message").innerText = "All fields must be filled" //Return error
   } else if (!storageDetails) { //If the username returns no details
    document.getElementById("error-message").innerText = "Account doesn't exist" //Return error
   } else if (storageDetails["Password"] !== password) { //If the password isn't correct
    document.getElementById("error-message").innerText = "Incorrect details" //Return error
   } else { //If all test passed
    sessionStorage.setItem("Current-user", username)
    document.getElementById("success-message").innerText = "Login Successful" //Return success confirmation
   }
}