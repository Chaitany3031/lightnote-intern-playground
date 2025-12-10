import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  console.log("File received:", file?.name);

  return NextResponse.json({ message: "File received" });
}
