import uuid

def generate_voice(script):

    filename = f"{uuid.uuid4()}.mp3"

    with open(filename, "wb") as f:
        f.write(b"")

    return filename
