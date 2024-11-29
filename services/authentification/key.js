const crypto = require('crypto');

const secretKey = crypto.randomBytes(32).toString('base64');
console.log(secretKey);

//mE9+BL18O7i3H743g6Got5eJFqCxwKi1OxYoMkuyNVs=