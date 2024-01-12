from flask import Flask, render_template, request, session, redirect, url_for
import requests
import mysql.connector
import secrets
import random


app = Flask(__name__)
app.static_folder = 'static'
app.secret_key = secrets.token_hex(16)  # Generate a 32-character secret key

"""
app.config['MYSQL_HOST'] = 'database-1.cczbiwiljwho.eu-north-1.rds.amazonaws.com'    # Replace with your MySQL server host
app.config['MYSQL_USER'] = 'admin'    # Replace with your MySQL username
app.config['MYSQL_PASSWORD'] = 'Emploitemps10#'    # Replace with your MySQL password
app.config['MYSQL_DB'] = 'new_schema'"""


@app.route('/')
def home():
    return render_template('Connexion.html')


@app.route('/create_account', methods=['POST'])
def create_account():
    name = request.form['name']
    email = request.form['email']
    password = request.form['password']

    # Generate a unique user ID
    user_id = random.randint(1, 1000)

    # Insert the user into the database with the assigned user ID
    """insert_user_query = "INSERT INTO users (id, name, email, password) VALUES (%s, %s, %s, %s)"
    user_data = (user_id, name, email, password)

     try:
        # Establish a connection to the MySQL database
        cnx = mysql.connector.connect(
            host=app.config['MYSQL_HOST'],
            user=app.config['MYSQL_USER'],
            password=app.config['MYSQL_PASSWORD'],
            database=app.config['MYSQL_DB']
        )

        # Create a cursor to execute the SQL query
        cursor = cnx.cursor()

        # Execute the insert query
        cursor.execute(insert_user_query, user_data)

        # Commit the changes to the database
        cnx.commit()

        # Close the cursor and database connection
        cursor.close()
        cnx.close()
        session['user_id'] = user_id

        # Redirect to a success page or perform any other necessary actions
        return render_template('Start.html')
    except mysql.connector.Error as error:
        # Handle the database error
        print("Error inserting user into the database:", error)

        # Redirect to an error page or perform error handling
        return render_template('Connexion.html')"""
    print(email)
    print(password)


@app.route('/login', methods=['POST'])
def login():
    # Retrieve form data
    email = request.form.get('email')
    password = request.form.get('password')
   
    # Connect to the database
    cnx = mysql.connector.connect(host=app.config['MYSQL_HOST'], user=app.config['MYSQL_USER'], password=app.config['MYSQL_PASSWORD'], database=app.config['MYSQL_DB'])
    cursor = cnx.cursor()

    # Check if the user exists in the database
    select_user_query = "SELECT * FROM users WHERE email = %s AND password = %s"
    user_data = (email, password)
    cursor.execute(select_user_query, user_data)
    user = cursor.fetchone()
   
    # Close the database connection
    cursor.close()
    cnx.close()

    if user:
        # User exists, perform login actions
        session['user_id'] = user[0]
        # Redirect to the user's dashboard or perform other actions
        return redirect(url_for('planning'))
    else:
        # User does not exist or invalid credentials, redirect to an error page or perform other actions
        return render_template('Connexion.html')


@app.route('/index.html')
def index(): 
    return render_template('index.html')


@app.route('/myvideos.html')
def myvideos():
    return render_template('MyVideos.html')


@app.route('/annotation.html')
def annotation():
    return render_template('NewAnnotation.html')


if __name__ == '__main__':
    app.run()