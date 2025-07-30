require('dotenv').config();
const express = require('express');
const { TwitterApi } = require('twitter-api-v2');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Configuration
const config = require('./config.example.js');

// Initialize Twitter API client
let twitterClient;

// Utility function for logging with timestamps
const log = (message, type = 'INFO') => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${type}] ${message}`);
};

// Utility function for error logging
const logError = (message, error = null) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR] ${message}`);
    if (error) {
        console.error(`[${timestamp}] [ERROR] Details:`, error);
    }
};

// Initialize Twitter API client
const initializeTwitterClient = () => {
    try {
        twitterClient = new TwitterApi({
            appKey: config.TWITTER_API_KEY,
            appSecret: config.TWITTER_API_SECRET,
            accessToken: config.TWITTER_ACCESS_TOKEN,
            accessSecret: config.TWITTER_ACCESS_TOKEN_SECRET,
        });
        log('✅ Twitter API client initialized successfully');
        return true;
    } catch (error) {
        logError('Failed to initialize Twitter API client', error);
        return false;
    }
};

// Validate OAuth 1.0a Credentials
const validateOAuthCredentials = () => {
    const requiredCredentials = [
        { key: 'TWITTER_API_KEY', value: config.TWITTER_API_KEY },
        { key: 'TWITTER_API_SECRET', value: config.TWITTER_API_SECRET },
        { key: 'TWITTER_ACCESS_TOKEN', value: config.TWITTER_ACCESS_TOKEN },
        { key: 'TWITTER_ACCESS_TOKEN_SECRET', value: config.TWITTER_ACCESS_TOKEN_SECRET }
    ];

    for (const credential of requiredCredentials) {
        if (!credential.value || credential.value.includes('YOUR_') || credential.value.includes('HERE')) {
            logError(`${credential.key} not configured. Please set ${credential.key} environment variable.`);
            return false;
        }
    }
    return true;
};

// Test Twitter API connection
const testTwitterConnection = async () => {
    try {
        const user = await twitterClient.v2.me();
        log(`✅ Twitter API connection test successful. Connected as: @${user.data.username}`);
        return true;
    } catch (error) {
        logError('Twitter API connection test failed', error);
        return false;
    }
};

// Post a single tweet
const postTweet = async (text, replyToTweetId = null) => {
    try {
        const tweetOptions = {
            text: text
        };

        // If this is a reply, add the reply configuration
        if (replyToTweetId) {
            tweetOptions.reply = {
                in_reply_to_tweet_id: replyToTweetId
            };
        }

        const tweet = await twitterClient.v2.tweet(tweetOptions);
        return tweet.data.id;
    } catch (error) {
        logError('Error posting tweet', error);
        throw error;
    }
};

// Convert request body format to array of tweets
const parseThreadFromRequestBody = (body) => {
    const tweets = [];
    
    // Extract numbered tweets (tweet1, tweet2, tweet3, etc.)
    let tweetIndex = 1;
    while (body[`tweet${tweetIndex}`]) {
        tweets.push(body[`tweet${tweetIndex}`]);
        tweetIndex++;
    }
    
    // Add closing tweet if present
    if (body.closingTweet) {
        tweets.push(body.closingTweet);
    }
    
    return tweets;
};

// Post a complete thread
const postThread = async (texts) => {
    log(`🚀 Starting to post thread with ${texts.length} tweets`);
    
    const tweetIds = [];
    let previousTweetId = null;

    for (let i = 0; i < texts.length; i++) {
        const text = texts[i];
        const tweetNumber = i + 1;
        
        log(`📝 Posting tweet ${tweetNumber}/${texts.length}`);
        log(`📄 Tweet content: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
        
        try {
            const tweetId = await postTweet(text, previousTweetId);
            tweetIds.push(tweetId);
            previousTweetId = tweetId;
            
            log(`✅ Tweet ${tweetNumber} posted successfully with ID: ${tweetId}`);
            
            // Add delay between tweets (except for the last one)
            if (i < texts.length - 1) {
                const delay = config.DELAY_BETWEEN_TWEETS;
                log(`⏳ Waiting ${delay}ms (${delay/1000} seconds) before next tweet...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        } catch (error) {
            logError(`Failed to post tweet ${tweetNumber}`, error);
            log(`❌ Thread posting aborted. Successfully posted ${tweetIds.length} tweets.`);
            throw error;
        }
    }

    log(`🎉 Thread completed successfully! Posted ${tweetIds.length} tweets`);
    log(`📋 Tweet IDs: ${tweetIds.join(', ')}`);
    
    return tweetIds;
};

