# Employee Portal

The project is split into two independently runnable applications:

- `frontend/` contains the React and Vite application.
- `backend/` contains the Express API and MongoDB models.

## Run locally

Use separate terminals from the repository root.

Start the frontend:

```powershell
cd frontend
npm install
npm run dev
```

Start the backend:

```powershell
cd backend
npm install
npm start
```

The backend listens on port `5000` by default and connects to MongoDB using
`MONGO_URI` from `backend/.env` (or its configured default).

## Deployment configuration

The frontend uses `https://employee-management-system-sandy.vercel.app/api` by
default. Set `VITE_API_BASE_URL` in the frontend deployment to override it.

The backend allows requests from
`https://frontend-tau-henna-41.vercel.app` by default. Set `FRONTEND_URL` in
the backend deployment if the frontend domain changes. Configure `MONGO_URI`
in the backend deployment with a reachable MongoDB connection string; the local
`mongodb://localhost:27017/EMS` address is not available to a hosted deployment.
