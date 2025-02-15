import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { 
          message: 'Authorization code is required',
          error: 'invalid_request'
        },
        { status: 400 }
      );
    }

    // Store the code if needed for future use
    // For now, just redirect back to the application
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Error handling DocuSign callback:', error);
    return NextResponse.json(
      {
        message: 'Failed to handle DocuSign callback',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
