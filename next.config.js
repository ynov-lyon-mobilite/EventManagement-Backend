const withPWA = require('next-pwa');

console.log('ENV', process.env.NODE_ENV);

module.exports = withPWA({
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
  },
});
