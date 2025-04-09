const dotenv = require('dotenv');
dotenv.config();
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch'); // Add this import

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
        return res.status(400).json({ error: 'No authorization code provided' });
    }
    
    try {
        const redirectUrl = 'https://localhost:3000/api/oauth';
        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirectUrl
        );
        
        console.log("Client ID:", process.env.CLIENT_ID.substring(0, 5) + "...");
        console.log("Redirect URL:", redirectUrl);
        
        const tokenResponse = await oAuth2Client.getToken(code);
        console.log("Token response received");
        
        await oAuth2Client.setCredentials(tokenResponse.tokens);
        console.log('Tokens acquired');
        
        const user = oAuth2Client.credentials;
        
        const userData = await getUserData(user.access_token);
        console.log("User data retrieved:", userData.email || userData.sub); // Log identifier
        
        
        // For now, just redirect to dashboard
        res.redirect('https://localhost:3001/dashboard');
        
    } catch(err) {
        console.error('Error with signing in with Google:', err.message);
        console.error(err.stack);
        
        // Redirect to frontend with error
        res.redirect('https://localhost:3001/login?error=auth_failed');
    } 
}

module.exports = {
    getData
};