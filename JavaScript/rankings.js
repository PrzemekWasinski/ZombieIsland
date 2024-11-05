let scores = [["Player", "Score"]]; //Store usernames and scores in a 2D array

for (let i = 0; i < localStorage.length; i++) { //For every user
    const user = localStorage.key(i); //Grab the username
    const details = JSON.parse(localStorage.getItem(user)); //Grab their details
    scores.push([user, details["Score"]]); //Add their username and score to the scores list
}

scores.sort((a, b) => { //Sort thescores in descending order
    if (a[0] === "Player") return -1;
    if (b[0] === "Player") return 1;  
    return b[1] - a[1]; 
});

const table = document.getElementById("scores").getElementsByTagName("tbody")[0]; //Get the table element

for (let i = 1; i < scores.length; i++) { //For every user
    let row = table.insertRow();  //Make a new row
    let cell1 = row.insertCell(0);  //Make 2 cells
    let cell2 = row.insertCell(1); 
    
    cell1.innerHTML = scores[i][0]; //Add username to cell 1
    cell2.innerHTML = scores[i][1]; //Add score to cell 2
}