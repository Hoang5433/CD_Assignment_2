# FloginFE_BE - Login & Product Management System

A full-stack web application for user authentication and product management with a React frontend and Spring Boot backend.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Project Architecture](#project-architecture)

## 🎯 Project Overview

FloginFE_BE is a full-stack application that demonstrates authentication, authorization, and CRUD operations for product management. Users can log in with credentials, and upon successful authentication, access a product management dashboard where they can view, create, update, and delete products organized by categories.

## ✨ Features

### Authentication & Authorization
- User login with JWT token-based authentication
- Secure password storage and validation
- JWT token stored in HTTP-only cookies
- Protected routes requiring authentication

### Product Management
- View all products with pagination
- Create new products with validation
- Update existing products (price, name, description, etc.)
- Delete products
- Organize products by categories

### User Interface
- Responsive React components
- Form validation with React Hook Form and Zod
- Toast notifications (Sonner)
- Clean and intuitive admin dashboard

### Testing
- Unit tests with Jest and React Testing Library
- Integration tests for components
- End-to-end tests with Cypress

## 🛠️ Tech Stack

### Frontend
- **React** 18.2.0 - UI library
- **React Router DOM** 7.9.6 - Client-side routing
- **React Hook Form** 7.66.0 - Form state management
- **Zod** 4.1.12 - Schema validation
- **Axios** 1.13.2 - HTTP client
- **Zustand** 5.0.8 - State management
- **Sonner** 2.0.7 - Toast notifications
- **Jest** - Unit testing
- **React Testing Library** - Component testing
- **Cypress** 15.6.0 - E2E testing

### Backend
- **Spring Boot** 3.5.7 - Framework
- **Spring Data JPA** - Database ORM
- **Spring Security** - Authentication & authorization
- **Spring Validation** - Input validation
- **MySQL** - Database
- **JWT (JSON Web Token)** - Token-based authentication
- **Maven** - Build tool
- **Java** 21 - Programming language

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📁 Project Structure

```
FloginFE_BE/
├── backend/                              # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/flogin/
│   │   │   │   ├── controller/           # REST API Controllers
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── ProductController.java
│   │   │   │   │   └── CategoryController.java
│   │   │   │   ├── service/              # Business Logic
│   │   │   │   ├── repository/           # Database Access
│   │   │   │   ├── entity/               # JPA Entities
│   │   │   │   ├── dto/                  # Data Transfer Objects
│   │   │   │   └── config/               # Security Configuration
│   │   │   └── resources/
│   │   │       └── application.yaml      # Configuration file
│   │   └── test/                         # Backend Tests
│   ├── pom.xml                           # Maven Dependencies
│   └── compose.yaml                      # Docker Compose Config
│
├── frontend/                             # React Frontend
│   ├── src/
│   │   ├── components/                   # React Components
│   │   │   ├── Login.jsx
│   │   │   ├── Product.jsx
│   │   │   └── Navbar.jsx
│   │   ├── routes/                       # Route Configuration
│   │   │   └── AdminRoutes.jsx
│   │   ├── services/                     # API Services
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   └── categoryService.js
│   │   ├── stores/                       # Zustand State Management
│   │   │   ├── useAuthStore.js
│   │   │   ├── useProductStore.js
│   │   │   └── useCategoryStore.js
│   │   ├── utils/                        # Utility Functions
│   │   │   ├── api.js
│   │   │   ├── cookie.js
│   │   │   └── LoginValidation.js
│   │   ├── tests/                        # Test Files
│   │   │   └── Login/
│   │   └── App.js
│   ├── cypress/                          # E2E Tests
│   │   └── e2e/
│   │       ├── login.e2e.cy.js
│   │       └── product.e2e.cy.js
│   ├── package.json                      # NPM Dependencies
│   └── cypress.config.js                 # Cypress Configuration
│
└── README.md                             # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java** 21 or higher
- **Node.js** 16 or higher (with npm)
- **MySQL** 8.0 or higher (or Docker)
- **Maven** 3.6 or higher
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Assignment_2
```

### 2. Backend Setup

#### Option A: Using Docker (Recommended)

```bash
cd FloginFE_BE/backend

# Start MySQL with Docker Compose
docker-compose up -d

# Build the backend
mvn clean install

# Run the application
mvn spring-boot:run
```

#### Option B: Manual MySQL Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE login_product;

# Update credentials in application.yaml if needed
cd FloginFE_BE/backend

# Build and run
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd FloginFE_BE/frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will start on `http://localhost:3000`

## ▶️ Running the Application

### Full Application Stack (Development)

1. **Start MySQL Database:**
   ```bash
   cd FloginFE_BE/backend
   docker-compose up -d
   ```

2. **Start Backend Server:**
   ```bash
   cd FloginFE_BE/backend
   mvn spring-boot:run
   ```

3. **Start Frontend Server (in a new terminal):**
   ```bash
   cd FloginFE_BE/frontend
   npm start
   ```

4. **Access the Application:**
   - Open `http://localhost:3000` in your browser
   - Log in with your credentials
   - Access the product management dashboard

### Production Build

```bash
# Frontend
cd FloginFE_BE/frontend
npm run build

# Backend
cd FloginFE_BE/backend
mvn clean package
java -jar target/login-product-0.0.1-SNAPSHOT.jar
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `GET /auth/profile` - Get current user profile (requires JWT)
- `POST /auth/logout` - User logout

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product (requires JWT)
- `PUT /api/products/{id}` - Update product (requires JWT)
- `DELETE /api/products/{id}` - Delete product (requires JWT)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category (requires JWT)
- `PUT /api/categories/{id}` - Update category (requires JWT)
- `DELETE /api/categories/{id}` - Delete category (requires JWT)

## 🧪 Testing

### Frontend Unit & Integration Tests

```bash
cd FloginFE_BE/frontend

# Run tests in watch mode
npm test

# Run tests with coverage
npm run test:coverage

# Run tests once (CI mode)
npm run test -- --watchAll=false
```

### End-to-End Tests with Cypress

```bash
cd FloginFE_BE/frontend

# Open Cypress Test Runner (interactive)
npm run cy:open

# Run Cypress tests headless
npm run test:e2e
```

## 🏗️ Project Architecture

### Authentication Flow

```
User Login (React)
      ↓
AuthService.logIn()
      ↓
POST /auth/login (Backend)
      ↓
JWT Token Generated
      ↓
Token stored in HTTP-only Cookie
      ↓
Zustand Store Updated (useAuthStore)
      ↓
Protected Route Accessed (/admin/products)
```

### State Management (Frontend)

The application uses Zustand for state management with the following stores:

- **useAuthStore** - Authentication state (user, token, isAuthenticated)
- **useProductStore** - Product list and operations
- **useCategoryStore** - Category list and operations

### Data Flow (Backend)

```
Request
   ↓
Controller (handles routing)
   ↓
Service (business logic)
   ↓
Repository (database queries)
   ↓
JPA Entity (database object)
   ↓
Response
```

## 🔐 Security Features

- JWT-based authentication
- HTTP-only cookies for token storage
- Spring Security configuration
- Input validation with Zod (frontend) and Spring Validation (backend)
- Protected REST endpoints requiring authentication headers
- CORS configuration for cross-origin requests

## 📝 Default Credentials

For testing purposes (if demo users are set up):
- **Username:** admin123
- **Password:** admin123

**Note:** Change these credentials in production!

## 🐛 Troubleshooting

### Backend Won't Start
- Ensure MySQL is running: `docker-compose up -d`
- Check if port 8080 is available
- Verify application.yaml database credentials

### Frontend Won't Start
- Delete `node_modules` folder and reinstall: `npm install`
- Clear npm cache: `npm cache clean --force`
- Ensure port 3000 is available

### API Connection Issues
- Verify backend is running on `http://localhost:8080`
- Check CORS configuration in backend
- Ensure JWT token is being sent in Authorization header

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [React Hook Form Documentation](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)
- [JWT Introduction](https://jwt.io/introduction)
- [Cypress Testing Guide](https://docs.cypress.io)

## 👨‍💻 Development Tips

1. **Format Code:** Follow consistent code style with Prettier/ESLint
2. **Component Organization:** Keep components small and focused
3. **Error Handling:** Always handle API errors gracefully
4. **Testing:** Write tests for new features
5. **Documentation:** Keep code comments and README updated

## 📄 License

This project is provided as-is for educational purposes.

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Create a feature branch
2. Make your changes
3. Write or update tests
4. Submit a pull request

## 📞 Support

For issues or questions, please refer to the project's issue tracker or contact the development team.

---

**Happy Coding! 🚀**

