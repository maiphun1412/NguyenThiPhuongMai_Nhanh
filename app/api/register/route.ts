import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(
      "https://contract.nhanhtravel.com/api/RegisterDemo/Register/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "NHANHTRAVEL-KEY": "api_key", 
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Lỗi gửi đăng ký demo" },
      { status: 500 }
    );
  }
}