const express = require('express');
const { join } = require('path');
const jwt = require('jsonwebtoken');
const jwksRsa = require('jwks-rsa');
const app = express();

app.use(express.static(join(__dirname, 'public')));

// Serve the index page for all requests
app.get('/*', (_, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

// OIDC configuration
const oidcConfig = {
    authority: 'https://dev-nwrnemwv5k4qzw0m.us.auth0.com',
    client_id: 'AguPJO5FklsMz75dYqVcVngnbKo7nnPB',
    redirect_uri: 'http://localhost:3000/', // Specify your callback URL
    response_type: 'code',
    scope: 'openid profile',
};

// OIDC token validation middleware
const validateAccessToken = (req, res, next) => {
    const accessToken = req.header('Authorization');

    if (!accessToken) {
        return res.status(401).json({ error: 'Unauthorized: Access token missing' });
    }

    const jwksUrl = 'https://dev-nwrnemwv5k4qzw0m.us.auth0.com/.well-known/jwks.json';
    const audience = 'AguPJO5FklsMz75dYqVcVngnbKo7nnPB';

    const options = { algorithms: ['RS256'], audience };

    const getKey = (header, callback) => {
        jwksRsa({ jwksUri: jwksUrl }).getSigningKey(header.kid, (_, key) => {
            const signingKey = key.publicKey || key.rsaPublicKey;
            callback(null, signingKey);
        });
    };

    jwt.verify(accessToken, getKey, options, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized: Invalid access token' });
        }

        req.user = decoded;
        next();
    });
};

// Apply OIDC token validation middleware to protected routes
app.use('/api', validateAccessToken);

// Listen on port 3000
app.listen(3000, () => console.log('Application running on http://localhost:3000'));
