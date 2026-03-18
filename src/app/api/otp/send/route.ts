import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const OTP_EXPIRY_MINUTES = 10;
const DEV_OTP = "123456";

function generateOtp() {
  if (process.env.NODE_ENV === "development" && process.env.USE_DEV_OTP === "1") {
    return DEV_OTP;
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phoneOrEmail = typeof body.phoneOrEmail === "string" ? body.phoneOrEmail.trim() : "";
    if (!phoneOrEmail) {
      return NextResponse.json(
        { error: "Phone or email is required" },
        { status: 400 }
      );
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await prisma.otpVerification.create({
      data: {
        phoneOrEmail,
        otp,
        expiresAt,
      },
    });

    // TODO: Send SMS/Email. For dev, log or return in response if USE_DEV_OTP.
    if (process.env.NODE_ENV === "development" && process.env.USE_DEV_OTP === "1") {
      return NextResponse.json({ success: true, message: "OTP sent (dev)", devOtp: DEV_OTP });
    }
    return NextResponse.json({ success: true, message: "OTP sent" });
  } catch (e) {
    console.error("OTP send", e);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
