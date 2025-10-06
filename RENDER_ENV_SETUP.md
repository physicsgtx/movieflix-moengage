# 🔧 Render Environment Variables Setup

## Current Issue
The backend is using **H2 (in-memory)** instead of **PostgreSQL** in production.

## Solution
Add the `SPRING_PROFILES_ACTIVE` environment variable to activate the production profile.

---

## 📋 Required Environment Variables in Render

Go to your Render backend service → **Environment** tab and add/verify these variables:

### 1. Spring Profile (NEW - Add This!)
```
SPRING_PROFILES_ACTIVE=prod
```
**Purpose**: Activates `application-prod.yml` which uses PostgreSQL

### 2. Database URL (Already Set)
```
DATABASE_URL=postgresql://movie_database_74yy_user:0fqY6XGuY1ttS00Y2KEjnJbwHKXVI1pg@dpg-d3humhili9vc739910jg-a.oregon-postgres.render.com/movie_database_74yy
```
**Purpose**: PostgreSQL connection string

### 3. JWT Secret (Already Set)
```
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
```
**Purpose**: Secure JWT token generation

### 4. OMDb API Key (Already Set)
```
OMDB_API_KEY=f1223943
```
**Purpose**: Access to OMDb movie API

---

## 🔄 After Adding the Variable

1. **Save** the environment variables
2. **Redeploy** (Render auto-deploys on save)
3. **Wait** ~3-5 minutes for deployment
4. **Verify** in logs - you should see:
   ```
   HikariPool-1 - Added connection ... url=jdbc:postgresql://...
   ```
   Instead of:
   ```
   HikariPool-1 - Added connection ... url=jdbc:h2:mem:movieflix
   ```

---

## ✅ Benefits of Using PostgreSQL

| Feature | H2 (Current) | PostgreSQL (Better) |
|---------|--------------|---------------------|
| **Data Persistence** | ❌ Lost on restart | ✅ Persists across restarts |
| **Performance** | ⚡ Very fast | 🐢 Slower but persistent |
| **Production Ready** | ⚠️ Only for testing | ✅ Production database |
| **Scalability** | ❌ Single instance | ✅ Can scale |
| **Cache Survival** | ❌ Resets on redeploy | ✅ Survives redeploys |

---

## 🤔 H2 vs PostgreSQL Trade-offs

### Current Setup (H2 - In-Memory)
**Pros:**
- ⚡ Extremely fast
- 🆓 No external database needed
- 💾 Simple setup

**Cons:**
- ❌ Data lost on every restart/redeploy
- ❌ Cache resets frequently
- ❌ Not suitable for production

### Recommended Setup (PostgreSQL)
**Pros:**
- ✅ Data persists across restarts
- ✅ Production-grade database
- ✅ Cache survives redeploys
- ✅ Better for real-world use

**Cons:**
- 🐢 Slower (especially on Render free tier)
- 💵 Uses database quota (1GB free)
- 🔧 Slightly more complex

---

## 🎯 Recommendation

**For MVP/Demo**: H2 is fine (current setup)
- Fast response times
- Good for demonstrations
- Acceptable data loss

**For Production**: Switch to PostgreSQL (add `SPRING_PROFILES_ACTIVE=prod`)
- Data persistence
- Professional setup
- Real-world deployment

---

## 📝 Notes

- The PostgreSQL database is already created and running on Render
- The `application-prod.yml` configuration is already in the codebase
- Only need to activate it via environment variable
- No code changes required!

---

## 🔍 How to Verify Which Database is Active

Check the logs after deployment:

**H2 (In-Memory):**
```log
H2 console available at '/h2-console'
Database available at 'jdbc:h2:mem:movieflix'
```

**PostgreSQL:**
```log
HikariPool-1 - Added connection ... url=jdbc:postgresql://
No H2 console logs
```

---

**Decision is yours!** Both are already configured and working. 🚀

