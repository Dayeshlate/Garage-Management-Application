# Endpoint/DTO/Entity Audit - Error List and Fix Plan

## Scope checked
- Backend controllers, services, security config, DTOs, entities
- Frontend API endpoints, DTO interfaces, normalization logic

## TODO List

- [x] 1) Security mismatch: user bill/jobcard endpoints are configured as permitAll in backend security config.
  - Impact: bypasses auth checks; inconsistent with user-scoped data access.
  - Fix: require authenticated access for all /user/** endpoints.

- [x] 2) Current user resolution is brittle in UserService.
  - Impact: casting principal directly to User can fail for anonymous or non-User principal types, causing auth-related failures.
  - Fix: make getCurrentUser()/getCurrentUserObject() resolve safely from Authentication principal or name.

- [x] 3) Frontend billing API contract naming ambiguity.
  - Impact: billingApi.getById(id) calls /user/bill/getAllBillsOfVehicle/{id}, which expects vehicle id, not bill id.
  - Fix: rename method to getByVehicleId and keep behavior explicit.

- [x] 4) Frontend job card create endpoint contract is misleading.
  - Impact: jobCardsApi.create posts to /admin/jobcard/update (update endpoint) and can cause semantic confusion.
  - Fix: mark create as unsupported until backend create endpoint exists, or implement backend create endpoint.

- [x] 5) Lint/quality issues in backend (unused imports/raw ResponseEntity fields).
  - Impact: noisy diagnostics and maintenance overhead.
  - Fix: cleanup obvious unused imports and raw generics where low-risk.

## Execution Log
- Completed TODO 1: removed endpoint-specific permitAll from security config; /user/** now authenticated.
- Completed TODO 2: hardened current-user extraction for different principal types in UserService.
- Completed TODO 3: renamed billing API vehicle-based lookup method to getByVehicleId.
- Completed TODO 4: changed frontend jobCardsApi.create to unsupported to avoid calling update endpoint as create.
- Completed TODO 5: cleaned backend unused imports, removed unused SecurityConfig dependency field, and fixed raw ResponseEntity usage in AdminController.
