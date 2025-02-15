import { NextResponse } from 'next/server';
import { createEnvelopeFromTemplate, DocuSignError } from '@/lib/docusign-service';
import { DocuSignAuthError, getJWTConsentUrl } from '@/lib/docusign-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.signerEmail || !body.signerName) {
      return NextResponse.json(
        { 
          message: 'Missing required fields',
          error: 'validation_error',
          details: {
            signerEmail: !body.signerEmail ? 'Email is required' : undefined,
            signerName: !body.signerName ? 'Name is required' : undefined
          }
        },
        { status: 400 }
      );
    }

    const result = await createEnvelopeFromTemplate(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in create-envelope:', error);

    // Handle DocuSign authentication errors (including consent required)
    if (error instanceof DocuSignError || error instanceof DocuSignAuthError) {
      // Check if this is a consent required error
      if (error.details?.error === 'consent_required') {
        try {
          const consentUrl = getJWTConsentUrl();
          return NextResponse.json(
            { 
              message: 'DocuSign consent required',
              error: 'consent_required',
              details: {
                consentUrl,
                originalError: error.details
              }
            },
            { status: 401 }
          );
        } catch (consentError) {
          console.error('Error getting consent URL:', consentError);
        }
      }

      // If we already have a consent URL in the error details, use that
      if (error.details?.consentUrl) {
        return NextResponse.json(
          {
            message: error.message || 'DocuSign authentication failed',
            error: 'consent_required',
            details: error.details
          },
          { status: 401 }
        );
      }

      // Handle other DocuSign errors
      return NextResponse.json(
        { 
          message: error.message || 'DocuSign error',
          error: error.details?.error || 'docusign_error',
          details: error.details
        },
        { status: error instanceof DocuSignError ? error.statusCode : 401 }
      );
    }

    // Handle unexpected errors
    return NextResponse.json(
      { 
        message: 'An unexpected error occurred',
        error: 'internal_error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}