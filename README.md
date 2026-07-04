# Garage Management Application

A full-stack garage management system — track vehicles coming in for service, manage job cards, keep tabs on spare parts inventory, and generate bills. Built with Spring Boot on the backend and React (Vite + TypeScript) on the frontend.

## How it works

A customer signs up, verifies their email, and submits a vehicle for service. An admin approves or rejects the request. Once approved, a job card gets opened and moves through a few stages (arrived, in service, waiting for parts, completed, delivered). Mechanics attach the parts used and their charges. At the end a bill is generated and can be marked paid.

## Features

- JWT-based auth with email activation on signup
- Three roles — user, mechanic, admin — each with different access
- Vehicle intake + approval workflow
- Job card tracking with status updates
- Spare parts inventory
- Billing (spare part cost + labor + tax → total)
- Admin dashboard with counts/analytics (active job cards, registered users, etc.)
- Frontend has a demo mode with mock accounts, so you can look around the UI without running the backend at all

## Tech stack

**Backend:** Java 21, Spring Boot 4, Spring Security + JWT, Spring Data JPA, PostgreSQL (H2 for local runs), Lombok, Maven

**Frontend:** React 18, TypeScript, Vite, Tailwind , React Query, React Hook ,Recharts

**Other:** Docker / Docker Compose for running everything together

## Project layout
Garage-Management-Application/     -> Spring Boot backend
  src/main/java/.../controller     -> Auth, Admin, User, Vehicle, JobCard, Bill, SparePart
  src/main/java/.../entity         -> User, Vehicle, JobCard, Bill, SparePart
  src/main/java/.../service
  src/main/java/.../configs        -> SecurityConfig (JWT + CORS + roles)

Garage-Management-frontend/        -> React app
  src/pages/{auth,dashboard,user,vehicles,jobcards,inventory,billing,customers,reports,settings}

docker-compose.yml

## Running it

### With Docker
bash
git clone https://github.com/Dayeshlate/Garage-Management-Application.git
cd Garage-Management-Application
docker compose up --build


Backend on `localhost:8080`, frontend on `localhost:3000`, MySQL on `3306`.

Change the `JWT_SECRET` and email credentials in `docker-compose.yml` before using this for anything beyond your own testing.

### Without Docker

Backend:
bash
cd Garage-Management-Application
cp example.env .env   # fill in your DB + email details
./mvnw spring-boot:run


Frontend:
bash
cd Garage-Management-frontend
npm install
echo "VITE_API_URL=http://localhost:8080" > .env
npm run dev

### Env variables you'll need

Backend: `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`, `JWT_SECRET`, `FRONTEND_URL`, `BACKEND_URL`, `EMAIL_USERNAME`, `EMAIL_PASSWORD`

Frontend: `VITE_API_URL`, `VITE_DEFAULT_CURRENCY`

> Heads up — `docker-compose.yml` currently sets up MySQL with `DATABASE_URL`-style variables, but `application.properties` expects Postgres with `PGHOST`/`PGUSER`/etc. If you run docker-compose as-is it won't line up with what the app reads, so pick one and update the other before relying on it.

## API overview

Auth (`/api/auth`): `register`, `activate`, `login`

User (`/user`): `current`, `update/{id}`, `getAllCustomer`

Vehicles (`/user/vehicle`): `create`, `allUservehicle`, `getByStatus`

Job cards (`/user/jobCard`): `Active_count`, `Active_Services`

Bills (`/user/bill`): `getAll`, `getBillCountForUser`, `getAllBillsOfVehicle/{id}`

Admin (`/admin`): vehicle approval, job card management, bill status updates, spare parts CRUD, user/job card counts — mostly restricted to `ADMIN`, with a few shared with `MECHANIC`.

## Demo accounts (frontend only, no backend needed)

- Admin — `admin@garage.com` / `admin123`
- User — `user@garage.com` / `user123`

These are hardcoded on the frontend for quick demos. Point `VITE_API_URL` at a real backend and it switches to actual login.

## Things I'd still fix

- Docker Compose vs application.properties DB mismatch (mentioned above)
- Not all controllers follow the same `/api` prefix convention
- No pagination yet on list endpoints

---
Built by Dayesh Late (Lokesh). Portfolio: dayeshlate-portfolio.vercel.app
