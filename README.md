# lendsquare-backend-assessment

Assessment for lendsquare's backend engineer task

## Authentication Endpoints

### **Register a New User**

**URL:** `/api/v1/auth/register`

**Method:** `POST`

**Description:** Register a new user.

**Request Body:**

```json
{
  "email": "johndoe@gmail.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "user registered successfully"
}
```

### **Login a User**

**URL:** `/api/v1/auth/login`

**Method:** `POST`

**Description:** Login a user.

**Request Body:**

```json
{
  "email": "johndoe@gmail.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```
