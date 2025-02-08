
import { NextResponse } from 'next/server';
import { getDocuSignToken } from '@/lib/docusign';

export async function POST(request: Request) {
  try {
    const { templateId, templateData } = await request.json();
    const accessToken = await getDocuSignToken();
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID;

    const envelope = {
      templateId: templateId,
      templateRoles: [{
        roleName: 'Merchant',
        name: templateData.ownerName,
        email: templateData.ownerEmail,
        tabs: {
          textTabs: Object.entries(templateData).map(([key, value]) => ({
            tabLabel: key,
            value: value
          }))
        }
      }],
      status: 'created'
    };

    const response = await fetch(
      `https://demo.docusign.net/restapi/v2.1/accounts/${accountId}/envelopes`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(envelope)
      }
    );

    if (!response.ok) {
      throw new Error('Failed to create envelope');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating envelope:', error);
    return NextResponse.json(
      { error: 'Failed to create envelope' },
      { status: 500 }
    );
  }
}
