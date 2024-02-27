import * as CryptoJS from "crypto-js";

/*
used contents:
https://medium.com/@adarsh-d/aes-encryption-and-decryption-in-javascript-using-cryptojs-81b57205711d
https://medium.com/@adarsh-d/encryption-and-decryption-using-c-and-js-954d3836753a
https://nirav-parmar.medium.com/c-file-encryption-and-decryption-protecting-your-data-4a27ca6790cf
https://www.tabnine.com/code/javascript/functions/crypto-js/Pkcs7
*/
export function encryptionData(data, pass) {
    var emailBytes = CryptoJS.enc.Utf8.parse(data);
    var key = CryptoJS.enc.Utf8.parse(pass);
    var ivBytes = CryptoJS.lib.WordArray.random();
    
    const encryptedMessage = {};
    const code = CryptoJS.AES.encrypt(emailBytes, key, { 
        iv: ivBytes,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    encryptedMessage.iv = ivBytes;
    encryptedMessage.data = code.ciphertext.toString(CryptoJS.enc.Base64);
    //console.log("elküldött data: " + encryptedMessage)
    return encryptedMessage;
}
