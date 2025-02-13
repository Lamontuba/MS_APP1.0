
import { NextResponse } from 'next/server';
import { getDocuSignToken } from '@/lib/docusign';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const accessToken = await getDocuSignToken();
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID;

    if (!accessToken || !accountId) {
      return NextResponse.json(
        { error: 'Missing DocuSign configuration' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://demo.docusign.net/clickapi/v1/accounts/${accountId}/clickwraps`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          status: 'active'
        })
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.message || 'Failed to create elastic template' },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error creating elastic template:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
