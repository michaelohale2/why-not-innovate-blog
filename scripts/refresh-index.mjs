import { readFileSync, writeFileSync } from 'fs'
import { slug } from 'github-slugger'

// Rebuilds app/tag-data.json and public/search.json from Contentlayer's generated
// index, for when the dev server leaves them stale. Run `yarn dev` or a build once
// first so .contentlayer/generated exists.
const indexPath = '.contentlayer/generated/Blog/_index.json'

let docs
try {
  docs = Object.values(JSON.parse(readFileSync(indexPath, 'utf8')))
} catch {
  console.error(`Could not read ${indexPath}. Start the dev server or run a build first.`)
  process.exit(1)
}

const isProduction = process.env.NODE_ENV === 'production'
const posts = docs.filter((d) => !isProduction || d.draft !== true)

const tagCount = {}
posts.forEach((post) => {
  ;(post.tags || []).forEach((tag) => {
    const key = slug(tag)
    tagCount[key] = (tagCount[key] || 0) + 1
  })
})
writeFileSync('./app/tag-data.json', JSON.stringify(tagCount, null, 2) + '\n')

const searchDocs = posts
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .map(({ body, _raw, _id, ...rest }) => rest)
writeFileSync('./public/search.json', JSON.stringify(searchDocs))

console.log(`Indexed ${posts.length} posts and ${Object.keys(tagCount).length} tags.`)
