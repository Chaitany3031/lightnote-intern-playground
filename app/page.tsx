"use client";
import React, { useState } from "react";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB.");
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

      console.log("PDF Text:", data.text);
      console.log("Pages:", data.pages);
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
    </div>
  );
}
