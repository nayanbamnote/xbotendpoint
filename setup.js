const fs = require('fs');
const path = require('path');

console.log('🔧 Twitter Thread Poster Setup\n');

// Check if .env file already exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists. Skipping setup.');
    console.log('💡 If you need to update your configuration, edit the .env file manually.');
    process.exit(0);
}

// Create .env file content
const envContent = `# Twitter API Configuration
# Get your Bearer Token from: https://developer.twitter.com/en/portal/dashboard
TWITTER_BEARER_TOKEN=YOUR_BEARER_TOKEN_HERE

# Twitter API Base URL (usually don't change this)
TWITTER_API_BASE=https://api.x.com/2/tweets

# Server Configuration
PORT=3000

# Thread Configuration
MAX_TWEETS_PER_THREAD=25
DELAY_BETWEEN_TWEETS=10000
`;

try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Edit the .env file and replace YOUR_BEARER_TOKEN_HERE with your actual Twitter Bearer Token');
    console.log('2. Get your Bearer Token from: https://developer.twitter.com/en/portal/dashboard');
    console.log('3. Run: npm start');
    console.log('4. Test with: node test-client.js');
    console.log('\n⚠️  Important: Never commit your .env file to version control!');
} catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
    console.log('\n📝 Please create a .env file manually with the following content:');
    console.log(envContent);
} 