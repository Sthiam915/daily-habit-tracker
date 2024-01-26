from flask import Flask, render_template, request \
,jsonify, url_for, redirect, make_response, session
from random import randint, shuffle
import json
import mangodb
from flask_bcrypt import Bcrypt

def to_hex(num):
    hex_num = str(hex(num))[2:]
    while len(hex_num) < 8:
        hex_num = "0" + hex_num
    return hex_num

def generate_id(type):
    return type + to_hex(randint(0, 2**32))


app_database = mangodb.mangodb('TaskManagerData')

app = Flask(__name__)
bcrypt = Bcrypt(app)

app.secret_key = 'jhygutr6789(847&47y) hoij;l"JHGYF"}[\|'

@app.route('/')
def home():
    return render_template('productivity.html')

@app.route("/get-userdata/<sessionid>", methods = ["GET"])
def return_userdata(sessionid):
    #sessionid = sessionid[1:]
    #sessionid = sessionid[:-1]
    if(app_database.get('sessions',sessionid) != None):

        username = app_database.get('sessions',sessionid)['username']
        userdata = app_database.get('users',username)
        del userdata['password']
        return json.dumps(userdata)
    return json.dumps({'guest_id':'no matching data'})

@app.route("/update-user-data/<sessionid>", methods = ["POST"])
def update_data(sessionid):
    if(app_database.get('sessions',sessionid) != None):
        if(app_database.get('users',app_database.get('sessions',sessionid)['username']) != None):
            username = app_database.get('sessions',sessionid)['username']
            userdata = app_database.get('users',username)
            newdata = request.get_json()
            for key in newdata:
                userdata[key] = newdata[key]
            app_database.put('users',userdata,username)
            return 'success'

    else:
        return 'user does not exist'



@app.route("/login")
def login():
    return render_template('login.html')

@app.route("/login/confirm", methods = ["POST","GET"])
def authenticate():
    login_info = request.json
    user_data = app_database.get('users', login_info["user_name"])

    if user_data is None:
        return "no associated account"

    hashed_password = user_data['password']
    print(hashed_password)
    if bcrypt.check_password_hash(hashed_password, login_info["password"]):
        sessionid = app_database.makesession(login_info['user_name'])
        response = make_response(redirect('/'))
        response.set_cookie('sessionid', sessionid)
        return response

    return "wrong password"

@app.route("/signup")
def signup():
    return render_template('signup.html')

@app.route("/signup/change", methods = ["POST","GET"])
def signup_create():

    user = request.get_json()
    if app_database.get('users', user['user_name']) == None:
        user['initialized'] = 0
        user['day'] = 0
        user['archive'] = []
        user['taskdata'] = [[]]
        user['daysactive'] = []
        user['tasks'] = []
        user['dataday'] = [[0,0.0,0.0]]

        hashed_password = bcrypt.generate_password_hash(user['password']).decode('utf-8')
        user['password'] = hashed_password
        app_database.put('users', user, user['user_name'])
        sessionid = app_database.makesession(user['user_name'])
        response = make_response(redirect('/'))
        response.set_cookie('sessionid',sessionid)

        return response



    return "Username already exists"


@app.route("/signup/change/encrypt", methods = ["POST","GET"])
def encrypt():
    user = app_database.get('users','sthiam915@gmail.com')
    hashed_password = bcrypt.generate_password_hash(user['password']).decode('utf-8')
    user['password'] = hashed_password
    app_database.put('users', user, user['user_name'])
    return None

@app.route('/templates/<filename>')
def templates(filename):
    # Your route logic here
    return render_template(filename)

