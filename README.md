# Banking App

This project is a full-stack banking application developed using the MERN stack (MongoDB, Express.js, React, Node.js). It includes features such as user registration, login, profile management, and verification via email or SMS.

## Technologies Used

### Frontend
- **React**: A JavaScript library for building user interfaces.

### Backend
- **Node.js**: A JavaScript runtime built on Chrome's V8 engine.
- **Express.js**: A fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB**: A NoSQL database for storing application data.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **JWT (JSON Web Token)**: For secure user authentication.
- **Nodemailer**: For sending emails via SMTP.
- **Twilio**: For sending SMS for phone verification.
- **Cloudinary**: For storing and managing documents and images.

## .env variables
- SERVER_PORT=3000
- TWILIO_ACCOUNT_SID=your_twilio_account_sid
- TWILIO_AUTH_TOKEN=your_twilio_auth_token
- TWILIO_PHONE_NUMBER=your_twilio_phone_number
- SMTP_MAIL=your_email@example.com
- SMTP_PASSWORD=your_smtp_password
- SMTP_HOST=smtp.gmail.com
- SMTP_PORT=587
- ACCESS_TOKEN=your_jwt_secret_key
- CLOUD_NAME=your_cloudinary_cloud_name
- CLOUD_API_KEY=your_cloudinary_api_key
- CLOUD_API_SECRET=your_cloudinary_api_secret
