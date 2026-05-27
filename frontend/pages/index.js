import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        "https://ai-video-saas-clean3-production.up.railway.app/generate?topic=" +
          encodeURIComponent(topic),
        {
          method: "POST",
        }
      );

      const data = await response.json();

      setResult(data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        color: "white",
        fontFamily: "Arial",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 48,
            marginBottom: 10,
          }}
        >
          AI Video SaaS
        </h1>

        <p
          style={{
            color: "#94a3b8",
            fontSize: 18,
            marginBottom: 40,
          }}
        >
          Generate viral AI video scripts instantly
        </p>

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your video topic..."
            style={{
              padding: 15,
              width: 350,
              borderRadius: 12,
              border: "none",
              outline: "none",
              fontSize: 16,
            }}
          />

          <button
            onClick={generate}
            style={{
              padding: "15px 25px",
              borderRadius: 12,
              border: "none",
              background: "#3b82f6",
              color: "white",
              cursor: "pointer",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        {result && (
          <div
            style={{
              marginTop: 40,
              background: "#1e293b",
              padding: 30,
              borderRadius: 20,
              textAlign: "left",
            }}
          >
            <h2>Generated Result</h2>

            <p>
              <strong>Topic:</strong> {result.topic}
            </p>

            <div
              style={{
                marginTop: 20,
                whiteSpace: "pre-wrap",
                lineHeight: 1.8,
              }}
            >
              <strong>Script:</strong>

              <p>{result.script}</p>
            </div>

            <div style={{ marginTop: 20 }}>
              <p>
                <strong>Voice URL:</strong>
              </p>

              <a
