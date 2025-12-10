"use client"
import React, { useState } from 'react'

const page = () => {

  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState("")

  async function uploadPDF() {
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    console.log(data);
  }


  function handleFile(e: any) {
    const selected = e.target.files[0]
    if (!selected) return

    if (selected.type !== "application/pdf") {
      setError("Please upload PDF file.")
      return
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError("Please upload PDF file less than 5MB.")
    }

    setError("")
    setFile(selected)
  }
  return (
    <div className='p-8 max-w-xl mx-auto border'>
      <h1 className='text-3xl font-bold mb-4'>PDF Text Reader</h1>
      <input onChange={handleFile} className='border p-2' type="file" accept="application/pdf" />
      <button
        onClick={uploadPDF}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload
      </button>

      {error && <p className='text-red-500 mt-2'>{error}</p>}
    </div>
  )
}

export default page


