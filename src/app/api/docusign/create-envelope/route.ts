import { NextResponse } from 'next/server';
import { sendEnvelopeToAdmin } from '@/lib/docusign-service';
import type { FormData } from '@/lib/docusign-service';

export async function POST(request: Request) {
  try {
    console.log('Starting envelope creation...');
    
    const body = await request.json();
    console.log('Request body:', {
      ...body,
      formData: body.formData ? {
        ...body.formData,
        signature: body.formData.signature ? 'BASE64_SIGNATURE_DATA_HIDDEN' : undefined
      } : undefined
    });

    if (!body.formData) {
      console.error('Missing form data in request');
      return NextResponse.json(
        { 
          message: 'Form data is required',
          error: 'validation_error'
        },
        { status: 400 }
      );
    }

    console.log('Sending envelope to DocuSign...');
    const result = await sendEnvelopeToAdmin(body.formData);
    console.log('Envelope sent successfully:', result);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in create-envelope route:', error);
    
    // Check if it's an authentication error
    if (error instanceof Error && error.message.includes('consent')) {
      return NextResponse.json(
        {
          message: 'DocuSign authentication required. Please grant consent.',
          error: 'auth_required',
          details: error.message
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: 'Failed to send envelope',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error : undefined
      },
      { status: 500 }
    );
  }
}
