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
            color: "#94a3
