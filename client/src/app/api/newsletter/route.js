import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db("studiospace");

    await db.collection("newsletterSubscribers").updateOne(
      { email: email.trim().toLowerCase() },
      {
        $setOnInsert: {
          email: email.trim().toLowerCase(),
          subscribedAt: new Date(),
        },
      },
      { upsert: true },
    );

    return NextResponse.json({
      success: true,
      message: "You have successfully subscribed to our newsletter!",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
