# MovieFlix Backend - Swagger API Documentation Guide

Complete guide to using the interactive Swagger UI for testing and exploring the MovieFlix API.

## 🚀 Accessing Swagger UI

Once the application is running, access the Swagger UI at:

```
http://localhost:8080/swagger-ui.html
```

Or the OpenAPI JSON specification at:

```
http://localhost:8080/v3/api-docs
```

## 📖 What is Swagger?

Swagger UI provides:
- 📚 **Interactive API Documentation** - View all endpoints with descriptions
- 🧪 **API Testing** - Test endpoints directly from your browser
- 📝 **Request/Response Examples** - See what data to send and receive
- 🔐 **Authentication** - Easy JWT token management
- ✅ **Validation** - See required fields and data types

## 🎯 Quick Start Guide

### Step 1: Start the Application

```bash
mvn spring-boot:run
```

### Step 2: Open Swagger UI

Navigate to: `http://localhost:8080/swagger-ui.html`

### Step 3: Authenticate

1. **Login to get token:**
   - Find the **Authentication** section
   - Click on `POST /api/auth/login`
   - Click **"Try it out"**
   - Enter credentials:
     ```json
     {
       "username": "admin",
       "password": "admin123"
     }
     ```
   - Click **"Execute"**
   - Copy the `token` value from the response

2. **Set Authorization:**
   - Click the **🔓 Authorize** button at the top
   - Enter: `Bearer YOUR_TOKEN_HERE` (replace with your actual token)
   - Click **"Authorize"**
   - Click **"Close"**

Now you can access all protected endpoints! 🎉

### Step 4: Test APIs

Try these operations:

**Search Movies:**
- Go to **Movies** section
- Click `GET /api/movies`
- Click "Try it out"
- Enter search query: `Matrix`
- Click "Execute"

**Get Movie Details:**
- Click `GET /api/movies/{imdbId}`
- Click "Try it out"
- Enter IMDb ID: `tt0133093`
- Click "Execute"

**View Statistics:**
- Go to **Statistics** section
- Click `GET /api/stats`
- Click "Try it out"
- Click "Execute"

## 📚 API Sections

