# 🎬 MovieFlix Frontend

Beautiful, modern React frontend for the MovieFlix Dashboard application.

## ✨ Features

- 🎨 **Modern UI/UX** - Clean, intuitive interface with smooth animations
- 🌓 **Dark Mode** - Toggle between light and dark themes
- 🔐 **Authentication** - JWT-based login/register with auto-redirect
- 🎬 **Movie Search** - Advanced search with filters (genre, year, rating)
- 📊 **Statistics Dashboard** - Interactive charts with genre distribution, ratings
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ⚡ **Fast & Optimized** - Vite-powered development with hot reload
- 🎭 **Movie Details** - Full movie information with beautiful cards
- 🔍 **Real-time Search** - Instant results as you type
- 🎯 **Pagination** - Navigate through large movie collections

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- MovieFlix Backend running on `http://localhost:8080`

### Installation

```bash
cd movieflix-frontend
npm install
```

### Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
movieflix-frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   │   ├── Navbar.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MovieGrid.jsx
│   │   ├── SearchBar.jsx
│   │   ├── Filters.jsx
│   │   ├── Stats.jsx
│   │   └── Loading.jsx
│   ├── pages/          # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── MovieDetails.jsx
│   │   └── Dashboard.jsx
│   ├── services/       # API services
│   │   └── api.js
│   ├── store/          # State management
│   │   └── authStore.js
│   ├── utils/          # Utility functions
│   │   └── constants.js
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎯 Key Features Explained

### Authentication
- Login/Register forms with validation
- JWT token storage in localStorage
- Auto-redirect to login if not authenticated
- Protected routes

### Movie Search
- Search by title
- Filter by genre (multi-select)
- Filter by year range
- Filter by minimum rating
- Sort by rating, year, title
- Pagination support

### Statistics Dashboard
- Genre distribution pie chart
- Average rating by genre bar chart
- Average runtime by year line chart
- Overall statistics cards

### Dark Mode
- Toggle in navbar
- Persists in localStorage
- Smooth transitions

## 🎨 Technologies Used

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Routing
- **Axios** - HTTP client
- **Zustand** - State management
- **Recharts** - Charts and graphs
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications

## 📝 Environment Variables

Create a `.env` file (optional):

```env
VITE_API_BASE_URL=http://localhost:8080
```

## 🔐 Default Credentials

**Admin:**
- Username: `admin`
- Password: `admin123`

**User:**
- Username: `user`
- Password: `user123`

## 📱 Screenshots

### Home Page
- Hero section with search
- Featured movies
- Quick stats

### Movies Page
- Grid layout with movie cards
- Advanced filters sidebar
- Pagination

### Movie Details
- Full movie information
- Poster and metadata
- Cast and crew

### Statistics Dashboard
- Interactive charts
- Genre distribution
- Rating analytics

## 🎯 API Integration

The frontend connects to the MovieFlix backend:

**Base URL:** `http://localhost:8080`

**Endpoints Used:**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/movies` - Search and filter movies
- `GET /api/movies/:id` - Get movie details
- `GET /api/stats` - Get statistics

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 💡 Tips

1. **Dark Mode** - Click moon/sun icon in navbar
2. **Quick Search** - Start typing in search bar for instant results
3. **Filters** - Use sidebar to refine your search
4. **Movie Details** - Click any movie card for full details
5. **Statistics** - View analytics in the Dashboard

## 🐛 Troubleshooting

### Backend Connection Issues
- Ensure backend is running on `http://localhost:8080`
- Check CORS settings in backend
- Verify API endpoints are accessible

### Build Errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
Change port in `vite.config.js`:
```js
server: {
  port: 3001  // Change to any available port
}
```

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for learning or production!

---

**Made with ❤️ for MoEngage Assignment**

