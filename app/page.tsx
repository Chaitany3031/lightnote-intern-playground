"use client";
import React, { useState } from "react";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const [pages, setPages] = useState<number | null>(null);
  const [guaranteeCount, setGuaranteeCount] = useState<number | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      setError("Please upload a PDF file only.");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB.");
      return;
    }

    setError("");
    setFile(selected);
  }

  async function uploadPDF() {
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to read PDF");
        return;
      }

      setText(data.text || "");
      setPages(data.pages ?? null);
      setGuaranteeCount(data.guaranteeCount ?? null);
    } catch (err: any) {
      setError("Network error: " + err.message);
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto border">
      <h1 className="text-3xl font-bold mb-4">PDF Text Reader</h1>

      <input type="file" accept="application/pdf" onChange={handleFile} className="border p-2" />

      <button
        onClick={uploadPDF}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {pages !== null && (
        <div className="mt-4">
          <p className="font-semibold">Pages:</p>
          <p>{pages}</p>
        </div>
      )}

      {guaranteeCount !== null && (
        <div className="mt-2">
          <p className="font-semibold">"guarantee" count:</p>
          <p>{guaranteeCount}</p>
        </div>
      )}

      {text && (
        <div className="mt-4 p-2 border border-gray-700 rounded max-h-96 overflow-auto whitespace-pre-wrap bg-black text-white">
          <h2 className="font-semibold mb-2">Extracted text</h2>
          <div>{text}</div>
        </div>
      )}
    </div>
  );
}
