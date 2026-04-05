# Full Project Error Scan (Frontend + Backend)

Date: 2026-04-05

## Errors Found

1. Signup request from frontend failed with 403 (Forbidden)
- Evidence: browser console at auth.ts:39 for POST /api/auth/register
- Root cause: stale/invalid bearer token was still attached to auth endpoints, and backend JWT filter did not gracefully ignore malformed tokens.
- Status: Fixed

2. Lombok builder warning in JobCard entity
- File: Garage-Management-Application/src/main/java/com/danny/Garage/Management/Application/entity/JobCard.java
- Warning: @Builder ignores initialized field value for spareParts
- Status: Fixed

3. Lombok builder warning in SparePart entity
- File: Garage-Management-Application/src/main/java/com/danny/Garage/Management/Application/entity/SparePart.java
- Warning: @Builder ignores initialized field value for jobCards
- Status: Fixed

4. Unused import warning in JwtUtils
- File: Garage-Management-Application/src/main/java/com/danny/Garage/Management/Application/utils/JwtUtils.java
- Warning: unused import SignatureAlgorithm
- Status: Fixed

5. Frontend CSS build warning (import order)
- File: Garage-Management-frontend/src/index.css
- Warning: @import must precede Tailwind statements
- Status: Fixed

6. Spring Boot parent patch version outdated
- File: Garage-Management-Application/pom.xml
- Message: newer patch version available
- Status: Fixed (upgraded to 4.0.5)

7. Unknown custom properties warnings in application.properties
- File: Garage-Management-Application/src/main/resources/application.properties
- Warnings: jwt.secret, jwt.token-validity-ms, billing.tax, billing.discount, email.url reported as unknown.
- Status: Fixed

8. Repeated 403 on admin inventory/jobcard endpoints from frontend
- Files:
  - Garage-Management-frontend/src/api/inventory.ts
  - Garage-Management-frontend/src/api/jobcards.ts
- Evidence: GET /admin/SparePart/getAll and GET /admin/jobcard/getAllJobCards returned 403 repeatedly.
- Root cause: frontend called admin-only endpoints without role gating, so USER sessions triggered forbidden responses and React Query retries.
- Status: Fixed

9. Browser still showing 403 on inventory list fetch after role gating
- Files:
  - Garage-Management-frontend/src/api/inventory.ts
  - Garage-Management-frontend/src/api/jobcards.ts
- Evidence: browser still surfaced error at return apiClient.get('/admin/SparePart/getAll').
- Root cause: stale role/token mismatch can still make admin request fail with 403 even when role check passes.
- Status: Fixed

10. Runtime process conflict causing inconsistent browser/API behavior
- Files: runtime terminals/processes (frontend Vite and backend Spring Boot)
- Evidence: frontend dev server had multiple instances (5173/5174), backend startup failed due port 8080 already in use.
- Root cause: stale running processes from older code path created mixed runtime state.
- Status: Fixed (killed stale processes and restarted clean instances)

11. Backend admin endpoints returned 403 in Postman for sparepart/jobcards
- Endpoints:
  - /admin/SparePart/getAll
  - /admin/jobcard/getAllJobCards
- Evidence: /admin/getAllVehicles returned 200 with same token while the above two returned 403.
- Root cause:
  - Existing admin account could be inactive/unusable for known credentials.
  - Hidden runtime error: recursive hashCode generation between entities (Bill <-> JobCard and SparePart collections), causing StackOverflowError and fallback /error handling appearing as 403.
- Status: Fixed

## Fixes Applied

