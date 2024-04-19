import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

export async function POST(req: NextRequest) {
  if(!req.body) {
    return NextResponse.json({ error: "No body provided" }, { status: 400 });
  }
  const body = await req.json();
  const { ext, value } = body;

  if(!ext) {
      return NextResponse.json({ error: "No ext provided" }, { status: 400 });
  }

  if(value === undefined) {
    return NextResponse.json({ error: "No value provided" }, { status: 400 });
  }

  const filePath = `./src/app/extentions/ext.json`;
  // update the extention 
  const data = fs.readFileSync(filePath, "utf-8");
  let extention = JSON.parse(data);
  extention[ext] = value;
  fs.writeFileSync(filePath, JSON.stringify(extention, null, 2));
  return NextResponse.json({ success: "Data written successfully" });

}