const crypto = require('crypto');


/**
 * Generates a secret key of the specified length.
 * @param {number} [length=64] - The length of the secret key in bytes.
 * @returns {void}
 */
const generateSecrete = (length = 64) => crypto.randomBytes(length, (err, buffer) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(buffer.toString('hex'));
  });

generateSecrete();
