const dotenv = require('dotenv');
dotenv.config();
const {OAuth2Client} = require('google-auth-library');

/* Generate AUTH URL. */
async function generateAuthUrl(req, res) {
    try {
        res.header('Access-Control-Allow-Origin', 'https://localhost:3001');
        res.header("Access-Control-Allow-Credentials", "true");
        res.header('Referrer-Policy', 'no-referrer-when-downgrade');

        const redirectUrl = 'https://localhost:3000/api/oauth';

        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirectUrl
        );

        const authorizeUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
            prompt: 'consent'
        });

        res.json({url: authorizeUrl});

    } catch (error) {
        console.error("Error generating auth URL:", error);
        res
            .status(500)
            .json({ error: "Internal Server Error", message: error.message});
    }
}

module.exports = {
    generateAuthUrl
};