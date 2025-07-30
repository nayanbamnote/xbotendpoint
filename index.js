const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Configuration
const TWITTER_API_BASE = 'https://api.x.com/2/tweets';
const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN || 'YOUR_BEARER_TOKEN_HERE';

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

// Validate Bearer Token
const validateBearerToken = () => {
    if (!BEARER_TOKEN || BEARER_TOKEN === 'YOUR_BEARER_TOKEN_HERE') {
        logError('Bearer Token not configured. Please set TWITTER_BEARER_TOKEN environment variable.');
        return false;
    }
    return true;
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
        
        try {
            const tweetId = await postTweet(text, previousTweetId);
            tweetIds.push(tweetId);
            previousTweetId = tweetId;
            
            // Add 10-second delay between tweets as requested
            if (i < texts.length - 1) {
                const delay = 10000; // 10 seconds between tweets
                log(`⏳ Waiting ${delay}ms (10 seconds) before next tweet...`);
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
app.get('/health', (req, res) => {
    log('Health check requested');
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString()
    });
});

// Post thread endpoint - runs immediately when called
app.post('/post-thread', async (req, res) => {
    log('📨 Received thread posting request');
    
    // Just console log the request body for now
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', JSON.stringify(req.headers, null, 2));
    
    // Return success response immediately
    res.status(200).json({
        success: true,
        message: 'Request received and logged',
        timestamp: new Date().toISOString()
    });
    
    /*
    try {
        // Validate Bearer Token
        if (!validateBearerToken()) {
            return res.status(500).json({ 
                error: 'Bearer Token not configured. Please set TWITTER_BEARER_TOKEN environment variable.' 
            });
        }

        const { texts } = req.body;

        // Validate input
        if (!texts || !Array.isArray(texts) || texts.length === 0) {
            logError('Invalid request: texts array is required and must not be empty');
            return res.status(400).json({ 
                error: 'texts array is required and must not be empty' 
            });
        }

        if (texts.length > 25) {
            logError('Invalid request: maximum 25 tweets allowed per thread');
            return res.status(400).json({ 
                error: 'Maximum 25 tweets allowed per thread' 
            });
        }

        // Validate each tweet text
        for (let i = 0; i < texts.length; i++) {
            const text = texts[i];
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
        log(`   Tweet count: ${texts.length}`);
        log(`   Starting execution immediately...`);

        // Start posting the thread immediately
        const tweetIds = await postThread(texts);

        res.status(200).json({
            success: true,
            threadId,
            completedAt: new Date().toISOString(),
            tweetCount: texts.length,
            tweetIds: tweetIds
        });

    } catch (error) {
        logError('Error processing thread posting request', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
    */
});

// Start server
app.listen(PORT, () => {
    log(`🚀 Twitter Thread Poster started on port ${PORT}`);
    log(`📡 Health check: http://localhost:${PORT}/health`);
    log(`📨 Post thread: POST http://localhost:${PORT}/post-thread`);
    
    if (!validateBearerToken()) {
        logError('⚠️  WARNING: Bearer Token not configured. Set TWITTER_BEARER_TOKEN environment variable.');
    }
});