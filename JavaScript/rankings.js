let scores = [];

for (let i = 0; i < localStorage.length; i++) {
    const user = localStorage.key(i);
    const details = JSON.parse(localStorage.getItem(user));
    scores.push([user, details["Score"]])
 
}

let list = document.getElementById("scores");
for (let i = 0; i < scores.length; ++i) {
    let li = document.createElement('li');
    li.innerText = scores[i];
    list.appendChild(li);
}