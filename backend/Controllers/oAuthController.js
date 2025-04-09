const dotenv = require('dotenv');
dotenv.config();
const { OAuth2Client } = require('google-auth-library');
const { User } = require('../models');
const { jwtGenerator } = require('../utils/jwtGenerator');
const fetch = require('node-fetch'); // Add this import
const crypto = require("crypto");



function generateRandomPassword() {
    return crypto.randomBytes(16).toString("hex"); // Generates a 32-character random string
}

async function getUserData(access_token) {
    try {
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Google API error (${response.status}): ${errorText}`);
            throw new Error(`Google API returned ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('User data retrieved successfully');
        return data;
    } catch (error) {
        console.error('Error getting user data:', error);
        throw error;
    }
}

async function getData(req, res) {
    const code = req.query.code;
    console.log("Received code:", code);

    if (!code) {
        return res.status(400).json({ error: "No authorization code provided" });
    }

    try {
        const redirectUrl = "https://localhost:3000/api/oauth";
        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirectUrl
        );

        const tokenResponse = await oAuth2Client.getToken(code);
        console.log("Token response received");

        await oAuth2Client.setCredentials(tokenResponse.tokens);
        console.log("Tokens acquired");

        const user = oAuth2Client.credentials;
        const userData = await getUserData(user.access_token);
        console.log("User data retrieved:", userData.email || userData.sub);

        // Check if user exists in the database
        let dbUser = await User.findOne({ where: { email: userData.email } });

        if (!dbUser) {
            // Generate a random password for Google-authenticated users
            const randomPassword = generateRandomPassword();

            // Hash the random password before storing it in the database
            const bcrypt = require("bcrypt");
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            // Create a new user if they don't exist
            dbUser = await User.create({
                email: userData.email,
                first_name: userData.given_name || "",
                last_name: userData.family_name || "",
                google_id: userData.sub,
                role_id: 1, // Default role id
                password: hashedPassword, // Store the hashed random password
            });
            console.log("New user created:", dbUser.email);
        }

        // Generate a JWT token
        const jwtToken = jwtGenerator(dbUser.id);

        // Redirect to the frontend with the JWT token in the URL
        res.redirect(`https://localhost:3001/signup?jwtToken=${jwtToken}`);
    } catch (err) {
        console.error("Error with signing in with Google:", err.message);
        console.error(err.stack);

        // Redirect to frontend with error
        res.redirect("https://localhost:3001/login?error=auth_failed");
    }
}

module.exports = {
    getData
};