var mongoose = require('mongoose');

const schema = new mongoose.Schema(
	{
		
		appCode: { type: String, trim: true, unique: true },
		quota: { type: Number, default: 0 },
		isActive: { type: Boolean, default: true },
		allowedDomains: [{ type: String, trim: true }],
		defaultSender: { type: String, trim: true, required: true },
		
		apiKeys: [
			{
				title: { type: String, trim: true },
				key: { type: String, trim: true },
			}
		],

	},

);
 
module.exports = mongoose.model('Emisor', schema);