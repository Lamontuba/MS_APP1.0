import { NextResponse } from 'next/server';
import { getJWTConsentUrl } from '@/lib/docusign-auth';

export async function GET() {
  try {
    const consentUrl = getJWTConsentUrl();
    return NextResponse.json({ consentUrl });
  } catch (error) {
    console.error('Error getting consent URL:', error);
    return NextResponse.json(
      { 
        message: 'Failed to get consent URL',
        error: 'consent_url_error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
