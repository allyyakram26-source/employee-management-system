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
