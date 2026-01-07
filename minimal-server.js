const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  console.log(`${req.method} ${path}`);
  
  res.setHeader('Content-Type', 'application/json');
  
  if (path === '/api/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, message: 'Minimal server working!' }));
  } else if (path === '/api/auth/register' && req.method === 'POST') {
    res.writeHead(200);
    res.end(JSON.stringify({ 
      success: true, 
      message: 'Registration successful',
      token: 'test-token',
      user: { id: '1', name: 'Test User', email: 'test@example.com' }
    }));
  } else if (path === '/api/auth/login' && req.method === 'POST') {
    res.writeHead(200);
    res.end(JSON.stringify({ 
      success: true, 
      message: 'Login successful',
      token: 'test-token',
      user: { id: '1', name: 'Test User', email: 'test@example.com' }
    }));
  } else if (path === '/api/cities') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune']
    }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ success: false, message: 'Not found' }));
  }
});

server.listen(8080, () => {
  console.log('🚀 Minimal server running on port 8080');
  console.log('📍 Test: http://localhost:8080/api/health');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});