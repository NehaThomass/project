// auth.js (urban-company-backend/routes/auth.js)

const express = require('express');
const db = require('../db'); // MySQL connection
const bcrypt = require('bcrypt');

const router = express.Router();

// -------------------- Signup Endpoint --------------------
router.post('/signup', async (req, res) => {
    const { fullName, email, phone, password, address } = req.body;
    console.log('Signup request body:', req.body);

    if (!fullName || !email || !phone || !password) {
        return res.status(400).json({ message: 'All fields except address are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdAt = new Date();

        const query = `
            INSERT INTO signup (FullName, Email, PhoneNumber, Password, Address, CreatedAt)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(query, [fullName, email, phone, hashedPassword, address, createdAt], (err, result) => {
            if (err) {
                console.error('Signup error:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'Signup failed: Email already exists' });
                } else {
                    return res.status(500).json({ message: 'Signup failed: Server error' });
                }
            }

            console.log('Signup successful for:', email);
            return res.status(201).json({ message: 'Signup completed successfully' });
        });
    } catch (err) {
        console.error('Signup server error:', err);
        return res.status(500).json({ message: 'Signup failed: Server error' });
    }
});

// -------------------- Login Endpoint --------------------
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const query = 'SELECT * FROM signup WHERE Email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Login database error:', err);
            return res.status(500).json({ message: 'Login failed: Server error' });
        }

        if (results.length === 0) {
            console.log('No user found with this email.');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];
        console.log('User found:', user);

        try {
            const isPasswordValid = await bcrypt.compare(password, user.Password);
            console.log('Password match:', isPasswordValid);

            if (isPasswordValid) {
                return res.status(200).json({ message: 'Login successful' });
            } else {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
        } catch (compareError) {
            console.error('Password compare error:', compareError);
            return res.status(500).json({ message: 'Login failed: Server error' });
        }
    });
});

module.exports = router;
