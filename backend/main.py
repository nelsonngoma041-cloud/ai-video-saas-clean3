from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from openai import OpenAI
import os
import requests
import uuid

app = FastAPI()

os.makedirs("audio", exist_ok=True)

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "status": "AI Video SaaS Running"
    }

@app.post("/generate")
def generate(topic: str):

    try:

        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You create short viral TikTok video scripts."
                },
                {
                    "role": "user",
                    "content": f"Create a TikTok script about {topic}"
                }
            ]
        )

        script = response.choices[0].message.content

    except Exception:

        script = """
HOOK:
You are not behind in life.

BODY:
Everyone grows at different speeds.
Keep trusting God and keep moving forward.

ENDING:
Your breakthrough may be closer than you think.
"""

    voice_url = "Voice generation failed"

    try:

        audio_id = str(uuid.uuid4())

        file_path = f"audio/{audio_id}.mp3"

        eleven_url = "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL"

        headers = {
            "xi-api-key": os.getenv("ELEVENLABS_API_KEY"),
            "Content-Type": "application/json"
        }

        data = {
            "text": script,
            "model_id": "eleven_multilingual_v2"
        }

        response = requests.post(
            eleven_url,
            json=data,
            headers=headers
        )

        if response.status_code == 200:

            with open(file_path, "wb") as f:
                f.write(response.content)

            voice_url = f"https://ai-video-saas-clean3-production.up.railway.app/audio/{audio_id}"

        else:

            print(response.text)

    except Exception as e:

        print(e)

    return {
        "topic": topic,
        "script": script,
        "voice": voice_url,
        "video": "video.mp4"
    }

@app.get("/audio/{audio_id}")
def get_audio(audio_id: str):

    file_path = f"audio/{audio_id}.mp3"

    return FileResponse(
        file_path,
        media_type="audio/mpeg"
    )
