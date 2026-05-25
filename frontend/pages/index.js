import { useState } from "react";

export default function Home() {

  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {

    if (!topic) {
      setError("Please enter a topic");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {

      const response = await fetch(
        "https://ai-video-saas-clean3-production.up.railway.app/generate?topic=" + encodeURIComponent(topic),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      const data = await response.json();

      setResult(data);

    } catch (err) {

      console.error(err);
      setError("Something went wrong connecting to backend");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div
      style={{
        padding: 40,
        fontFamily: "Arial",
        maxWidth: 700,
        margin: "0 auto"
      }}
    >

      <h1>AI Video SaaS</h1>

      <p>
        Generate AI video scripts instantly.
      </p>

      <div style={{ marginTop: 20 }}>

        <input
          type="text"
          placeholder="Enter video topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{
            padding: 12,
            width: "70%",
            marginRight: 10,
            borderRadius: 8,
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={generate}
          style={{
            padding: "12px 20px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer"
          }}
        >
          Generate
        </button>

      </div>

      {loading && (
        <p style={{ marginTop: 20 }}>
          Generating...
        </p>
      )}

      {error && (
        <p style={{
          marginTop: 20,
          color: "red"
        }}>
          {error}
        </p>
      )}

      {result && (
        <div
          style={{
            marginTop: 30,
            padding: 20,
            border: "1px solid #ddd",
            borderRadius: 10
          }}
        >

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
