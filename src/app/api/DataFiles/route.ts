import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

export async function POST(req: NextRequest) {
  
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ data: "Hello" });
}

export async function PUT(req: NextRequest) {

}