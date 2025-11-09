# FARMLINK BACKEND

## Project Overview

**Farmlink** is a comprehensive platform that directly connects farmers with buyers, eliminating intermediaries and ensuring fresh produce accessibility. The platform provides farmers with a digital marketplace to showcase their products while giving buyers direct access to farm locations and contact information.

## Key Features

### Farmers

- **Product Management**: Add, edit, and manage produce listings
- **Dashboard**: View sales analytics and product performance
- **Status Control**: Toggle product availability (Active/Inactive)
- **Verification System**: Secure farmer verification process

### Buyers/Customers

- **Marketplace Browse**: Search and filter available produce
- **Farmer Ratings**: Rate farmers based on transaction experience
- **Direct Contact**: Access verified farmer information
- **Product Details**: Comprehensive produce information and pricing

### Administrators

- **User Management**: Manage farmer and customer accounts
- **Verification Control**: Approve/reject farmer verification requests
- **Content Moderation**: Remove inappropriate listings
- **Analytics Dashboard**: Platform usage and performance metrics

## Tech Stack

- **Backend Framework**: Node.js with Express (ES Modules)
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT-based authentication system
- **File Upload**: Cloudinary integration
- **Email Service**: SMTP email notifications
- **SMS Service**: SMS verification capabilities
- **Architecture**: RESTful API with MVC pattern

## Core Dependencies

```json
{
  "express": "Web application framework",
  "sequelize": "Promise-based Node.js ORM",
  "mysql2": "MySQL database driver",
  "jsonwebtoken": "JWT implementation",
  "bcryptjs": "Password hashing",
  "dotenv": "Environment variable management",
  "cors": "Cross-Origin Resource Sharing",
  "helmet": "Security middleware",
  "cloudinary": "Cloud-based image management"
}
```

### Development Dependencies

```json
{
  "nodemon": "Auto-restart server during development"
}
```

## Git repository

`https://github.com/MyITjournal/Farmlink_Backend`

## Installation instructions and setup

1.  Create a folder where you want the project to be installed.

`mkdir farmlink_project`

2.  Navigate to that folder, for example:

`cd farmlink_project`

3.  Clone the repository.

`git clone https://github.com/MyITjournal/Farmlink_Backend.git`

4.  Install the dependencies

`npm install`

To install the dev dependencies:

`npm install nodemon --save -dev`

