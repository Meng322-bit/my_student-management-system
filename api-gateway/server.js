const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const REGISTER_URL = process.env.REGISTER_URL || 'http://localhost:5001';
const STUDENT_URL = process.env.STUDENT_URL || 'http://localhost:5002';

app.use(createProxyMiddleware('/register', { target: REGISTER_URL, changeOrigin: true }));
app.use(createProxyMiddleware(['/login', '/students'], { target: STUDENT_URL, changeOrigin: true }));

app.get('/', (req, res) => res.send('API Gateway running'));

app.listen(3000, () => console.log('Gateway on 3000'));