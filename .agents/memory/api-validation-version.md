---
name: API validation version
description: Shared dependency constraint for OpenAPI-generated Zod validators.
---

The API generator emits Zod 4 helpers such as `z.int()` and `z.email()`, so the workspace Zod catalog must stay on the Zod 4 major until the generator configuration changes.

**Why:** A codegen run can succeed while the chained library typecheck fails if the workspace resolves Zod 3.

**How to apply:** When changing the API spec or regenerating client code, verify the workspace Zod major remains compatible before debugging generated validation errors.