### 1. Authentication
**No authentication required** ✅

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/refresh` - Refresh access token

### 2. Movies
**Requires authentication** 🔐

- `GET /api/movies` - Search and filter movies
  - Parameters: search, sort, order, genres, minYear, maxYear, minRating, page, size
- `GET /api/movies/{imdbId}` - Get movie details

### 3. Statistics
**Requires authentication** 🔐

- `GET /api/stats` - Get aggregated movie statistics

### 4. Admin
**Requires ADMIN role** 👑

- `PUT /api/admin/movies/{imdbId}` - Update movie in cache
- `DELETE /api/admin/movies/{imdbId}` - Delete movie from cache

## 🔐 Authentication Flow

### 1. Using Default Credentials

**Admin User:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Regular User:**
```json
{
  "username": "user",
  "password": "user123"
}
```

### 2. Register New User

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### 3. Set Bearer Token

After login, copy the token and click **Authorize**:
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:** Include the word "Bearer" followed by a space before your token!

## 📝 Example Workflows

### Workflow 1: Search Movies

1. **Login** (if not already authenticated)
2. Go to **Movies** → `GET /api/movies`
3. Click "Try it out"
4. Enter parameters:
   - search: `Batman`
   - sort: `rating`
   - order: `desc`
   - page: `0`
   - size: `10`
5. Click "Execute"
6. View results in Response body

### Workflow 2: Get Movie Details

1. From search results, copy an IMDb ID (e.g., `tt0468569`)
2. Go to `GET /api/movies/{imdbId}`
3. Click "Try it out"
4. Enter IMDb ID: `tt0468569`
5. Click "Execute"
6. View full movie details

### Workflow 3: View Statistics

1. Go to **Statistics** → `GET /api/stats`
2. Click "Try it out"
3. Click "Execute"
4. View analytics:
   - Genre distribution
   - Average ratings by genre
   - Average runtime by year
   - Overall statistics

### Workflow 4: Admin Operations

1. **Login as admin:**
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
2. Copy admin token and authorize
3. Go to **Admin** section
4. **Update Movie:**
   - Click `PUT /api/admin/movies/{imdbId}`
   - Enter IMDb ID: `tt0133093`
   - Enter update data:
     ```json
     {
       "title": "The Matrix - Updated",
       "imdbRating": 9.0
     }
     ```
   - Click "Execute"

5. **Delete Movie:**
   - Click `DELETE /api/admin/movies/{imdbId}`
   - Enter IMDb ID
   - Click "Execute"

## 🎬 Popular IMDb IDs for Testing

```
tt0133093  - The Matrix (1999)
tt0468569  - The Dark Knight (2008)
tt1375666  - Inception (2010)
tt0816692  - Interstellar (2014)
tt0111161  - The Shawshank Redemption (1994)
tt0109830  - Forrest Gump (1994)
tt0110912  - Pulp Fiction (1994)
tt0137523  - Fight Club (1999)
tt0167260  - LOTR: Return of the King (2003)
tt0114369  - Se7en (1995)
```

## 🔍 Understanding the UI

### Request Parameters

- **Required** - Marked with red asterisk (*)
- **Optional** - Can be left empty
- **Types** - Shows data type (string, integer, number, etc.)
- **Examples** - Pre-filled example values

### Response Section

- **Code** - HTTP status code (200, 201, 400, 401, etc.)
- **Response body** - JSON response from API
- **Response headers** - HTTP headers
- **Duration** - Time taken for request

### Schema Section

- Shows the structure of request/response objects
- Indicates required fields
- Displays data types and formats

## 💡 Pro Tips

### 1. Token Management
- Tokens expire after 24 hours
- Use refresh token to get new access token
- Keep admin and user tokens separate

### 2. Testing Features
- Use "Download" button to save responses as JSON
- Use "Clear" button to reset form
- Check "Response headers" for debugging

### 3. Filtering Movies
Combine multiple filters:
```
search=Action
genres=Action
genres=Sci-Fi
minYear=2000
maxYear=2020
minRating=7.0
sort=rating
order=desc
```

### 4. Pagination
- Start with `page=0`
- Adjust `size` (default: 10, max recommended: 100)
- Check `totalPages` in response for navigation

### 5. Error Handling
Common HTTP codes:
- `200` - Success
- `201` - Created (register)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `502` - Bad Gateway (OMDb API error)

## 🐛 Troubleshooting

### "401 Unauthorized" Error

**Problem:** Not authenticated or token expired

**Solution:**
1. Login via `/api/auth/login`
2. Copy the token from response
3. Click 🔓 **Authorize** button
4. Enter: `Bearer YOUR_TOKEN`
5. Try the request again

### "403 Forbidden" Error

**Problem:** Insufficient permissions (trying to access admin endpoint as user)

**Solution:**
1. Logout (click Authorize → Logout)
2. Login with admin credentials
3. Use admin token for admin operations

### Token Doesn't Work

**Problem:** Missing "Bearer" prefix or extra spaces

**Solution:**
- Format: `Bearer {token}` (one space after "Bearer")
- Example: `Bearer eyJhbGc...`
- Don't include quotes or braces

### Movie Not Found

**Problem:** Movie not in cache and OMDb API can't find it

**Solution:**
- Use valid IMDb IDs (start with "tt")
- Try searching first to populate cache
- Check OMDb API status

### Empty Statistics

**Problem:** No movies in cache yet

**Solution:**
- Search for some movies first
- Movies will be cached automatically
- Then check statistics

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "field": "Error message"
  }
}
```

## 🎨 UI Features

### Tags (Sections)
- **Authentication** - Green (no auth required)
- **Movies** - Blue (auth required)
- **Statistics** - Blue (auth required)
- **Admin** - Red (admin only)

### Endpoints
- **GET** - Blue (read operations)
- **POST** - Green (create operations)
- **PUT** - Orange (update operations)
- **DELETE** - Red (delete operations)

## 📥 Export API Documentation

### OpenAPI JSON
```
http://localhost:8080/v3/api-docs
```

### OpenAPI YAML
```
http://localhost:8080/v3/api-docs.yaml
```

**Use cases:**
- Import into Postman
- Generate client SDKs
- Share with frontend team
- API version control

## 🔄 Integration with Other Tools

### Postman
1. Get OpenAPI spec: `http://localhost:8080/v3/api-docs`
2. In Postman: Import → Link → Paste URL
3. All endpoints imported automatically!

### API Testing Tools
- **Insomnia** - Import OpenAPI spec
- **Thunder Client** (VS Code) - Import OpenAPI
- **Hoppscotch** - Import OpenAPI

## 📖 Additional Resources

- **README.md** - Complete project documentation
- **API_EXAMPLES.md** - cURL examples
- **QUICK_START.md** - Setup guide
- **DEPLOYMENT.md** - Deployment instructions

## 🌟 Best Practices

1. ✅ Always test with both user and admin accounts
2. ✅ Use example values provided in documentation
3. ✅ Check response schemas before making requests
4. ✅ Save successful requests for future reference
5. ✅ Test error scenarios (invalid data, missing auth)
6. ✅ Download OpenAPI spec for offline use
7. ✅ Share Swagger URL with your team

## 🎯 Summary

Swagger UI provides:
- ✅ Interactive API testing
- ✅ Complete documentation
- ✅ No need for external tools
- ✅ Built-in authentication
- ✅ Real-time testing
- ✅ Example requests/responses
- ✅ Schema validation

**Access your Swagger UI at:** `http://localhost:8080/swagger-ui.html`

---

**Happy Testing! 🚀**

