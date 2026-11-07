# Why Not Innovate?

Personal blog at [whynotinnovate.com](https://www.whynotinnovate.com/), built with [Next.js](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/), and [Contentlayer](https://www.contentlayer.dev/). Based on [tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog).

## Requirements

- Node.js 18 or later
- Yarn 3 (the repo pins `yarn@3.6.1`; run `corepack enable` to use it)

## Setup

```bash
yarn install
```

Create a `.env.local` file in the project root:

```bash
# Kit (newsletter signup, see app/actions/subscribe.ts)
KIT_API_KEY=
KIT_FORM_ID=
```

Never commit `.env.local`.

## Commands

| Command        | Description                                                |
| -------------- | ---------------------------------------------------------- |
| `yarn dev`     | Start the dev server at http://localhost:3000              |
| `yarn build`   | Production build (also generates the search index and RSS) |
| `yarn serve`   | Serve the production build (run `yarn build` first)        |
| `yarn lint`    | Run ESLint with auto-fix                                   |
| `yarn analyze` | Production build with the bundle analyzer enabled          |

There is no automated test suite. Before pushing, run `yarn lint` and `yarn build` to catch lint, type, and content errors.

## Project structure

```
app/          Routes, layouts, and server actions (app/actions)
components/   React components
layouts/      Page layouts for posts, listings, and authors
data/         Site config, nav links, authors, and blog posts (MDX)
public/       Static assets
```

Key config files:

- `data/siteMetadata.js`: site title, URLs, analytics, newsletter, and comments settings
- `data/headerNavLinks.ts`: header navigation
- `data/projectsData.ts`: projects page content
- `contentlayer.config.ts`: content schema

## Writing posts

Add an `.md` or `.mdx` file under `data/blog/`. Frontmatter fields (see `contentlayer.config.ts` for the full list):

```yaml
---
title: 'Post title' # required
date: '2026-01-01' # required
tags: ['tag-one', 'tag-two']
lastmod: '2026-01-02'
draft: false
summary: 'Short description used in listings and SEO'
images: ['/static/images/example.jpg']
authors: ['default']
layout: PostLayout
canonicalUrl: https://example.com/post
---
```

## Newsletter

Signups use [Kit](https://kit.com/). The `NewsletterForm` component calls the `subscribe` server action in `app/actions/subscribe.ts`, which adds the email to the Kit form given by `KIT_FORM_ID`. Set `KIT_API_KEY` and `KIT_FORM_ID` in your hosting provider's environment variables as well as `.env.local`.

## Deployment

Deploy to any Next.js host such as [Vercel](https://vercel.com/). Set the environment variables above in the host's dashboard, and use `yarn build` as the build command.

## License

[MIT](LICENSE)
