// Load environment variables
const config = {
    spotify: {
        clientId: process.env.SPOTIFY_CLIENT_ID || 'your_client_id',
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET || 'your_client_secret'
    }
};

export default config;
