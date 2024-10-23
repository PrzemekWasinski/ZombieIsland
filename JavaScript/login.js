function login(event) {
    event.preventDefault();

    const password = document.getElementById("login-password").value;
    const username = document.getElementById("login-username").value;

    const storageDetails = JSON.parse(localStorage.getItem(username));

   if (!password || !username) {
    document.getElementById("message").innerText = "Missing details"
   } else if (!storageDetails) {
    document.getElementById("message").innerText = "Account doesn't exist"
   } else if (storageDetails["Password"] !== password) {
    document.getElementById("message").innerText = "Incorrect detail"
   } else {
    sessionStorage.setItem("User", username)
    window.open("../HTML/game.html", "_self");
    window.focus();
   }
}