# Messaging Gateway

This microservice allows you to centralize tasks of to send messages by email and sms

## Features

- Many providers.
- Allows you manage queues by message priority.
- Manage contact list.
- Schedule a message to send at a specific time.
- Manage templates.


## Current transports
	
- Mail
	-Sendmail

## Roadmap

- Templates
- Contact List
- Mail
	- Mailgun provider
	- AWS provider
- SMS
- Whatsapp


## Routes

- /status
- /mail/enqueue
- /emisor/apikey

## Enviroment

- NODE_ENV=development
- LOG_FILE=/app/logs/deploy.logs
- CORS=*
- API_PREFIX=test/auth
- DEFAULT_LANGUAGE=
- SERVICE_PORT=
- MONGO_HOST=
- MONGO_PORT=27017
- MONGO_USER=
- MONGO_PASSWORD=
- MONGO_DATABASE=
- MONGO_AUTH_SOURCE=
- GITHUB_USER=
- GITHUB_TOKEN=
- GITHUB_REPOSITORY=
- GITHUB_BRANCH=
- SECRET_KEY=
- LOG_TRANSPORTS=
- LOG_API_ENDPOINT=
- LOG_API_KEY=
- MASTER_KEY=
- MAIL_DEFAULT_PROVIDER=
- SENDGRID_API_KEY=
- DAEMON_DELAY_TIME=

## Verify

```bash
curl  http://127.0.0.1:PORT/api/messenger/ping
```

## Example
```

curl  -H "Content-Type: application/json" \
-H "X-API-KEY: THISISMYAPIKEY" \
-d '{ "from": { "email":"peter@example.com","name":"Peter Example" },
	"to": { "email":"joan@example.com" },
	"subject":"Testing my email gateway",
	"text":"Hello from the gateway","html":"<h1>Hello from the gateway</h1>" }' \
-X POST http://127.0.0.1:PORT/api/messenger/mail/enqueue

```

