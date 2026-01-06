# [2.0.0](https://github.com/abordage/lighthouse-box/compare/v1.0.0...v2.0.0) (2026-01-06)


### Bug Fixes

* **project:** correct release version numbering ([d81dff1](https://github.com/abordage/lighthouse-box/commit/d81dff1fb835edf5ce255d22c0b9781ffd811257))


### BREAKING CHANGES

* **project:** This release corrects the version numbering.
Previous v1.0.0 release was incorrect - this should be v2.0.0.
The action now requires Node.js 24 runtime and uses updated
input names (GH_TOKEN, GIST_ID, TEST_URL instead of INPUT_* format).

# 1.0.0 (2026-01-06)


* feat!: rewrite action with modern architecture ([aa9e932](https://github.com/abordage/lighthouse-box/commit/aa9e932ae9b733762b1d06dbd0c52e8bbecb04f0))


### Bug Fixes

* lock TypeScript version to 5.1.6 ([d5e3fa8](https://github.com/abordage/lighthouse-box/commit/d5e3fa8193c29b81816f33e992313340bfc3047a))


### BREAKING CHANGES

* Input names changed from INPUT_* to standard format.
- INPUT_GH_TOKEN -> GH_TOKEN
- INPUT_GIST_ID -> GIST_ID
- INPUT_TEST_URL -> TEST_URL
- Added GIST_TITLE input
- Requires Node.js 24 runtime
