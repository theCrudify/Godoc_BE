# 🎯 **Project Setup Guide**

---

## 📌 1. **Database Preparation**
Before running the project, ensure that the MySQL database is properly configured.
🔹 **Check the migration file** in `migration/../migration.sql` and adjust it if necessary.
🔹 **Configure `.env`** with MySQL connection details matching your server environment.

---

## 🛆 2. **Install Dependencies**
Run the following command to install all required dependencies:
```sh
npm install
```

---

## ⚙️ 3. **Generate Prisma Client**
After installing dependencies, run the following command to generate the Prisma Client:
```sh
npx prisma generate
```

---

## 🛠️ 4. **Synchronize Database with Prisma**
To ensure the database schema matches Prisma, execute the following commands:
```sh
npx prisma db push
npx prisma db pull
```
👉 `db push` applies the Prisma schema to the database.
👉 `db pull` retrieves the schema from the database if any changes were made.

---

## 🔍 5. **Check Database Connection**
Use the following command to verify the database connection:
```sh
npx ts-node src/config/dbCheck.ts
```
👌 If the connection is successful, proceed to the next step.

---

## 🚀 6. **Run the Project**
Once all configurations are complete, start the server with:
```sh
npm run dev
```
🎉 If successful, the server will be available at **`http://localhost:3000`**.

---

## 🔗 **API Endpoints**
### 👤 **User Management**
- 💚 **Create a new user:**
  ```
  POST http://localhost:3000/api/users
  ```
  **Request Body:**
  ```json
  {
    "username": "jojo",
    "email": "john@example.com",
    "password": "1234578A@"
  }
  ```
  
- 🔑 **User login:**
  ```
  POST http://localhost:3000/api/users/login
  ```
  **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "1234578A@"
  }
  ```
  **Response:**
  ```json
  {
      "message": "Login successful",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJ1c2VybmFtZSI6Impvam8iLCJpYXQiOjE3NDExMzUyMzEsImV4cCI6MTc0MTIyMTYzMX0.JjIYECNDcr1hS5TH1eRJwTFwR8ZbzRfeYMyQtWxy0KE",
      "user": {
          "user_id": 1,
          "username": "jojo",
          "email": "john@example.com"
      }
  }
  ```
  
- 📃 **Retrieve all users (requires authentication):**
  ```
  GET http://localhost:3000/api/users/
  ```
  **Authorization:** Bearer Token
  
- 👤 **Retrieve a user by ID (requires authentication):**
  ```
  GET http://localhost:3000/api/users/10
  ```
  **Authorization:** Bearer Token
  
- ✏️ **Update a user by ID (requires authentication):**
  ```
  PUT http://localhost:3000/api/users/10
  ```
  **Authorization:** Bearer Token
  
- 🛢️ **Soft delete a user (set `is_deleted` column to `true`, requires authentication):**
  ```
  DELETE http://localhost:3000/api/users/soft/6
  ```
  **Authorization:** Bearer Token
  
- ❌ **Delete a user permanently (requires authentication):**
  ```
  DELETE http://localhost:3000/api/users/6
  ```
  **Authorization:** Bearer Token

---

## 📚 **API Usage Instructions**
1. 📝 **Create an account first** using the `POST /api/users` endpoint.
2. 🔒 **Login** using the `POST /api/users/login` endpoint to obtain a **Bearer Token**.
3. ⚡ Use the **Bearer Token** to access the following endpoints:
   - **GET** (Retrieve all users or a specific user by ID)
   - **PUT** (Update user information)
   - **DELETE** (Soft delete a user)
   - **DELETE** (Permanently delete a user)

### 🔒 **How to Use Bearer Token in Authorization**
When making API requests that require authentication, include the **Bearer Token** in the request header:
```http
Authorization: Bearer YOUR_TOKEN_HERE
```
Example using **cURL**:
```sh
curl -X GET "http://localhost:3000/api/users" -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## ⚠️ **Notes**
🚀 Ensure MySQL is running before starting the project.
🚀 If there are schema changes, always run:
```sh
npx prisma generate
npx prisma db push
```

📉 **Security Reminder:** Do not expose your `.env` file in public repositories.

📄 **Happy Coding! 🚀**

