import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

export async function POST(req: NextRequest) {
  if(!req.body) {
    return NextResponse.json({ error: "No body provided" }, { status: 400 });
  }
  const body = await req.json();
  const { id, data } = body;

  if(!id) {
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  }
  if(!data) {
    return NextResponse.json({ error: "No data provided" }, { status: 400 });
  }

  const filePath = `./src/app/inbox/${id}.json`;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return NextResponse.json({ success: "Data written successfully" });

}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  
  if(!id) {
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  }

  const filePath = `./src/app/inbox/${id}.json`;
  if(!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "No message with that ID", id: id, path: filePath }, { status: 404 });
  }

  const data = fs.readFileSync(filePath, "utf-8");
  return NextResponse.json(JSON.parse(data));
}

export async function PUT(req: NextRequest) {

}