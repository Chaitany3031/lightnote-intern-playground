// app/api/upload/route.ts
const { NextResponse } = require("next/server");
// Import the library implementation directly so we don't trigger the package's
// top-level test/demo runner which tries to open a local test PDF when the
// package is required as a module in some bundlers or dev servers.
// See: node_modules/pdf-parse/index.js (it executes a test when module.parent is null)
const PDFParse = require("pdf-parse/lib/pdf-parse.js");


export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const data = await PDFParse(buffer);

    // Count occurrences of the word "guarantee" (case-insensitive)
    const text = data && data.text ? data.text : "";
    const guaranteeCount = (text.match(/guarantee/gi) || []).length;

    return NextResponse.json({
      success: true,
      text: data.text,
      pages: data.numpages,
      guaranteeCount,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to parse PDF" },
      { status: 500 }
    );
  }
}
