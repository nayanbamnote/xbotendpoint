# Twitter Thread Poster

A lightweight Node.js service for posting Twitter threads via the X API v2.

## Features

- ✅ Post complete Twitter threads with automatic chaining
- ✅ Support for custom delay between tweets
- ✅ Comprehensive error handling and logging
- ✅ Health check endpoint
- ✅ Environment-based configuration

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Twitter API Configuration
# Get your Bearer Token from: https://developer.twitter.com/en/portal/dashboard
TWITTER_BEARER_TOKEN=YOUR_BEARER_TOKEN_HERE

# Twitter API Base URL (usually don't change this)
TWITTER_API_BASE=https://api.x.com/2/tweets

# Server Configuration
PORT=3000

# Thread Configuration
MAX_TWEETS_PER_THREAD=25
DELAY_BETWEEN_TWEETS=10000
```

### 3. Get Your Twitter Bearer Token

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new app or use an existing one
3. Generate a Bearer Token with user context (not app-only)
4. Copy the token to your `.env` file

## Usage

### Production Deployment

The service is live at: **https://xbotendpoint.onrender.com**

### Local Development

Start the server locally:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

### API Endpoints

#### Health Check
```
GET https://xbotendpoint.onrender.com/health
```

#### Post Thread
```
POST https://xbotendpoint.onrender.com/post-thread
```

**Request Body Format:**
```json
{
  "tweet1": "First tweet content...",
  "tweet2": "Second tweet content...",
  "tweet3": "Third tweet content...",
  "closingTweet": "Final tweet with call to action..."
}
```

**Response:**
```json
{
  "success": true,
  "threadId": "thread_1234567890_abc123",
  "completedAt": "2024-01-01T12:00:00.000Z",
  "tweetCount": 4,
  "tweetIds": ["1234567890123456789", "1234567890123456790", ...],
  "message": "Successfully posted 4 tweets as a thread"
}
```

## How It Works

1. **Thread Parsing**: The service automatically extracts numbered tweets (`tweet1`, `tweet2`, etc.) and the `closingTweet` from the request body
2. **Sequential Posting**: Tweets are posted one by one with configurable delays between them
3. **Thread Chaining**: Each subsequent tweet is posted as a reply to the previous one using Twitter's `reply.in_reply_to_tweet_id` parameter
4. **Error Handling**: If any tweet fails, the process stops and returns detailed error information

## Configuration Options

- `MAX_TWEETS_PER_THREAD`: Maximum number of tweets allowed in a single thread (default: 25)
- `DELAY_BETWEEN_TWEETS`: Delay in milliseconds between posting tweets (default: 10000ms = 10 seconds)
- `PORT`: Server port (default: 3000)

## Error Handling

The service includes comprehensive error handling for:
- Invalid Bearer Token
- Twitter API errors
- Invalid request format
- Tweet length validation (280 character limit)
- Network issues

## Logging

All operations are logged with timestamps and include:
- Request processing
- Tweet posting progress
- Success/failure status
- Error details
- Configuration information

## Testing

### Test Live Endpoint

Test the production deployment:
```bash
npm test
```

This will test both the health check and thread posting functionality against the live endpoint.

### Test Locally

If running locally, update the `SERVER_URL` in `test-client.js` to `http://localhost:3000` and run:
```bash
npm test
```

## Security Notes

- Never commit your `.env` file to version control
- Use environment variables for sensitive configuration
- The Bearer Token should have appropriate permissions for posting tweets 