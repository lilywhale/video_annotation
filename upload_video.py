import google.auth
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# Set your API credentials file path
CLIENT_SECRETS_FILE = 'D:/hippo/Nouveau dossier/client_secrets.json'

# Set your video file path
VIDEO_FILE_PATH = 'D:/hippo/Nouveau dossier/vid/mario.mp4'

# Set your YouTube API version
API_SERVICE_NAME = 'youtube'
API_VERSION = 'v3'

# Get credentials and create an API client
flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRETS_FILE, ['https://www.googleapis.com/auth/youtube.upload'])
credentials = flow.run_local_server(port=0)

# Save the credentials for future use
with open('token.json', 'w') as token:
    token.write(credentials.to_json())

# Create an authorized API client
youtube = build(API_SERVICE_NAME, API_VERSION, credentials=credentials)

# Upload the video as private
request_body = {
    'snippet': {
        'title': 'Your Video Title',
        'description': 'Your Video Description',
        'tags': ['tag1', 'tag2', 'tag3'],
        'categoryId': '22'  # Category ID for your video
    },
    'status': {
        'privacyStatus': 'private'
    }
}

media_file = MediaFileUpload(VIDEO_FILE_PATH, chunksize=-1, resumable=True)

response = youtube.videos().insert(
    part='snippet,status',
    body=request_body,
    media_body=media_file
).execute()

print(f'Video uploaded! Video ID: {response["id"]}')