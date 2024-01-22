const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 5000; 

app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.status(200).end();
        return;
    }
    next();
});

const apiProxy = createProxyMiddleware('/api', {
    target: 'https://api.anaf.ro', 
    changeOrigin: true,
    pathRewrite: {
        '^/api': '', 
    },
    onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*'; 
    }
});

app.use('/api', apiProxy);

app.listen(port, () => {
    console.log(`Serverul proxy rulează pe portul ${port}`);
});
