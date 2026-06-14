# 📮 API Testing Guide — Postman

This guide walks you through testing the Portfolio OS 2026 backend API using [Postman](https://www.postman.com/).

---

## Setup

### 1. Start the Backend Server

```bash
cd server
npm install
npm run dev
```

The server should start on `http://localhost:5000`.

### 2. Create a Postman Environment

Create a new environment in Postman with the following variable:

| Variable   | Initial Value              |
| ---------- | -------------------------- |
| `base_url` | `http://localhost:5000`    |

---

## API Endpoints

### Health Check

Verifies the API server is running.

```
GET {{base_url}}/api/health
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Portfolio OS API is running",
  "timestamp": "2026-06-14T10:00:00.000Z",
  "environment": "development"
}
```

---

### Get Profile

Retrieves the developer's profile information.

```
GET {{base_url}}/api/profile
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Profile data retrieved successfully",
  "data": {
    "name": "Soham Kundu",
    "title": "Full Stack Developer",
    "bio": "...",
    "email": "soham.kundu@example.com",
    "location": {
      "city": "Kolkata",
      "state": "West Bengal",
      "country": "India"
    },
    "social": {
      "github": "...",
      "linkedin": "...",
      "twitter": "..."
    },
    "availableForHire": true,
    "yearsOfExperience": 2
  }
}
```

---

### 404 — Route Not Found

Test with any undefined route to verify error handling.

```
GET {{base_url}}/api/nonexistent
```

**Expected Response** (404 Not Found):
```json
{
  "success": false,
  "message": "Route GET /api/nonexistent not found"
}
```

---

## Testing Tips

1. **Use the Console**: Postman's console (`View → Show Postman Console`) shows raw request/response details.
2. **Save Requests**: Create a collection called "Portfolio OS 2026" and save all requests for easy re-testing.
3. **Verify Headers**: All responses should have `Content-Type: application/json`.
4. **Check CORS**: If testing from a browser, the API allows requests from `http://localhost:5173` (the Vite dev server).

---

## Future Endpoints (Phase 2+)

| Method | Endpoint              | Status   |
| ------ | --------------------- | -------- |
| GET    | `/api/projects`       | Planned  |
| GET    | `/api/projects/:id`   | Planned  |
| GET    | `/api/skills`         | Planned  |
| GET    | `/api/timeline`       | Planned  |
| GET    | `/api/achievements`   | Planned  |
| POST   | `/api/contact`        | Planned  |
