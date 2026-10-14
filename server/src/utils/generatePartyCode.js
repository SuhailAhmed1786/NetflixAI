
const crypto = require('crypto')

const generatePartyCode = () => {
  // Generate a random 6-character party code
  return crypto.randomBytes(4).toString("hex").slice(0, 6).toUpperCase();
};


module.exports = {generatePartyCode}
