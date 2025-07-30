# Twitter Thread Scheduler MVP (Bearer‑Token + Raw HTTP)

## 🎯 Overview

A lightweight Node.js service that accepts a webhook payload (an array of text tweets), schedules them for execution, and posts them sequentially as a thread using raw HTTP requests authenticated via a Bearer Token (OAuth 2.0 App-only).

## 🚀 Features

1. Accepts HTTP payload with a list of tweet texts.
2. Schedules execution via `setTimeout` (or simple scheduler).
3. Posts first tweet, then replies to previous tweet IDs to form a thread.
4. Runs on local host for rapid prototyping.


## 📨 Authorization Header

Include in every request:
Authorization: Bearer YOUR_BEARER_TOKEN


Passing in the header ensures authenticated access to v2 endpoints :contentReference[oaicite:2]{index=2}.

## 🧱 Architecture

### 1. **n8n Webhook Trigger**
- Sends a POST request to `http://localhost:<port>/schedule-thread` with JSON payload:
  ```json
  { 
    "texts": ["First tweet", "Second tweet", … up to 5], 
    "delayMs": 60000 
  }
  
2. Node.js Endpoint Handler
Validates incoming array.

Stores in local memory or minimal persistent store.

Schedules execution using setTimeout or other scheduler.

3. Thread Posting Logic
HTTP POST to https://api.twitter.com/2/tweets with JSON:
{ "text": "First tweet" }

Capture returned id from response.

For each subsequent tweet, send:{
  "text": "Next tweet",
  "reply": { "in_reply_to_tweet_id": "previousTweetId" }
}
Repeat sequentially to form the thread.

4. Error Handling & Logging
On HTTP error, retry with simple backoff.

Log success or failure, final tweet IDs, or error reason.

🔁 Rate Limits & Auth Context
App-only Bearer Token is read-only; it cannot post tweets—attempts will be rejected with unauthorized error. Supported methods for posting require user context (OAuth 1.0a or OAuth 2.0 user token) 
Stack Overflow
.

To post, you must use user context tokens, not just app-only Bearer Token.