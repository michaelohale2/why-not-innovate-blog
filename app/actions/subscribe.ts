'use server'

const KIT_API = 'https://api.kit.com/v4'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type SubscribeResult = { success: true } | { success: false; error: string }

export async function subscribe(email: string): Promise<SubscribeResult> {
  const apiKey = process.env.KIT_API_KEY
  const formId = process.env.KIT_FORM_ID
  if (!apiKey || !formId) {
    console.error('Kit is not configured: missing KIT_API_KEY or KIT_FORM_ID')
    return { success: false, error: 'Subscriptions are not available right now.' }
  }

  const address = (email ?? '').trim().toLowerCase()
  if (!EMAIL_RE.test(address) || address.length > 254) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-Kit-Api-Key': apiKey,
  }

  try {
    // Create the subscriber (Kit upserts, so existing emails are fine)
    const created = await fetch(`${KIT_API}/subscribers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email_address: address }),
      cache: 'no-store',
    })
    if (!created.ok) {
      console.error('Kit create subscriber failed:', created.status, await created.text())
      return { success: false, error: 'Could not subscribe. Please try again.' }
    }

    // Add them to the newsletter form
    const added = await fetch(`${KIT_API}/forms/${encodeURIComponent(formId)}/subscribers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email_address: address }),
      cache: 'no-store',
    })
    if (!added.ok) {
      console.error('Kit add to form failed:', added.status, await added.text())
      return { success: false, error: 'Could not subscribe. Please try again.' }
    }

    return { success: true }
  } catch (err) {
    console.error('Kit request error:', err)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
