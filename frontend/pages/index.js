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
            {loading ? "Generating AI Content..." : "Generate"}
          </button>
        </div>

        {loading && (
          <div
            style={{
              marginTop: 40,
              background: "#1e293b",
              padding: 30,
              borderRadius: 20,
            }}
          >
            <h2>Generating Your AI Video...</h2>

            <p
              style={{
                marginTop: 15,
                color: "#cbd5e1",
                lineHeight: 1.8,
              }}
            >
              Creating script, scenes, visuals, and voice assets...
            </p>
          </div>
        )}

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
                href={result.voice}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#60a5fa",
                  wordBreak: "break-all",
                }}
              >
                {result.voice}
              </a>

              <div style={{ marginTop: 20 }}>
                <audio controls style={{ width: "100%" }}>
                  <source src={result.voice} type="audio/mpeg" />
                </audio>
              </div>

              <div style={{ marginTop: 15 }}>
                <a
                  href={result.voice}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "#22c55e",
                    color: "white",
                    padding: "12px 20px",
                    borderRadius: 10,
                    textDecoration: "none",
                    display: "inline-block",
                    fontWeight: "bold",
                  }}
                >
                  Download Voice
                </a>
              </div>

              <p style={{ marginTop: 20 }}>
                <strong>Video:</strong> {result.video}
              </p>
            </div>

            <div style={{ marginTop: 30 }}>
              <h3>Scenes</h3>

              {result.scenes &&
                result.scenes.map((scene, index) => (
                  <div
                    key={index}
                    style={{
                      marginTop: 20,
                      padding: 20,
                      background: "#334155",
                      borderRadius: 12,
                    }}
                  >
                    <h4>{scene.title}</h4>

                    <img
                      src={`https://picsum.photos/seed/${scene.title}/800/400`}
                      alt={scene.title}
                      style={{
                        width: "100%",
                        borderRadius: 12,
                        marginTop: 15,
                      }}
                    />

                    <p
                      style={{
                        color: "#cbd5e1",
                        marginTop: 10,
                      }}
                    >
                      {scene.image_prompt}
                    </p>
                  </div>
                ))}
            </div>

            <div style={{ marginTop: 40 }}>
              <h3>Subtitles</h3>

              {result.subtitles &&
                result.subtitles.map((line, index) => (
                  <div
                    key={index}
                    style={{
                      marginTop: 10,
                      background: "#0f172a",
                      padding: 15,
                      borderRadius: 10,
                      fontSize: 18,
                      fontWeight: "bold",
                      color: "#f8fafc",
                    }}
                  >
                    {line}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
                  }
