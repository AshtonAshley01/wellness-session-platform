const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

// POST /api/auth/register - User registration
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        
        let userByEmail = await User.findOne({ email });
        if (userByEmail) {
            return res.status(400).json({ message: 'User with that email already exists' });
        }
        let userByUsername = await User.findOne({ username });
        if (userByUsername) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        
        const newUser = new User({
            username,
            email,
            password_hash: password 
        });

        const salt = await bcrypt.genSalt(10);
        newUser.password_hash = await bcrypt.hash(password, salt);
        await newUser.save();

        const payload = {
            user: {
                id: newUser.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                
                res.json({ token, username: newUser.username });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        
        const payload = {
            user: {
                id: user.id
            }
        };

        
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, username: user.username });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;