{
  "version": 2,
  "name": "grither-app",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "ALLOWALL"
        },
        {
          "key": "X-Content-Type-Options", 
          "value": "nosniff"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:; frame-ancestors https://web.telegram.org"
        }
      ]
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}