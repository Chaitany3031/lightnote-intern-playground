// app/api/upload/route.ts
import { NextResponse } from "next/server";
import PDFParse from "pdf-parse";

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

    return NextResponse.json({
      success: true,
      text: data.text,
      pages: data.numpages,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to parse PDF" },
      { status: 500 }
    );
  }
}
