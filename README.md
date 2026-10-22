# IPAY — Amazon Clone (Frontend)

React single-page application (SPA) for **IPAY** ("Incredible Project Aspnet Yes"), an Amazon-style e-commerce platform built as a team course project. It is the client for the [IPAY backend](https://github.com/ThisIsEngineerGaming/IPAY_backend), an ASP.NET Core Web API that handles authentication, the product catalog, carts and orders, ratings, a video catalog and role-based administration.

## Links

| Resource | URL |
|---|---|
| Live frontend | https://ipay-client.onrender.com/ |
| Backend repository | https://github.com/ThisIsEngineerGaming/IPAY_backend |
| API reference (Scalar registry) | https://registry.scalar.com/@default-team-wbd0w/apis/fat-api@v1#tag/admin |
| Backend code documentation (Doxygen) | https://ipay-doxygen-documentation.onrender.com/ |
| Requirements (SRS, in Ukrainian) | https://github.com/ysantonyance/IPAY_SRS |

## Tech stack

- **Framework:** React 19
- **Build tool:** Vite
- **Routing:** React Router 7
- **HTTP:** Axios, with a shared instance that attaches the access token to every request
- **Styling:** Tailwind CSS 4 (via `@tailwindcss/vite`)
- **Linting:** Oxlint
- **Hosting:** Render

## Project structure

```
ipay_client/
├── index.html                 # Single HTML page with <div id="root">
├── vite.config.js
├── package.json
├── public/                    # Static assets served as-is
└── src/
    ├── main.jsx               # Entry point: mounts <App /> inside <BrowserRouter />
    ├── App.jsx                # Route table and layouts (MainLayout, CleanLayout)
    ├── api/                   # One module per backend area, all built on api.js
    │   ├── api.js             # Axios instance + request/response interceptors
    │   ├── authApi.js
    │   ├── productsApi.js
    │   ├── categoriesApi.js
    │   ├── cartApi.js
    │   ├── ordersApi.js
    │   ├── filmsApi.js
    │   ├── seriesApi.js
    │   ├── episodesApi.js
    │   ├── genresApi.js
    │   └── adminApi.js
    ├── components/
    │   └── basic/             # Header, Footer, Button, Modal, ErrorMessage, LoadingSpinner, PaginationLoading
    ├── hooks/                 # useAuth, useCart, useProducts, useFilms, useAdmin
    └── pages/                 # One component per route
```

## How it talks to the backend

All requests go through the Axios instance in `src/api/api.js`:

- **Request interceptor:** reads `authToken` from `localStorage` and sends it as `Authorization: Bearer <token>`.
- **Response interceptor:** returns `response.data`, so API modules resolve with the payload directly. On a `401` it removes the stored token and redirects to `/login`.
- **API modules:** each file in `src/api/` groups the calls for one backend area (for example `authApi.login(credentials)`), so components and hooks never build URLs themselves.

The backend login response has the shape `{ accessToken, refreshToken, expiresAt, tokenType, user }`. When emailed 2FA is enabled, login first returns `{ twoFactorRequired, challengeId, maskedEmail }` and the session is only issued after the verify-code step. The full route list is in the [API reference](https://registry.scalar.com/@default-team-wbd0w/apis/fat-api@v1#tag/admin).

## Project status

| Area | State |
|---|---|
| Vite, React, Tailwind and Router setup | Done |
| Axios instance with token and 401 handling | Done |
| API modules for auth, products, categories, cart, orders, films, series, episodes, genres, admin | Created |
| Shared layouts (main with header and footer, clean without) | Done |
| Home route (`/`) | Enabled |
| Other pages and routes | Files exist, routes are commented out in `App.jsx` |
| Hooks (`useAuth`, `useCart`, ...) | Files exist |
| Refresh-token handling | Not implemented: an expired access token logs the user out |

### Planned routes

These pages exist as files but are commented out in `App.jsx`:

| Route | Page |
|---|---|
| `/products/:id` | Product details |
| `/video/:id`, `/amazon-video` | Video details, video catalog |
| `/cart` | Cart |
| `/your-orders` | Orders |
| `/your-account`, `/customer-preferences` | Account, preferences |
| `/sell` | Seller page |
| `/labordaysale`, `/coupons`, `/gift-cards`, `/registries`, `/buyagain`, `/history`, `/contact-us`, `/yourstore/home` | Storefront pages |
| `/login`, `/register` | Authentication (clean layout) |
| `/admin` | Administration (clean layout) |

## Getting started

### Prerequisites

- A current LTS release of [Node.js](https://nodejs.org/) and npm
- The [IPAY backend](https://github.com/ThisIsEngineerGaming/IPAY_backend), running locally or deployed. Locally it needs the [.NET 10 SDK](https://dotnet.microsoft.com/download)

### Install

```bash
git clone https://github.com/ysantonyance/ipay_client
cd ipay_client
npm install
```

### Connect to the backend

The API base URL is set in `src/api/api.js`:

```js
const api = axios.create({
    baseURL: 'backendurl', // replace with your backend's /api URL
    timeout: 10000,
});
```

Replace the placeholder with your backend's API URL, for example `https://localhost:7137/api` when running the backend locally.

Start the backend from its repository:

```bash
dotnet run --project src/IPAY.WebApi --launch-profile https
```

### Run locally

```bash
npm run dev
```

Vite prints the local URL to open.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run Oxlint |

## Deployment

The frontend is hosted on Render at https://ipay-client.onrender.com/. Build it with `npm run build` and publish the `dist/` folder. As with any single-page app using client-side routing, the host must serve `index.html` for unknown paths so deep links such as `/cart` work after a refresh.

## Related projects

- **Backend:** [IPAY_backend](https://github.com/ThisIsEngineerGaming/IPAY_backend), the ASP.NET Core Web API this client consumes
- **Requirements:** the [SRS](https://github.com/ysantonyance/IPAY_SRS) lists functional and non-functional requirements, use cases, risks and success metrics

## Team

Built by the IPAY team as a course project for ASP.NET Core.
