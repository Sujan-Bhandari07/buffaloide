<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100" width="400" height="100" role="img" aria-label="Buffalo IDE">
  <defs>
    <linearGradient id="horn" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#6366F1"/>
      <stop offset="1" stop-color="#8B5CF6"/>
    </linearGradient>
    <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FDE68A"/>
      <stop offset="1" stop-color="#F59E0B"/>
    </linearGradient>
  </defs>

  <!-- Buffalo horns -->
  <path d="M12 30 C12 52 26 62 40 62 L40 52 C32 52 24 46 22 30 Z" fill="url(#horn)"/>
  <path d="M88 30 C88 52 74 62 60 62 L60 52 C68 52 76 46 78 30 Z" fill="url(#horn)"/>

  <!-- Head -->
  <rect x="34" y="40" width="32" height="46" rx="12" fill="url(#horn)"/>

  <!-- Code brackets on head -->
  <g stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <polyline points="46,55 40,63 46,71"/>
    <polyline points="54,55 60,63 54,71"/>
  </g>

  <!-- AI spark -->
  <path d="M50 8 L53 17 L62 20 L53 23 L50 32 L47 23 L38 20 L47 17 Z" fill="url(#spark)"/>

  <!-- Wordmark -->
  <text x="110" y="62" font-family="Inter, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="44" font-weight="700" fill="#4F46E5" letter-spacing="1">Buffalo</text>
  <text x="298" y="62" font-family="Inter, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="44" font-weight="300" fill="#F59E0B" letter-spacing="1">IDE</text>
  <text x="112" y="84" font-family="Inter, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="11" font-weight="500" fill="#8B5CF6" letter-spacing="3">CODE AT FULL STRENGTH</text>
</svg>

# Buffalo IDE

**Code at full strength.**

An AI-powered IDE that generates code from natural language, built with React, Express, and npm workspaces.

<br />

![Status](https://img.shields.io/badge/status-currently%20in%20development-F59E0B?style=for-the-badge)

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

> [!NOTE]
> 🚧 **Currently in Development.** Buffalo IDE is under active development. Features, APIs, and architecture may change, and the project is not yet production-ready.

## 📖 About

Buffalo IDE is an AI-powered development environment. Describe what you want to build in natural language and the IDE generates working code from scratch, rather than only enhancing or autocompleting code you have already written.

It pairs a React frontend with an Express backend organized as microservices, communicating asynchronously through RabbitMQ. AI workflows are built with LangChain and LangGraph on top of LLMs. The whole project lives in a single npm workspaces repository.

## ✨ Features

| Feature | Description | Status |
| --- | --- | --- |
| 🤖 **AI code generation** | Generate new code from natural language prompts | 🚧 In development |
| 🧠 **Agent workflows** | Multi-step AI workflows built with LangChain and LangGraph | 🚧 In development |
| ⚡ **Real-time communication** | Live updates between the IDE and backend over WebSockets | 🚧 In development |
| 🧩 **Microservice backend** | Message-driven Express services communicating via RabbitMQ | 🚧 In development |
| ☁️ **Media uploads** | Asset and media handling through Cloudinary | 🚧 In development |
| 🔐 **Sessions and caching** | Redis-backed sessions and fast data access | 🚧 In development |

<!-- VERIFY: update each status to ✅ Available as features are completed, and add features that actually exist (editor, file tree, projects, etc.). -->

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
        RT["Real-time Service"]
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
    Client <-->|"WebSockets"| RT
    Gateway --> Redis
    Gateway --> MQ
    MQ <--> Auth
    MQ <--> Project
    MQ <--> AISvc
    MQ <--> RT

    Auth --> Mongo
    Project --> Mongo
    Project --> Cloud

    AISvc --> LC
    LC --> LG
    LG --> LLM
```

<!-- VERIFY: service names, which services use Mongo/Redis/Cloudinary, and the WebSocket host service are inferred. Adjust to match the actual code. -->

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

Create the required environment files for MongoDB, Redis, RabbitMQ, Cloudinary, and your LLM provider as described in the repository's example env files.

### Run

```bash
# Start infrastructure (verify the Compose file path and service names)
docker compose up -d

# Run a script in a specific workspace (replace the placeholders)
npm run <script> --workspace=<workspace-name>
```

<!-- VERIFY: replace with the exact scripts defined in each workspace's package.json. -->

## 🗺️ Roadmap

- [ ] 🤖 AI code generation from natural language
- [ ] 🧠 LangGraph agent workflows
- [ ] ⚡ Real-time communication over WebSockets
- [ ] 🧩 Core microservices and message-driven communication
- [ ] ☁️ Cloudinary media uploads
- [ ] 🧪 Testing and CI/CD
- [ ] 🚢 Production deployment

<!-- VERIFY: tick items that are complete and add or remove items to match your plans. -->

## 📄 License

A license has not yet been specified for this project.

<!-- VERIFY: if a LICENSE file exists in the repository, replace this section with its name and a link. -->

---

<div align="center">

**Buffalo IDE** · Code at full strength.

</div>
