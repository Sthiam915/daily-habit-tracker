if(document.cookie != "" && document.cookie.length != 9 ){
  fetch('/')
  .then(response => window.location.href = response.url);
}
function authenticate(){

  var login_info = {
      "user_name": document.getElementById('usernamein').value,
      "password": document.getElementById('passwordin').value
    }
    login_info = JSON.stringify(login_info);
   
    fetch(`/login/confirm`, {
      method: "POST",
      headers: {'content-type': 'application/json'},
      body: login_info
    })
    .then(response => {
      if (response.redirected) {
           
          //document.cookie = `username=${document.getElementById('usernamein').value}`;
          window.location.href = response.url;
          return; 
      } else {
          return response.text();
      }
  })
  .then(data => {
    if(data != undefined){
      document.getElementById('respond').innerHTML = data;
    }
  })
}