const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Test routes
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CityGuide API is running!' });
});

app.post('/api/auth/register', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Registration successful (test mode)',
    token: 'test-token',
    user: { id: '1', name: 'Test User', email: 'test@example.com' }
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Login successful (test mode)',
    token: 'test-token',
    user: { id: '1', name: 'Test User', email: 'test@example.com' }
  });
});

app.get('/api/cities', (req, res) => {
  res.json({
    success: true,
    data: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune']
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}/api`);
});

console.log('Starting simple server with CORS enabled...');