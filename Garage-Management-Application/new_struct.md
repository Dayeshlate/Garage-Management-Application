# Backend → Frontend Mapping for Garage Assistant

This document describes exactly how to make the existing Spring Boot backend match the frontend clients in this workspace.

## Global rules
- Base API path: `/api` (controllers should be annotated with `@RequestMapping("/api/...")`).
- ID type: String UUIDs in JSON (store as UUID or String in DB).
- Dates: ISO-8601 strings (use `java.time.OffsetDateTime` / `Instant` and Jackson defaults).
- Content-Type: `application/json`.
- Auth: expect header `Authorization: Bearer <token>`; keep JWT filter active and allow `/api/auth/**` anonymously.
- Create responses: `201 Created` with created entity in body and optional `Location` header.
- Delete responses: `204 No Content`.
- Lists: return JSON arrays (frontend clients call `getAll()` and expect arrays).
- Validation: use `@Valid` on DTOs and a `@RestControllerAdvice` global handler for standardized error JSON.

## Project package layout (recommended)
- `com.garageassistant.model` — JPA entities
- `com.garageassistant.dto` — DTO classes
- `com.garageassistant.repository` — Spring Data JPA repos
- `com.garageassistant.service` — service interfaces
- `com.garageassistant.service.impl` — service implementations
- `com.garageassistant.controller` — REST controllers (base `/api`)
- `com.garageassistant.mapper` — MapStruct or manual mappers
- `com.garageassistant.exception` — exceptions and `GlobalExceptionHandler`
- `com.garageassistant.config` — security, CORS

## Exact entity → endpoint mapping (match frontend paths and JSON keys)

1) Vehicles
- Frontend path: `/vehicles`
- JSON keys: `id, make, model, year, licensePlate, vin, color, owner, lastService, totalServices`
- Controller endpoints (place file: `controller/VehicleController.java`):
  - `GET /api/vehicles` → List<VehicleDTO>
  - `GET /api/vehicles/{id}` → VehicleDTO
  - `POST /api/vehicles` → create (body VehicleCreateDTO) → 201 VehicleDTO
  - `PUT /api/vehicles/{id}` → update → 200 VehicleDTO
  - `DELETE /api/vehicles/{id}` → 204
  - Optional: `POST /api/vehicles/{id}/service` → record service, returns VehicleDTO

2) Customers (frontend calls `/customers`)
- If your project currently uses `User` for customers, expose alias endpoints at `/api/customers` or create `Customer` entity/controller.
- JSON keys: `id, name, email, phone, address, vehicleCount, totalSpent, createdAt`
- Controller endpoints (place file: `controller/CustomerController.java`):
  - `GET /api/customers`
  - `GET /api/customers/{id}`
  - `POST /api/customers`
  - `PUT /api/customers/{id}`
  - `DELETE /api/customers/{id}`
  - `GET /api/customers/{id}/vehicles` (optional)

3) Inventory (frontend path `/inventory`) — map to your `SparePart`
- Add or alias controller to `/api/inventory` so frontend calls succeed.
- JSON keys must match frontend's `InventoryItem`: `id, name, sku, category, quantity, unit, minStock, unitPrice, supplier, lastUpdated`
- Controller endpoints (place file: `controller/InventoryController.java` or update `SparePartController`):
  - `GET /api/inventory`
  - `GET /api/inventory/{id}`
  - `POST /api/inventory` (create)
  - `PUT /api/inventory/{id}`
  - `DELETE /api/inventory/{id}`
  - `POST /api/inventory/{id}/adjust` body `{ "delta": number }` → adjust quantity
  - `GET /api/inventory/low-stock`

4) Job Cards (`/job-cards`)
- JSON keys: `id, jobNumber, customer, vehicle, services, status, estimatedCost, assignedTo, createdAt, dueDate`
- Controller endpoints (place file: `controller/JobCardController.java`):
  - `GET /api/job-cards`
  - `GET /api/job-cards/{id}`
  - `POST /api/job-cards`
  - `PUT /api/job-cards/{id}`
  - `DELETE /api/job-cards/{id}`
  - `POST /api/job-cards/{id}/status` body `{ "status": "..." }`
  - `GET /api/job-cards/by-customer/{customerId}`

5) Invoices (frontend `/invoices`) — map to your `Bill` entity
- Expose controller at `/api/invoices` (or add alias).
- JSON keys: `id, invoiceNumber, customer, jobCard, amount, tax, total, status, dueDate, createdAt, paidAt`
- Controller endpoints (place file: `controller/InvoiceController.java` or update `BillController`):
  - `GET /api/invoices`
  - `GET /api/invoices/{id}`
  - `POST /api/invoices`
  - `PUT /api/invoices/{id}`
  - `DELETE /api/invoices/{id}`
  - `POST /api/invoices/{id}/pay` → mark as paid

## DTO & mapping rules
- DTO property names must exactly match the frontend TypeScript interfaces to avoid mapping friction.
- Use MapStruct or manual mappers in `mapper/*Mapper` to translate `entity <-> dto`.
- Example `VehicleDTO` fields: `String id; String make; String model; Integer year; String licensePlate; String vin; String color; String owner; OffsetDateTime lastService; Integer totalServices;`

## Security, CORS, and headers
- Ensure `SecurityConfig` reads Bearer token and your `JwtFilter` extracts user info from `Authorization` header.
- Allow CORS from the frontend origin (vite dev server) in `SecurityConfig` or a `CorsConfiguration` bean.

## Response & error format
- Standardize error JSON from `GlobalExceptionHandler`:
```
{
  "timestamp":"2026-02-10T12:00:00Z",
  "status":404,
  "error":"Not Found",
  "message":"Vehicle not found",
  "path":"/api/vehicles/abc"
}
```

## Quick actionable checklist (apply now)
- [ ] Expose controllers at exact frontend paths: `/api/vehicles`, `/api/customers`, `/api/inventory`, `/api/job-cards`, `/api/invoices`.
- [ ] Make DTO field names identical to frontend TypeScript interfaces.
- [ ] Return arrays for list endpoints (or update frontend to accept paginated `Page` objects).
- [ ] Ensure create returns `201` + created object; delete returns `204`.
- [ ] Confirm `Authorization: Bearer` token processing in `JwtFilter`.
- [ ] Add CORS allowing frontend origin.
- [ ] Compute derived fields (`vehicleCount`, `totalSpent`) in the service layer.
- [ ] Add endpoint aliases if you want to keep original controller names (e.g., `@RequestMapping({"/api/inventory","/api/spare-parts"})`).

## Next steps I can do for you
- Generate a runnable Spring Boot skeleton matching these paths and DTOs.
- Implement one entity end-to-end (recommended: `Vehicle`) as a template.
- Produce a patch to add alias mappings in your current controllers (quick rename/alias).

---
File created to help align backend with frontend. If you want a direct patch to your Java sources to add exact `/api/*` mappings and DTO renames, tell me which option above and I will apply the changes.
