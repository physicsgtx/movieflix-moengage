# 🚀 Quick Deployment Guide - MovieFlix

Your code is on GitHub! Now let's deploy it. Here are the **easiest and FREE** options:

---

## 🎯 Recommended: Deploy to Render (Easiest!)

### Why Render?
- ✅ **100% Free** tier available
- ✅ **Automatic deployments** from GitHub
- ✅ **No credit card** required
- ✅ **PostgreSQL included** (free)
- ✅ **Both backend and frontend** supported

### Backend Deployment (5 minutes)

1. **Go to Render**
   - Visit: https://render.com
   - Click **"Get Started"** and sign up with GitHub

2. **Create PostgreSQL Database**
   - Click **"New +"** → **"PostgreSQL"**
   - Name: `movieflix-db`
   - Plan: **Free**
   - Click **"Create Database"**
   - Copy the **Internal Database URL** (we'll need this)

3. **Deploy Backend**
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository: `physicsgtx/movieflix-moengage`
   - Configure:
     - **Name**: `movieflix-backend`
     - **Root Directory**: `movieflix-backend`
     - **Environment**: `Java`
     - **Build Command**: `mvn clean install -DskipTests`
     - **Start Command**: `java -jar target/movieflix-backend-1.0.0.jar`
     - **Plan**: Free

4. **Set Environment Variables**
   Click **"Advanced"** → **"Add Environment Variable"**:
   ```
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=[paste your PostgreSQL Internal URL here]
   JWT_SECRET=movieflix_super_secret_jwt_key_change_this_in_production_12345
   OMDB_API_KEY=f1223943
   ```

5. **Deploy**
   - Click **"Create Web Service"**
   - Wait 5-10 minutes for deployment
   - Your backend will be live at: `https://movieflix-backend.onrender.com`

### Frontend Deployment (3 minutes)

1. **Deploy Frontend**
   - Click **"New +"** → **"Static Site"**
   - Connect your GitHub repository: `physicsgtx/movieflix-moengage`
   - Configure:
     - **Name**: `movieflix-frontend`
     - **Root Directory**: `movieflix-frontend`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`

2. **Set Environment Variable**
   ```
   VITE_API_BASE_URL=https://movieflix-backend.onrender.com
   ```

3. **Deploy**
   - Click **"Create Static Site"**
   - Your frontend will be live at: `https://movieflix-frontend.onrender.com`

---

## 🚂 Alternative: Railway (Also Easy & Free)

### Backend + Database on Railway

1. **Sign Up**
   - Go to: https://railway.app
   - Sign up with GitHub

2. **New Project**
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose: `physicsgtx/movieflix-moengage`

3. **Add PostgreSQL**
   - In your project, click **"New"** → **"Database"** → **"PostgreSQL"**

4. **Configure Backend Service**
   - Click on your service
   - Go to **"Settings"**:
     - **Root Directory**: `movieflix-backend`
     - **Build Command**: `mvn clean install -DskipTests`
     - **Start Command**: `java -jar target/movieflix-backend-1.0.0.jar`

5. **Environment Variables**
   Go to **"Variables"** tab:
   ```
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=your_secret_key
   OMDB_API_KEY=f1223943
   PORT=8080
   ```

6. **Deploy** - Automatic!

### Frontend on Vercel (Best for React)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click **"Add New..."** → **"Project"**
   - Import `physicsgtx/movieflix-moengage`
   - **Root Directory**: `movieflix-frontend`
   - Framework: **Vite**

3. **Environment Variables**
   ```
   VITE_API_BASE_URL=https://your-backend-url.railway.app
   ```

4. **Deploy** - Click **"Deploy"**!

---

## 🐳 Local Docker Deployment

Already set up! Just run:

```bash
# Make sure you're in the project root
docker-compose up --build
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html

---

## 📋 Deployment Checklist

### Before Deploying:

- ✅ Code pushed to GitHub
- ✅ Environment variables ready
- ✅ OMDb API key available
- ✅ Database chosen (PostgreSQL for production)

### After Deploying:

- ✅ Test authentication (login/register)
- ✅ Test movie search
- ✅ Test admin features
- ✅ Check Swagger documentation
- ✅ Verify CSV download works
- ✅ Test on mobile

---

## 🔑 Environment Variables Summary

### Backend (.env or platform settings)
```bash
# Required
OMDB_API_KEY=f1223943
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Optional
SPRING_PROFILES_ACTIVE=prod
PORT=8080
```

### Frontend (.env or platform settings)
```bash
VITE_API_BASE_URL=https://your-backend-url.com
```

---

## 🎯 My Recommendation

**For Quick Demo:**
1. **Backend**: Deploy to **Render** (5 min setup)
2. **Frontend**: Deploy to **Vercel** (2 min setup)
3. **Database**: Use Render's free PostgreSQL

**Total Time**: ~10 minutes
**Cost**: $0 (completely free)

---

## 🆘 Troubleshooting

### Backend won't start
- Check environment variables are set
- Verify DATABASE_URL format
- Check build logs for errors

### Frontend can't connect to backend
- Verify VITE_API_BASE_URL is correct
- Check CORS settings in backend
- Ensure backend is deployed and running

### Database connection fails
- Verify DATABASE_URL is correct
- Check if database is running
- Ensure H2 is not being used in production

---

## 📱 Share Your Deployment

Once deployed, share:
- **Frontend URL**: https://movieflix-frontend.onrender.com
- **Backend API**: https://movieflix-backend.onrender.com
- **Swagger Docs**: https://movieflix-backend.onrender.com/swagger-ui.html

---

## 🎉 Next Steps

After deployment:
1. Update README.md with live demo links
2. Test all features
3. Share with MoEngage team
4. Add to your portfolio

**Good luck! 🚀**

---

**Need Help?**
- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs

