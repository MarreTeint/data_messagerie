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
    // return all json files in the inbox folder + metadata
    const files = fs.readdirSync("./src/app/inbox");
    const messages = files.map(file => {
      const data = fs.readFileSync(`./src/app/inbox/${file}`, "utf-8");
      const fileName = file.split(".")[0];
      return { file: fileName, metadata: JSON.parse(data).metadata };
    });
    return NextResponse.json(messages);
  }

  const filePath = `./src/app/inbox/${id}.json`;
  if(!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "No message with that ID", id: id, path: filePath }, { status: 404 });
  }

  const data = fs.readFileSync(filePath, "utf-8");
  return NextResponse.json(JSON.parse(data));
}

export async function PUT(req: NextRequest) {
  if(!req.body) {
    return NextResponse.json({ error: "No body provided" }, { status: 400 });
  }
  const body = await req.json();
  const { data } = body;

  let id = Math.random().toString(36).substring(2); // Generate a random alphanumeric string for the id
  const filePath = `./src/app/inbox/${id}.json`;
  // Check if the file already exists
  while(fs.existsSync(filePath)) {
    id = Math.random().toString(36).substring(2);
  }

  if(!data) {
    return NextResponse.json({ error: "No data provided" }, { status: 400 });
  }

  // Write the data to the file
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
  catch(e) {
    return NextResponse.json({ error: "Failed to write data to file" }, { status: 500 });
  }
  return NextResponse.json({ success: "Data written successfully", id: id });
}