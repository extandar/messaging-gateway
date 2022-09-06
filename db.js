
var mongoose = require('mongoose');

async function main(callback) {

	let URI;

	if(process.env.MONGO_URI){
		URI = process.env.MONGO_URI; // Declare MONGO_URI in your .env file	
	}else{

		const host = process.env.MONGO_HOST
		const port = process.env.MONGO_PORT
		const user = process.env.MONGO_USER
		const pass = process.env.MONGO_PASSWORD
		const database = process.env.MONGO_DATABASE
		const auth_source = process.env.MONGO_AUTH_SOURCE ? `?authSource=${process.env.MONGO_AUTH_SOURCE}` : ''
		const auth = user ? `${user}:${pass}@` : ''

        URI = `mongodb://${auth}${host}:${port}/${database}${auth_source}`
	}

    try {
        
        const connection = await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });

        // Make the appropriate DB calls
        await callback(connection);

    } catch (e) {
        // Catch any errors
        console.error(e);
        throw new Error('Unable to Connect to Database')
    }
}

module.exports = main;