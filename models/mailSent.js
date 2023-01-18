var mongoose = require('mongoose');

const schema = new mongoose.Schema(
	{
		
		emisor: { type: mongoose.ObjectId, required: true, ref:"Emisor" },
		messageId: { type: String, trim: true, index: true },
		status: { type: String, enum:['queued','sent','delivered','errored'], index: true },
		priority: { type: String, enum: ['high', 'medium', 'low'] },

		from: {
			email: { type: String, trim: true, required: true, index: true },
			name: { type: String, trim: true },
		},
		
		replyTo: {
			email: { type: String, trim: true },
			name: { type: String, trim: true },
		},

		to: [{
				email: { type: String, trim: true },	
				name: { type: String, trim: true }
		}],

		cc: [{
				email: { type: String, trim: true },
				name: { type: String, trim: true }
		}],

		bcc: [{
				email: { type: String, trim: true },
				name: { type: String, trim: true }
		}],
		
		subject: { type: String, trim: true },
		text: { type: String, trim: true },
		html: { type: String, trim: true },
		attachments: [
	    	{
				filename: { type: String, trim: true },
				type: { type: String, trim: true },
				content: { type: String, trim: true },
		    }
		],

		provider: { type: String, trim: true },
		schedule: { type: Date, index: true },
		template: { type: String, trim: true },
		templateData: { type: mongoose.Mixed },

		events: [
			{
				status:  { type: String, enum:['queued','sent','delivered','errored'] },
				date: { type: Date },
				info: { type: String },
			}
		],
	},

);
 
module.exports = mongoose.model('MailSent', schema);