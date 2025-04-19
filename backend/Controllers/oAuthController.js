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

    if (!code) {
        return res.status(400).json({ error: "No authorization code provided" });
    }

    try {
        const redirectUrl = "https://localhost:3000/api/oauth"; // Ensure this matches your redirect URI
        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirectUrl
        );

        // Exchange the authorization code for tokens
        const tokenResponse = await oAuth2Client.getToken(code);
        const { tokens } = tokenResponse; // Extract tokens from the response
        const access_token = tokens.access_token; // Get the access_token

        if (!access_token) {
            throw new Error("Access token not found in token response");
        }

        console.log("Access token retrieved:", access_token);

        // Fetch user data using the access token
        const userData = await getUserData(access_token);

        // Check if the user exists in the database
        let dbUser = await User.findOne({
            where: { email: userData.email },
            attributes: ['id', 'email', 'organization_id'], // Include organization_id
        });

        if (!dbUser) {
            // Create a new user if they don't exist
            dbUser = await User.create({
                email: userData.email,
                first_name: userData.given_name || "",
                last_name: userData.family_name || "",
                google_id: userData.sub,
                organization_id: null, // Set a default organization_id if necessary
                password: null,
            });
        }

        // Generate a JWT token for the user
        const jwtToken = jwtGenerator(dbUser); // Pass the full user object to jwtGenerator

        // Redirect to the frontend with the JWT token in the URL
        res.redirect(`https://localhost:3001/signup?jwtToken=${jwtToken}`);
    } catch (err) {
        console.error("Error with signing in with Google:", err.message);
        res.redirect("https://localhost:3001/login?error=auth_failed");
    }
}

module.exports = {
    getData
};