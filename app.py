from flask import Flask, render_template, request, session, redirect, url_for,send_file, jsonify
# import mysql.connector
import secrets
import random
import os
import json
from io import BytesIO
import zipfile
from moviepy.video.io.VideoFileClip import VideoFileClip
from PIL import Image
from werkzeug.utils import secure_filename
import pandas as pd

app = Flask(__name__)
app.static_folder = 'static'
app.secret_key = secrets.token_hex(16)  # Generate a 32-character secret key

ALLOWED_EXTENSIONS = ['mp4']

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
        # User does not exist or invalid credentials
        return render_template('Connexion.html')



@app.route('/index.html')
def index(): 
    return render_template('index.html')


@app.route('/annotation.html')
def annotation():
    return render_template('NewAnnotation.html')


@app.route('/myvideos.html')
def myvideos(): 
    # Liste les fichiers dans le dossier
    video_files = [f for f in os.listdir("./static/video") if os.path.isfile(os.path.join("./static/video", f))]
    print(video_files)
    video_info = []

    for video_file in video_files:
        video_path = os.path.join("./static/video", video_file)
        print(video_path)
        clip = VideoFileClip(video_path)
        duration = round(round(clip.duration, 0) / 60, 2)
        fps = clip.fps
        size = clip.size
        thumbnail_path = get_video_thumbnail(video_path)
        thumbnail_path = thumbnail_path.split("/")[1]
        video_info.append({
            'file_name': video_file,
            'duration': duration,
            'fps': fps,
            'size': size,
            'thumbnail': thumbnail_path,
        })
        print("video info :")
        print(video_info)
    return render_template('My_Videos.html', video_info=video_info)


def get_video_thumbnail(video_path):
    clip = VideoFileClip(video_path)
    frame = clip.get_frame(15)
    thumbnail = Image.fromarray(frame)
    thumbnail_path = os.path.join('static/thumbnails', os.path.basename(video_path).rsplit('.', 1)[0] + '.png')
    thumbnail.save(thumbnail_path)
    return thumbnail_path


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.',1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload_video', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return "No video file found"
    video = request.files['video']
    if video.filename == "":
        return 'No video file selected'
    if video and allowed_file(video.filename):
        filename = secure_filename(video.filename.replace(" ", "_"))
        video.save('static/video/' + filename)
        return render_template('NewAnnotation.html', video_name=filename) 
    return "invalid video"


@app.route('/stream_video')
def stream_video():
    video_path = 'static/video/temp_video.mp4'
    return send_file(video_path, mimetype='video/mp4', as_attachment=True)


@app.route('/delete_video/<video_name>')
def delete_video(video_name):
    video_path = os.path.join("static/video", video_name)
    thumbnail_path = os.path.join("static/thumbnails", video_name.replace('.mp4', '.png'))

    try:
        os.remove(video_path)
        os.remove(thumbnail_path)
        return "Video and thumbnail deleted successfully."
    except Exception as e:
        return f"Error deleting video: {str(e)}"


@app.route('/annotate_video/<video_name>')
def annotate_video(video_name):
    return render_template('NewAnnotation.html', video_name=video_name)


# upload video
@app.route('/upload_video_desktop_app', methods=['POST'])
def upload_video_desktop_app():
    # Get the uploaded file from the request
    video_file = request.files['videoFile']

    video_file.save("static/video/" + video_file.filename.split(".")[0] + "/" + video_file.filename)
    session['current_video'] = video_file.filename

    # Print the file name to the console for debugging
    print("Uploaded Video File Name:", video_file.filename)

    # Call the upload_video_desktop_app.py script with the file path
    # Include the --file argument properly
    script_path = 'upload_video/upload_video_desktop_app.py'
    os.system(f'python {script_path} --file="static/video/{video_file.filename}" --title="upload test script" --description="Test to upload a video on youtube"  --keywords="python, programming" --category="28"  --privacyStatus="public"')

    return 'Video uploaded successfully!'


