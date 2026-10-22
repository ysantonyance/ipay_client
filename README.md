# IPAY — Amazon Clone (Frontend)

React single-page application for **IPAY** ("Incredible Project Aspnet Yes"), an Amazon-style e-commerce platform built as a team course project. It is the client for the [IPAY backend](https://github.com/ThisIsEngineerGaming/IPAY_backend) and covers sign-in, the product catalog, cart and orders, ratings, a video catalog (series, episodes) and role-based administration.

## Links

| Resource | URL |
|---|---|
| Live frontend | https://ipay-client.onrender.com/ |
| Backend repository | https://github.com/ThisIsEngineerGaming/IPAY_backend |
| API reference (Scalar registry) | https://registry.scalar.com/@default-team-wbd0w/apis/fat-api@v1#tag/admin |
| Backend code documentation (Doxygen) | https://ipay-doxygen-documentation.onrender.com/ |
| Requirements (SRS, in Ukrainian) | https://github.com/ysantonyance/IPAY_SRS |

## Tech stack

- **Framework:** React 19 (function components and hooks)
- **Build tool:** Vite
- **Routing:** React Router 7
- **HTTP:** Axios, with a shared instance that attaches the access token to every request
- **Styling:** Tailwind CSS 4 (via `@tailwindcss/vite`)
- **Linting:** Oxlint
- **Deployment:** Render

## Project structure

```
ipay_client/
├── index.html
├── vite.config.js
├── package.json
├── public/                    # Static assets served as-is
└── src/
    ├── main.jsx               # Entry point: mounts <App /> inside <BrowserRouter />
    ├── App.jsx                # Route table and layouts (MainLayout, CleanLayout)
    ├── api/                   # One module per backend area, all built on api.js
    │   ├── api.js             # Axios instance + request/response interceptors
    │   ├── authApi.js         # Login, register, logout, profile
    │   ├── productsApi.js     # Products
    │   ├── categoriesApi.js   # Categories
    │   ├── cartApi.js         # Cart
    │   ├── ordersApi.js       # Orders
    │   ├── filmsApi.js        # Films
    │   ├── seriesApi.js       # Series
    │   ├── episodesApi.js     # Episodes
    │   ├── genresApi.js       # Genres
    │   └── adminApi.js        # Administration
    ├── components/
    │   └── basic/             # Header, Footer, Button, Modal, ErrorMessage, LoadingSpinner, PaginationLoading
    ├── hooks/                 # useAuth, useCart, useProducts, useFilms, useAdmin
    └── pages/                 # One component per route
```

## Features

- **Authentication:** login and registration screens, token-based sessions, automatic redirect to `/login` when a session is no longer valid
- **Catalog:** product listing and product detail pages
- **Cart and orders:** cart page and order history
- **Account:** profile and customer preferences
- **Video catalog:** video browsing and detail pages
- **Selling:** seller page for creating and managing your own products
- **Administration:** admin dashboard for users, roles and products
- **Storefront pages:** today's deals, coupons, gift cards, registries, buy again, browsing history and customer service
- **Layouts:** a main layout (header and footer) for the store, and a clean layout without them for login, registration and admin

### Pages and routes

| Route | Page |
|---|---|
| `/` | Home |
| `/products/:id` | Product details |
| `/video/:id`, `/amazon-video` | Video details, video catalog |
| `/cart` | Cart |
| `/your-orders` | Orders |
| `/your-account`, `/customer-preferences` | Account, preferences |
| `/sell` | Seller page |
| `/labordaysale`, `/coupons`, `/gift-cards`, `/registries`, `/buyagain`, `/history`, `/contact-us`, `/yourstore/home` | Storefront pages |
| `/login`, `/register` | Authentication (clean layout) |
| `/admin` | Administration (clean layout) |

## How it talks to the backend

All requests go through the Axios instance in `src/api/api.js`:

- **Request interceptor:** reads `authToken` from `localStorage` and sends it as `Authorization: Bearer <accessToken>`.
- **Response interceptor:** unwraps `response.data`, so API modules return the payload directly. On a `401`, it clears the stored token and redirects to `/login`.
- **API modules:** each file in `src/api/` groups the calls for one backend area (for example `authApi.login(credentials)`), so components and hooks never build URLs themselves.

The backend login response has the shape `{ accessToken, refreshToken, expiresAt, tokenType, user }`. When emailed 2FA is enabled, login first returns `{ twoFactorRequired, challengeId, maskedEmail }` and the session is only issued after the verify-code step. See the [API reference](https://registry.scalar.com/@default-team-wbd0w/apis/fat-api@v1#tag/admin) for every route.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or newer and npm
- The [IPAY backend](https://github.com/ThisIsEngineerGaming/IPAY_backend) (local or deployed), which needs the [.NET 10 SDK](https://dotnet.microsoft.com/download)

### Install

```bash
git clone https://github.com/ysantonyance/ipay_client
cd ipay_client
npm install
```

### Configuration

Environment variables live in `.env.local` (git-ignored). Do not commit secrets.

| Variable | Used when | Purpose |
|---|---|---|
| `IPAY_BACKEND_PATH` | Local development | Path to the backend's `IPAY.WebApi` folder, so Vite can start it for you |
| `START_BACKEND` | Local development | Set to `false` if you start the backend yourself |
| `VITE_API_URL` | Production build | Base URL of the deployed API, for example `https://your-backend.example.com/api` |

Example `.env.local`:

```
IPAY_BACKEND_PATH=C:\path\to\IPAY_backend\src\IPAY.WebApi
```

### Run locally

```bash
npm run dev
```

Vite starts the backend (unless `START_BACKEND=false`) and proxies `/api` to `https://localhost:7137`. The client opens at the URL Vite prints, usually `http://localhost:5173`.

To run the backend yourself instead:

```bash
dotnet run --project src/IPAY.WebApi --launch-profile https
```

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run Oxlint |

## Deployment

The frontend is hosted on Render. Build it with `npm run build` and publish the `dist/` folder, with `VITE_API_URL` set to the deployed backend at build time. Because this is a single-page app using client-side routing, configure the host to rewrite all paths to `index.html`.

## Related projects

- **Backend:** [IPAY_backend](https://github.com/ThisIsEngineerGaming/IPAY_backend), the ASP.NET Core Web API this client consumes
- **Requirements:** the [SRS](https://github.com/ysantonyance/IPAY_SRS) lists functional and non-functional requirements, use cases, risks and success metrics

## Team

Built by the IPAY team as a course project for ASP.NET Core.
