import { NextResponse } from 'next/server';

export async function GET() {
  // Get all environment variables that start with DOCUSIGN
  const docusignVars = Object.entries(process.env)
    .filter(([key]) => key.startsWith('DOCUSIGN_'))
    .reduce<Record<string, string | undefined>>((acc, [key, value]) => {
      // For the private key, only show the first 50 chars
      if (key === 'DOCUSIGN_PRIVATE_KEY' && value) {
        return { ...acc, [key]: `${value.substring(0, 50)}...` };
      }
      return { ...acc, [key]: value };
    }, {});

  // Check for common issues
  const issues: string[] = [];
  
  // Check for spaces around values
  Object.entries(docusignVars).forEach(([key, value]) => {
    if (typeof value === 'string' && (value.startsWith(' ') || value.endsWith(' '))) {
      issues.push(`${key} has leading or trailing spaces`);
    }
  });

  // Check private key format
  const privateKey = process.env.DOCUSIGN_PRIVATE_KEY;
  if (privateKey) {
    if (!privateKey.includes('-----BEGIN RSA PRIVATE KEY-----')) {
      issues.push('Private key is missing BEGIN marker');
    }
    if (!privateKey.includes('-----END RSA PRIVATE KEY-----')) {
      issues.push('Private key is missing END marker');
    }
    if (privateKey.includes('\\n')) {
      issues.push('Private key contains literal \\n instead of actual newlines');
    }
  }

  return NextResponse.json({
    variables: docusignVars,
    issues,
    rawLength: {
      DOCUSIGN_PRIVATE_KEY: privateKey?.length || 0,
      DOCUSIGN_USER_ID: process.env.DOCUSIGN_USER_ID?.length || 0,
      DOCUSIGN_ACCOUNT_ID: process.env.DOCUSIGN_ACCOUNT_ID?.length || 0
    }
  });
}
