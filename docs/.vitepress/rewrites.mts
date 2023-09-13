import { packages } from '../../packages/metadata'

export default Object.fromEntries(
  packages.flatMap(pkg => pkg.rules
    .map(r => [r.docsEntry, `rules/${pkg.shortId}/${r.name}.md`]),
  ),
)
