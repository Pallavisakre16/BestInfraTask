## Local Setup

### Backend

1. Go to sibling backend folder: `../backend/`.
2. Install packages:

```bash
npm install
```

3. Use `../backend/.env`.
4. Start the backend:

```bash
npm run dev
```

### Frontend

1. In the project root, create `.env` from `.env.example`.
2. Set:

```txt
EXPO_PUBLIC_API_URL=https://bestinfratask.onrender.com/api
```

3. Start Expo:

```bash
npm start
```

## Render Setup

Create a new Web Service from the sibling `backend/` folder, not from `bestInfra/`.

Use these settings:

```txt
Build Command: npm install
Start Command: npm start
```

Add these environment variables in Render:

```txt
PORT=10000
MONGO_URI=mongodb+srv://pallavisakre4461_db_user:VbMKI16ESgzeiL29@cluster0.2ri7bqs.mongodb.net/bestinfra?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=CHANGE_THIS_ON_RENDER
JWT_EXPIRES_IN=7d
```

## Frontend Production API URL

When your Render backend is deployed, set the frontend API URL to:

```txt
EXPO_PUBLIC_API_URL=https://bestinfratask.onrender.com/api
```

## Notes

1. MongoDB Atlas must have:
   `Database User`: `pallavisakre4461_db_user`
2. Atlas `Network Access` must include:
   `0.0.0.0/0`
3. Change the JWT secret on Render before production use.
4. If this repository will be pushed publicly, rotate the MongoDB password because it has now been used in local config.
