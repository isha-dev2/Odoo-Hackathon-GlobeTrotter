# 📖 GlobeTrotter REST API Reference

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints

### `POST /auth/register`
Register a new user account.
* **Payload**:
```json
{
  "name": "Aarav Sharma",
  "email": "aarav@globetrotter.in",
  "password": "SecurePassword123!"
}
```
* **Response `201 Created`**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "user-1", "name": "Aarav Sharma", "email": "aarav@globetrotter.in" }
}
```

### `POST /auth/login`
Authenticate user with email and password.
* **Response `200 OK`**: Returns JWT access token.

---

## 2. Trip & Itinerary Management

### `GET /trips`
Retrieve all trips for the authenticated traveler.

### `POST /trips`
Create a new multi-city trip itinerary.
* **Payload**:
```json
{
  "name": "Royal Rajasthan Heritage",
  "description": "7 days exploring Jaipur and Udaipur forts and culture",
  "startDate": "2026-10-01",
  "endDate": "2026-10-08",
  "budgetLimit": 45000,
  "isPublic": true,
  "theme": "Heritage & Royalty"
}
```

### `PUT /trips/:id`
Update an existing trip (metadata, stops, budget limit).

### `DELETE /trips/:id`
Delete an itinerary and cascade clean up associated stops and bookings.

### `GET /trips/share/:slug`
Public read-only endpoint to access shared community itineraries.

---

## 3. City & Destination Directory

### `GET /cities`
List and search destinations with query parameters:
* `?q=Jaipur` — Search by city or country name
* `?country=India` — Filter by country
* `?minCost=20&maxCost=80` — Filter by daily cost index
* `?sortBy=popularity&order=desc` — Sort options

### `GET /cities/:id`
Retrieve detailed city metadata, climate stats, and scheduled experiences.

---

## 4. Activities & Experiences

### `GET /activities`
Query curated tours, tickets, and culinary experiences.
* `?cityId=city-in-1`
* `?category=Culture`
* `?maxPrice=2500`

### `POST /activities`
Create custom activity under a specific itinerary stop.

---

## 5. AI Smart Travel Agent

### `POST /agent/plan`
Generate automated AI itineraries based on natural language prompts.
* **Payload**:
```json
{
  "prompt": "Plan 7 days royal tour in Rajasthan under 45000",
  "destination": "Jaipur",
  "days": 7,
  "budgetLevel": "moderate"
}
```
* **Response**: Returns complete day-by-day stops and activities itinerary.

---

## 6. Admin & Health Telemetry

### `GET /admin/stats`
Platform metrics: Total Users, Total Trips, Catalog Destinations, and Spend Volume.

### `GET /admin/health`
PostgreSQL database connection pool and Prisma ORM latency monitor.
