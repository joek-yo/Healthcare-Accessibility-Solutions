const crypto = require('crypto');
const signingKey = crypto.randomBytes(64).toString('base64');
console.log(signingKey);
