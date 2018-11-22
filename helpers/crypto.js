var crypto = require('crypto');
var SECRET_KEY = "Th1sAs3creT";
var ENCODING = 'hex';

function encrypt(text){
    var cipher = crypto.createCipher('des-ede3-cbc', SECRET_KEY);
    var retVal = cipher.update(text, 'utf8', ENCODING);
    retVal += cipher.final(ENCODING);
    console.log("Crypted Text:", retVal);
    return retVal;
}

function decrypt(text){
    var decipher = crypto.createDecipher('des-ede3-cbc', SECRET_KEY);
    var retVal = decipher.update(text, ENCODING, 'utf8');
    retVal += decipher.final('utf8');
    console.log("Decrypted Text:", retVal);
    return retVal;
}

module.exports = {
    "encrypt": encrypt,
    "decrypt": decrypt
};
