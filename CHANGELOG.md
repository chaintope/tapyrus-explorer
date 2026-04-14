# Changelog

## [v0.3.0] - 2026-04-14

### New Features
- Add transaction broadcast endpoint (`POST /api/tx`) (#e80d3b5)
- Add `/address/:address/utxo` endpoint for querying address UTXOs (#330cd9d)
- Add Colored Coin operation labels to transaction details and block pages (#fa80f18, #f668250, #837437b)
- Add token metadata information to color page (#63e54c6)
- Add link for block hash in transaction detail page (#22c4036)
- Add QR code support with angularx-qrcode

### Bug Fixes
- Fix TPC calculation to exclude colored coins from total (#3190bcd)
- Fix the OutPoint displayed in TransactionDetails to automatically wrap to a new line (#73d4c6e)
- Fix #180 - UI improvements (#c8a92ee)
- Hide LOAD MORE button when no additional data is available (#5a0a283)
- Load button improvements (#47b5c2b)
- Apply decimal formatting to basic info (#380fd56)

### Dependencies
- **tapyrusjs-lib**: 0.6.0 → 0.7.3 (includes breaking changes in upstream)
- **Angular**: Updated to 21.2.4
- **ESLint**: Migrated to ESLint 9 with Flat Config (#9df81be)
- **Prettier**: Updated to 3.x in both frontend and backend
- **Express**: Updated to 5.x
- **big.js**: 6.2.2 → 7.0.1
- **jayson**: 3.7.0 → 4.3.0
- **zone.js**: 0.15.1 → 0.16.0
- **esplora-tapyrus**: Updated to v0.5.5
- Replaced `node-fetch` with Node.js built-in `fetch` (#abe5e6c)
- Numerous security updates for transitive dependencies

### Infrastructure
- Update Docker image build workflow to use latest GitHub Actions versions
- Fix deprecated `::set-output` syntax in CI workflow
- Migrate CI to reusable workflow (#89dc8c9)
- Add SBOM upload action (#6d3198e)
- Fix Trivy install error (#7bd8fd6)
- Update copyright notices (#193bed3)
- Remove unused jasmine-spec-reporter (#c3bbf54)

### Breaking Changes for Developers
- **ESLint 9**: Migrated from legacy `.eslintrc` to flat config (`eslint.config.js`). Developers need to update their editor ESLint plugins.
- **Prettier 3.x**: Updated from 2.x to 3.x. Formatting rules may differ slightly.
- **Node.js**: Minimum required version is now 22.0.0.

## [v0.2.4] - 2026-01-14

Previous release. See [GitHub releases](https://github.com/chaintope/tapyrus-explorer/releases/tag/v0.2.4) for details.
