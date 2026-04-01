import tempfile
import subprocess
import os
import shutil

def trimVideo(filepath: str, start: float, end: float):
    filepath = os.path.join("videos", filepath)
    if not filepath or not os.path.exists(filepath):
        return "invalid file", 400

    if start is None or end is None or start < 0 or end <= start:
        return "invalid time range", 400

    duration = end - start
    ext = os.path.splitext(filepath)[1]

    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=ext)
    temp_file.close()

    try:
        command = [
            "ffmpeg",
            "-y",
            "-ss", str(start),
            "-i", filepath,
            "-t", str(duration),
            "-c:v", "libx264",
            "-c:a", "aac",
            temp_file.name
        ]

        result = subprocess.run(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        if result.returncode != 0:
            os.remove(temp_file.name)
            return result.stderr.decode(), 500

        shutil.move(temp_file.name, filepath)

    except Exception as e:
        if os.path.exists(temp_file.name):
            os.remove(temp_file.name)
        return str(e), 500

    return "ok", 200