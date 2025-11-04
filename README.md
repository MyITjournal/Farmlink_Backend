# FARMLINK

## Project details

This is a platform that connects buyers as well as end users/buyers together such that the buyer has a direct access to different farm locations where the produce is available. The major focus being availability of such produce.

## Features

- A directory where farmers can register and have their products listed
- Buyers can peruse what is available and sign up to have access to a farmer's location/contact
-

## Tech Stack

- Backend - Node.js/Express (ESM)
- Frontend -
- Database - Sequelize/MySQL
-

## Dependencies:

- express - This is the web server framework
- dotenv - To ensure the security of the credentials
-
-
-

### Development dependency

- nodemon - To ensure the continuous running of the server during testing

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

6.  To start the server once, use the following command:

`npm start`

Alternatively, to ensure that the server automatically restarts whenever changes are effected to the file, run the following command:

`npm run dev`

## API Endpoints

## How it works

## Folder Structure

```
farmlink-backend/
│
├── src/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db_files.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── customerController.js
│   │   ├── farmerController.js
│   │   ├── produceController.js
│   │   └──
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── models/
│   │   ├── admin.js
│   │   ├── customer.js
│   │   ├── farmer.js
│   │   ├── produce.js
│   │   └── verification.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── farmerRoutes.js
│   │   ├── produceRoutes.js
│   │   └── verificationRoutes.js
│   │
│   ├── utils/
│   │   ├── emailService.js
│   │   ├── generateToken.js
│   │   ├── smsService.js
│   │   └── validators.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
└── README.md
```

## Author

Techcrush Capstone Project Group 2
