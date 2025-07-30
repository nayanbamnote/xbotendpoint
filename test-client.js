const fetch = require('node-fetch');

// Test configuration - using live production endpoint
const SERVER_URL = 'https://xbotendpoint.onrender.com';

// Test request body matching the format from reqestbody.md
const testThreadData = {
    "tweet1": "Midjourney just launched its first AI video model.\n\nThese videos are surprisingly rich and diverse 💭\n\n5 great examples + resources:\n\n1/ Steampunk airplane taking off https://t.co/C9wo0m6jak",
    "tweet2": "2/ Grok 4's neural cosmos visualization https://t.co/QHslMyKCgo",
    "tweet3": "3/ Artistic AI animations #AIart https://t.co/Ot9k26I6V0",
    "tweet4": "4/ Mysterious 'somewhere out there' video https://t.co/6Zi4Ln7T6f",
    "tweet5": "5/ Midjourney Veo 3 video demonstration https://t.co/ctwzpetaU4",
    "closingTweet": "If you liked this thread, follow [@AIxFunding] and comment/repost/like so we can provide more AI knowledge! Cheers",
    "scheduledTime": "2025-07-30T06:13:09Z",
    "index": 1
};

async function testHealthCheck() {
    console.log('🔍 Testing health check...');
    try {
        const response = await fetch(`${SERVER_URL}/health`);
        const data = await response.json();
        console.log('✅ Health check response:', JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        console.error('❌ Health check failed:', error.message);
        return null;
    }
}

async function testThreadPosting() {
    console.log('\n📨 Testing thread posting...');
    console.log('📋 Request body:', JSON.stringify(testThreadData, null, 2));
    
    try {
        const response = await fetch(`${SERVER_URL}/post-thread`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testThreadData)
        });

        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Thread posted successfully!');
            console.log('📊 Response:', JSON.stringify(data, null, 2));
        } else {
            console.error('❌ Thread posting failed:', response.status, response.statusText);
            console.error('📊 Error response:', JSON.stringify(data, null, 2));
        }
        
        return data;
    } catch (error) {
        console.error('❌ Thread posting request failed:', error.message);
        return null;
    }
}

async function runTests() {
    console.log('🚀 Starting Twitter Thread Poster Tests');
    console.log(`🌐 Testing against: ${SERVER_URL}\n`);
    
    // Test 1: Health Check
    const healthData = await testHealthCheck();
    
    if (!healthData) {
        console.log('❌ Server is not responding. Please check if the service is running.');
        return;
    }
    
    // Test 2: Thread Posting
    await testThreadPosting();
    
    console.log('\n🏁 Tests completed!');
}

// Run the tests
runTests().catch(console.error); 