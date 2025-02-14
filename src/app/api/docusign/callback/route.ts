import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const error_description = searchParams.get('error_description');

  if (error) {
    console.error('DocuSign consent error:', error, error_description);
    return new Response(
      `
      <html>
        <body>
          <h1>Error</h1>
          <p>Failed to get DocuSign consent: ${error}</p>
          <p>${error_description}</p>
          <script>
            setTimeout(() => {
              window.close();
            }, 5000);
          </script>
        </body>
      </html>
      `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }

  if (!code) {
    return new Response(
      `
      <html>
        <body>
          <h1>Error</h1>
          <p>No authorization code received</p>
          <script>
            setTimeout(() => {
              window.close();
            }, 5000);
          </script>
        </body>
      </html>
      `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }

  // Store the code or exchange it for a token if needed
  console.log('Received authorization code:', code);

  return new Response(
    `
    <html>
      <body>
        <h1>Success!</h1>
        <p>DocuSign consent granted. You can close this window.</p>
        <script>
          setTimeout(() => {
            window.close();
          }, 5000);
        </script>
      </body>
    </html>
    `,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
}
