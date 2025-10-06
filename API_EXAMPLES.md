# MovieFlix Backend - API Examples

Complete collection of API examples for testing the MovieFlix backend.

## Base URL
```
http://localhost:8080
```

## 1. Authentication

### 1.1 Register New User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
    "type": "Bearer",
    "username": "testuser",
    "email": "test@example.com",
    "role": "USER"
  }
}
```

### 1.2 Login (Admin)
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### 1.3 Login (Regular User)
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user",
    "password": "user123"
  }'
```

### 1.4 Refresh Token
```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

---

## 2. Movies API

### 2.1 Search Movies by Title
```bash
curl -X GET "http://localhost:8080/api/movies?search=Matrix" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2.2 Search with Sorting
```bash
# Sort by rating (descending)
curl -X GET "http://localhost:8080/api/movies?search=Batman&sort=rating&order=desc" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Sort by year (ascending)
curl -X GET "http://localhost:8080/api/movies?search=Batman&sort=year&order=asc" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Sort by title
curl -X GET "http://localhost:8080/api/movies?search=Batman&sort=title&order=asc" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Sort by runtime
curl -X GET "http://localhost:8080/api/movies?search=Batman&sort=runtime&order=desc" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2.3 Search with Filters
```bash
# Filter by genre
curl -X GET "http://localhost:8080/api/movies?search=Action&genres=Action&genres=Sci-Fi" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filter by year range
curl -X GET "http://localhost:8080/api/movies?search=Movie&minYear=2000&maxYear=2020" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Filter by minimum rating
curl -X GET "http://localhost:8080/api/movies?search=Movie&minRating=8.0" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2.4 Combined Search, Filter, and Sort
```bash
curl -X GET "http://localhost:8080/api/movies?search=Action&sort=rating&order=desc&genres=Action&minYear=2000&minRating=7.0&page=0&size=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2.5 Pagination
```bash
# First page (10 items)
curl -X GET "http://localhost:8080/api/movies?search=Batman&page=0&size=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Second page (10 items)
curl -X GET "http://localhost:8080/api/movies?search=Batman&page=1&size=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Custom page size (20 items)
curl -X GET "http://localhost:8080/api/movies?search=Batman&page=0&size=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2.6 Get Movie by IMDb ID
```bash
# The Matrix
curl -X GET "http://localhost:8080/api/movies/tt0133093" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Inception
curl -X GET "http://localhost:8080/api/movies/tt1375666" \
  -H "Authorization: Bearer YOUR_TOKEN"

# The Dark Knight
curl -X GET "http://localhost:8080/api/movies/tt0468569" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Interstellar
curl -X GET "http://localhost:8080/api/movies/tt0816692" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 3. Statistics API

### 3.1 Get Movie Statistics
```bash
curl -X GET "http://localhost:8080/api/stats" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "genreDistribution": {
      "Action": 45,
      "Drama": 32,
      "Sci-Fi": 28,
      "Thriller": 25
    },
    "averageRatingByGenre": {
      "Action": 7.5,
      "Drama": 8.2,
      "Sci-Fi": 7.8,
      "Thriller": 7.6
    },
    "averageRuntimeByYear": {
      "1999": 136.5,
      "2003": 138.2,
      "2008": 152.0
    },
    "overallAverageRating": 7.8,
    "totalMovies": 50
  }
}
```

---

## 4. Admin API (Requires ADMIN Role)

### 4.1 Update Movie
```bash
curl -X PUT "http://localhost:8080/api/admin/movies/tt0133093" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Matrix - Updated",
    "imdbRating": 9.0,
    "plot": "Updated plot description"
  }'
```

### 4.2 Delete Movie from Cache
```bash
curl -X DELETE "http://localhost:8080/api/admin/movies/tt0133093" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 5. Popular Movie IMDb IDs for Testing

Here are some popular movie IMDb IDs you can use for testing:

```
tt0133093 - The Matrix (1999)
tt0468569 - The Dark Knight (2008)
tt1375666 - Inception (2010)
tt0816692 - Interstellar (2014)
tt0111161 - The Shawshank Redemption (1994)
tt0109830 - Forrest Gump (1994)
tt0110912 - Pulp Fiction (1994)
tt0137523 - Fight Club (1999)
tt0167260 - The Lord of the Rings: The Return of the King (2003)
tt0114369 - Se7en (1995)
tt0120737 - The Lord of the Rings: The Fellowship of the Ring (2001)
tt0076759 - Star Wars (1977)
tt0167261 - The Lord of the Rings: The Two Towers (2002)
tt0102926 - The Silence of the Lambs (1991)
tt0088763 - Back to the Future (1985)
```

---

## 6. Testing Workflow

### Complete Testing Flow:

```bash
# 1. Register a new user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@test.com","password":"pass123"}'

# 2. Save the token from response, then search for movies
TOKEN="eyJhbGciOiJIUzI1NiJ9..."

# 3. Search for Batman movies
curl -X GET "http://localhost:8080/api/movies?search=Batman" \
  -H "Authorization: Bearer $TOKEN"

# 4. Get specific movie details
curl -X GET "http://localhost:8080/api/movies/tt0468569" \
  -H "Authorization: Bearer $TOKEN"

# 5. Get statistics
curl -X GET "http://localhost:8080/api/stats" \
  -H "Authorization: Bearer $TOKEN"

# 6. Login as admin
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 7. Use admin token for admin operations
ADMIN_TOKEN="eyJhbGciOiJIUzI1NiJ9..."

# 8. Update a movie (admin only)
curl -X PUT "http://localhost:8080/api/admin/movies/tt0468569" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"imdbRating": 9.5}'

# 9. Delete a movie (admin only)
curl -X DELETE "http://localhost:8080/api/admin/movies/tt0468569" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## 7. Error Responses

### 401 Unauthorized (Missing/Invalid Token)
```json
{
  "success": false,
  "message": "Unauthorized: Full authentication is required to access this resource"
}
```

### 403 Forbidden (Insufficient Permissions)
```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Movie not found with ID: tt9999999"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "username": "Username is required",
    "email": "Email must be valid"
  }
}
```

---

## 8. Using Postman

Import this collection structure:

1. Create environment with:
   - `baseUrl`: `http://localhost:8080`
   - `token`: (set after login)
   - `adminToken`: (set after admin login)

2. Set Authorization header:
   - Type: Bearer Token
   - Token: `{{token}}` or `{{adminToken}}`

3. Create requests for each endpoint above

---

## 9. Frontend Integration Example

```javascript
// Login and get token
const login = async () => {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  const data = await response.json();
  const token = data.data.token;
  localStorage.setItem('token', token);
  return token;
};

// Search movies
const searchMovies = async (query) => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `http://localhost:8080/api/movies?search=${query}&sort=rating&order=desc`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  return await response.json();
};

// Get statistics
const getStats = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8080/api/stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};
```

---

## Notes

- Replace `YOUR_TOKEN` and `ADMIN_TOKEN` with actual tokens from login response
- All authenticated endpoints require `Authorization: Bearer TOKEN` header
- Admin endpoints require ADMIN role
- The first search for a movie will fetch from OMDb API and cache it
- Subsequent requests will use cached data
- Cache expires after 24 hours

