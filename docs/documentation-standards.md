# Documentation Standards

This project uses documentation as part of the product, not as an afterthought. The goal is to make the system understandable for recruiters, clients and future developers.

## Documentation Principles

| Principle | How it is applied |
| --- | --- |
| Document the real system | Docs describe the current codebase, not an idealized version |
| Separate responsibilities | API, database, checkout, auth and deployment live in different files |
| Prefer examples | Endpoints include request and response JSON |
| Make risks visible | Deployment and roadmap call out production gaps |
| Keep onboarding fast | README gives the shortest path to run the app |
| Preserve business context | Checkout and order docs explain why decisions were made |

## Why The Docs Are Split

Large README files become hard to maintain. This project uses a README as the entry point and `/docs` as the technical knowledge base.

```txt
README.md
  -> What the project is
  -> How to run it
  -> Where to find deeper documentation

docs/
  -> Detailed responsibility-based documentation
```

## Audience Strategy

### Recruiters

Recruiters need to quickly understand:

- What the project does.
- Which technologies were used.
- Which production concerns were considered.
- Whether the developer understands real-world systems.

Relevant files:

- `README.md`
- `docs/architecture.md`
- `docs/checkout-flow.md`
- `docs/roadmap.md`

### Clients

Clients need to understand:

- What features exist.
- How payments work.
- What is needed to deploy.
- What future phases may cost more time.

Relevant files:

- `README.md`
- `docs/checkout-flow.md`
- `docs/deployment.md`
- `docs/roadmap.md`

### Developers

Developers need:

- Setup steps.
- API contracts.
- Data model.
- Folder structure.
- Auth and permission rules.

Relevant files:

- `docs/setup.md`
- `docs/api.md`
- `docs/database.md`
- `docs/frontend-structure.md`
- `docs/backend-structure.md`
- `docs/authentication.md`

## Markdown Conventions

Use:

- Tables for endpoint summaries, fields and responsibilities.
- JSON blocks for API examples.
- ASCII diagrams for architecture and data flows.
- Short paragraphs for operational notes.
- Explicit file paths when pointing to source code.

Avoid:

- Vague claims like "secure and scalable" without explaining why.
- Duplicating long sections across multiple files.
- Documenting features that are not implemented.
- Hiding production risks.

## Maintenance Rules

Update documentation when:

- A route changes.
- An endpoint changes.
- A model field changes.
- Checkout behavior changes.
- Environment variables change.
- Deployment strategy changes.
- Permissions change.

## Suggested Pull Request Checklist

```txt
[ ] Does this change add or modify an endpoint?
[ ] Does this change alter a model or migration?
[ ] Does this change affect checkout/payment behavior?
[ ] Does this change require a new environment variable?
[ ] Does this change affect admin/user permissions?
[ ] Was the related docs file updated?
```

## Production Documentation Gaps To Fill Later

- Add real screenshots under `docs/assets/`.
- Add OpenAPI schema or Swagger.
- Add architecture diagram image.
- Add ADRs for major technical decisions.
- Add runbook for payment incidents.
- Add rollback guide for deployments.
