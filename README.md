# college-baptiste-gacuba-ii

College Baptiste Gacuba II school website, built with Vue and Express.

## Setup

Install the frontend dependencies from the repository root:

```sh
npm install
```

Copy `backend/.env.example` to `backend/.env`, then configure the environment
variables. For MongoDB Atlas:

1. Create an Atlas cluster and a database user.
2. Allow your development machine's IP address in the Atlas network access list.
3. Copy the cluster connection string into `MONGODB_URI` in `backend/.env`.
   Replace the username, password, and cluster name. URL-encode special
   characters in the password.
4. Set `MONGODB_DB_NAME` to the database name the API should use.

All backend features use this database, including accounts, admissions, contact
messages, website content, analytics, announcements, and student results.
Existing data in a separate MySQL database is not copied automatically.

Keep `backend/.env` private; do not commit Atlas credentials.
In Atlas Network Access, allow only the development machine's IP and the
deployment server's outbound IP. Avoid `0.0.0.0/0`, which allows connections
from any IP address.

Start the backend from the `backend` directory:

```sh
node server.js
```

Start the frontend from the repository root:

```sh
npm run dev
```

The frontend expects the API at `http://localhost:5000` by default. If needed,
copy the root `.env.example` to `.env` and set `VITE_API_BASE_URL`.

Build the frontend with:

```sh
npm run build
```
