const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('./db');
require('dotenv').config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-production-secure-secret-key';
const OTP_EXPIRY_MINUTES = 5;
const MAX_VERIFICATION_ATTEMPTS = 3;

// Configure NodeMailer
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
        user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
        pass: process.env.SMTP_PASS || 'ethereal.pass',
    },
});

// Configure Phone.Email API (Dummy config - since they require an API Key)
// For local local testing, we print OTP to console
const sendEmailOTPViaService = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: '"Triplova E-Commerce" <no-reply@triplova.com>',
            to: email,
            subject: 'Account Verification OTP',
            text: `Your OTP for account verification is: ${otp}\n\nThis OTP will expire in 5 minutes.\nDo not share this code with anyone.`,
        });
        console.log(`[EMAIL] OTP ${otp} sent to ${email}`);
    } catch (e) {
        console.log(`[EMAIL] Error sending email, logging OTP for local dev: ${otp}`);
    }
};

const sendPhoneOTPViaService = async (phone, otp) => {
    // In production, use Twilio / MSG91 / Phone.Email API here
    console.log(`[PHONE.EMAIL] Your verification OTP is ${otp}. This code is valid for 5 minutes. Sent to ${phone}`);
};

const sendWhatsAppMessage = async (phone, messageText) => {
    const hasTwilioCredentials =
        process.env.TWILIO_ACCOUNT_SID &&
        process.env.TWILIO_ACCOUNT_SID !== 'YOUR_TWILIO_ACCOUNT_SID_HERE' &&
        process.env.TWILIO_AUTH_TOKEN &&
        process.env.TWILIO_AUTH_TOKEN !== 'YOUR_TWILIO_AUTH_TOKEN_HERE';

    if (hasTwilioCredentials) {
        // Real Twilio WhatsApp send
        const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
            body: messageText,
            from: process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886',
            to: `whatsapp:+${phone.replace(/^\+/, '')}` // normalize number format
        });
        console.log(`[WHATSAPP ✅] Real message sent to +${phone}`);
    } else {
        // Dev mode: log the message to terminal instead
        console.log(`\n[WHATSAPP 🛠 DEV MODE] No real Twilio credentials found.`);
        console.log(`  To: +${phone}`);
        console.log(`  Message:\n${messageText}\n`);
        console.log(`  ➡ To enable real sending, add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to .env\n`);
    }
    return true;
};


const logBookingIntent = async (bookingData) => {
    return new Promise((resolve, reject) => {
        const { user_phone, package_name, package_location, package_price } = bookingData;
        db.run(
            `INSERT INTO bookings (user_phone, package_name, package_location, package_price) VALUES (?, ?, ?, ?)`,
            [user_phone, package_name, package_location, package_price],
            function (err) {
                if (err) reject(err);
                else resolve(this.lastID);
            }
        );
    });
};

const generateSecureOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
};

// ============================================
// API ENDPOINTS
// ============================================

// Register User
app.post('/api/auth/register', async (req, res) => {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
        return res.status(400).json({ status: 'error', message: 'All fields are required' });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        db.run(
            `INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)`,
            [name, email, phone, passwordHash],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ status: 'error', message: 'Email or phone already exists' });
                    }
                    return res.status(500).json({ status: 'error', message: err.message });
                }

                res.status(201).json({ status: 'success', message: 'User registered. Please verify email and phone.', user_id: this.lastID });
            }
        );
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// Sync Firebase Verified User to Local Database
app.post('/api/auth/sync-firebase-user', async (req, res) => {
    const { name, email, phone } = req.body;
    if (!email) return res.status(400).json({ status: 'error', message: 'Email required' });

    // If phone is provided, mark as verified, otherwise not
    const isVerified = phone ? 1 : 0;

    db.run(
        `INSERT INTO users (name, email, phone, email_verified, phone_verified) VALUES (?, ?, ?, 1, ?)
         ON CONFLICT(email) DO UPDATE SET phone = coalesce(?, users.phone), phone_verified = ?`,
        [name, email, phone, isVerified, phone, isVerified],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed: users.phone')) {
                    return res.status(400).json({ status: 'error', message: 'This phone number is already registered to another account.' });
                }
                return res.status(500).json({ status: 'error', message: err.message });
            }
            res.status(200).json({ status: 'success', message: 'User synced successfully', user_id: this.lastID });
        }
    );
});

