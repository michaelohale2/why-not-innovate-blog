# Things to turn on later

Features that are built into the template but not set up yet. Secrets go in a `.env.local` file at the project root (it is not committed). `.env.example` lists every variable name. Restart `yarn dev` after changing `.env.local` or `data/siteMetadata.js`.

## Newsletter signup

**Now:** the signup form (home page, [app/Main.tsx](app/Main.tsx)) is switched off. Submitting an email shows "Subscriptions are not yet turned on." and does nothing else.

**Where it lives**

- Switch: `newsletter.enabled` in [data/siteMetadata.js](data/siteMetadata.js) (currently `false`)
- Provider: `newsletter.provider` in the same block (currently `buttondown`)
- Form: [components/NewsletterForm.tsx](components/NewsletterForm.tsx) (the "not yet turned on" wording is in here)
- API route: [app/api/newsletter/route.ts](app/api/newsletter/route.ts)

**To turn it on (Buttondown)**

1. Create an account at buttondown.com and copy your API key.
2. Add this line to `.env.local`:
   ```
   BUTTONDOWN_API_KEY=your-key-here
   ```
3. In `data/siteMetadata.js`, set `enabled: true` in the `newsletter` block.
4. Restart the dev server and test with a real email address.

**Other providers:** change `provider` to `mailchimp`, `convertkit`, `klaviyo`, `revue`, `emailoctopus` or `beehive`, and set that provider's variables from `.env.example` instead.

**Not covered:** `BlogNewsletterForm` (from `pliny`) can be used inside a post's `.mdx`. It ignores the `enabled` switch and still shows the old "invalid or already subscribed" message when subscriptions are off. No post uses it right now.

## Comments (Giscus)

**Now:** every post shows a "Load Comments" button, but Giscus is not configured, so comments will not work.

**How it works:** Giscus stores comments as GitHub Discussions in a GitHub repo. Readers sign in with GitHub to comment. Each post gets one discussion, matched by page path. You moderate in the repo's Discussions tab.

**Where it lives**

- Config: the `comments` block in [data/siteMetadata.js](data/siteMetadata.js)
- Button/loader: [components/Comments.tsx](components/Comments.tsx)

**To turn it on**

1. Pick a **public** GitHub repo and enable Discussions (repo Settings, then Features).
2. Install the Giscus app on that repo: https://github.com/apps/giscus
3. Go to https://giscus.app, enter the repo, choose a Discussion category (Announcements is the usual one), and copy the four values it shows.
4. Add them to `.env.local`:
   ```
   NEXT_PUBLIC_GISCUS_REPO=owner/repo
   NEXT_PUBLIC_GISCUS_REPOSITORY_ID=...
   NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
   NEXT_PUBLIC_GISCUS_CATEGORY_ID=...
   ```
5. Restart the dev server, open a post, click "Load Comments" and post a test comment.

**To remove comments instead:** delete the `comments` block from `data/siteMetadata.js`. The button disappears.

## Contact email forwarding

**Now:** the site shows `contact@whynotinnovate.com` (mail icon in the footer and on the About page). That address does not receive mail until forwarding is set up, so messages sent to it currently bounce.

**Where it lives**

- Footer icon: `email` in [data/siteMetadata.js](data/siteMetadata.js)
- About page icon: `email` in [data/authors/default.mdx](data/authors/default.mdx)

**To set up forwarding** (the domain is registered at Vercel, which has no email forwarding of its own, so use ImprovMX, which is free, together with Vercel's DNS)

1. Sign up at https://improvmx.com and add the domain `whynotinnovate.com`.
2. Create the alias `contact` and set its destination to your real inbox. ImprovMX may email that inbox a verification link; click it.
3. Add the DNS records in Vercel: dashboard, "Domains", click `whynotinnovate.com`, "DNS Records", then "Add". Leave Name blank (the root domain) for each. Use the values ImprovMX shows you if they differ from these:

   | Type | Name    | Value                                  | Priority |
   | ---- | ------- | -------------------------------------- | -------- |
   | MX   | (blank) | `mx1.improvmx.com`                     | 10       |
   | MX   | (blank) | `mx2.improvmx.com`                     | 20       |
   | TXT  | (blank) | `v=spf1 include:spf.improvmx.com ~all` |          |

   These do not affect the website itself, which uses different records. If there is already a TXT record that starts with `v=spf1`, edit it to add `include:spf.improvmx.com` instead of adding a second one.

4. Back in ImprovMX, use its "check DNS" button; it can take from a few minutes to a few hours to turn green.
5. Send a test message to `contact@whynotinnovate.com` from a different account and confirm it arrives.

The real inbox address is only entered in the forwarding service, never in this project, so it stays private even if the repo is public.

**Optional:** to reply _from_ `contact@whynotinnovate.com`, use Gmail's Settings, "Accounts", "Send mail as" (ImprovMX documents the SMTP details; sending needs a separate setup there).

## Per-post GitHub / Twitter links

These are already opt-in. Add either line to a post's frontmatter to show the link under that post. See [data/blog/testFolder/Another One.mdx](data/blog/testFolder/Another%20One.mdx) for an example.

```yaml
githubUrl: 'https://github.com/you/repo/blob/main/some-file'
discussUrl: 'https://x.com/you/status/123456789'
```

## If tags or search look stale

Run `yarn refresh-index` to rebuild `app/tag-data.json` and `public/search.json`. Search matches post titles and summaries only, not body text.
