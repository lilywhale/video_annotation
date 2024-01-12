function signUp() {
    const name = document.querySelector("#name").value
    const email = document.querySelector("#email").value
    const password = document.querySelector("#password").value
    const idStudent = document.querySelector("#StudentID").value
    console.log( document.getElementById("email"))
    const url = "http://localhost:3000/user/sign-up"
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, idStudent }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        alert('succesful sing up')
         window.location.assign('connection.html')
      })
      .catch(error => {
        console.error('Erreur lors de la requête :', error);
      });
}

document.getElementById("sign-up").onclick = function(e) {
  e.preventDefault();
  signUp()};

  function signIn() {
    const email = document.querySelector("#email").value
    const password = document.querySelector("#password").value
    const url = "http://localhost:3000/user/sign-in"
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.statut)
        window.location.assign('start.html')
      })
      .catch(error => {
        console.error('Erreur lors de la requête :', error);
      });
}

document.getElementById("sign-in").onclick = function(e) {
  e.preventDefault();
  signIn()};