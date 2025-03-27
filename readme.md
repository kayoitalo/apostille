# Project Structure

```
.
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin section
│   ├── api/                      # API routes
│   ├── dashboard/                # Dashboard section
│   ├── dashboard-client/         # Client dashboard
│   ├── dashboard-translator/     # Translator dashboard
│   ├── login/                    # Login section
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Root page
├── components/                   # UI components
│   ├── ui/                      # UI component library
│   ├── theme-provider.tsx       # Theme context provider
│   └── theme-toggle.tsx         # Theme toggle component
├── hooks/                       # Custom React hooks
│   ├── use-mobile.tsx          # Mobile detection hook
│   └── use-toast.ts            # Toast notification hook
├── lib/                        # Utility functions and services
│   ├── validations/           # Form validation schemas
│   ├── auth.ts                # Authentication utilities
│   ├── pdf.ts                 # PDF handling utilities
│   ├── prisma.ts             # Prisma client configuration
│   ├── rate-limit.ts         # Rate limiting utilities
│   ├── storage.ts            # Storage utilities
│   └── utils.ts              # General utilities
├── prisma/                    # Prisma ORM
│   └── migrations/           # Database migrations
├── services/                  # Business logic services
│   ├── batch.service.ts      # Batch processing service
│   ├── document.service.ts   # Document handling service
│   └── user.service.ts       # User management service
├── src/                      # Source directory
│   ├── lib/                  # Additional libraries
│   ├── services/            # Additional services
│   └── types/              # TypeScript type definitions
├── ARCHITECTURES.md         # Architecture documentation
├── ARCHITECTURES RESUME.md  # Architecture summary
├── components.json         # UI components configuration
├── middleware.ts          # Next.js middleware
├── next.config.ts        # Next.js configuration
├── package.json          # Project dependencies
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

# API Documentation

## Authentication

All API requests must include an Authorization header with a Bearer token:

```
Authorization: Bearer <your_jwt_token>
```

## Login

```
POST /api/v1/auth
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

Response:

```
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "CLIENT"
  }
}
```

## Documents

### List Documents

```
GET /api/v1/documents
```

### Create Document

```
POST /api/v1/documents
Content-Type: multipart/form-data

file: [PDF File]
title: "Document Title"
registrantName: "Person Name"
```

### Get Document

```
GET /api/v1/documents/{id}
```

### Update Document

```
PUT /api/v1/documents/{id}
Content-Type: application/json

{
  "title": "Updated Title",
  "notes": "Additional notes"
}
```

### Delete Document

```
DELETE /api/v1/documents/{id}
```

## Batches

### List Batches

```
GET /api/v1/batches
```

### Create Batch

```
POST /api/v1/batches
Content-Type: multipart/form-data

file: [PDF File]
name: "Batch Name"
notes: "Batch Notes"
```

## Integration Example (TypeScript)

Here's how to integrate the API into your system:

```typescript
// api-client.ts
class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  async login(email: string, password: string) {
    const response = await fetch(`${this.baseUrl}/api/v1/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    this.token = data.token;
    return data;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    if (!this.token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Documents
  async getDocuments() {
    return this.request('/api/v1/documents');
  }

  async createDocument(file: File, title: string, registrantName: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('registrantName', registrantName);

    return this.request('/api/v1/documents', {
      method: 'POST',
      body: formData,
    });
  }

  // Batches
  async getBatches() {
    return this.request('/api/v1/batches');
  }

  async createBatch(file: File, name: string, notes?: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    if (notes) formData.append('notes', notes);

    return this.request('/api/v1/batches', {
      method: 'POST',
      body: formData,
    });
  }
}

// Usage example
const api = new ApiClient('https://your-api-url.com');

// Login
await api.login('user@example.com', 'password');

// Upload document
const file = new File(['...'], 'document.pdf', { type: 'application/pdf' });
await api.createDocument(file, 'Birth Certificate', 'John Doe');

// Get all documents
const documents = await api.getDocuments();

// Create batch
const batchFile = new File(['...'], 'batch.pdf', { type: 'application/pdf' });
await api.createBatch(batchFile, 'January Documents', 'Urgent processing');
```

This API provides all the functionality available in the client dashboard. The client can:

- Authenticate users
- Manage individual documents
- Create and manage document batches
- Track document status
- Add notes and observations

Important security considerations:

- Always use HTTPS for API requests
- Store the JWT token securely
- Implement proper error handling
- Add rate limiting for API endpoints
- Validate file types and sizes
- Implement request timeout handling

The API follows REST principles and uses standard HTTP status codes. All responses are in JSON format except for file uploads which use multipart/form-data.