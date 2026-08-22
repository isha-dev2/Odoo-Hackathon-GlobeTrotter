# 🌍 GlobeTrotter — Empowering Personalized Multi-City Travel Planning

![GlobeTrotter Banner](https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400)

> **Odoo Hackathon 2026 Submission**  
> An intelligent, collaborative, end-to-end multi-city travel planning platform combining GIS interactive mapping, day-wise master itineraries, live financial budget intelligence, and AI-assisted journey synthesis.

---

## 🎯 Problem Statement & Core Mission
Planning multi-city journeys is traditionally chaotic and fragmented across disjointed spreadsheets, map bookmarks, currency converters, and travel guides. 

**GlobeTrotter** solves this by delivering an integrated, intuitive, and responsive workspace allowing travelers to:
* 🗺️ **Design Multi-City Topologies**: Add, remove, and seamlessly reorder destinations with automatic transit estimations.
* 📍 **GIS Real-World World Map API**: Visualize global and Indian routes using OpenStreetMap, CartoDB Voyager, and Satellite layers with GPS coordinates.
* 💰 **Financial Budget Intelligence**: Multi-segment progress meters with category breakdown (Stays, Transport, Activities, Dining) and instant over-budget alerts.
* 💱 **Multi-Currency Engine**: Default **₹ INR (Indian Rupee)** with instant real-time conversion to **$ USD**, **€ EUR**, **£ GBP**, and **¥ JPY**.
* 🤖 **AI Smart Travel Agent**: Natural language itinerary generation tailored for budget limits and durations.
* 👥 **Collaborative & Shareable**: Live online planner tickers, shareable public links, and 1-click **"Clone / Copy Trip"** functionality.

---

## 🚀 Key Feature Matrix

| Feature Module | Description & Capabilities |
|---|---|
| 📊 **Clean Executive Dashboard** | Live stats, active trip preview cards, quick tool launchers, and trending destination spotlights. |
| 🛠️ **Interactive Trip Builder** | Drag & reorder stops, instant popular city presets (+ Jaipur, + Goa, + Kerala, + Dubai), and live budget totals. |
| 📋 **Master Itinerary Guide** | Day-by-day journey flow with category badges, duration chips, transit connectors, and checklist tracking. |
| 🗺️ **GIS Interactive World Map** | Real-world Leaflet vector tiles, GPS coordinates, interactive numbered pins, and animated flight paths. |
| 📅 **Visual Timeline & Calendar** | Dual-mode schedule visualizer (Vertical Day Flow with simulated weather + Monthly Interactive Calendar Grid). |
| 💰 **Budget & Expense Analyzer** | Stacked visual expense breakdown with daily burn rate calculations and overdraft warnings. |
| 🏙️ **City & Activity Explorers** | Filterable catalogs across Indian and global destinations with 1-click "Add to Itinerary". |
| 🔗 **Community & Public Showcase** | Public read-only itinerary viewing with direct URL copy and 1-click account cloning. |
| 🛡️ **Admin & Platform Telemetry** | Active travelers monitor, database connection health, and top booked destinations analytics. |

---

## 🏗️ System Architecture & Tech Stack

```
GlobeTrotter Architecture
├── Frontend (React 18 + Vite)
│   ├── Leaflet GIS OpenStreetMap Engine
│   ├── Multi-Currency Locale Formatter (en-IN / en-US)
│   ├── Hash-Synchronized Reactive State Store
│   └── High-Contrast Tailored Design System
│
├── Backend (Node.js + Express)
│   ├── JWT Authentication & Access Control
│   ├── Trip, Stop & Activity Controllers
│   ├── AI Smart Travel Agent Generator Engine
│   └── Platform Telemetry & Health Checks
│
└── Database (PostgreSQL + Prisma ORM)
    └── Normalized Schema: Users, Trips, Stops, Cities, Activities, Bookings
```

---

## ⚡ Quick Start & Installation

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **PostgreSQL** (or run with built-in client fallbacks)

### 1. Clone Repository
```bash
git clone https://github.com/isha-dev2/Odoo-Hackathon-GlobeTrotter.git
cd Odoo-Hackathon-GlobeTrotter
```

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npm run dev
# Backend starts on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
# Frontend starts on http://localhost:3000
```

### 4. Docker 1-Click Deployment (Optional)
```bash
docker-compose up --build
```

---

## 📄 Automated Export Features
* **Export JSON**: Complete structured data model download.
* **Export CSV**: Spreadsheet-ready table breakdown of all stops, activities, and expenses.
* **Print / PDF**: Clean formatted printable itinerary guide.

---

## 🛡️ License
Built with ❤️ for the **Odoo Hackathon 2026**.
