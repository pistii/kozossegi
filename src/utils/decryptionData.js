import * as CryptoJS from "crypto-js";

export function decrypt(encryptedBytes, key) {     
      //var key = CryptoJS.enc.Utf8.parse(encryptedBytes);
      var keybytes = CryptoJS.enc.Utf8.parse(key);

      //   console.log("cipherbytes utf8" + CryptoJS.enc.Utf8.parse(encryptedBytes))
      //   console.log("cipherbytes base64" + CryptoJS.enc.Base64.parse(encryptedBytes))
      //   console.log("cipherbytes hex" + CryptoJS.enc.Hex.parse(encryptedBytes))

      var decrypted = CryptoJS.AES.decrypt(encryptedBytes, keybytes, {
            key: keybytes,
            iv: CryptoJS.lib.WordArray.create(16),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
      });

      return decrypted.toString(CryptoJS.enc.Utf8);
}