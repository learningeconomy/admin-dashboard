# admin-dashboard

## How to Use

You will need to set an .env file with 'MONGODB_URI' pointed to your mongo database and 'PAYLOAD_SECRET' - this is a secure string that will be used to authenticate with Payload. It can be random but should be at least 14 characters and be very difficult to guess. Payload uses this secret key to generate secure user tokens (JWT). Behind the scenes, we do not use your secret key to encrypt directly - instead, we first take the secret key and create an encrypted string using the SHA-256 hash function. Then, we reduce the encrypted string to its first 32 characters.

A typical .env file will look like this:
```
MONGODB_URI=mongodb://127.0.0.1/my-app
PAYLOAD_SECRET=your-payload-secret
```

`yarn dev` will start up your application and reload on any changes.

### Docker

If you have docker and docker-compose installed, you can run `docker-compose up`

To build the docker image, run `docker build -t my-tag .`

Ensure you are passing all needed environment variables when starting up your container via `--env-file` or setting them with your deployment.

The 3 typical env vars will be `MONGODB_URI`, `PAYLOAD_SECRET`, and `PAYLOAD_CONFIG_PATH`

`docker run --env-file .env -p 3000:3000 my-tag`
