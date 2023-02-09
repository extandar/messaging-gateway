'use strict'

const SECRET_KEY_32 = process.env.SECRET_KEY_32;
const SECRET_KEY_16 = process.env.SECRET_KEY_16;
const { createCipheriv, randomBytes, createDecipheriv } = require('crypto');
const { createHmac } = require('crypto'); 

//const SuperKEY = "el-secreto-del-desarrollador-123";
//const SuperIV = "SDFSVECTORIEJDKS";


const service = {

	encrypt : function( password ){

		const cipher = createCipheriv('aes256', SECRET_KEY_32, SECRET_KEY_16);
		const encryptedPassword = cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
		
		return encryptedPassword;
	},

	decrypt : function( encryptedPassword ){

		const decipher = createDecipheriv('aes256', SECRET_KEY_32, SECRET_KEY_16);
		const decryptedPassword = decipher.update(encryptedPassword, 'hex', 'utf-8') + decipher.final('utf8');
		
		return decryptedPassword;
	}

}

module.exports = service;