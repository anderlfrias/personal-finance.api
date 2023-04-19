module.exports = {
  apps: [{
    name: 'WalletAdm API',
    script: './app.js',
    autorestart: true,
    env: {
      PORT: 80,
    }
  }]
};
