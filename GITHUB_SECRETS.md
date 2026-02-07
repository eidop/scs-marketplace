# GitHub Secrets Required for Auto-Deploy

## Repository: eidop/scs-marketplace

### Add these secrets in GitHub:

1. Go to: https://github.com/eidop/scs-marketplace/settings/secrets/actions
2. Click: "New repository secret"

### Required Secrets:

#### 1. CLOUDFLARE_API_TOKEN
- Value: Your Cloudflare API Token
- Get it: https://dash.cloudflare.com/profile/api-tokens
- Template: "Workers & Pages" (edit permissions)

#### 2. CLOUDFLARE_ACCOUNT_ID
- Value: Your Cloudflare Account ID
- Get it: https://dash.cloudflare.com
- Look at: Right side of dashboard (32-character ID)

### How to get Cloudflare API Token:

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click: "Create Token"
3. Select: "Workers & Pages" template
4. Set permissions:
   - Account: Workers & Pages: Edit
   - Zone: Workers & Pages: Edit
5. Create and copy the token

### After adding secrets:

The workflow will automatically deploy on every push to master/main branch.

### Manual trigger:

Go to: https://github.com/eidop/scs-marketplace/actions
Click: "Deploy to Cloudflare Pages" → "Run workflow"
