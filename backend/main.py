from fastapi import FastAPI
from core.script import generate_script
from core.voice import generate_voice
from core.video import generate_video
from core.storage import save_video

app = FastAPI()

@app.get("/")
def home():
    return {"status": "AI Video SaaS Running"}

@app.post("/generate")
def generate(topic: str):
    script = generate_script(topic)
    voice = generate_voice(script)
    video = generate_video(script, voice)
    return save_video("user1", topic, script, video)
