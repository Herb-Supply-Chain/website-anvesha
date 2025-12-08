# API Folder

This folder contains backend API endpoints for the ANVESHA application.

## Structure

```
api/
├── auth/           # Authentication endpoints
├── lab/            # Lab-related endpoints
├── processor/      # Processor-related endpoints
├── manufacturer/   # Manufacturer-related endpoints
└── admin/          # Admin-related endpoints
```

## Usage

This folder is separate from the `app` folder to keep backend logic isolated from frontend pages.

### Example API Endpoint

Create files in this folder to handle backend requests:

```javascript
// api/auth/login.js
export default function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    
    // Your authentication logic here
    
    res.status(200).json({ 
      token: 'jwt-token',
      user: { id: 1, email, role: 'Admin' }
    });
  }
}
```

## Note

Currently, the application uses **mock authentication** (no backend required).
When you're ready to implement real backend endpoints, you can:

1. Create API files in this folder
2. Update `lib/auth-service.ts` to uncomment the API calls
3. Point the API calls to your backend server

## Backend Options

You can use this folder with:
- **Node.js/Express** server
- **Flask/FastAPI** (Python)
- **Next.js API Routes** (if you prefer)
- Any other backend framework

The frontend is already configured to send requests to `http://localhost:5000/api` by default.
