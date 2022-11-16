APP_PORT=8080

stripe listen --forward-to http://localhost:$APP_PORT/stripe/webhooks