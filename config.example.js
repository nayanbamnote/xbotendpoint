// Configuration file - copy this to .env and fill in your values
module.exports = {
    // Twitter API Configuration - OAuth 1.0a User Context (required for posting tweets)
    TWITTER_API_KEY: process.env.TWITTER_API_KEY || 'YOUR_API_KEY_HERE',
    TWITTER_API_SECRET: process.env.TWITTER_API_SECRET || 'YOUR_API_SECRET_HERE',
    TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN_HERE',
    TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET || 'YOUR_ACCESS_TOKEN_SECRET_HERE',
    
    // Legacy Bearer Token (for read-only operations if needed)
    TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN || 'YOUR_BEARER_TOKEN_HERE',
    TWITTER_API_BASE: process.env.TWITTER_API_BASE || 'https://api.twitter.com/2/tweets',
    
    // Server Configuration
    PORT: process.env.PORT || 3000,
    
    // Thread Configuration
    MAX_TWEETS_PER_THREAD: parseInt(process.env.MAX_TWEETS_PER_THREAD) || 25,
    DELAY_BETWEEN_TWEETS: 10000
}; 