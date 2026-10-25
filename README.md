<div align="center">

<img src="assets/logo.svg" alt="Buffalo IDE logo" width="360" />

# Buffalo IDE

**Code at full strength.**

An AI-powered IDE that generates code from natural language, built with React, Express, and npm workspaces.

<br />

![Status](https://img.shields.io/badge/status-ready%20to%20deploy-10B981?style=for-the-badge)

<br />

![npm workspaces](https://img.shields.io/badge/npm_workspaces-CB3837?style=flat-square&logo=npm&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=flat-square&logo=rabbitmq&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=flat-square&logo=langchain&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-1C3C3C?style=flat-square)

</div>

---

> [!TIP]
> 🚀 **Ready to Deploy.** Buffalo IDE is feature-complete for its initial release. See [Deployment](#-deployment) to get it running.

## 📖 About

Buffalo IDE is an AI-powered development environment. Describe what you want to build in natural language and the IDE generates working code from scratch, rather than only enhancing or autocompleting code you have already written.

It pairs a React frontend with an Express backend organized as microservices, communicating asynchronously through RabbitMQ. AI workflows are built with LangChain and LangGraph on top of LLMs. The whole project lives in a single npm workspaces repository.

## ✨ Features

| Feature | Description |
| --- | --- |
| 🤖 **AI code generation** | Generate new code from natural language prompts |
| 🧠 **Agent workflows** | Multi-step AI workflows built with LangChain and LangGraph |
| 🧩 **Microservice backend** | Message-driven Express services communicating via RabbitMQ |
| ☁️ **Media uploads** | Asset and media handling through Cloudinary |
| 🔐 **Sessions and caching** | Redis-backed sessions and fast data access |

<!-- VERIFY: add features that actually exist (editor, file tree, projects, etc.) and remove any that don't. -->

## 🧰 Tech Stack

| Layer | Technologies |
| --- | --- |
| **Monorepo** | npm workspaces |
| **Frontend** | React, Tailwind CSS |
| **Backend** | Express, TypeScript |
| **Data** | MongoDB with Mongoose, Redis (sessions and caching) |
| **Messaging** | RabbitMQ |
| **AI** | LLMs, LangChain, LangGraph |
| **Media** | Cloudinary |
| **Infrastructure** | Docker, Docker Compose |

## 🏗️ Architecture

```mermaid
flowchart LR
    Client["React Frontend"]
    Gateway["Express API Gateway"]

    subgraph Services["Express Microservices"]
        Auth["Auth Service"]
        Project["Project Service"]
        AISvc["AI Service"]
    end

    subgraph AIStack["AI Layer"]
        LC["LangChain"]
        LG["LangGraph"]
        LLM["LLMs"]
    end

    Mongo[("MongoDB")]
    Redis[("Redis")]
    MQ{{"RabbitMQ"}}
    Cloud["Cloudinary"]

    Client -->|"HTTP"| Gateway
    Gateway --> Redis
    Gateway --> MQ
    MQ <--> Auth
    MQ <--> Project
    MQ <--> AISvc

    Auth --> Mongo
    Project --> Mongo
    Project --> Cloud

    AISvc --> LC
    LC --> LG
    LG --> LLM
```

<!-- VERIFY: service names and which services use Mongo/Redis/Cloudinary are inferred. Adjust to match the actual code. -->

## 📁 Project Structure

```text
buffalo-ide/
├── apps/          # React frontend (and backend services, if kept here)
├── packages/      # Express services and shared packages
├── assets/        # Logo and static README assets
└── package.json   # npm workspaces root
```

<!-- VERIFY: replace with the actual workspace layout from the "workspaces" field in the root package.json. -->

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- Docker and Docker Compose

### Installation

```bash
git clone <your-repository-url>
cd buffalo-ide
npm install
```

### Configuration

<!-- VERIFY: document the real environment files and variables (e.g. from .env.example). None are listed here to avoid inaccuracies. -->

Create the required environment files for MongoDB, Redis, RabbitMQ, Cloudinary, and your LLM provider as described in the repository's example env files. Never commit secrets.

### Run locally

```bash
# Start infrastructure (verify the Compose file path and service names)
docker compose up -d

# Run a script in a specific workspace (replace the placeholders)
npm run <script> --workspace=<workspace-name>
```

<!-- VERIFY: replace with the exact scripts defined in each workspace's package.json. -->

## 🚢 Deployment

1. Provision MongoDB, Redis, and RabbitMQ (managed services or containers).
2. Set production environment variables for every service, including Cloudinary and your LLM provider keys.
3. Build and start the stack:

```bash
npm run build
docker compose up -d --build
```

<!-- VERIFY: confirm the root build script, the production Compose file name (e.g. -f docker-compose.prod.yml), and the host/platform you deploy to. -->

## 🗺️ Roadmap

- [x] 🤖 AI code generation from natural language
- [x] 🧠 LangGraph agent workflows
- [x] 🧩 Core microservices and message-driven communication
- [x] ☁️ Cloudinary media uploads
- [ ] 🧪 Expanded testing and CI/CD
- [ ] 📈 Monitoring and observability

<!-- VERIFY: adjust checkmarks and planned items to match reality. -->

## 📄 License

A license has not yet been specified for this project.

<!-- VERIFY: if a LICENSE file exists in the repository, replace this section with its name and a link. -->

---

<div align="center">

**Buffalo IDE** · Code at full strength.

</div>
