# Contributing

## Code Style

- Keep frontend code typed and route-oriented.
- Keep backend code explicit and schema-driven.
- Prefer small changes over giant mixed refactors.

## Pull Requests

- Include a summary of what changed.
- Include verification steps.
- Update docs when behavior changes.
- Update `AUDIT.md` when architecture or risk posture changes materially.

## Testing Standards

- Frontend changes should pass `npm run lint` and `npm run build`.
- Backend changes should pass `python -m unittest discover -s tests -v`.
- Security-sensitive changes should re-check `npm audit`.
