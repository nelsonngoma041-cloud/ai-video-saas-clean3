from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

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

from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

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

        return {
            "topic": topic,
            "script": script,
            "video": "video.mp4"
        }

    except Exception as e:

        return {
            "topic": topic,
            "script": f"OpenAI Error: {str(e)}",
            "video": "error"
        }
def generate(topic: str):

    return {
        "topic": topic,
        "script": f"This is a generated AI script about {topic}",
        "video": "video.mp4"
    }
