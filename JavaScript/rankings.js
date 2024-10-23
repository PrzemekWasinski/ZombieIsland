let scores = [["Player", "Score"]];

for (let i = 0; i < localStorage.length; i++) {
    const user = localStorage.key(i);
    const details = JSON.parse(localStorage.getItem(user));
    scores.push([user, details["Score"]])
}

const table = document.getElementById("scores");
for (let i = 0; i < scores.length; i++) {
    if (i <= 10) {
        let row = table.insertRow(i);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        cell1.innerHTML = scores[i][0];
        cell2.innerHTML = scores[i][1];
    }
}