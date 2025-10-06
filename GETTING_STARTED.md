# 🚀 Getting Started with MovieFlix Backend

Welcome! This guide will get you up and running with the MovieFlix backend in just a few minutes.

## 📋 What You Need

1. **Java 17** - [Download here](https://adoptium.net/)
2. **Maven 3.6+** - [Download here](https://maven.apache.org/download.cgi)
3. **OMDb API Key** - [Get free key](http://www.omdbapi.com/apikey.aspx)

## ⚡ Quick Start (3 Steps)

### Step 1: Get Your API Key

1. Go to [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx)
2. Choose "FREE" plan (1,000 requests/day)
3. Enter your email
4. Check email and **click activation link** (important!)
5. Save your API key

### Step 2: Set API Key

**Windows (PowerShell):**
```powershell
$env:OMDB_API_KEY="your_api_key_here"
```

**Mac/Linux:**
```bash
export OMDB_API_KEY=your_api_key_here
```

**Or edit `application.yml`:**
```yaml
app:
  omdb:
    api-key: your_api_key_here
```

### Step 3: Run!

```bash
mvn spring-boot:run
```

**That's it!** 🎉 The server is now running at `http://localhost:8080`

## ✅ Test It Works

### Test 1: Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

You should see a response with a JWT token!

### Test 2: Search Movies

Replace `YOUR_TOKEN` with the token from the login response:

```bash
curl -X GET "http://localhost:8080/api/movies?search=Matrix" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

You should see The Matrix movies! 🎬

## 🎯 What's Next?

### 🧪 Try Swagger UI (Recommended!)

For the best experience, use the interactive Swagger documentation:

1. **Open Swagger UI:** `http://localhost:8080/swagger-ui.html`
2. **Login** via the Authentication section
3. **Click Authorize** and enter your token
4. **Test endpoints** directly in your browser!

See **[SWAGGER_GUIDE.md](SWAGGER_GUIDE.md)** for complete Swagger documentation.

### Default Login Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**User Account:**
- Username: `user`  
- Password: `user123`

### Explore the API

Try these endpoints:

1. **Search Batman movies:**
   ```bash
   GET /api/movies?search=Batman&sort=rating&order=desc
   ```

2. **Get movie details:**
   ```bash
   GET /api/movies/tt0468569  # The Dark Knight
   ```

3. **View statistics:**
   ```bash
   GET /api/stats
   ```

### Access H2 Database Console

Visit: `http://localhost:8080/h2-console`

- JDBC URL: `jdbc:h2:mem:movieflix`
- Username: `sa`
- Password: (leave empty)

## 📚 Documentation

- **[Swagger UI](http://localhost:8080/swagger-ui.html)** - Interactive API docs (run app first!)
- **[SWAGGER_GUIDE.md](SWAGGER_GUIDE.md)** - Complete Swagger guide
- **[README.md](README.md)** - Complete documentation
- **[QUICK_START.md](QUICK_START.md)** - Detailed setup guide
- **[API_EXAMPLES.md](API_EXAMPLES.md)** - All API examples
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy to cloud
- **[FEATURES.md](FEATURES.md)** - Feature list
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Architecture

## 🎬 Try These Popular Movies

```bash
tt0133093  # The Matrix (1999)
tt0468569  # The Dark Knight (2008)
tt1375666  # Inception (2010)
tt0816692  # Interstellar (2014)
tt0111161  # The Shawshank Redemption (1994)
```

Example:
```bash
curl -X GET "http://localhost:8080/api/movies/tt0133093" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 Troubleshooting

### Port 8080 Already in Use?
```bash
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```

### Forgot to Activate API Key?
Check your email and click the activation link from OMDb.

### Token Expired?
Login again to get a new token. Tokens last 24 hours.

### Movies Not Found?
First search creates the cache. Try searching for popular movies like "Batman" or "Matrix".

## 💡 Pro Tips

1. **Search once, use many times** - Movies are cached for 24 hours after first search
2. **Use admin account** - To update or delete cached movies
3. **Check H2 console** - To see what's in your database
4. **Read API examples** - See [API_EXAMPLES.md](API_EXAMPLES.md) for all endpoints
5. **Deploy to cloud** - See [DEPLOYMENT.md](DEPLOYMENT.md) for Heroku, AWS, etc.

## 🎉 You're Ready!

You now have:
- ✅ Working Spring Boot backend
- ✅ Movie search and caching
- ✅ JWT authentication
- ✅ Statistics and analytics
- ✅ Admin operations

### What to Do Next?

1. **Build a frontend** - Connect React/Vue/Angular app
2. **Deploy to cloud** - Heroku, AWS, Railway, etc.
3. **Add features** - Extend the backend as needed
4. **Explore the code** - Learn from the implementation

## 📞 Need Help?

1. Check the [README.md](README.md) for detailed info
2. Review [API_EXAMPLES.md](API_EXAMPLES.md) for examples
3. Read [QUICK_START.md](QUICK_START.md) for troubleshooting
4. Inspect logs in your terminal

## 🌟 Happy Coding!

You're all set to build an amazing movie dashboard! 🎬🍿

---

**Made for MoEngage Assignment** | Spring Boot 3.2.0 | Java 17 | OMDb API

