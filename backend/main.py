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

    voice_url = "https://ai-video-saas-clean3-production.up.railway.app"

    scenes = [
    {
        "title": "HOOK",
        "image_prompt": f"Cinematic scene about {topic}, dramatic lighting"
    },
    {
        "title": "BODY",
        "image_prompt": f"Inspirational moment about {topic}, ultra realistic"
    },
    {
        "title": "ENDING",
        "image_prompt": f"Hopeful ending about {topic}, cinematic atmosphere"
    }
]

return {
    "topic": topic,
    "script": script,
    "voice": voice_url,
    "video": "video.mp4",
    "scenes": scenes
}
    }

@app.get("/audio/{audio_id}")
def get_audio(audio_id: str):

    file_path = f"audio/{audio_id}.mp3"

    return FileResponse(
        file_path,
        media_type="audio/mpeg"
    )
