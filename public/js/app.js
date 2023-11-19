let oidcClient = null;

const configureClient = async () => {
    // OIDC configuration
    const oidcConfig = {
        authority: 'https://dev-nwrnemwv5k4qzw0m.us.auth0.com',
        client_id: 'AguPJO5FklsMz75dYqVcVngnbKo7nnPB',
        redirect_uri: window.location.origin,
        response_type: 'code',
        scope: 'openid profile',
        metadata: {
            "authorization_endpoint": "https://dev-nwrnemwv5k4qzw0m.us.auth0.com/authorize",
            "end_session_endpoint": "https://dev-nwrnemwv5k4qzw0m.us.auth0.com/logout?client_id=AguPJO5FklsMz75dYqVcVngnbKo7nnPB&returnTo=http://localhost:3000/",
            "issuer": "https://dev-nwrnemwv5k4qzw0m.us.auth0.com/",
            "jwks_uri": "https://dev-nwrnemwv5k4qzw0m.us.auth0.com/.well-known/jwks.json",
            "userinfo_endpoint": "https://dev-nwrnemwv5k4qzw0m.us.auth0.com/userinfo",
            "token_endpoint": "https://dev-nwrnemwv5k4qzw0m.us.auth0.com/oauth/token"
        }
    };

    oidcClient = new Oidc.UserManager(oidcConfig);
};

window.onload = async () => {
    await configureClient();

    updateUI();

    // Check for the token and state parameters
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {

        // Process the login state for OIDC
        await oidcClient.signinRedirectCallback();

        updateUI();

        // Use replaceState to redirect the user away and remove the querystring parameters
        window.history.replaceState({}, document.title, "/");
    }
};

// Update the UI based on authentication status for both Auth0 and OIDC
const updateUI = async () => {
    const isAuthenticatedOIDC = await oidcClient.getUser();

    document.getElementById("btn-logout").disabled = !isAuthenticatedOIDC;
    document.getElementById("btn-login").disabled = isAuthenticatedOIDC;

    // Show/hide gated content after authentication
    if (isAuthenticatedOIDC) {
        document.getElementById("gated-content").classList.remove("hidden");

        // Display information from OIDC
        const user = await oidcClient.getUser();
        document.getElementById("ipt-access-token").innerHTML = user.access_token;
        document.getElementById("ipt-user-profile").textContent = JSON.stringify(user.profile);
        // You can customize the display of user information here

    } else {
        document.getElementById("gated-content").classList.add("hidden");
    }
};

// Login function for Auth0 and OIDC
const login = async () => {
    // Redirect the user to the OIDC provider for login
    await oidcClient.signinRedirect();
};

// Logout function for Auth0 and OIDC
const logout = async () => {
    // Redirect the user to the OIDC provider for logout
    await oidcClient.signoutRedirect();
};