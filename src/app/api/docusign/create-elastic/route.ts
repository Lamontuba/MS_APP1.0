
import { NextResponse } from 'next/server';
import { getDocuSignToken } from '@/lib/docusign';

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    const accessToken = await getDocuSignToken();
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID;

    if (!accessToken || !accountId) {
      return NextResponse.json(
        { error: 'Missing DocuSign configuration' },
        { status: 500 }
      );
    }

    const documentHtml = generateDocumentHtml(formData);
    const documentBase64 = Buffer.from(documentHtml).toString('base64');

    const clickwrapRequest = {
      displaySettings: {
        consentButtonText: "I Agree",
        displayName: "Merchant Application",
        downloadable: true,
        format: "modal",
        hasAccept: true,
        mustRead: true,
        requireAccept: true,
        size: "medium",
        documentDisplay: "document"
      },
      documents: [{
        documentBase64,
        documentName: "Merchant Application",
        fileExtension: "html",
        order: 0
      }],
      dataFields: [
        { label: "Business Name", type: "STRING", name: "businessName" },
        { label: "Business Address", type: "STRING", name: "businessAddress" },
        { label: "Business Phone", type: "STRING", name: "businessPhone" },
        { label: "Business Email", type: "STRING", name: "businessEmail" },
        { label: "Owner Name", type: "STRING", name: "ownerName" }
      ],
      name: "Merchant Application",
      requireReacceptance: true,
      status: "active"
    };

    const response = await fetch(
      `https://demo.docusign.net/clickapi/v1/accounts/${accountId}/clickwraps`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(clickwrapRequest)
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


function generateDocumentHtml(formData: any): string {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="text-align: center; color: #333;">Merchant Application</h1>
        
        <div style="margin-top: 30px;">
          <h2 style="color: #444;">Business Information</h2>
          <p><strong>Business Name:</strong> ${formData.businessName}</p>
          <p><strong>Business Address:</strong> ${formData.businessAddress}</p>
          <p><strong>Business Phone:</strong> ${formData.businessPhone}</p>
          <p><strong>Business Email:</strong> ${formData.businessEmail}</p>
        </div>
        
        <div style="margin-top: 30px;">
          <h2 style="color: #444;">Owner Information</h2>
          <p><strong>Owner Name:</strong> ${formData.ownerName}</p>
          <p><strong>Owner Title:</strong> ${formData.ownerTitle}</p>
          <p><strong>Owner Phone:</strong> ${formData.ownerPhone}</p>
          <p><strong>Owner Email:</strong> ${formData.ownerEmail}</p>
        </div>

        <div style="margin-top: 30px;">
          <h2 style="color: #444;">Bank Information</h2>
          <p><strong>Bank Name:</strong> ${formData.bankName}</p>
          <p><strong>Account Type:</strong> ${formData.accountType}</p>
          <p><strong>Routing Number:</strong> ${formData.routingNumber}</p>
          <p><strong>Account Number:</strong> ${formData.accountNumber}</p>
        </div>
        
        <div style="margin-top: 50px;">
          <hr style="border: 1px solid #ccc;">
          <p>By clicking "I Agree", you confirm that all provided information is accurate and you accept our terms and conditions.</p>
        </div>
      </body>
    </html>
  `;
}
