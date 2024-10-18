const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Sequelize, DataTypes } = require('sequelize');

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

// Set up Sequelize to connect to your AWS RDS
const sequelize = new Sequelize('your-db-name', 'your-username', 'your-password', {
    host: 'your-rds-endpoint.amazonaws.com',
    dialect: 'mysql', // or 'postgres'
});

// Define a User model
const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
});

// Sync models with the database
sequelize.sync();

// Signup route to process user registration data
app.post('/api/signup', async (req, res) => {
    try {
        // Encrypt the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Store user data in the database
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        res.json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
