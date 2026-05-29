from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from openai import OpenAI
import os
import requests
import uuid
import subprocess

app = FastAPI()

# =========================
# CREATE FOLDERS
# =========================

os.makedirs("audio", exist_ok=True)
os.makedirs("videos", exist_ok=True)
os.makedirs("images", exist_ok=True)
os.makedirs("srt_files", exist_ok=True)

# =========================
# OPENAI CLIENT
# =========================

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# HOME ROUTE
# =========================

@app.get("/")
def home():
    return {
        "status": "AI Video SaaS Running"
    }

# =========================
# GENERATE VIDEO
# =========================

@app.post("/generate")
def generate(topic: str):

    # =========================
    # AI SCRIPT
    # =========================

    try:

        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You create viral TikTok video scripts."
                },
                {
                    "role": "user",
                    "content": f"Create a motivational TikTok script about {topic}"
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

    # =========================
    # GENERATE VOICE
    # =========================

    audio_id = str(uuid.uuid4())

    voice_file = f"audio/{audio_id}.mp3"

    try:

        elevenlabs_response = requests.post(
            "https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb",
            headers={
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": os.getenv("ELEVENLABS_API_KEY")
            },
            json={
                "text": script,
                "model_id": "eleven_multilingual_v2"
            }
        )

        with open(voice_file, "wb") as f:
            f.write(elevenlabs_response.content)

        voice_url = f"https://ai-video-saas-clean3-production.up.railway.app/audio/{audio_id}"

    except Exception:

        voice_url = "Voice generation failed"

    # =========================
    # GENERATE SCENES
    # =========================

    scenes = []

    scene_prompts = [
        {
            "title": "HOOK",
            "prompt": f"Cinematic dramatic Christian motivation scene about {topic}, ultra realistic, movie lighting"
        },
        {
            "title": "BODY",
            "prompt": f"Inspirational emotional moment about {topic}, cinematic atmosphere, ultra detailed"
        },
        {
            "title": "ENDING",
            "prompt": f"Hopeful powerful ending scene about {topic}, sunrise, cinematic masterpiece"
        }
    ]

    image_files = []

    for index, scene in enumerate(scene_prompts):

        try:

            image_response = client.images.generate(
                model="gpt-image-1",
                prompt=scene["prompt"],
                size="1024x1024"
            )

            image_url = image_response.data[0].url

            image_data = requests.get(image_url).content

            image_path = f"images/{uuid.uuid4()}.png"

            with open(image_path, "wb") as f:
                f.write(image_data)

        except Exception:

            image_url = f"https://picsum.photos/seed/{scene['title']}/800/800"

            image_path = f"images/fallback_{index}.jpg"

            image_data = requests.get(image_url).content

            with open(image_path, "wb") as f:
                f.write(image_data)

        image_files.append(image_path)

        scenes.append({
            "title": scene["title"],
            "image_prompt": scene["prompt"],
            "image_url": image_url
        })

    # =========================
    # CREATE SUBTITLES
    # =========================

    video_id = str(uuid.uuid4())

    subtitle_file = f"srt_files/{video_id}.srt"

    subtitle_content = f"""1
00:00:00,000 --> 00:00:15,000
{script}
"""

    with open(subtitle_file, "w") as f:
        f.write(subtitle_content)

    # =========================
    # CREATE VIDEO
    # =========================

    video_file = f"videos/{video_id}.mp4"

    try:

        input_txt = "videos/input.txt"

        with open(input_txt, "w") as f:
            for image in image_files:
                f.write(f"file '{image}'\n")
                f.write("duration 3\n")

        temp_video = f"videos/temp_{video_id}.mp4"

        slideshow_command = [
            "ffmpeg",
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            input_txt,
            "-vf",
            "scale=1080:1920",
            "-pix_fmt",
            "yuv420p",
            "-c:v",
            "libx264",
            temp_video
        ]

        subprocess.run(slideshow_command)

        final_command = [
            "ffmpeg",
            "-y",
            "-i",
            temp_video,
            "-i",
            voice_file,
            "-vf",
            f"subtitles={subtitle_file}",
            "-c:v",
            "libx264",
            "-c:a",
            "aac",
            "-shortest",
            video_file
        ]

        subprocess.run(final_command)

        video_url = f"https://ai-video-saas-clean3-production.up.railway.app/video/{video_id}"

    except Exception:

        video_url = "Video generation failed"

    subtitles = script.split("\n")

    return {
        "topic": topic,
        "script": script,
        "voice": voice_url,
        "video": video_url,
        "scenes": scenes,
        "subtitles": subtitles
    }

# =========================
# AUDIO ROUTE
# =========================

@app.get("/audio/{audio_id}")
def get_audio(audio_id: str):

    file_path = f"audio/{audio_id}.mp3"

    return FileResponse(
        file_path,
        media_type="audio/mpeg"
    )

# =========================
# VIDEO ROUTE
# =========================

@app.get("/video/{video_id}")
def get_video(video_id: str):

    file_path = f"videos/{video_id}.mp4"

    return FileResponse(
        file_path,
        media_type="video/mp4"
    )
