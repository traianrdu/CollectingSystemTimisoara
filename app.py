import json
import os

from dotenv import load_dotenv
from flask import Flask, render_template, request, redirect, url_for, flash, session
import bcrypt

from manager.JsonManager import JsonManager
from manager.db import db_init, db
from model.CollectingPoints import CollectingPoints
from model.JsonDump import JsonDump
from model.models import Users , Contact, Container
from datetime import timedelta

load_dotenv()
app = Flask(__name__)

app.permanent_session_lifetime = timedelta(days=5)
app.secret_key = "gameover"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db_init(app)


@app.route("/", methods=['POST','GET'])
def home():
    # User session for feed back, the 0 and 1 will be replaced
    if "userInSession" in session:
        1
    else:
        0

    if request.method == "POST":
        name = request.form['name']
        mail = request.form['email']
        subject = request.form['subject']
        message = request.form['message']

        
       
        saveInDB = Contact(
            name = name,
            mail = mail,
            subject = subject,
            message = message
        )                
        db.session.add(saveInDB)
        db.session.commit()


    
    return render_template("home.html", env_key=os.getenv("GOOGLE_CLOUD_KEY"))

@app.route("/contact", methods=['POST','GET'])
def contact():
    if request.method == "POST":
        name = request.form['name']
        mail = request.form['email']
        subject = request.form['subject']
        message = request.form['message']

        saveInDB = Contact(
            name = name,
            mail = mail,
            subject = subject,
            message = message
        )                
        db.session.add(saveInDB)
        db.session.commit()
    return render_template("contact.html")


@app.route("/materials")
def materials():
    return render_template("materials.html")

@app.route("/signup", methods=['POST', 'GET'])
def signup():
    message = None

    if request.method == "POST":

        session.permanent = True

        username = request.form['username']
        mail = request.form['mail']
        password = request.form['password']
        retypedPassword = request.form['retypedPassword']

        selectAllUsers = Users.query.filter_by(username=username).first()

        if not selectAllUsers:

            hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            if password == retypedPassword:
                addUserInDB = Users(
                    username=username,
                    password=hashed,
                    mail=mail
                )

                db.session.add(addUserInDB)
                db.session.commit()

                session['userInSession'] = username
                message = "Welcome"
            else:
                message = "The passwords don't match,Try again."
        else:
            message = "The username already exists."

    if message != None:
        flash(message)
    return render_template("signup.html")


@app.route("/signin", methods=['POST', 'GET'])
def signin():
    message = None

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        selectUserFromDB = Users.query.filter_by(username=username).first()

        if selectUserFromDB:
            if bcrypt.checkpw(password.encode('utf-8'), selectUserFromDB.password):
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
    else:
        return render_template("home.html")



@app.route("/emptyCont" , methods=['POST','GET'])
def empty():
    if 'userInSession' in session:
        if request.method == 'POST':
            nameOfEmptyCan = request.form['name']
            percentOfCan = request.form['percent']
            percentOfCan ="perc_" + percentOfCan[:len(percentOfCan)-1]

            selectContainerFromDB =  Container.query.filter_by(name=nameOfEmptyCan).first()

            percents = ['perc_50' , 'perc_70' , 'perc_100']

            for i in range(len(percents)):
                if percents[i] == percentOfCan:
                    x = i
                    break
            if i == 0:
                selectContainerFromDB.perc_50 = selectContainerFromDB.perc_50 + 1
                db.session.commit()
            elif i == 1:
                selectContainerFromDB.perc_70 = selectContainerFromDB.perc_70 + 1
                db.session.commit()
            elif i == 1:
                selectContainerFromDB.perc_100 = selectContainerFromDB.perc_100 + 1
                db.session.commit()


            print(nameOfEmptyCan + " " + percentOfCan)
    return render_template("home.html")

# @app.route("/cityhall")
# def cityhall():
#     session["staff"] ="staff"
#     if "staff" in session:

#         return render_template("cityhallmap.html")

@app.route("/get_collecting_points", methods=['POST', 'GET'])
def closest_location():
    json_manager = JsonManager(
        'https://data.primariatm.ro/api/3/action/datastore_search?resource_id=d0134630-84d9-40b8-9bcb-dfdc926d66ab'
        '&limit=500')
    jd = JsonDump.from_json(json_manager.connect())
    collecting_list = []
    for item in jd.return_records():
        cp = CollectingPoints(item["_id"], item["id"], item["tip colectare"], item['adresa'], item['companie'],
                              item['website'], item['latitudine'], item['longitudine'])
        collecting_list.append(json.dumps(cp.__dict__))
    return json.dumps(collecting_list)


if __name__ == "__main__":
    app.run(debug=True)
