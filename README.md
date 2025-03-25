## 📌 Personal Finance Tracker System

This is a **MERN stack-based Budget Management API** that allows users to track their transactions, set budgets, and manage financial goals. It includes authentication, budget tracking, transaction logging, and notification management.

## 🚀 Setup Instructions
### 1. Clone the Repository
git clone https://github.com/your-repo/budget-management-api.git  
cd budget-management-api

### 2. Install Dependencies
npm install

### 3. Configure Environment Variables
Create a .env file in the root directory and set up the following environment variables:

PORT=8080  
MONGO_URL=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  
EXCHANGE_RATE_API_KEY=your_api_key

### 4. Start the Server
npm start

## 🔥 API Endpoints

### **Authentication Routes**
| Method | Endpoint                | Description         |
|--------|-------------------------|---------------------|
| POST   | `/api/v1/auth/register` | Register a new user |
| POST   | `/api/v1/auth/login`    | Authenticate a user |

### **Transaction Routes**
| Method | Endpoint                                     | Description               |
|--------|---------------------------------------------|---------------------------|
| POST   | `/api/v1/transactions/createtransaction`   | Create a new transaction  |
| GET    | `/api/v1/transactions/alltransaction`      | Get all user transactions |
| PUT    | `/api/v1/transactions/updatetransaction/:id` | Update a transaction      |
| DELETE | `/api/v1/transactions/deletetransaction/:id` | Delete a transaction      |

### **Budget Routes**
| Method | Endpoint                    | Description                |
|--------|-----------------------------|----------------------------|
| POST   | `/api/v1/budgets/setBudget` | Set or update a budget     |
| GET    | `/api/v1/budgets/allBudget` | Get all budgets for a user |
| GET    | `/api/v1/budgets/status`    | Check if spending exceeds budget |

### **Report Routes**
| Method | Endpoint                          | Description                       |
|--------|----------------------------------|---------------------------------|
| GET    | `/api/v1/reports/income-expense`  | Get income vs. expense report     |
| GET    | `/api/v1/reports/category-report` | Get category-wise spending report |
| GET    | `/api/v1/reports/filtered-transactions` | Get transactions based on filters (date, category, etc.) |

### **Notification Routes**
| Method | Endpoint                          | Description                       |
|--------|----------------------------------|---------------------------------|
| GET    | `/api/v1/notifications`  | Get inew notifications     |
| PUT    | `/api/v1/reports/notifications/mark-as-read"` | Mark notifications as read |

### **Goal Routes**
| Method | Endpoint                          | Description                       |
|--------|----------------------------------|---------------------------------|
| GET    | `/api/v1/goals/create-goal`  | Create a new goal    |
| GET    | `/api/v1/goals/all-goals` | Get all goals |
| GET    | `/api/v1/goals/update-progress/:id` | Update goal progress manually |
| GET    | `/api/v1/goals/auto-allocate` | Auto-allocate savings from income |
| GET    | `/api/v1/goals/delete-goal/:id` | Remove a goal |

### **Dashboard Routes**
| Method | Endpoint                          | Description                       |
|--------|----------------------------------|---------------------------------|
| GET    | `/api/v1/dashboard`  | Get dashboard data based on user role     |


## 🛠 Running Tests
### Run Unit Testing
npm test -- tests/unitTesting/(filename).test.js

### Performance Testing
**Install Artillery** - npm install -g artillery
**Run Artillery Performance Test** - artillery run artillery-config.yml

## Security testing 
cross-site scripting (XSS), and insecure authentication

## 📌 Notes for Testing Environments

Use a separate MongoDB database for testing.  
Mock API calls using Jest and Supertest.