// Verify via Phone.Email JSON URL (Converted from Java snippet)
app.post('/api/auth/verify-phone-email', async (req, res) => {
    const { user_json_url, email } = req.body;
    if (!user_json_url || !email) {
        return res.status(400).json({ status: 'error', message: 'user_json_url and email are required' });
    }

    try {
        // Fetch JSON response from phone.email
        const response = await fetch(user_json_url);
        if (!response.ok) {
            return res.status(400).json({ status: 'error', message: 'Failed to fetch JSON from phone.email' });
        }

        const jsonObject = await response.json();

        // Parse JSON response like Java Snippet
        const userCountryCode = jsonObject.user_country_code;
        const userPhoneNumber = jsonObject.user_phone_number;
        const userFirstName = jsonObject.user_first_name;
        const userLastName = jsonObject.user_last_name;

        console.log("================================");
        console.log("Phone.Email Verification Result:");
        console.log("User Country Code: " + userCountryCode);
        console.log("User Phone Number: " + userPhoneNumber);
        console.log("User First Name: " + userFirstName);
        console.log("User Last Name: " + userLastName);
        console.log("================================");

        // Update local database with verified phone number
        db.run(
            `UPDATE users SET phone = ?, phone_verified = 1 WHERE email = ?`,
            [userPhoneNumber, email],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed: users.phone')) {
                        return res.status(400).json({ status: 'error', message: 'This mobile number is already linked to another Triplova account. Please use a different number or login with that account.' });
                    }
                    return res.status(500).json({ status: 'error', message: err.message });
                }
                res.status(200).json({
                    status: 'success',
                    message: 'Phone verified successfully via phone.email',
                    phone: userPhoneNumber
                });
            }
        );

    } catch (error) {
        console.error("Phone.Email JSON verification error:", error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Get User Profile by Email
app.get('/api/auth/profile/:email', async (req, res) => {
    const { email } = req.params;
    db.get(`SELECT id, name, email, phone, phone_verified, role FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message });
        if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
        res.json({ status: 'success', user });
    });
});

// Log Booking Intent
app.post('/api/bookings', async (req, res) => {
    const { user_phone, package_name, package_location, package_price } = req.body;
    if (!user_phone || !package_name) {
        return res.status(400).json({ status: 'error', message: 'Missing booking details' });
    }

    try {
        await logBookingIntent({ user_phone, package_name, package_location, package_price });
        res.status(201).json({ status: 'success', message: 'Booking intent logged' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Send WhatsApp Message Endpoint
app.post('/api/whatsapp/send', async (req, res) => {
    const { phone, message } = req.body;
    if (!phone || !message) return res.status(400).json({ status: 'error', message: 'Phone and message required' });

    try {
        await sendWhatsAppMessage(phone, message);
        res.json({ status: 'success', message: 'WhatsApp message sent (or logged in dev mode).' });
    } catch (err) {
        console.error('[WHATSAPP ERROR]', err.message);
        res.status(500).json({ status: 'error', message: err.message || 'Failed to send WhatsApp message' });
    }
});

// Send Email OTP
app.post('/api/auth/send-email-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ status: 'error', message: 'Email is required' });

    db.get(`SELECT id FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err || !user) return res.status(404).json({ status: 'error', message: 'User not found' });

        const otp = generateSecureOTP();
        const otpHash = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000).toISOString();

        db.run(
            `INSERT INTO otp_verifications (user_id, otp_hash, otp_type, expires_at) VALUES (?, ?, ?, ?)`,
            [user.id, otpHash, 'email', expiresAt],
            async (err) => {
                if (err) return res.status(500).json({ status: 'error', message: 'Database error' });

                await sendEmailOTPViaService(email, otp);
                res.json({ status: 'success', message: 'Email OTP sent successfully' });
            }
        );
    });
});

