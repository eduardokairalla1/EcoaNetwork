# ecoa-backend

Ecoa platform backend API.

## Getting started

```bash
cp .env.example .env
uv sync
scripts/dev
```

| Script | What it does |
|---|---|
| `scripts/dev` | Dev server with hot reload, on port 8000 |
| `scripts/test` | Ruff, mypy over `src` and `tests`, then pytest |
| `scripts/build` | Builds the Docker image as `ecoa-backend:<version>-<commit>` |
| `scripts/init` | Production entry point, run by the image |

Routes live under `/api`. The interactive docs are at
`http://localhost:8000/api/docs`, and are switched off when
`ENVIRONMENT=production`.

`scripts/build` refuses to run on a dirty tree, so every tag maps to a real
commit.

## Stack

Python 3.12+ · FastAPI · Pydantic 2 · pydantic-settings · Uvicorn · uv ·
Ruff · mypy · pytest
