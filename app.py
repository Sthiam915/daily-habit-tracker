#module defining the routes for each page, logging in, database access, etc.
from flask import Flask, render_template, request, \
redirect, make_response
from random import randint
import json
import mangodb
from flask_bcrypt import Bcrypt

#initializing app and database
app = Flask(__name__)
bcrypt = Bcrypt(app)
app.secret_key = 'jhygutr6789(847&47y) hoij;l"JHGYF"}[\|'

app_database = mangodb.mangodb('TaskManagerData') 

#main page route
@app.route('/')
def home():
    return render_template('productivity.html')

#login page route
@app.route("/login")
def login():
    return render_template('login.html')

#confirm login
@app.route("/login/confirm", methods = ["POST","GET"])
def authenticate():

    #access user data in database
    login_info = request.json
    user_data = app_database.get('users', login_info["user_name"])
    
    #check if user data exists(may change return type to boolean in future)
    if user_data is None:
        return "no associated account"
    
    #hashes password and tests against hashed password in the database, 
    #returning either a message or a redirect
    hashed_password = user_data['password']
    if bcrypt.check_password_hash(hashed_password, login_info["password"]):
        sessionid = app_database.makesession(login_info['user_name'])
        response = make_response(redirect('/'))
        response.set_cookie('sessionid', sessionid)
        return response
    
    return "wrong password"

#signup page route
@app.route("/signup")
def signup():
    return render_template('signup.html')

#create account from signup
@app.route("/signup/change", methods = ["POST","GET"])
def signup_create():
    
    #takes json data from sign up page, and converts it into a dict(user data)
    user = request.get_json()

    #makes sure user name is not already in database
    if app_database.get('users', user['user_name']) == None:
        user['initialized'] = 0
        user['day'] = 0
        user['archive'] = []
        user['taskdata'] = [[]]
        user['daysactive'] = []
        user['tasks'] = []
        user['dataday'] = [[0,0.0,0.0]]

        #encrypts password to add to database
        hashed_password = bcrypt.generate_password_hash(user['password']).decode('utf-8')
        user['password'] = hashed_password
        app_database.put('users', user, user['user_name'])

        #generates session id for when redirected and stores it in cookie
        sessionid = app_database.makesession(user['user_name'])
        response = make_response(redirect('/'))
        response.set_cookie('sessionid',sessionid)

        return response



    return "Username already exists"

#Requests user data from database to set up home page, redirects to login if session id doesn't exist
@app.route("/get-userdata/<sessionid>", methods = ["GET"])
def return_userdata(sessionid):
    #checks if session exists
    if(app_database.get('sessions',sessionid) != None):

        username = app_database.get('sessions',sessionid)['username']
        userdata = app_database.get('users',username)
        del userdata['password']
        return json.dumps(userdata)
    return redirect("/login")

#updates user data when client makes changes on the front end
@app.route("/update-user-data/<sessionid>", methods = ["POST"])
def update_data(sessionid):
    #makes sure session exists, updates data if it does
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

#route for file templaes
@app.route('/templates/<filename>')
def templates(filename):
    return render_template(filename)

