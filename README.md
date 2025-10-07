# 🎬 MovieFlix - Complete Movie Discovery Platform

A full-stack movie discovery application with Spring Boot backend and React frontend, featuring advanced search, JWT authentication, and interactive analytics.

## 🌐 Live Application

**🚀 [Try MovieFlix Now](https://movieflix-moengage-frontend.onrender.com)** - Live React Frontend

**📚 [API Documentation](https://movieflix-moengage.onrender.com/swagger-ui/index.html)** - Interactive Swagger UI

**🔧 [Backend API](https://movieflix-moengage.onrender.com)** - Spring Boot REST API

## 📁 Project Structure

```
movieflix-moengage/
├── movieflix-backend/          # Spring Boot REST API
│   ├── src/
│   ├── pom.xml
│   └── README.md
│
├── movieflix-frontend/         # React + Vite frontend
│   ├── src/
│   ├── package.json
│   └── README.md
│
├── README.md                   # This file
├── API_EXAMPLES.md             # API usage examples
├── GETTING_STARTED.md          # Quick start guide
├── SWAGGER_GUIDE.md            # API documentation guide
└── example.env                  # Environment variables template
```

## 🚀 Quick Start

### Option 1: Try Live Application (Easiest)

**🌐 [Access Live App](https://movieflix-moengage-frontend.onrender.com)** - No setup required!

**📚 [View API Docs](https://movieflix-moengage.onrender.com/swagger-ui/index.html)** - Interactive documentation

#### 🎯 Live Demo Features
- **30+ Popular Movies** pre-loaded on startup
- **Multi-select Genre Filter** for advanced searching
- **Netflix-style UI** with movie collage hero
- **Interactive Analytics** dashboard with charts
- **Admin Panel** (login: `admin` / `admin123`)
- **CSV Export** functionality
- **Real-time Search** with OMDb API integration

### Option 2: Run Locally

#### Backend

```bash
cd movieflix-backend
mvn spring-boot:run
```

#### Frontend

```bash
cd movieflix-frontend
npm install
npm run dev
```

## ✨ Features

### Backend
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **OMDb API Integration** - Real-time movie data
- ✅ **Advanced Search** - Filter by genre, year, rating
- ✅ **Smart Caching** - Fast local movie database
- ✅ **Admin Management** - Update/delete movies
- ✅ **Analytics API** - Genre distribution, ratings
- ✅ **Swagger Documentation** - Interactive API docs

### Frontend
- ✅ **Netflix-Style UI** - Beautiful movie collage hero
- ✅ **Advanced Filters** - Sort, search, filter with ease
- ✅ **Interactive Dashboard** - Charts and statistics
- ✅ **Dark Mode** - Full theme support
- ✅ **Pagination** - Smart page navigation
- ✅ **CSV Export** - Download movie data
- ✅ **Admin Panel** - Edit/delete movies inline
- ✅ **Responsive Design** - Mobile-first approach

## 🔐 Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| User | `user` | `user123` |

## 🛠️ Technology Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security + JWT
- PostgreSQL / H2
- Maven
- Swagger/OpenAPI

### Frontend
- React 18
- Vite
- Tailwind CSS
- Recharts
- Zustand
- React Router

## 📚 Documentation

- [Backend README](./movieflix-backend/README.md) - Backend setup and API details
- [Frontend README](./movieflix-frontend/README.md) - Frontend setup and features
- [API Examples](./API_EXAMPLES.md) - cURL examples for all endpoints
- [Swagger Guide](./SWAGGER_GUIDE.md) - How to use Swagger UI
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Complete production deployment instructions

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token

### Movies
- `GET /api/movies` - Search movies with filters
- `GET /api/movies/{id}` - Get movie details

### Statistics
- `GET /api/stats` - Get movie analytics

### Admin (Requires ADMIN role)
- `PUT /api/admin/movies/{id}` - Update movie
- `DELETE /api/admin/movies/{id}` - Delete movie

## 🔧 Environment Variables

### Backend
```bash
OMDB_API_KEY=your_omdb_api_key
JWT_SECRET=your_jwt_secret_key
DATABASE_URL=postgresql://localhost:5432/movieflix
PORT=8080
```

### Frontend
```bash
VITE_API_BASE_URL=http://localhost:8080
```

## 📦 Build for Production

### Backend
```bash
cd movieflix-backend
mvn clean package -DskipTests
java -jar target/movieflix-backend-1.0.0.jar
```

### Frontend
```bash
cd movieflix-frontend
npm run build
# Build output in dist/
```

## 🎯 Key Features Showcase

### 1. Netflix-Style Hero
Beautiful movie collage with gradient overlays and smooth animations

### 2. Advanced Movie Search
- Real-time search with debouncing
- Multiple filters (genre, year, rating)
- Sort by title, year, rating, runtime
- Interactive rating slider

### 3. Analytics Dashboard
- Genre distribution with pie chart and legend
- Average rating by genre with gradient bars
- Top-rated genres showcase
- Rating scale reference

### 4. Admin Features
- Inline edit buttons on movie cards
- Comprehensive edit modal with all fields
- Delete with confirmation
- Role-based access control

### 5. CSV Export
- Download complete movie database
- Includes all fields
- Proper CSV formatting
- Date-stamped filenames

## 🤝 Contributing

This project is part of the MoEngage assignment. For questions or issues, please contact the development team.

## 📄 License

This project is developed as part of the MoEngage technical assessment.

## 🙏 Acknowledgments

- **OMDb API** for movie data
- **MoEngage** for the opportunity
- **Spring Boot** and **React** communities for excellent documentation

---

**Made with ❤️ for MoEngage**
