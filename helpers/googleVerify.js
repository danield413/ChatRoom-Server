const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client( '06ZerZ-VsH7RI9yVvwa7Poz7' );

const googleVerify = async ( idToken ) => {

    const ticket = await client.verifyIdToken({ idToken, audience: '257430794857-ifhr62u2i59t0snq8a3q4gns6k8or9a6.apps.googleusercontent.com' });

    const { name, email } = ticket.getPayload();
    
    return { name, email };

}

module.exports = {
    googleVerify
}