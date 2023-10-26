# Admin Dashboard

## Introduction

This repository houses the main services for the Admin Dashboard which include Claim Page, Dashboard, and DCC (Digital Credential Consortium) Services. The services are organized within separate directories and are dockerized for easy setup and deployment.

## Directory Structure

```plaintext
.
├── packages
│   └── claim-page
├── services
│   ├── payload
│   └── dcc-services
└── compose.yaml
```

## Services

### Claim Page

Located inside `packages/claim-page`, this service handles the webpage that users see when claiming
a credential.

- **Environment Setup**:
    - A sample environment file is provided as `.env.sample`.
    - Copy `.env.sample` to `.env` and replace the dummy values with actual values for your setup.

### Dashboard

Located inside `services/payload`, this service provides the dashboard functionality for the application.

- **Environment Setup**:
    - A sample environment file is provided as `.env.sample`.
    - Copy `.env.sample` to `.env` and replace the dummy values with actual values for your setup.

### DCC Services

Located inside `services/dcc-services`, this service handles digital credential consortium functionalities. This includes three sub-services each with its own environment configuration:

- Coordinator Service
- Signing Service
- Status Service

- **Environment Setup**:
    - Sample environment files are provided for each service as `.coordinator.env.sample`, `.signing-service.env.sample`, and `.status-service.env.sample`.
    - Copy these sample files to `.coordinator.env`, `.signing-service.env`, and `.status-service.env` respectively, replacing the dummy values with actual values for your setup.
    - More information on the configuration can be found [here](https://github.com/digitalcredentials/workflow-coordinator#configuration).

## Deployment

The services are dockerized and a top-level `compose.yaml` is provided to orchestrate the deployment of the Claim Page, Dashboard, and all DCC services.

### Local Deployment

For local deployment, you can use Docker Compose to bring up the services:

```bash
docker-compose -f compose.yaml up
```

### Cloud Deployment

For cloud deployment (e.g., on an AWS EC2 instance), you can also use the provided `compose.yaml` file with Docker Compose. Alternatively, the containers for Claim Page and Dashboard are available on Docker Hub and can be run independently.

```bash
docker-compose -f compose.yaml up -d
```

## Repository

The repository can be found at [https://github.com/learningeconomy/admin-dashboard](https://github.com/learningeconomy/admin-dashboard).

---

**Note:** Ensure that you have Docker and Docker Compose installed on your machine for deploying the services.

This README provides a high-level overview of the services, for more detailed information refer to the README files within each service's directory.

