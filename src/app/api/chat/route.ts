import { NextResponse } from 'next/server';
import { queryDeepSeek } from '@/lib/deepseek'; // Ensure this matches the filename

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Validate the input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request: 'messages' array is required" },
        { status: 400 }
      );
    }

    // Log the incoming request for debugging
    console.log('Incoming request payload:', { messages });

    // Call the DeepSeek API
    const aiResponse = await queryDeepSeek(messages);

    // Log the AI response for debugging
    console.log('AI response:', aiResponse);

    // Return the AI response
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    // Log the full error for debugging
    console.error('Error in API route:', error);

    // Return a user-friendly error message
    return NextResponse.json(
      { error: "Failed to process your request. Please try again later." },
      { status: 500 }
    );
  }
}