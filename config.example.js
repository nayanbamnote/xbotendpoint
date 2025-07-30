// Configuration file - copy this to .env and fill in your values
module.exports = {
    // Twitter API Configuration
    TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN || 'YOUR_BEARER_TOKEN_HERE',
    TWITTER_API_BASE: process.env.TWITTER_API_BASE || 'https://api.x.com/2/tweets',
    
    // Server Configuration
    PORT: process.env.PORT || 3000,
    
    // Thread Configuration
    MAX_TWEETS_PER_THREAD: parseInt(process.env.MAX_TWEETS_PER_THREAD) || 25,
    DELAY_BETWEEN_TWEETS: parseInt(process.env.DELAY_BETWEEN_TWEETS) || 10000
}; 