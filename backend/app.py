from flask import Flask, request, jsonify
import os
from backend.ffmpeg import trimVideo

app = Flask(__name__)

MEDIA_ROOT = "/media"

@app.route("/ffmpeg", methods=["POST"])
def ffmpeg_route():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No JSON body"}), 400

    action = data.get("action")
    filename = data.get("filename")

    if not action or not filename:
        return jsonify({"error": "Missing action or filename"}), 400

    filepath = os.path.abspath(os.path.join(MEDIA_ROOT, filename))

    if not os.path.exists(filepath):
        return jsonify({"error": "File not found"}), 404

    try:
        if action == "trim":
            start = data.get("min")
            end = data.get("max")

            if start is None or end is None:
                return jsonify({"error": "Missing min/max"}), 400

            start = float(start)
            end = float(end)

            msg, code = trimVideo(filepath, start, end)
            return jsonify({"message": msg}), code

        return jsonify({"error": "Invalid action"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500
