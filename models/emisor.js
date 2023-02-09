var mongoose = require('mongoose');

const schema = new mongoose.Schema(
	{
		
		title: { type: String, trim: true },

		isActive: { type: Boolean, default: true },
		
		apiKeys: [
			{
				key: { type: String, trim: true, unique: true },
				title: { type: String, trim: true },

				//Email settings

				emailProviders: [{ type: String, trim: true }],
				defaultEmailProvider: { type: String, trim: true },

				emailSender: {
					name: { type: String, trim: true },
					email: { type: String, trim: true },
					password: { type: String, trim: true }, //Needed for smtp authentication
				},

			}
		],

	},

);
 
module.exports = mongoose.model('Emisor', schema);