// Send Phone OTP
app.post('/api/auth/send-phone-otp', async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ status: 'error', message: 'Phone is required' });

    db.get(`SELECT id FROM users WHERE phone = ?`, [phone], async (err, user) => {
        if (err || !user) return res.status(404).json({ status: 'error', message: 'User not found' });

        const otp = generateSecureOTP();
        const otpHash = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000).toISOString();

        db.run(
            `INSERT INTO otp_verifications (user_id, otp_hash, otp_type, expires_at) VALUES (?, ?, ?, ?)`,
            [user.id, otpHash, 'phone', expiresAt],
            async (err) => {
                if (err) return res.status(500).json({ status: 'error', message: 'Database error' });

                await sendPhoneOTPViaService(phone, otp);
                res.json({ status: 'success', message: 'Phone OTP sent successfully' });
            }
        );
    });
});

// Verify Email OTP
app.post('/api/auth/verify-email-otp', async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ status: 'error', message: 'Email and OTP required' });

    db.get(`SELECT id FROM users WHERE email = ?`, [email], (err, user) => {
        if (err || !user) return res.status(404).json({ status: 'error', message: 'User not found' });

        db.get(
            `SELECT * FROM otp_verifications WHERE user_id = ? AND otp_type = 'email' AND is_used = 0 ORDER BY created_at DESC LIMIT 1`,
            [user.id],
            async (err, record) => {
                if (err || !record) return res.status(400).json({ status: 'error', message: 'No pending OTP found' });

                if (new Date(record.expires_at) < new Date()) {
                    return res.status(400).json({ status: 'error', message: 'OTP has expired' });
                }

                if (record.attempt_count >= MAX_VERIFICATION_ATTEMPTS) {
                    return res.status(400).json({ status: 'error', message: 'Maximum verification attempts exceeded' });
                }

                const isValid = await bcrypt.compare(otp.toString(), record.otp_hash);

                db.run(`UPDATE otp_verifications SET attempt_count = attempt_count + 1 WHERE id = ?`, [record.id]);

                if (!isValid) return res.status(400).json({ status: 'error', message: 'Invalid OTP' });

                db.run(`UPDATE otp_verifications SET is_used = 1 WHERE id = ?`, [record.id]);
                db.run(`UPDATE users SET email_verified = 1 WHERE id = ?`, [user.id]);

                res.json({ status: 'success', message: 'Email verified successfully' });
            }
        );
    });
});

// Verify Phone OTP
app.post('/api/auth/verify-phone-otp', async (req, res) => {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ status: 'error', message: 'Phone and OTP required' });

    db.get(`SELECT id FROM users WHERE phone = ?`, [phone], (err, user) => {
        if (err || !user) return res.status(404).json({ status: 'error', message: 'User not found' });

        db.get(
            `SELECT * FROM otp_verifications WHERE user_id = ? AND otp_type = 'phone' AND is_used = 0 ORDER BY created_at DESC LIMIT 1`,
            [user.id],
            async (err, record) => {
                if (err || !record) return res.status(400).json({ status: 'error', message: 'No pending OTP found' });

                if (new Date(record.expires_at) < new Date()) {
                    return res.status(400).json({ status: 'error', message: 'OTP has expired' });
                }

                if (record.attempt_count >= MAX_VERIFICATION_ATTEMPTS) {
                    return res.status(400).json({ status: 'error', message: 'Maximum verification attempts exceeded' });
                }

                const isValid = await bcrypt.compare(otp.toString(), record.otp_hash);

                db.run(`UPDATE otp_verifications SET attempt_count = attempt_count + 1 WHERE id = ?`, [record.id]);

                if (!isValid) return res.status(400).json({ status: 'error', message: 'Invalid OTP' });

                db.run(`UPDATE otp_verifications SET is_used = 1 WHERE id = ?`, [record.id]);
                db.run(`UPDATE users SET phone_verified = 1 WHERE id = ?`, [user.id]);

                res.json({ status: 'success', message: 'Phone verified successfully' });
            }
        );
    });
});

// Phone OTP Login
app.post('/api/auth/login-phone', async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ status: 'error', message: 'Phone is required' });

    db.get(`SELECT * FROM users WHERE phone = ?`, [phone], async (err, user) => {
        if (err || !user) return res.status(404).json({ status: 'error', message: 'User with this phone not found' });

        if (!user.phone_verified) return res.status(403).json({ status: 'error', message: 'Phone number NOT verified. Please sign up and verify first.' });

        const otp = generateSecureOTP();
        const otpHash = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000).toISOString();

        db.run(
            `INSERT INTO otp_verifications (user_id, otp_hash, otp_type, expires_at) VALUES (?, ?, ?, ?)`,
            [user.id, otpHash, 'login', expiresAt],
            async (err) => {
                if (err) return res.status(500).json({ status: 'error', message: 'Database error' });

                await sendPhoneOTPViaService(phone, otp);
                res.json({ status: 'success', message: 'Login OTP sent to phone successfully' });
            }
        );
    });
});

