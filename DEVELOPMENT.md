# Development

## Requirements

- Node.js (Active LTS or Current)
- npm

## Commands

A `Makefile` is provided for common tasks:

```bash
make install        # Install dependencies
make format         # Format code using Prettier
make lint           # Lint code using ESLint
make test           # Run all tests (including minified and CLI)
make all            # Run format, lint, and test (default)
make site           # Build the demo site locally in build/site/
make check-upgrade  # Check for dependency updates
```

## Releasing a new version

Releases are automated via GitHub Actions.

1.  Ensure all changes are committed and the working tree is clean.
2.  Update the version in `package.json`:
    ```bash
    # Manually or using a tool like mversion
    npx mversion minor # or major/patch
    ```
3.  Commit and push the version bump to `main`.
4.  Create and push a git tag:
    ```bash
    git tag v2.0.0
    git push origin v2.0.0
    ```
5.  The `Publish Package` GitHub Action will trigger, run tests, and publish to NPM with provenance.

**Note**: This project uses **NPM Trusted Publishing**. You do not need to configure an `NPM_TOKEN` secret. Instead, ensure that GitHub Actions is configured as a Trusted Publisher in your npmjs.com package settings for this repository and workflow.
