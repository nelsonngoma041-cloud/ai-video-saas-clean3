import { useState } from "react";

export default function Home() {

  const [topic, setTopic] = useState("");
  const [video, setVideo] = useState("");

  const generate = async () => {

    const res = await fetch(
      "http://localhost:8000/generate?topic=" + topic,
      { method: "POST" }
    );

    const data = await res.json();
    setVideo(data.video);
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>AI Video SaaS</h1>

      <input
        placeholder="Enter topic"
        onChange={(e) => setTopic(e.target.value)}
      />

      <button onClick={generate}>
        Generate
      </button>

      {video && (
        <div>
          <p>Video ready:</p>
          <a href={video} download>
            Download Video
          </a>
        </div>
      )}
    </div>
  );
}
