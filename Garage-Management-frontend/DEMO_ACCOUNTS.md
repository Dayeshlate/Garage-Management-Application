# Demo Accounts for Testing

These demo credentials work **without requiring a backend** - they are built into the frontend for easy testing and demos.

## Admin Account

**Email:** `admin@garage.com`  
**Password:** `admin123`

### Features Available:
- Full dashboard access with mock data
- Create and manage vehicles
- Create and manage job cards
- Manage inventory
- View all billing and invoices
- Access customer management
- View reports
- Settings and configuration

## User Account

**Email:** `user@garage.com`  
**Password:** `user123`

### Features Available:
- User dashboard with personal stats
- View own vehicles
- Track service for own vehicles
- View own invoices
- Limited access (no admin features)

## Quick Testing

1. Go to the Login page
2. Click the **Admin Demo** or **User Demo** buttons to auto-fill credentials
3. Or manually enter the credentials above
4. Click **Sign In**
5. You'll be logged in immediately with mock demo data

## How It Works

- Demo credentials are validated **locally in the frontend** without needing a backend
- User data + token are stored in `localStorage` for session persistence
- All UI and routing works as expected with demo accounts
- Perfect for:
  - Testing the UI/UX
  - Screenshoots and demos
  - Working offline
  - Frontend development

## Using a Real Backend

If you have a working backend API:

1. Set your backend URL: `VITE_API_URL=http://your-backend.com`
2. Create accounts on your backend
3. Log in with those credentials
4. The login will skip demo mode and use your backend API
