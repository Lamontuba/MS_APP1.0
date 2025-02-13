
import { NextResponse } from 'next/server';
import { getDocuSignToken } from '@/lib/docusign';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const accessToken = await getDocuSignToken();
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID;

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

    if (!response.ok) {
      throw new Error('Failed to create elastic template');
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating elastic template:', error);
    return NextResponse.json(
      { error: 'Failed to create elastic template' },
      { status: 500 }
    );
  }
}