5.  Configure the environment variables by creating a `.env` file in the root directory. Enter the following details

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_profile_db
DB_PORT=your_db_port
PORT=3000
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
EMAIL_PORT=
EMAIL_HOST=
```

6.  Start the server:

**Production mode:**

```bash
npm start
```

**Development mode (with auto-restart):**

```bash
npm run dev
```

## API Endpoints

| Method                    | Endpoint                           | Description                       | Authentication | Middleware                                                      |
| ------------------------- | ---------------------------------- | --------------------------------- | -------------- | --------------------------------------------------------------- |
| **AUTHENTICATION ROUTES** |                                    |                                   |                |                                                                 |
| `POST`                    | `/api/auth/register`               | User registration with validation | Public         | `registrationValidator`, `validationMiddleware`                 |
| `POST`                    | `/api/auth/login`                  | User authentication               | Public         | `loginValidator`, `validationMiddleware`                        |
| `GET`                     | `/api/auth/profile`                | Get user profile                  | Required       | `authMiddleware`                                                |
| `POST`                    | `/api/auth/change-password`        | Change user password              | Required       | `authMiddleware`                                                |
| `POST`                    | `/api/auth/email-otp`              | Request email OTP verification    | Public         | None                                                            |
| `POST`                    | `/api/auth/verify-email-otp`       | Verify email OTP                  | Public         | None                                                            |
| **FARMER ROUTES**         |                                    |                                   |                |                                                                 |
| `POST`                    | `/api/farmers/products`            | Add new product                   | Farmer Auth    | `authMiddleware`                                                |
| `PUT`                     | `/api/farmers/products/:id`        | Update existing product           | Farmer Auth    | `authMiddleware`                                                |
| `PATCH`                   | `/api/farmers/products/:id/status` | Toggle product status             | Farmer Auth    | `authMiddleware`                                                |
| `GET`                     | `/api/farmers/dashboard`           | Get farmer dashboard data         | Farmer Auth    | `authMiddleware`                                                |
| `GET`                     | `/api/farmers/`                    | Get all farmers                   | Farmer Auth    | `authMiddleware`                                                |
| **CUSTOMER ROUTES**       |                                    |                                   |                |                                                                 |
| `GET`                     | `/api/customers/`                  | Get all customers                 | Admin Auth     | `authMiddleware`                                                |
| `GET`                     | `/api/customers/:id`               | Get customer by ID                | Admin Auth     | `authMiddleware`                                                |
| `PUT`                     | `/api/customers/:id`               | Update customer information       | Admin Auth     | `authMiddleware`                                                |
| `DELETE`                  | `/api/customers/:id`               | Delete customer account           | Admin Auth     | `authMiddleware`                                                |
| **ADMIN ROUTES**          |                                    |                                   |                |                                                                 |
| `GET`                     | `/api/admin/pending-verifications` | Get pending farmer verifications  | Admin Auth     | `authMiddleware`                                                |
| `PATCH`                   | `/api/admin/verification-status`   | Update verification status        | Admin Auth     | `authMiddleware`                                                |
| `DELETE`                  | `/api/admin/users/:userId`         | Remove user account               | Admin Auth     | `authMiddleware`                                                |
| `DELETE`                  | `/api/admin/listings/:listingId`   | Remove product listing            | Admin Auth     | `authMiddleware`                                                |
| `GET`                     | `/api/admin/summary`               | Get admin dashboard summary       | Admin Auth     | `authMiddleware`                                                |
| **PRODUCE ROUTES**        |                                    |                                   |                |                                                                 |
| `GET`                     | `/api/produce/`                    | Get all active produce listings   | Public         | None                                                            |
| `GET`                     | `/api/produce/:listingId`          | Get specific produce details      | Public         | None                                                            |
| `POST`                    | `/api/produce/rate`                | Rate a farmer                     | Customer Auth  | `rateFarmerValidator`, `validationMiddleware`, `authMiddleware` |

### Authentication Legend:

- **Public**: No authentication required
- **Required**: JWT token required in Authorization header
- **Farmer Auth**: Must be authenticated farmer
- **Admin Auth**: Must be authenticated admin
- **Customer Auth**: Must be authenticated customer

### Request Headers:

```bash
# For authenticated endpoints
Authorization: Bearer <your_jwt_token>
WContent-Type: application/json
```

### Response Format:

All endpoints return standardized JSON responses:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

## How It Works

### User Registration & Authentication

1. Users register with role selection (farmer/customer)
2. JWT tokens issued for authenticated sessions
3. Role-based middleware controls endpoint access
4. Password hashing ensures secure credential storage

### Farmer Workflow

1. Farmers register and await verification approval
2. Once verified, farmers can add/manage products
3. Product listings appear in public marketplace
4. Farmers monitor performance via dashboard

### Buyer Experience

1. Browse marketplace without authentication
2. Register/login to rate farmers and access contact info
3. Filter products by category, price, location
4. Rate farmers post-transaction

### Admin Management

1. Review and approve farmer verification requests
2. Monitor platform activity and user behavior
3. Remove inappropriate content or problematic users
4. Access comprehensive analytics dashboard

## Project Structure

```
Farmlink_Backend/
│
├── src/
│   ├── config/                    # Configuration files
│   │   ├── cloudinary.js         # Cloudinary setup
│   │   ├── db_files.js           # Database configuration & connection
│   │   └── index.js              # Main config exports
│   │
│   ├── controllers/              # Business logic handlers
│   │   ├── adminController.js    # Admin management functions
│   │   ├── authController.js     # Authentication logic
│   │   ├── customerController.js # Customer CRUD operations
│   │   ├── farmerController.js   # Farmer & product management
│   │   └── produceController.js  # Marketplace & rating logic
│   │
│   ├── middlewares/              # Express middleware
│   │   ├── authMiddleware.js     # JWT authentication
│   │   ├── errorHandler.js       # Global error handling
│   │   ├── roleMiddleware.js     # Role-based access control
│   │   └── validationMiddleware.js # Request validation
│   │
│   ├── models/                   # Sequelize database models
│   │   ├── admin.js             # Admin user model
│   │   ├── customer.js          # Customer user model
│   │   ├── farmer.js            # Farmer user model
│   │   ├── produce.js           # Product listing model
│   │   ├── user.js              # Base user model
│   │   ├── verification.js      # Verification request model
│   │   └── index.js             # Model associations & exports
│   │
│   ├── routes/                   # API route definitions
│   │   ├── adminRoutes.js       # Admin endpoint routes
│   │   ├── authRoutes.js        # Authentication routes
│   │   ├── customerRoutes.js    # Customer management routes
│   │   ├── farmerRoutes.js      # Farmer operation routes
│   │   └── produceRoutes.js     # Marketplace routes
│   │
│   ├── services/                 # Business service layer
│   │   ├── emailService.js      # Email notification service
│   │   ├── smsService.js        # SMS notification service
│   │   └── userService.js       # User management services
│   │
│   ├── utils/                    # Utility functions & helpers
│   │   ├── AppError.js          # Custom error class
│   │   ├── auth.js              # JWT token generation & verification
│   │   ├── fileUploads.js       # File upload utilities (Multer)
│   │   ├── responseHandler.js   # Standardized API responses
│   │   └── validators.js        # Input validation rules
│   │
│   ├── app.js                    # Express app configuration
│   └── server.js                 # Server startup & port binding
│
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
├── package.json                  # Project dependencies & scripts
└── README.md                     # Project documentation
```

## Architecture Highlights

- **MVC Pattern**: Clear separation of concerns with Models, Views (JSON), Controllers
- **ES Modules**: Modern JavaScript import/export syntax throughout
- **Middleware Pipeline**: Authentication, validation, error handling
- **Service Layer**: Business logic abstraction from controllers
- **Centralized Associations**: All model relationships defined in `models/index.js`
- **Centralized Error Handling**: Consistent error responses across all endpoints
- **Role-Based Access**: Granular permissions for farmers, customers, and admins
- **Token Management**: Unified authentication utilities in `utils/auth.js`

## Contributing

This is a capstone project for educational purposes. For team members working on improvements:

1. Create feature branch (`git checkout -b feature/NewFeature`)
2. Make your changes following the established patterns
3. Test your changes locally
4. Commit with descriptive messages (`git commit -m 'Add: New feature description'`)
5. Push to your branch and create a pull request

## License

This project is part of the Techcrush Capstone Program.

## Group 2 Backend Team

1.  Nwazota Chibuike Anthony
2.  Adeyoola Adebayo
3.  Adegoke Christopher Ayomide
4.  Olatunji Bisola
5.  Charles Robinson
6.  Chukwumaobi Chizaram Divine
7.  Onuzulike Chijioke Marie Claire

## Acknowledgement

Special appreciation to **Mr. Oluwatobi Adelabu**, our instructor, for his exceptional guidance and mentorship. His teaching methodology has been instrumental in helping our team understand complex backend development concepts. We are grateful for his patience, technical expertise, and commitment to ensuring every student grasps the fundamentals of modern web development. His dedication to student success has made this learning experience both challenging and rewarding.