// API Routes

// Health check endpoint
app.get('/health', async (req, res) => {
    log('Health check requested');
    
    const oauthValid = validateOAuthCredentials();
    let connectionTest = false;
    let userInfo = null;
    
    if (oauthValid && twitterClient) {
        try {
            const user = await twitterClient.v2.me();
            connectionTest = true;
            userInfo = {
                username: user.data.username,
                name: user.data.name,
                id: user.data.id
            };
        } catch (error) {
            connectionTest = false;
        }
    }
    
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        config: {
            maxTweetsPerThread: config.MAX_TWEETS_PER_THREAD,
            delayBetweenTweets: config.DELAY_BETWEEN_TWEETS,
            oauthCredentialsConfigured: oauthValid,
            twitterApiLibrary: 'twitter-api-v2',
            connectionTest: connectionTest,
            connectedUser: userInfo
        }
    });
});

// Post thread endpoint
app.post('/post-thread', async (req, res) => {
    log('📨 Received thread posting request');
    
    try {
        // Validate OAuth 1.0a Credentials and client
        if (!validateOAuthCredentials() || !twitterClient) {
            return res.status(500).json({ 
                error: 'Twitter API not configured properly. Please check your credentials.' 
            });
        }

        // Parse the request body to extract tweets
        const tweets = parseThreadFromRequestBody(req.body);
        
        log(`📋 Parsed ${tweets.length} tweets from request body`);

        // Validate input
        if (tweets.length === 0) {
            logError('Invalid request: no tweets found in request body');
            return res.status(400).json({ 
                error: 'No tweets found in request body. Expected format: { tweet1: "...", tweet2: "...", closingTweet: "..." }' 
            });
        }

        if (tweets.length > config.MAX_TWEETS_PER_THREAD) {
            logError(`Invalid request: maximum ${config.MAX_TWEETS_PER_THREAD} tweets allowed per thread`);
            return res.status(400).json({ 
                error: `Maximum ${config.MAX_TWEETS_PER_THREAD} tweets allowed per thread` 
            });
        }

        // Validate each tweet text
        for (let i = 0; i < tweets.length; i++) {
            const text = tweets[i];
            if (!text || typeof text !== 'string' || text.trim().length === 0) {
                logError(`Invalid tweet text at index ${i}: must be non-empty string`);
                return res.status(400).json({ 
                    error: `Invalid tweet text at index ${i}: must be non-empty string` 
                });
            }
            
            if (text.length > 280) {
                logError(`Tweet at index ${i} exceeds 280 character limit (${text.length} chars)`);
                return res.status(400).json({ 
                    error: `Tweet at index ${i} exceeds 280 character limit (${text.length} chars)` 
                });
            }
        }

        // Generate unique thread ID
        const threadId = `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        log(`📋 Thread details:`);
        log(`   ID: ${threadId}`);
        log(`   Tweet count: ${tweets.length}`);
        log(`   Starting execution immediately...`);

        // Start posting the thread immediately
        const tweetIds = await postThread(tweets);

        res.status(200).json({
            success: true,
            threadId,
            completedAt: new Date().toISOString(),
            tweetCount: tweets.length,
            tweetIds: tweetIds,
            message: `Successfully posted ${tweets.length} tweets as a thread`
        });

    } catch (error) {
        logError('Error processing thread posting request', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

// Start server
app.listen(PORT, async () => {
    log(`🚀 Twitter Thread Poster started on port ${PORT}`);
    log(`📡 Health check: http://localhost:${PORT}/health`);
    log(`📨 Post thread: POST http://localhost:${PORT}/post-thread`);
    
    // Initialize Twitter client
    const credentialsValid = validateOAuthCredentials();
    if (credentialsValid) {
        const clientInitialized = initializeTwitterClient();
        if (clientInitialized) {
            // Test connection
            await testTwitterConnection();
        }
    } else {
        logError('⚠️  WARNING: Twitter API credentials not configured. Set TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, and TWITTER_ACCESS_TOKEN_SECRET environment variables.');
    }
    
    log(`⚙️  Configuration:`);
    log(`   Max tweets per thread: ${config.MAX_TWEETS_PER_THREAD}`);
    log(`   Delay between tweets: ${config.DELAY_BETWEEN_TWEETS}ms`);
    log(`   Twitter API library: twitter-api-v2 (modern)`);
});