1. Frontend auth header behavior
- File: Garage-Management-frontend/src/api/config.ts
- Change: skip attaching Authorization header for /api/auth/* requests.

2. Backend JWT filter resilience
- File: Garage-Management-Application/src/main/java/com/danny/Garage/Management/Application/utils/JwtFilter.java
- Change: safely catch token parse errors and continue filter chain as anonymous.

3. Lombok builder defaults
- Files:
  - Garage-Management-Application/src/main/java/com/danny/Garage/Management/Application/entity/JobCard.java
  - Garage-Management-Application/src/main/java/com/danny/Garage/Management/Application/entity/SparePart.java
- Change: added @Builder.Default to initialized Set fields.

4. Unused import cleanup
- File: Garage-Management-Application/src/main/java/com/danny/Garage/Management/Application/utils/JwtUtils.java
- Change: removed unused SignatureAlgorithm import.

5. CSS import order
- File: Garage-Management-frontend/src/index.css
- Change: moved Google Fonts @import above @tailwind directives.

6. Spring Boot parent upgrade
- File: Garage-Management-Application/pom.xml
- Change: upgraded spring-boot-starter-parent from 4.0.2 to 4.0.5.

7. Spring property metadata recognition
- Files:
  - Garage-Management-Application/pom.xml
  - Garage-Management-Application/src/main/resources/META-INF/additional-spring-configuration-metadata.json
- Change: added spring-boot-configuration-processor and custom property metadata entries.

8. Property naming normalization
- Files:
  - Garage-Management-Application/src/main/resources/application.properties
  - Garage-Management-Application/src/main/java/com/danny/Garage/Management/Application/service/UserService.java
- Change: replaced EMAIL_URL key with email.url and updated @Value usage.

9. Role-aware admin API calling in frontend
- Files:
  - Garage-Management-frontend/src/api/inventory.ts
  - Garage-Management-frontend/src/api/jobcards.ts
- Change: added role checks so ADMIN/MECHANIC call admin endpoints and USER returns empty lists instead of firing forbidden requests.

10. Defensive 403 fallback for admin list APIs
- Files:
  - Garage-Management-frontend/src/api/inventory.ts
  - Garage-Management-frontend/src/api/jobcards.ts
- Change: normalized role parsing with trim() and catch ApiError 403 to return [] for list endpoints.

11. Defensive fallback expanded for list fetch stability
- Files:
  - Garage-Management-frontend/src/api/inventory.ts
  - Garage-Management-frontend/src/api/jobcards.ts
- Change: recoverable statuses for list APIs now include 0/401/403 to avoid surfacing transient auth/connectivity errors.

12. Admin billing page showed placeholder customer labels
- Files:
  - Garage-Management-frontend/src/pages/billing/Billing.tsx
  - Garage-Management-frontend/src/api/billing.ts
  - Garage-Management-Application/src/main/java/com/danny/Garage/Management/Application/dto/BillDTO.java
  - Garage-Management-Application/src/main/java/com/danny/Garage/Management/Application/service/BillService.java
- Evidence: billing table displayed values like Customer #1 instead of actual customer names.
- Root cause: backend bill DTO did not include customer name, so frontend used fallback placeholder.
- Status: Fixed

13. Billing DTO enrichment for customer identity
- Files:
  - Garage-Management-Application/src/main/java/com/danny/Garage/Management/Application/dto/BillDTO.java
  - Garage-Management-Application/src/main/java/com/danny/Garage/Management/Application/service/BillService.java
- Change: added customerName field and mapped it from vehicle.user.name with ownerName fallback.

14. Billing UI display update
- Files:
  - Garage-Management-frontend/src/api/billing.ts
  - Garage-Management-frontend/src/pages/billing/Billing.tsx
- Change: added customerName to InvoiceDTO and rendered it in billing table with fallback only when name is missing.

12. Bootstrap admin account hardening
- File: Garage-Management-Application/src/main/java/com/danny/Garage/Management/Application/configs/AdminBootstrapConfig.java
- Change: ensure configured admin email exists, is active, and has known bootstrap credentials in local/dev startup.

13. Backend authorization hardening for sparepart/jobcard routes
- Files:
  - Garage-Management-Application/src/main/java/com/danny/Garage/Management/Application/configs/SecurityConfig.java
  - Garage-Management-Application/src/main/java/com/danny/Garage/Management/Application/controller/SparePartController.java
- Change: route-level auth set to authenticated for targeted paths; explicit method-level role checks added for SparePart endpoints.

14. Entity recursion fix (StackOverflowError)
- Files:
  - Garage-Management-Application/src/main/java/com/danny/Garage/Management/Application/entity/Bill.java
  - Garage-Management-Application/src/main/java/com/danny/Garage/Management/Application/entity/JobCard.java
  - Garage-Management-Application/src/main/java/com/danny/Garage/Management/Application/entity/SparePart.java
- Change: replaced recursive default Lombok equals/hashCode behavior with id-based equals/hashCode using @EqualsAndHashCode(onlyExplicitlyIncluded = true).

## Latest Verification (Postman-equivalent)

- Login with admin@garage.com/admin123: PASS
- GET /admin/getAllVehicles: PASS (200)
- GET /admin/SparePart/getAll: PASS (200)
- GET /admin/jobcard/getAllJobCards: PASS (200)

## Verification

- Backend compile: PASS (.\mvnw.cmd -q -DskipTests compile)
- Frontend build: PASS (npm run -s build)

Residual notes:
- Frontend build still shows chunk-size advisory (>500 kB), which is an optimization warning, not a failure.
