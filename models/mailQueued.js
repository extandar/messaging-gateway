var mongoose = require('mongoose');

const schema = new mongoose.Schema(
	{
		
		emisor: { type: mongoose.ObjectId, required: true, ref:"Emisor" },
		messageId: { type: String, trim: true },
		status: { type: String, enum:['queued','sent','delivered','errored'] , index: true},
		priority: { type: String, enum: ['high', 'medium', 'low'] },
		to: { type: String, trim: true, required: true },
		from: { type: String, trim: true, required: true },
		subject: { type: String, trim: true, required: true },
		text: { type: String, trim: true, required: true },
		html: { type: String, trim: true, required: true },
		attachments: [
	    	{
				filename: { type: String, trim: true },
				type: { type: String, trim: true },
		    }
		],
		provider: { type: String, trim: true },
		schedule: { type: Date, index: true },
		events: [
			{
				status:  { type: String, enum:['queued','sent','delivered','errored'] },
				date: { type: Date },
				info: { type: String },
			}
		],
	},

);
 
module.exports = mongoose.model('MailQueued', schema);