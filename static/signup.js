if(document.cookie != "" && document.cookie.length != 9 ){
    fetch('/')
    .then(response => window.location.href = response.url);
  }
function check(){
    if((document.getElementById('uname').value.includes('"')||document.getElementById('uname').value.includes('>')||document.getElementById('uname').value.includes('<')||
    document.getElementById('uname').value.includes('/')||document.getElementById('uname').value.includes(':')||document.getElementById('uname').value.includes('\\')||
    document.getElementById('uname').value.includes('|')||document.getElementById('uname').value.includes('?')||document.getElementById('uname').value.includes('*'))){
        alert('username can not contain ">", "<", "/", ":", "\\", "|", "?" or "*"');
        return false; 
    }
    if(document.getElementById('pwd').value == document.getElementById('cpwd').value
    && document.getElementById('name').value.length > 0
    && document.getElementById('uname').value.length > 0
    && document.getElementById('pwd').value.length > 7
    
    ){return true;}
    else{return false;}
}

function create(){
    var name = document.getElementById('name').value;
    var uname = document.getElementById('uname').value;
    var pwd = document.getElementById('pwd').value;
    if(check()){
        

        var userdata = {'name':name,
                'user_name' :uname,
                'password'  :pwd,
};
        
    fetch(`/signup/change`,{method: 'POST',

        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(userdata)})
    .then(response => {
        if(response.redirected){
        
            //document.cookie = `username=${uname}`;

            window.location.href = response.url;
        }
        else{

            return response.text();
        }
    })
    .then(data => {
        document.getElementById('validate').innerHTML = data;
    }
    );


        

    }
    else{
        if(name.length == 0){document.getElementById('validate').innerHTML = "Name too short"}
        else if(uname.length == 0){document.getElementById('validate').innerHTML = "User name too short"}
        else if(pwd.length < 8){document.getElementById('validate').innerHTML = "Password too short"}
        else{document.getElementById('validate').innerHTML = "Passwords don't match"}
    }

}