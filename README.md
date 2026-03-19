# Vite-Server-Express

A demonstration project showcasing the integration of Express.js as middleware within a Vite development server. This project uses TaffyDB as an in-memory database to store users and posts fetched from the JSONPlaceholder API.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [File Structure](#file-structure)
- [Getting Started](#getting-started)
- [Development vs Production](#development-vs-production)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Configuration](#configuration)

---

## Project Overview

This project demonstrates a powerful pattern for combining the fast HMR (Hot Module Replacement) of Vite's development server with the robustness of Express.js for backend API handling. The architecture allows developers to benefit from Vite's superior DX (Developer Experience) while maintaining full Express capabilities.

### Key Features

- **Express as Vite Middleware**: Seamlessly integrates Express into the Vite development server
- **TaffyDB In-Memory Database**: Fast, lightweight JavaScript database for storing API data
- **RESTful API**: Complete CRUD-style endpoints for users and posts
- **Dual Environment Support**: Different behaviors for development and production modes
- **Comprehensive Error Handling**: Graceful error handling at multiple levels

---

## Architecture

The project follows a layered architecture where Vite acts as the entry point, loading Express as middleware during development.

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Vite Dev Server                            │
│                           (Port 3000)                                │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │      expressPlugin.js        │
                    │   (Custom Vite Plugin)       │
                    │   - Loads server.js via      │
                    │     ssrLoadModule()          │
                    │   - Mounts Express as        │
                    │     middleware               │
                    └───────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │         server.js            │
                    │   - Express Application      │
                    │   - CORS Configuration        │
                    │   - Static File Serving      │
                    │   - Global Error Handling     │
                    └───────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │           api.js             │
                    │   - REST API Router          │
                    │   - TaffyDB Integration       │
                    │   - User/Post Endpoints       │
                    └───────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │         taffy.js            │
                    │   (In-Memory Database)       │
                    │   - usersDb                  │
                    │   - postsDb                  │
                    └───────────────────────────────┘
```

### Request Flow

#### Development Mode
```
Browser Request
      │
      ▼
┌─────────────────┐
│  Vite Dev       │ ── HMR, File Serving ──► Static Assets
│  Server         │
└────────┬────────┘
         │ /api/* routes
         ▼
┌─────────────────┐
│  Express        │ ── CORS ──► API Response
│  Middleware     │
└─────────────────┘
```

#### Production Mode
```
Browser Request
      │
      ▼
┌─────────────────┐
│  Express        │ ── Static Files ──► public/
│  Server         │
└────────┬────────┘
         │ /api/* routes
         ▼
┌─────────────────┐
│  API Router     │ ── JSON Response ──► TaffyDB
└─────────────────┘
```

---

## File Structure

```
vite-server-express/
├── express-plugin.js    # Custom Vite plugin that mounts Express
├── server.js            # Express server configuration
├── api.js               # REST API routes and database operations
├── taffy.js             # TaffyDB library (vendored)
├── vite.config.js       # Vite configuration
├── package.json         # Project dependencies and scripts
└── README.md            # This documentation
```

### File Descriptions

| File | Purpose |
|------|---------|
| [`vite.config.js`](vite.config.js) | Configures Vite with the custom express plugin and server port |
| [`express-plugin.js`](express-plugin.js) | Custom Vite plugin that loads Express and mounts it as middleware |
| [`server.js`](server.js) | Express application setup with CORS, routing, and error handling |
| [`api.js`](api.js) | Express router containing all REST API endpoints |
| [`taffy.js`](taffy.js) | TaffyDB library - a JavaScript-based in-memory database |

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd vite-server-express
   ```

2. Install dependencies using pnpm:
   ```bash
   pnpm install
   ```

   Or using npm:
   ```bash
   npm install
   ```

### Running the Project

#### Development Mode

Start the Vite development server with Express middleware:

```bash
pnpm run dev
# or
npm run dev
```

The server will start at `http://localhost:3000`. In development mode:
- Vite handles HMR and asset serving
- Express intercepts `/api` routes
- Changes to API files require a server restart (Vite doesn't restart for backend changes)

#### Production Build

1. Build the project:
   ```bash
   pnpm run build
   ```

2. Start the production server:
   ```bash
   pnpm start
   ```

The production server runs on `http://localhost:3000` serving:
- Static files from the `public/` directory
- API routes from the Express application

---

## Development vs Production

| Feature | Development (`npm run dev`) | Production (`npm start`) |
|---------|----------------------------|--------------------------|
| **Server** | Vite Dev Server | Standalone Express |
| **HMR** | Enabled for frontend assets | Not available |
| **Port** | 3000 (configurable) | 3000 or `PORT` env var |
| **Static Files** | Served by Vite | Served by Express from `public/` |
| **API Routes** | Handled by Express middleware | Handled by Express directly |
| **CORS** | Enabled for all origins | Enabled for all origins |
| **Error Stack** | Visible in console | Hidden, JSON response only |

---

## API Endpoints

The REST API provides the following endpoints. All endpoints are prefixed with `/api`.

### Base URL

```
http://localhost:3000/api
```

### Available Endpoints

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api` | GET | API health check | `{ "message": "Hello from Express API!" }` |
| `/api/users` | GET | Get all users | Array of user objects |
| `/api/users/:id` | GET | Get user by ID | Single user object |
| `/api/users/:id/posts` | GET | Get posts by user | Array of post objects |
| `/api/posts` | GET | Get all posts | Array of post objects |
| `/api/posts/:id` | GET | Get post by ID | Post object with author |

### Example Requests

#### Get All Users

```bash
curl http://localhost:3000/api/users
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    ...
  },
  ...
]
```

#### Get User by ID

```bash
curl http://localhost:3000/api/users/1
```

**Response:**
```json
{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "address": {
    "street": "Kulas Light",
    "suite": "Apt. 556",
    "city": "Gwenborough",
    "zipcode": "92998-3874"
  },
  "phone": "1-770-736-0984 x56442",
  "website": "hildegard.org",
  "company": {
    "name": "Romaguera-Crona",
    "catchPhrase": "Multi-layered client-server neural-net"
  }
}
```

#### Get Posts by User

```bash
curl http://localhost:3000/api/users/1/posts
```

**Response:**
```json
[
  {
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident...",
    "body": "quia et suscipit\nsuscipit recusandae..."
  },
  ...
]
```

#### Get Single Post with Author

```bash
curl http://localhost:3000/api/posts/1
```

**Response:**
```json
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident...",
  "body": "quia et suscipit\nsuscipit recusandae...",
  "author": {
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    ...
  }
}
```

### Error Responses

| Status Code | Description | Example Response |
|-------------|-------------|-------------------|
| 400 | Invalid ID parameter | `{ "error": "Invalid user ID" }` |
| 404 | Resource not found | `{ "error": "User not found" }` |
| 500 | Server error | `{ "error": "Failed to fetch users" }` |

---

## Error Handling

The project implements multiple layers of error handling to ensure reliability:

### 1. Database Initialization ([`api.js`](api.js:9-29))

```javascript
const init = async () => {
    try {
        // Fetch from JSONPlaceholder API
        // ...
    } catch (error) {
        console.error('Error initializing API data:', error.message);
        console.warn('Continuing with empty databases');
    }
}
```

- **Behavior**: If the JSONPlaceholder API fails during startup, the application continues with empty databases
- **Impact**: API endpoints return empty arrays rather than crashing

### 2. Route-Level Error Handling ([`api.js`](api.js:37-105))

Each route handler includes try/catch blocks:

```javascript
router.get("/users", async (req, res) => {
    try {
        res.json(usersDb().get());
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
```

- **Behavior**: Catches errors during database operations
- **Response**: Returns JSON error with appropriate status code

### 3. Input Validation ([`api.js`](api.js:48-51))

```javascript
const userId = parseInt(req.params.id);
if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
}
```

- **Behavior**: Validates that route parameters are valid integers
- **Response**: Returns 400 Bad Request for invalid input

### 4. Global Error Middleware ([`server.js`](server.js:30-36))

```javascript
app.use((err, req, res, next) => {
    console.error('Server Error:', err.message);
    res.status(err.status || 500).json({ 
        error: err.message || 'Internal Server Error' 
    });
});
```

- **Behavior**: Catches any unhandled errors in the Express pipeline
- **Response**: Returns JSON error response with appropriate status code

### 5. Plugin Error Handling ([`express-plugin.js`](express-plugin.js:28-31))

```javascript
try {
    const module = await server.ssrLoadModule(entry);
    // ...
} catch (error) {
    console.error('Error loading Express module:', error.message);
    console.error('Make sure your Express server is properly exporting the app');
}
```

- **Behavior**: Handles errors when loading the Express module in development
- **Impact**: Provides clear error messages if the Express setup is incorrect

---

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `cross-env NODE_ENV=development vite` | Starts Vite dev server with Express middleware |
| `build` | `vite build` | Builds for production, outputs to `dist/` |
| `start` | `cross-env NODE_ENV=production node dist/server.js` | Starts production Express server |
| `test` | `echo "Error: no test specified" && exit 1` | Placeholder for test script |

---

## Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| [express](https://expressjs.com/) | ^5.2.1 | Web framework for API and server |
| [cors](https://github.com/expressjs/cors) | ^2.8.5 | Cross-origin resource sharing middleware |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| [vite](https://vitejs.dev/) | ^8.0.0 | Build tool and development server |
| [cross-env](https://github.com/kentcdodds/cross-env) | ^10.1.0 | Set environment variables cross-platform |

### Vendored Dependencies

| Package | Source | Purpose |
|---------|--------|---------|
| [taffy.js](taffy.js) | Local file | In-memory JavaScript database |

---

## Configuration

### Vite Configuration ([`vite.config.js`](vite.config.js))

```javascript
import { defineConfig } from "vite";
import { expressPlugin } from "./express-plugin.js";

export default defineConfig({
    plugins: [expressPlugin({ entry: "./server.js" })],
    server: {
        port: 3000,
    }
});
```

### Express Plugin Options

The `expressPlugin` accepts the following options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entry` | string | `"./server.js"` | Path to the Express server entry file |
| `appName` | string | `"app"` | Name of the exported Express app in the entry file |

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Environment mode (`development` or `production`) |
| `PORT` | `3000` | Server port |

---

## Data Source

The project fetches initial data from [JSONPlaceholder](https://jsonplaceholder.typicode.com/), a free fake API for testing:

- **Users Endpoint**: `https://jsonplaceholder.typicode.com/users`
- **Posts Endpoint**: `https://jsonplaceholder.typicode.com/posts`

This data is loaded into TaffyDB at startup and maintained in memory during the server session.

---

## License

ISC
