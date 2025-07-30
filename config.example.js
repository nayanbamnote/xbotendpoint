// Example configuration file
// Copy this to config.js and update with your values

module.exports = {
    // Twitter API Configuration
    // Replace with your actual Bearer Token from Twitter Developer Portal
    // IMPORTANT: Use a user context token, not app-only token
    TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN || 'your_bearer_token_here',
    
    // Server Configuration
    PORT: process.env.PORT || 3000,
    
    // API Configuration
    TWITTER_API_BASE: 'https://api.x.com/2/tweets',
    
    // Rate Limiting
    DELAY_BETWEEN_TWEETS: 2000, // 2 seconds between tweets in a thread
    MAX_TWEETS_PER_THREAD: 25,  // Twitter's limit
    
    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || 'INFO'
}; 