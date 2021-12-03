from flask import Flask, render_template, request, redirect, url_for, flash,session
from  flask_mysqldb import MySQL
import bcrypt
from db import db_init, db
from models import Users
from datetime import timedelta

app = Flask(__name__)
 

app.permanent_session_lifetime=timedelta(days=5)
app.secret_key = "gameover"
app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db_init(app)




@app.route("/")
def home():
    text=""
    if "userInSession" in session:
        text = "Hello " + session['userInSession']
    else: 
        text = "Hello"
    return render_template("home.html", text=text)

@app.route("/signup", methods = ['POST' ,'GET'])
def signup():
    
    message = None

    if request.method =="POST":


        session.permanent = True

        username = request.form['username']
        mail = request.form['mail']
        password = request.form['password']
        retypedPassword = request.form['retypedPassword']

        selectAllUsers = Users.query.filter_by(username=username).first()

        
        if   not selectAllUsers:
            

            hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            if password == retypedPassword:
                addUserInDB = Users(
                    username = username,
                    password = hashed,
                    mail = mail
                )

                
                db.session.add(addUserInDB)
                db.session.commit()

                session['userInSession'] = username
                message="Welcome"
            else: 
                message = "The passwords don't match,Try again."
        else:
            message = "The username already exists."

    if message != None:
        flash(message)
    return render_template("signup.html")

@app.route("/signin", methods=['POST','GET'])
def signin():

    message = None

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        selectUserFromDB = Users.query.filter_by(username=username).first()

        if selectUserFromDB:
            if bcrypt.checkpw(password.encode('utf-8'),selectUserFromDB.password):
                session["userInSession"] = username
                message = "Now you are signed in!"
            else:
                message = "Password incorrect!"
    
    if message != None:
        flash(message)
    return render_template("signin.html")

@app.route("/signout")
def signout():
    if "userInSession" in session:
        session.pop("userInSession", None)
        return redirect(url_for("home"))

if __name__== "__main__":
    app.run(debug=True)