# Twitter Thread Scheduler MVP

A lightweight Node.js service that accepts webhook payloads with tweet arrays, schedules them for execution, and posts them sequentially as Twitter threads using the X API v2.

## 🚀 Features

- **Webhook Integration**: Accepts POST requests with tweet arrays
- **Thread Scheduling**: Schedules execution with configurable delays
- **Sequential Posting**: Posts tweets as a connected thread
- **Comprehensive Logging**: Detailed console logs for monitoring
- **Error Handling**: Robust error handling with retry logic
- **Thread Management**: View, cancel, and monitor scheduled threads
- **Rate Limit Respect**: Built-in delays between tweets

## 📋 Prerequisites

- Node.js (v14 or higher)
- Twitter Developer Account with API access
- Bearer Token (OAuth 2.0 App-only)

## 🛠 Installation

1. **Clone or download the project files**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your Twitter Bearer Token:**
   ```bash
   # Windows PowerShell
   $env:TWITTER_BEARER_TOKEN="your_bearer_token_here"
   
   # Windows Command Prompt
   set TWITTER_BEARER_TOKEN=your_bearer_token_here
   
   # Linux/Mac
   export TWITTER_BEARER_TOKEN="your_bearer_token_here"
   ```

## 🚀 Usage

### Starting the Server

```bash
# Start the server
npm start

# Or for development with auto-restart
npm run dev
```

The server will start on `http://localhost:3000` by default.

### API Endpoints

#### 1. Health Check
```bash
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "scheduledThreads": 2
}
```

#### 2. Schedule Thread
```bash
POST /schedule-thread
Content-Type: application/json

{
  "texts": [
    "First tweet in the thread",
    "Second tweet with more details",
    "Third tweet with conclusions"
  ],
  "delayMs": 60000
}
```

**Response:**
```json
{
  "success": true,
  "threadId": "thread_1705312200000_abc123def",
  "scheduledAt": "2024-01-15T10:30:00.000Z",
  "executionTime": "2024-01-15T10:31:00.000Z",
  "tweetCount": 3
}
```



## 🧪 Testing

Run the test client to verify everything works:

```bash
node test-client.js
```

This will:
1. Check server health
2. Schedule a sample thread
3. Monitor thread status
4. List all threads

## 📝 Example Usage with cURL

### Schedule a Thread
```bash
curl -X POST http://localhost:3000/schedule-thread \
  -H "Content-Type: application/json" \
  -d '{
    "texts": [
      "🚀 Just launched my new project!",
      "✨ Built with Node.js and Express",
      "📈 Already getting great feedback!"
    ],
    "delayMs": 30000
  }'
```

### Check Thread Status
```bash
curl http://localhost:3000/thread/thread_1705312200000_abc123def
```

### List All Threads
```bash
curl http://localhost:3000/threads
```

## 🔧 Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)
- `TWITTER_BEARER_TOKEN`: Your Twitter API Bearer Token

### Rate Limiting

The service includes built-in delays:
- 2 seconds between tweets in a thread
- Configurable delay before thread execution starts

## 📊 Console Logging

The service provides comprehensive logging:

```
[2024-01-15T10:30:00.000Z] [INFO] 🚀 Twitter Thread Scheduler MVP started on port 3000
[2024-01-15T10:30:05.000Z] [INFO] 📨 Received thread scheduling request
[2024-01-15T10:30:05.000Z] [INFO] 📋 Thread details:
[2024-01-15T10:30:05.000Z] [INFO]    ID: thread_1705312205000_abc123def
[2024-01-15T10:30:05.000Z] [INFO]    Tweet count: 3
[2024-01-15T10:30:05.000Z] [INFO]    Delay: 30000ms
[2024-01-15T10:30:35.000Z] [INFO] 🚀 Executing scheduled thread thread_1705312205000_abc123def
[2024-01-15T10:30:35.000Z] [INFO] 🚀 Starting to post thread with 3 tweets
[2024-01-15T10:30:35.000Z] [INFO] 📝 Posting tweet 1/3
[2024-01-15T10:30:35.000Z] [INFO] Attempting to post tweet: "🚀 Just launched my new project!"
[2024-01-15T10:30:36.000Z] [INFO] ✅ Successfully posted tweet with ID: 1234567890123456789
```

## ⚠️ Important Notes

### Authentication Requirements

**⚠️ CRITICAL**: The service requires a **user context Bearer Token**, not an app-only token. App-only tokens are read-only and cannot post tweets.

To get a user context token:
1. Use OAuth 1.0a or OAuth 2.0 with user context
2. The token must have write permissions
3. Follow Twitter's [Create Post API documentation](https://docs.x.com/x-api/posts/create-post)

### Thread Creation Process

Threads are created by:
1. Posting the first tweet
2. Using the returned tweet ID in the `reply.in_reply_to_tweet_id` field for subsequent tweets
3. Repeating this process for each tweet in the thread

### Error Handling

The service includes:
- Input validation
- HTTP error handling
- Retry logic for failed requests
- Graceful error logging
- Thread status tracking

## 🚨 Troubleshooting

### Common Issues

1. **"Bearer Token not configured"**
   - Set the `TWITTER_BEARER_TOKEN` environment variable
   - Ensure you're using a user context token, not app-only

2. **"HTTP 401: Unauthorized"**
   - Check your Bearer Token is valid
   - Ensure the token has write permissions
   - Verify the token hasn't expired

3. **"Maximum 25 tweets allowed per thread"**
   - Twitter has a limit of 25 tweets per thread
   - Reduce the number of tweets in your request

4. **"Tweet exceeds 280 character limit"**
   - Twitter's character limit is 280 characters per tweet
   - Shorten your tweet text

### Debug Mode

For detailed debugging, check the console logs. All operations are logged with timestamps and status information.

## 📚 API References

- [X API Create Post](https://docs.x.com/x-api/posts/create-post)
- [Twitter Thread Documentation](Thread.md)
- [Project Blueprint](Blueprint.md)

## 🤝 Contributing

This is an MVP implementation. Feel free to extend with:
- Database persistence
- Advanced scheduling
- Media upload support
- Webhook notifications
- Rate limit optimization

## 📄 License

MIT License - feel free to use and modify as needed. 