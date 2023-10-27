# Dashboard Service
[![Release Branch](https://img.shields.io/badge/release_branch-main-green.svg)](https://github.com/learningeconomy/admin-dashboard/tree/main)
[![Read the Docs](https://img.shields.io/badge/docs-quickstart-green.svg)](https://docs.learncard.com/)
[![License](https://img.shields.io/badge/license-mit-blue.svg)](https://github.com/learningeconomy/admin-dashboard/blob/main/LICENSE)

<p float="left">
  <img src="https://github.com/learningeconomy/admin-dashboard/assets/2185016/9926ded7-40e9-4f18-a89a-bd788274903e" width="200" />
    <img src="https://github.com/learningeconomy/admin-dashboard/assets/2185016/31882ce0-ce6e-4661-8c42-e64958accfc3" width="350" height="0" /> 
  <img src="https://github.com/learningeconomy/admin-dashboard/assets/2185016/31882ce0-ce6e-4661-8c42-e64958accfc3" width="350" /> 
</p>


This open-source **VC Admin Dashboard** is a joint effort between the [Digital Credentials Consortium at MIT](https://digitalcredentials.mit.edu/) and the [Learning Economy Foundation](https://www.learningeconomy.io). It's designed to provide enterprises, schools, and organizations with a straightforward way to issue Verifiable Credentials in bulk.

## Features:

- **User Management**: Efficient user onboarding and management.
- **Credential Management**: Handle individual credentials—search, view, check status, and revoke.
- **Batch Management**: Manage groups of credentials, such as annual diploma issuances.
- **VC & Email Template Management**: Edit and store templates for credentials and emails.
- **Claim Page**: Allows students to claim and download their credentials.
- **White Label Ready**: Configurable branding options.
- **VC-API & CHAPI Integration**: Compatible with the Verifiable Credential API exchange endpoints and CHAPI.
- **Deployment**: Fully dockerized for ease of deployment.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

[![Stargazers repo roster for @learningeconomy/admin-dashboard](https://reporoster.com/stars/learningeconomy/admin-dashboard)](https://github.com/learningeconomy/admin-dashboard/stargazers)

## Comments, Questions, or Palpitations of the Heart?
The best way to start engaging in the community is to participate in our Github Discussions: 
- [Post an Issue or Ask for Help 💖](https://github.com/learningeconomy/admin-dashboard/issues)

### Dashboard

This service provides the dashboard functionality for the application.

### Environment Setup:
- A sample environment file is provided as `.env.sample`.
- Copy `.env.sample` to `.env` and replace the dummy values with actual values for your setup.

### How to Use

You will need to set an .env file with 'MONGODB_URI' pointed to your mongo database and 'PAYLOAD_SECRET' - this is a secure string that will be used to authenticate with the Dashboard. It can be random but should be at least 14 characters and be very difficult to guess. The Dashboard uses this secret key to generate secure user tokens (JWT). Behind the scenes, we do not use your secret key to encrypt directly - instead, we first take the secret key and create an encrypted string using the SHA-256 hash function. Then, we reduce the encrypted string to its first 32 characters.

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

## License
MIT © [MIT](#)
