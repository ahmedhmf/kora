const fs = require("fs")
const path = require("path")

// Medusa v2 build outputs vary. We create a placeholder index.html
// in the most common locations the admin-bundler loader checks.
const candidates = [
  path.join(process.cwd(), ".medusa", "admin"),
  path.join(process.cwd(), ".medusa", "client"), // some setups put assets here
  path.join(process.cwd(), ".medusa", "client", "admin"),
  path.join(process.cwd(), ".medusa", "server", "admin"),
  path.join(process.cwd(), ".medusa", "server", "public", "admin"),
  path.join(process.cwd(), "static", "admin"),
]

const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Admin Disabled</title>
  </head>
  <body style="font-family: system-ui, sans-serif; padding: 24px;">
    <h1>Admin UI not built</h1>
    <p>This MVP deployment runs the Medusa API only.</p>
    <p>If you need Admin, run it separately (Medusa v2 recommended).</p>
  </body>
</html>
`

let wrote = 0
for (const dir of candidates) {
  try {
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, "index.html"), html, "utf8")
    wrote++
  } catch (_) {}
}

if (!wrote) {
  console.error("Could not write placeholder admin index.html anywhere.")
  process.exit(1)
}

console.log(`Wrote placeholder admin index.html into ${wrote} location(s).`)