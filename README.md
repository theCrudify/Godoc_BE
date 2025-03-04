# 🎯 **Project Setup Guide**

---

## 📌 1. **Database Preparation**
Before running the project, ensure that the MySQL database is properly configured.
🔹 **Check the migration file** in `migration/../migration.sql` and adjust it if necessary.
🔹 **Configure `.env`** with MySQL connection details matching your server environment.

---

## 📦 2. **Install Dependencies**
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

## 🔄 4. **Synchronize Database with Prisma**
To ensure the database schema matches Prisma, execute the following commands:
```sh
npx prisma db push
npx prisma db pull
```
✔️ `db push` applies the Prisma schema to the database.
✔️ `db pull` retrieves the schema from the database if any changes were made.

---

## 🔍 5. **Check Database Connection**
Use the following command to verify the database connection:
```sh
npx ts-node src/config/dbCheck.ts
```
✅ If the connection is successful, proceed to the next step.

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
- 🆕 **Create a new user:**
  ```
  POST http://localhost:3000/api/users
  ```
- 🔑 **User login:**
  ```
  POST http://localhost:3000/api/users/login
  ```
- 📜 **Retrieve all users:**
  ```
  GET http://localhost:3000/api/users/
  ```
- 🆔 **Retrieve a user by ID:**
  ```
  GET http://localhost:3000/api/users/10
  ```
- ✏️ **Update a user by ID:**
  ```
  PUT http://localhost:3000/api/users/10
  ```
- 🗑️ **Soft delete a user (set `is_deleted` column to `true`):**
  ```
  DELETE http://localhost:3000/api/users/soft/6
  ```
- ❌ **Delete a user from query:**
  ```
  DELETE http://localhost:3000/api/users/6
  ```

---

## 📖 **API Usage Instructions**
1. 📝 **Create an account first** using the `POST /api/users` endpoint.
2. 🔐 **Login** using the `POST /api/users/login` endpoint to obtain a **Bearer Token**.
3. ⚡ Use the **Bearer Token** to access the following endpoints:
   - **GET** (Retrieve all users or a specific user by ID)
   - **PUT** (Update user information)
   - **DELETE** (Soft delete a user)
   - **DELETE** (Permanently delete a user)

---

## ⚠️ **Notes**
⚡ Ensure MySQL is running before starting the project.
⚡ If there are schema changes, always run:
```sh
npx prisma generate
npx prisma db push
```

📌 **Happy Coding! 🚀**
