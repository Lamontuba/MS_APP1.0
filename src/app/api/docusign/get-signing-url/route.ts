import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
  } catch (error) {
    console.error('Error in get-signing-url:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { envelopeId, signerEmail, signerName } = body;

    if (!envelopeId || !signerEmail || !signerName) {
      return NextResponse.json(
        {
          message: 'Missing required fields',
          error: 'validation_error',
          details: {
            envelopeId: !envelopeId ? 'Envelope ID is required' : undefined,
            signerEmail: !signerEmail ? 'Signer email is required' : undefined,
            signerName: !signerName ? 'Signer name is required' : undefined,
          }
        },
        { status: 400 }
      );
    }

    const returnUrl = `${request.headers.get('origin')}/docusign-test`;
    const signingUrl = await createEmbeddedSigningUrl(
      envelopeId,
      signerEmail,
      signerName,
      returnUrl
    );

    return NextResponse.json({ signingUrl });
  } catch (error) {
    console.error('Error getting signing URL:', error);
    return NextResponse.json(
      {
        message: 'Failed to get signing URL',
        error: 'signing_url_error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