@app.route('/submit_annotation', methods=['POST'])
def submit_annotation():

    if 'df_annotation' not in session:
        df_annotation = pd.DataFrame(columns=["playerName", "scoreAfter", "startTime", "endTime",
                                                        "incomingShot", "incomingType", "outgoingType",
                                                        "outgoingShot", "pointFinish", "position"])
    else: 
        df_annotation_json = session.get('df_annotation')
        df_annotation = pd.read_json(df_annotation_json)
        print(type(df_annotation))
    # Récupération des données du formulaire
    player_name = request.form['playerName']
    score_after = request.form['scoreAfter']
    start_time = request.form['startTime']
    end_time = request.form['endTime']
    incoming_shot = request.form['incomingShot']
    incoming_type = request.form['incomingType']
    outgoing_type = request.form['outgoingType']
    outgoing_shot = request.form['outgoingShot']
    point_finish = request.form['pointFinish']
    position = request.form['position']

    # Traiter ou stocker les données ici
    new_row = {
        "playerName": player_name,
        "scoreAfter": score_after,
        "startTime": start_time,
        "endTime": end_time,
        "incomingShot": incoming_shot,
        "incomingType": incoming_type,
        "outgoingType": outgoing_type,
        "outgoingShot": outgoing_shot,
        "pointFinish": point_finish,
        "position": position
    }
    """df_annotation_json = session.get('df_annotation')
    print(df_annotation_json)
    print(type(df_annotation_json))
    df_annotation_data = json.loads(df_annotation_json)
    print(df_annotation_data)
    print(type(df_annotation_data))
    df_annotation = pd.DataFrame(df_annotation_data)"""
    
    df_annotation = pd.concat([df_annotation, pd.DataFrame([new_row])], ignore_index=True)

    if len(df_annotation) == 1:
        last_index = 0
    else:
        last_index = df_annotation.index[-1]
    print(df_annotation)
    
    annotation_data = df_annotation.to_dict(orient='records')
    json_data = json.dumps(annotation_data)
    session['df_annotation'] = json_data
    """clip = VideoFileClip("static/video/" + session['current_video'])

    # Trim the video to the specified portion
    trimmed_clip = clip.subclip(start_time, end_time)

    # Specify the output file path for the trimmed video
    output_path = './output/' + session['current_video']

    # Write the trimmed video to the output file
    trimmed_clip.write_videofile(output_path, codec="libx264", fps=24)"""

    clip = VideoFileClip("static/video/Royalty ► My Journey to You.mp4")

    # Trim the video to the specified portion
    trimmed_clip = clip.subclip(start_time, end_time)

    output_directory = './output/Royalty/videos/'

    # Create the directory if it doesn't exist
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    # Specify the output file path for the trimmed video using the last_index
    output_path = os.path.join(output_directory, str(last_index) + ".mp4")

    # Write the trimmed video to the output file
    trimmed_clip.write_videofile(output_path, codec="libx264", fps=24)

    return jsonify({'message': 'Annotation enregistrée'}), 200


@app.route('/process_slider_values', methods=['POST'])
def process_slider_values():
    data = request.get_json()
    start_time = data['startTime']
    end_time = data['endTime']
    print(start_time)
    print(end_time)
    # Process the start and end timeframes as needed
    # You can perform any further processing or logic here

    return jsonify({'message': 'Slider values received successfully'})


@app.route('/download_data', methods=['GET'])
def download_data():
    
    # Path to the folder to be zipped
    folder_path = './output/Royalty/'

    # Path to the data.csv file
    csv_file_path = os.path.join(folder_path, 'data.csv')
    
    df_annotation_json = session.get('df_annotation')
    df_annotation = pd.read_json(df_annotation_json)

    df_annotation.to_csv(folder_path, index=False)
    
    # Create a ZipFile object in write mode
    zip_file_path = './output/Royalty.zip'
    with zipfile.ZipFile(zip_file_path, 'w') as zipf:
        # Write the data.csv file to the zip
        zipf.write(csv_file_path, arcname='data.csv')

        # Add the 'video' folder and its contents to the zip
        video_folder_path = os.path.join(folder_path, 'videos')
        for root, dirs, files in os.walk(video_folder_path):
            for file in files:
                file_path = os.path.join(root, file)
                zipf.write(file_path, arcname=os.path.relpath(file_path, folder_path))

    # Send the zip file for download
    return send_file(zip_file_path,
                     mimetype='application/zip',
                     attachment_filename='Royalty.zip',
                     as_attachment=True)

if __name__ == '__main__':
    app.run()
