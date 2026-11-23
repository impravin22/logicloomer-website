# Vendored files

| File | Source | Version | Licence |
| --- | --- | --- | --- |
| `world.js` | `dist/maps/world.js` from the `jsvectormap` npm package | 1.6.0 | MIT (`LICENSE-jsvectormap.txt`) |

- Tarball integrity (npm registry): `sha512-4b/v4GWqiggHGN+CBOJBhIdpSGLY6wVetmMKiOlQ7oVM1PIzsLlSBJDMQd9ycLk6Rmzg4aFua35QDrk5HPb1YQ==`
- `world.js` SHA-256: `de3c2c21cf63bdd95a4cfc477a566a4b189579daeb26157e8ecb101000224edd` (pinned by a test in `src/journey/journey.test.js`)

The file is unmodified. It calls `jsVectorMap.addMap("world", {...})` with literal
country outlines; `../world-shim.js` captures that data so the page needs no map
library. To update, run `npm pack jsvectormap@<version>`, copy
`package/dist/maps/world.js` here, and update the hashes above and in the test.
