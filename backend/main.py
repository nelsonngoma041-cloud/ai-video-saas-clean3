from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "AI Video SaaS Running"}

@app.post("/generate")
def generate(topic: str):

    return {
        "topic": topic,
        "script": f"Video about {topic}",
        "video": "video.mp4"
    }
