import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: 'loyaltylink-saas-platform-2vs1cb6h',
  authRequired: false // Allow unauthenticated access to landing page
})