📘 Syllabus Management System

The Syllabus Management System is a full-stack MERN application built to simplify how academic syllabi are managed and accessed.

In many institutions, syllabus information is scattered across PDFs, notice boards, or multiple platforms. This project centralizes everything into one secure system where:

Admin manages subjects and users

Faculty views assigned subjects

Students access their relevant syllabus

It transforms static document sharing into a structured, role-based digital workflow.

🚀 What This Project Does

Provides secure login using JWT authentication

Implements Role-Based Access Control (Admin, Faculty, Student)

Allows Admin to manage subjects and departments

Assigns faculty to subjects

Gives students personalized syllabus access

Protects routes using backend middleware

🛠 Tech Stack

Frontend:
React.js, Tailwind CSS

Backend:
Node.js, Express.js

Database:
MongoDB with Mongoose

Authentication:
JSON Web Token (JWT)

📂 Project Structure
client/      → React frontend
server/      → Express backend
models/      → Database schemas
routes/      → API endpoints
controllers/ → Business logic
middleware/  → Authentication & role validation

🔐 Security Approach

Password hashing for secure storage

Stateless JWT authentication

Role-based middleware authorization

Protected API endpoints

🛠 How to Run the Project

Clone the repository
git clone https://github.com/your-username/syllabus-management-system.git

Install backend dependencies
cd server
npm install

Install frontend dependencies
cd ../client
npm install

Create a .env file in the server folder:

MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key


Start backend
npm start

Start frontend
npm run dev

📈 Future Improvements

PDF upload for syllabus

Pagination and advanced search

Notification system

Analytics dashboard

👨‍💻 Author

Praveen M
MERN Stack Developer