// Verify Login OTP
app.post('/api/auth/verify-login-otp', async (req, res) => {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ status: 'error', message: 'Phone and OTP required' });

    db.get(`SELECT * FROM users WHERE phone = ?`, [phone], (err, user) => {
        if (err || !user) return res.status(404).json({ status: 'error', message: 'User not found' });

        db.get(
            `SELECT * FROM otp_verifications WHERE user_id = ? AND otp_type = 'login' AND is_used = 0 ORDER BY created_at DESC LIMIT 1`,
            [user.id],
            async (err, record) => {
                if (err || !record) return res.status(400).json({ status: 'error', message: 'No pending login OTP found' });

                if (new Date(record.expires_at) < new Date()) {
                    return res.status(400).json({ status: 'error', message: 'OTP has expired' });
                }

                if (record.attempt_count >= MAX_VERIFICATION_ATTEMPTS) return res.status(400).json({ status: 'error', message: 'Maximum attempts exceeded' });

                const isValid = await bcrypt.compare(otp.toString(), record.otp_hash);
                db.run(`UPDATE otp_verifications SET attempt_count = attempt_count + 1 WHERE id = ?`, [record.id]);

                if (!isValid) return res.status(400).json({ status: 'error', message: 'Invalid OTP' });

                db.run(`UPDATE otp_verifications SET is_used = 1 WHERE id = ?`, [record.id]);

                // Create JWT Token
                const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: 'user' }, JWT_SECRET, { expiresIn: '24h' });

                res.json({
                    status: 'success',
                    message: 'Login successful',
                    token,
                    user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: 'user' }
                });
            }
        );
    });
});

// Regular Login (Email + Password)
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ status: 'error', message: 'Email and password required' });

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err || !user) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

        if (!user.email_verified) return res.status(403).json({ status: 'error', message: 'Email not verified. Please verify your email first.' });

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: 'user' }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            status: 'success',
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: 'user' }
        });
    });
});

// Get All Users (Admin Feature)
app.get('/api/auth/users', async (req, res) => {
    db.all(`SELECT id, name, email, phone, phone_verified, created_at, status FROM users`, [], (err, rows) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message });
        res.json({ status: 'success', data: rows });
    });
});

// Update User Status (Block/Active)
app.put('/api/auth/users/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.run(`UPDATE users SET status = ? WHERE id = ?`, [status, id], function (err) {
        if (err) return res.status(500).json({ status: 'error', message: err.message });
        res.json({ status: 'success', message: 'User status updated successfully' });
    });
});

// Delete User
app.delete('/api/auth/users/:id', async (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM otp_verifications WHERE user_id = ?`, [id], (err) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message });
        db.run(`DELETE FROM bookings WHERE user_phone = (SELECT phone FROM users WHERE id = ?)`, [id], (err2) => {
            if (err2) return res.status(500).json({ status: 'error', message: err2.message });
            db.run(`DELETE FROM users WHERE id = ?`, [id], function (err3) {
                if (err3) return res.status(500).json({ status: 'error', message: err3.message });
                res.json({ status: 'success', message: 'User deleted successfully' });
            });
        });
    });
});

// Contact Form Handlers
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ status: 'error', message: 'All fields are required' });

    db.run(
        `INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)`,
        [name, email, message],
        function (err) {
            if (err) return res.status(500).json({ status: 'error', message: err.message });
            res.status(200).json({ status: 'success', message: 'Message sent successfully!', message_id: this.lastID });
        }
    );
});

app.get('/api/contact', async (req, res) => {
    db.all(`SELECT * FROM contact_messages ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ status: 'error', message: err.message });
        res.json({ status: 'success', data: rows });
    });
});

app.delete('/api/contact/:id', async (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM contact_messages WHERE id = ?`, [id], function (err) {
        if (err) return res.status(500).json({ status: 'error', message: err.message });
        res.json({ status: 'success', message: 'Message deleted successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Node OTP Auth server running on http://localhost:${PORT}`);
});
