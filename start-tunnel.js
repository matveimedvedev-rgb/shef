import ngrok from 'ngrok';

(async function() {
  try {
    const url = await ngrok.connect({
      addr: 5173,
      authtoken: process.env.NGROK_AUTHTOKEN || null, // Optional: set NGROK_AUTHTOKEN env var if needed
    });
    
    console.log('\n✅ Public URL created!');
    console.log('🌐 Share this URL with anyone:');
    console.log(`   ${url}\n`);
    console.log('Press Ctrl+C to stop the tunnel.\n');
  } catch (error) {
    console.error('Error starting ngrok:', error.message);
    console.log('\n💡 If you see an authentication error:');
    console.log('   1. Sign up at https://dashboard.ngrok.com/signup');
    console.log('   2. Get your authtoken from https://dashboard.ngrok.com/get-started/your-authtoken');
    console.log('   3. Run: set NGROK_AUTHTOKEN=your_token_here');
    console.log('   4. Then run this script again\n');
  }
})();

