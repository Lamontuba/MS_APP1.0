/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DOCUSIGN_INTEGRATION_KEY: process.env.DOCUSIGN_INTEGRATION_KEY,
    DOCUSIGN_USER_ID: process.env.DOCUSIGN_USER_ID,
    DOCUSIGN_ACCOUNT_ID: process.env.DOCUSIGN_ACCOUNT_ID,
    DOCUSIGN_PRIVATE_KEY: process.env.DOCUSIGN_PRIVATE_KEY,
    DOCUSIGN_TEMPLATE_ID: process.env.DOCUSIGN_TEMPLATE_ID,
    DOCUSIGN_BASE_PATH: process.env.DOCUSIGN_BASE_PATH || 'https://demo.docusign.net/restapi'
  }
}

module.exports = nextConfig
