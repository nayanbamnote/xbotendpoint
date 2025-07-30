const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

// Test data - sample thread
const testThread = {
    texts: [
        "🚀 Just launched my new project! Here's what I built...",
        "✨ Key features include:\n• Real-time updates\n• Beautiful UI\n• Scalable architecture",
        "🔧 Built with:\n• Node.js\n• Express\n• Modern JavaScript",
        "📈 Results so far:\n• 1000+ users\n• 99.9% uptime\n• Great feedback!",
        "🎯 Next steps:\n• Mobile app\n• API documentation\n• Community features\n\nWhat would you like to see next?"
    ],
    delayMs: 10000 // 10 seconds delay for testing
};

// Utility function for logging
const log = (message) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
};

// Test functions
const testHealthCheck = async () => {
    log('🏥 Testing health check...');
    try {
        const response = await fetch(`${BASE_URL}/health`);
        const data = await response.json();
        log(`✅ Health check passed: ${JSON.stringify(data, null, 2)}`);
        return true;
    } catch (error) {
        log(`❌ Health check failed: ${error.message}`);
        return false;
    }
};

const testScheduleThread = async () => {
    log('📨 Testing thread scheduling...');
    try {
        const response = await fetch(`${BASE_URL}/schedule-thread`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testThread)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            log(`✅ Thread scheduled successfully: ${JSON.stringify(data, null, 2)}`);
            return data.threadId;
        } else {
            log(`❌ Thread scheduling failed: ${JSON.stringify(data, null, 2)}`);
            return null;
        }
    } catch (error) {
        log(`❌ Thread scheduling error: ${error.message}`);
        return null;
    }
};

const testGetThreadStatus = async (threadId) => {
    log(`📊 Testing thread status for: ${threadId}`);
    try {
        const response = await fetch(`${BASE_URL}/thread/${threadId}`);
        const data = await response.json();
        
        if (response.ok) {
            log(`✅ Thread status: ${JSON.stringify(data, null, 2)}`);
            return data;
        } else {
            log(`❌ Failed to get thread status: ${JSON.stringify(data, null, 2)}`);
            return null;
        }
    } catch (error) {
        log(`❌ Thread status error: ${error.message}`);
        return null;
    }
};

const testListThreads = async () => {
    log('📋 Testing list threads...');
    try {
        const response = await fetch(`${BASE_URL}/threads`);
        const data = await response.json();
        
        if (response.ok) {
            log(`✅ Threads list: ${JSON.stringify(data, null, 2)}`);
            return data;
        } else {
            log(`❌ Failed to list threads: ${JSON.stringify(data, null, 2)}`);
            return null;
        }
    } catch (error) {
        log(`❌ List threads error: ${error.message}`);
        return null;
    }
};

const testCancelThread = async (threadId) => {
    log(`❌ Testing thread cancellation for: ${threadId}`);
    try {
        const response = await fetch(`${BASE_URL}/thread/${threadId}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        
        if (response.ok) {
            log(`✅ Thread cancelled successfully: ${JSON.stringify(data, null, 2)}`);
            return true;
        } else {
            log(`❌ Failed to cancel thread: ${JSON.stringify(data, null, 2)}`);
            return false;
        }
    } catch (error) {
        log(`❌ Thread cancellation error: ${error.message}`);
        return false;
    }
};

// Main test runner
const runTests = async () => {
    log('🧪 Starting Twitter Thread Scheduler Tests...');
    
    // Test 1: Health check
    const healthOk = await testHealthCheck();
    if (!healthOk) {
        log('❌ Server not running. Please start the server first with: npm start');
        return;
    }
    
    // Test 2: Schedule a thread
    const threadId = await testScheduleThread();
    if (!threadId) {
        log('❌ Failed to schedule thread. Stopping tests.');
        return;
    }
    
    // Test 3: Get thread status immediately
    await testGetThreadStatus(threadId);
    
    // Test 4: List all threads
    await testListThreads();
    
    // Test 5: Wait a bit and check status again
    log('⏳ Waiting 5 seconds before checking status again...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    await testGetThreadStatus(threadId);
    
    // Test 6: Cancel the thread (optional - comment out if you want to see it execute)
    // await testCancelThread(threadId);
    
    log('🎉 All tests completed!');
    log(`💡 To monitor the thread execution, check: http://localhost:3000/thread/${threadId}`);
};

// Run tests if this file is executed directly
if (require.main === module) {
    runTests().catch(error => {
        log(`💥 Test runner error: ${error.message}`);
        process.exit(1);
    });
}

module.exports = {
    testHealthCheck,
    testScheduleThread,
    testGetThreadStatus,
    testListThreads,
    testCancelThread
}; 