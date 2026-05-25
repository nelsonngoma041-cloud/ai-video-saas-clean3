import { useState } from "react";

export default function Home() {

  const [topic, setTopic] = useState("");
  const [response, setResponse] = useState(null);

  const generate = async () => {

    const res = await fetch(
      "YOUR_RAILWAY_URL/generate?topic=" + topic,
      {
        method: "POST"
      }
    );

    const data = await res.json();

    setResponse(data);
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>

      <h1>AI Video SaaS</h1>

      <input
        placeholder="Enter topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={{
          padding: 10,
          width: 300,
          marginRight: 10
        }}
      />

      <button onClick={generate}>
        Generate
      </button>

      {response && (
        <div style={{ marginTop: 20 }}>
          <h3>Result</h3>

          <p><strong>Topic:</strong> {response.topic}</p>
          <p><strong>Script:</strong> {response.script}</p>
          <p><strong>Video:</strong> {response.video}</p>
        </div>
      )}

    </div>
  );
}
