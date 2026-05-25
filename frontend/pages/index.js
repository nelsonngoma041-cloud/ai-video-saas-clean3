import { useState } from "react";

export default function Home() {

  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);

  const generate = async () => {

    const response = await fetch(
      http://ai-video-saas-clean3-production.up.railway.app/generate?topic=" + topic,
      {
        method: "POST"
      }
    );

    const data = await response.json();

    setResult(data);
  };

  return (
    <div style={{
      padding: 40,
      fontFamily: "Arial"
    }}>

      <h1>AI Video SaaS</h1>

      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter video topic"
        style={{
          padding: 10,
          width: 300,
          marginRight: 10
        }}
      />

      <button onClick={generate}>
        Generate
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>

          <h2>Generated Result</h2>

          <p>
            <strong>Topic:</strong> {result.topic}
          </p>

          <p>
            <strong>Script:</strong> {result.script}
          </p>

          <p>
            <strong>Video:</strong> {result.video}
          </p>

        </div>
      )}

    </div>
  );
        }
