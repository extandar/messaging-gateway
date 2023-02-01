module.exports = {
  apps : [
  {
    name   : "messaging",
    cwd: "./messaging-gateway/",
    script : "./server.js",
    env: {
	    "NODE_ENV":"production",
			"CORS":"*",
			"SERVICE_PORT":"2010",
			"MONGO_HOST":"127.0.0.1",
			"MONGO_PORT":"27017",
			"MONGO_USER":"",
			"MONGO_PASSWORD":"",
			"MONGO_DATABASE":"",
			"MONGO_AUTH_SOURCE":"admin",
			"API_PREFIX":"messenger",
			"SECRET_KEY":"",
      "LOG_TRANSPORTS":"console,console,console,console",
      "MASTER_KEY":"",
      "MAIL_DEFAULT_PROVIDER":"sendgrid",
      "SENDGRID_API_KEY":"",
      "DEMON_DELAY_TIME":"60000"
	    }
	  }
  ]
}