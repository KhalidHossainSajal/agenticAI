# AXLE 2.0
## AI Business Agent Platform

> **Build small. Verify everything. Never skip a phase.**

AXLE is a multi-tenant AI agent platform that allows businesses to create AI assistants using their own business knowledge, connect AI providers such as Google Gemini and OpenAI, deploy text and voice agents, receive conversations from websites and external channels, and track usage and billing.

AXLE 2.0 is intentionally being rebuilt from a clean, modular foundation.

The goal is **not** to build everything at once.

The goal is to build one reliable phase at a time.

---

# 🚨 CRITICAL DEVELOPMENT RULE

## NEVER SKIP A PHASE

This is the most important rule in this project.

### The development process is strictly sequential:

```text
PHASE 0
   ↓
VERIFY
   ↓
PHASE 1
   ↓
VERIFY
   ↓
PHASE 2
   ↓
VERIFY
   ↓
PHASE 3
   ↓
VERIFY
   ↓
...
```

### ❌ DO NOT:

- Start Phase 1 while Phase 0 is incomplete.
- Implement future features "because they will be needed later".
- Create placeholder systems for future phases unless explicitly required.
- Build the entire platform in one prompt.
- Add unnecessary dependencies.
- Create microservices prematurely.
- Implement WhatsApp before the core agent works.
- Implement billing before usage tracking exists.
- Implement voice before text agent functionality is stable.
- Implement RAG before the basic AI provider system works.
- Rewrite working code unnecessarily.

### ✅ DO:

1. Complete the current phase.
2. Run the application.
3. Test every requirement.
4. Fix every error.
5. Verify the Definition of Done.
6. Document the result.
7. Commit the completed phase.
8. Only then begin the next phase.

---

# 1. Project Vision

AXLE allows a business to create an AI employee/assistant.

Example:

```text
Business
   │
   ├── Business Information
   │
   ├── Knowledge Base
   │       ├── Website
   │       ├── PDF
   │       ├── DOCX
   │       ├── TXT
   │       ├── FAQ
   │       └── Manual Text
   │
   ├── AI Agent
   │       ├── System Instructions
   │       ├── AI Provider
   │       ├── Model
   │       └── Language
   │
   ├── Voice Agent
   │       ├── STT
   │       ├── AI
   │       └── TTS
   │
   └── Channels
           ├── Website
           ├── API
           ├── Voice
           ├── WhatsApp
           ├── SIP
           └── Phone
```

Visitors can then interact with the business's AI agent.

```text
Visitor
   ↓
Website / Voice / API / WhatsApp / SIP
   ↓
AXLE
   ↓
Business Agent
   ↓
Knowledge Retrieval
   ↓
AI Provider
   ↓
Response
   ↓
Visitor
```

AXLE stores the interaction and calculates usage.

---

# 2. Core Product Flow

The complete product should eventually work like this:

```text
User Login
     ↓
Create Business
     ↓
Business Dashboard
     ↓
Add Knowledge Base
     ↓
AXLE Processes Knowledge
     ↓
Store Knowledge + Embeddings
     ↓
Create AI Agent
     ↓
Select AI Provider + Model
     ↓
Test Agent
     ↓
Enable Voice Agent
     ↓
Configure STT + TTS
     ↓
Generate API / Widget
     ↓
Install Website Widget
     ↓
Visitor Opens Business Website
     ↓
Visitor Talks to AI
     ↓
AI Uses Business Knowledge
     ↓
Conversation Stored
     ↓
Usage Recorded
     ↓
Billing Calculated
```

---

# 3. Technology Stack

## Frontend

```text
React
Vite
TypeScript
Tailwind CSS
```

## Backend

```text
Node.js
TypeScript
Express.js
```

## Database

```text
PostgreSQL
pgvector
```

## AI Providers

Initial providers:

```text
Google Gemini
OpenAI
```

Additional providers may be added later.

## Voice

Initial architecture:

```text
Speech
 ↓
STT
 ↓
LLM
 ↓
TTS
 ↓
Speech
```

Streaming voice optimization comes later.

## Authentication

```text
JWT
```

## Deployment

```text
Docker
Docker Compose
Nginx
PostgreSQL
```

Production target:

```text
Hostinger VPS
```

---

# 4. Architecture Philosophy

AXLE 2.0 must remain simple.

The previous AXLE implementation became too large and difficult to maintain.

Therefore:

## Prefer

```text
Simple
Modular
Testable
Understandable
Maintainable
```

## Avoid

```text
Over-engineering
Premature microservices
Huge files
Circular dependencies
Unnecessary abstractions
Unnecessary packages
Complex orchestration
```

---

# 5. Initial Project Structure

Start with a simple structure.

```text
axle/
│
├── web/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── api/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── providers/
│   │   ├── repositories/
│   │   ├── utils/
│   │   └── server.ts
│   │
│   └── package.json
│
├── database/
│   ├── migrations/
│   ├── schema/
│   └── seed/
│
├── docs/
│
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
├── ARCHITECTURE.md
├── DEVELOPMENT.md
└── AGENTS.md
```

Do not create additional architecture unless there is a real requirement.

---

# 6. Multi-Tenant Architecture

AXLE is a multi-tenant SaaS.

Every business must be isolated.

Example:

```text
Business A
 ├── Agents
 ├── Knowledge
 ├── Conversations
 ├── API Keys
 └── Usage

Business B
 ├── Agents
 ├── Knowledge
 ├── Conversations
 ├── API Keys
 └── Usage
```

Business A must NEVER be able to access Business B's:

- users
- agents
- knowledge
- conversations
- API keys
- usage
- billing information

Every business-owned database record must have an appropriate ownership relationship.

---

# 7. Development Environment

The project must support local development on Windows.

Recommended environment:

```text
Windows 10/11
Node.js LTS
npm
Docker Desktop
Git
VS Code
```

Optional:

```text
Kilo Code
GitHub
Postman / Bruno
```

---

# 8. Environment Variables

Use:

```text
.env
```

Never commit `.env`.

Provide:

```text
.env.example
```

Example:

```env
NODE_ENV=development

PORT=3000

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/axle

JWT_SECRET=change-me

ENCRYPTION_KEY=change-me

GEMINI_API_KEY=

OPENAI_API_KEY=
```

Provider keys may eventually be supplied by businesses through BYOK.

Do not expose provider API keys to the browser.

---

# 9. Security Principles

Security must be designed from the beginning.

Never trust:

```text
Browser
URL parameters
Request body
Headers
Uploaded files
User supplied URLs
External webhooks
```

Validate everything.

Never expose:

```text
DATABASE_URL
JWT_SECRET
ENCRYPTION_KEY
Provider API keys
Internal credentials
```

to frontend clients.

---

# 10. AI Provider Architecture

The application must not directly call Gemini/OpenAI from random routes.

Use a unified provider interface.

Conceptually:

```text
AIProvider
    │
    ├── GeminiProvider
    │
    └── OpenAIProvider
```

Example:

```ts
interface AIProvider {
    chat(input: ChatInput): Promise<ChatResponse>;
}
```

The rest of AXLE should not need to know the internal API implementation of Gemini or OpenAI.

This makes future providers easier to add.

---

# 11. Knowledge Architecture

AXLE uses **RAG**, not model training.

The process is:

```text
Business Document
       ↓
Text Extraction
       ↓
Cleaning
       ↓
Chunking
       ↓
Embedding
       ↓
PostgreSQL + pgvector
```

When a visitor asks a question:

```text
Question
   ↓
Question Embedding
   ↓
Vector Search
   ↓
Relevant Knowledge Chunks
   ↓
Prompt
   ↓
AI Model
   ↓
Answer
```

Do NOT train or fine-tune an AI model for each business.

---

# 12. Voice Architecture

Initial implementation:

```text
Browser Microphone
       ↓
STT
       ↓
AXLE Agent
       ↓
RAG
       ↓
LLM
       ↓
TTS
       ↓
Browser Speaker
```

The first voice version should prioritize:

```text
Reliability
Correctness
Simple debugging
```

not ultra-low latency.

Streaming optimization comes later.

---

# 13. Phase Development System

AXLE development consists of sequential phases.

---

# PHASE 0 — FOUNDATION

## Goal

Create a clean, working AXLE development environment.

## Build

### Frontend

Create:

```text
React
Vite
TypeScript
Tailwind
```

Create a basic AXLE interface.

### Backend

Create:

```text
Node.js
Express
TypeScript
```

Create:

```text
GET /health
```

Expected response:

```json
{
  "status": "ok"
}
```

### Database

Create PostgreSQL connection.

Verify:

```text
Application
     ↓
PostgreSQL
```

### Docker

Create:

```text
docker-compose.yml
```

At minimum:

```text
PostgreSQL
```

The application should be able to connect to the database.

---

## Phase 0 Definition of Done

ALL must work:

- [ ] Repository created.
- [ ] Web application starts.
- [ ] API starts.
- [ ] PostgreSQL starts.
- [ ] API connects to PostgreSQL.
- [ ] `/health` works.
- [ ] Frontend can communicate with API.
- [ ] Docker Compose works.
- [ ] `.env.example` exists.
- [ ] `.gitignore` exists.
- [ ] README exists.
- [ ] ARCHITECTURE.md exists.
- [ ] DEVELOPMENT.md exists.
- [ ] No TypeScript errors.
- [ ] No build errors.

### Required test

```text
Browser
   ↓
React
   ↓
Express
   ↓
PostgreSQL
```

must work successfully.

### STOP CONDITION

If ANY item above fails:

> **DO NOT START PHASE 1.**

---

# PHASE 1 — AUTHENTICATION & BUSINESS

## Goal

A user can create an account and create/manage a business.

## Build

Authentication:

```text
Register
Login
Logout
JWT
```

Database:

```text
users
businesses
business_members
```

Dashboard:

```text
Login
 ↓
Dashboard
 ↓
Create Business
 ↓
Business Dashboard
```

---

## Phase 1 Definition of Done

- [ ] Registration works.
- [ ] Login works.
- [ ] JWT authentication works.
- [ ] Protected API routes work.
- [ ] Business creation works.
- [ ] Business dashboard works.
- [ ] Business settings work.
- [ ] User/business ownership is enforced.
- [ ] Unauthorized users cannot access another business.
- [ ] Database migrations work.
- [ ] Frontend build works.
- [ ] Backend build works.

### STOP CONDITION

If authentication or tenant isolation is not working:

> **DO NOT START PHASE 2.**

---

# PHASE 2 — AI PROVIDERS / BYOK

## Goal

Connect AXLE to AI providers.

Initial providers:

```text
Google Gemini
OpenAI
```

Business dashboard:

```text
AI Providers
    ↓
Provider
    ↓
API Key
    ↓
Model
    ↓
Test Connection
```

Provider keys must be encrypted before storage.

Create:

```text
AIProvider
GeminiProvider
OpenAIProvider
```

---

## Phase 2 Definition of Done

- [ ] Gemini provider works.
- [ ] OpenAI provider works.
- [ ] Provider interface exists.
- [ ] API keys are not exposed to frontend.
- [ ] API keys are encrypted at rest.
- [ ] Business can configure provider.
- [ ] Business can select model.
- [ ] Test Connection works.
- [ ] AI response successfully returns.
- [ ] Provider errors are handled.
- [ ] Provider credentials are tenant-isolated.

### STOP CONDITION

If Gemini/OpenAI calls are unreliable:

> **DO NOT START PHASE 3.**

---

# PHASE 3 — AI AGENT

## Goal

Create a business AI agent.

Agent configuration:

```text
Agent Name
System Instructions
Provider
Model
Temperature
Language
```

Example:

```text
Agent:
Customer Support Agent

Instructions:
You are the customer support assistant for this business.
```

Create a Playground:

```text
User
 ↓
Agent
 ↓
AI Provider
 ↓
Response
```

---

## Phase 3 Definition of Done

- [ ] Agent can be created.
- [ ] Agent can be edited.
- [ ] Agent can be deleted.
- [ ] Agent belongs to a business.
- [ ] Provider can be selected.
- [ ] Model can be selected.
- [ ] System instructions work.
- [ ] Playground works.
- [ ] Conversation context works.
- [ ] Errors are handled.

### STOP CONDITION

If the agent cannot reliably answer through the playground:

> **DO NOT START PHASE 4.**

---

# PHASE 4 — KNOWLEDGE BASE / RAG

## Goal

Allow businesses to teach the AI about their business.

Supported sources:

```text
Website URL
PDF
DOCX
TXT
Manual Text
FAQ
```

Pipeline:

```text
Source
 ↓
Extract
 ↓
Clean
 ↓
Chunk
 ↓
Embed
 ↓
Store
```

Database:

```text
knowledge_bases
knowledge_documents
knowledge_chunks
```

Use:

```text
PostgreSQL
pgvector
```

---

## Retrieval

```text
User Question
 ↓
Embedding
 ↓
Vector Search
 ↓
Top Relevant Chunks
 ↓
Agent Prompt
 ↓
AI
 ↓
Answer
```

---

## Phase 4 Definition of Done

- [ ] Knowledge base can be created.
- [ ] Text can be added.
- [ ] PDF can be processed.
- [ ] TXT can be processed.
- [ ] DOCX can be processed.
- [ ] Website source can be processed.
- [ ] Documents can be listed.
- [ ] Documents can be deleted.
- [ ] Text extraction works.
- [ ] Chunking works.
- [ ] Embeddings are generated.
- [ ] Embeddings are stored in pgvector.
- [ ] Vector search works.
- [ ] Relevant chunks are retrieved.
- [ ] Playground uses retrieved knowledge.
- [ ] Business isolation works.
- [ ] Business A cannot retrieve Business B knowledge.

### STOP CONDITION

If RAG retrieval is unreliable or tenant isolation is broken:

> **DO NOT START PHASE 5.**

---

# PHASE 5 — WEBSITE TEXT CHAT

## Goal

Allow businesses to install an AXLE chat widget on their websites.

Example:

```html
<script src="https://axle.example/widget.js"></script>
```

Visitor:

```text
Business Website
      ↓
AXLE Widget
      ↓
AXLE API
      ↓
Business Agent
      ↓
RAG
      ↓
AI
      ↓
Response
```

---

## Phase 5 Definition of Done

- [ ] Widget loads.
- [ ] Widget opens.
- [ ] Visitor can send a message.
- [ ] Agent responds.
- [ ] RAG works through widget.
- [ ] Business agent is correctly selected.
- [ ] Visitor does not need an AXLE account.
- [ ] Widget works on an external test website.
- [ ] Business isolation works.
- [ ] Errors are handled.

### STOP CONDITION

If the external website widget does not work reliably:

> **DO NOT START PHASE 6.**

---

# PHASE 6 — CONVERSATION SYSTEM

## Goal

Store all conversations.

Database:

```text
conversations
messages
```

Conversation should contain:

```text
business_id
agent_id
session_id
channel
created_at
updated_at
```

Message should contain:

```text
conversation_id
role
content
model
input_tokens
output_tokens
created_at
```

Channels may include:

```text
playground
website
voice
api
whatsapp
sip
phone
```

---

## Dashboard

Business should be able to see:

```text
Conversations
   ↓
Conversation List
   ↓
Conversation Details
```

---

## Phase 6 Definition of Done

- [ ] Conversations are created.
- [ ] Messages are stored.
- [ ] Website conversations are stored.
- [ ] Playground conversations are stored.
- [ ] Conversation history works.
- [ ] Conversation details work.
- [ ] Business isolation works.
- [ ] Pagination works.
- [ ] No sensitive provider keys are stored in messages.

### STOP CONDITION

If conversation storage or tenant isolation fails:

> **DO NOT START PHASE 7.**

---

# PHASE 7 — VOICE AGENT

## Goal

Add voice interaction separately from text chat.

Initial architecture:

```text
Microphone
 ↓
STT
 ↓
AXLE Agent
 ↓
RAG
 ↓
LLM
 ↓
TTS
 ↓
Speaker
```

Dashboard:

```text
Voice Agent
 ├── Enable Voice
 ├── STT Provider
 ├── TTS Provider
 ├── Voice
 └── Language
```

---

## Phase 7 Definition of Done

- [ ] Microphone permission works.
- [ ] Speech is captured.
- [ ] STT works.
- [ ] Agent receives transcript.
- [ ] RAG works.
- [ ] LLM generates response.
- [ ] TTS generates speech.
- [ ] Browser plays response.
- [ ] Voice conversation is stored.
- [ ] Errors are handled.
- [ ] Voice usage can be measured.

### STOP CONDITION

If voice interaction is unstable:

> **DO NOT START PHASE 8.**

---

# PHASE 8 — WEBSITE FLOATING CALL BUTTON

## Goal

Allow website visitors to call/talk to the AI agent.

Example:

```text
┌─────────────────────────┐
│                         │
│     Business Website    │
│                         │
│                         │
│                  ┌────┐ │
│                  │ ☎  │ │
│                  └────┘ │
└─────────────────────────┘
```

Visitor clicks:

```text
Talk to AI
```

Then:

```text
Microphone
 ↓
Voice Agent
 ↓
AI
 ↓
Response
```

---

## MVP Definition of Done

- [ ] Floating button works.
- [ ] Microphone permission works.
- [ ] Voice session starts.
- [ ] Visitor can talk.
- [ ] AI responds.
- [ ] Conversation is stored.
- [ ] Usage is recorded.
- [ ] Widget works on an external website.

---

# 🎯 MVP COMPLETE

After Phase 8, AXLE has a usable MVP.

The business can:

```text
Create Account
      ↓
Create Business
      ↓
Add Knowledge
      ↓
Create AI Agent
      ↓
Test Agent
      ↓
Enable Voice
      ↓
Install Website Widget
      ↓
Receive AI Conversations
```

This is the first major product milestone.

---

# PHASE 9 — PUBLIC API

Create public APIs.

Example:

```http
POST /api/v1/chat
POST /api/v1/voice/session

GET /api/v1/agent
GET /api/v1/conversations
GET /api/v1/usage
```

Businesses receive API keys.

Dashboard:

```text
Developer
 ├── API Keys
 ├── Webhooks
 ├── API Documentation
 └── Usage
```

---

## Definition of Done

- [ ] API keys can be generated.
- [ ] API keys can be revoked.
- [ ] API authentication works.
- [ ] Chat API works.
- [ ] Voice session API works.
- [ ] API usage is recorded.
- [ ] Rate limits exist.
- [ ] Tenant isolation works.
- [ ] API documentation exists.

---

# PHASE 10 — EXTERNAL CHANNELS

Implement one channel at a time.

## 10A — WhatsApp

```text
WhatsApp
 ↓
AXLE
 ↓
Agent
 ↓
Response
```

## 10B — SIP

```text
SIP
 ↓
Voice Gateway
 ↓
AXLE
 ↓
Agent
```

## 10C — Phone

Potential provider:

```text
Twilio
```

Do not implement all channels simultaneously.

---

# PHASE 11 — USAGE TRACKING & BILLING ENGINE

Track AI usage.

For text:

```text
Provider
Model
Input Tokens
Output Tokens
Request Count
```

For voice:

```text
STT Seconds
TTS Usage
Call Duration
AI Tokens
```

Calculate:

```text
Provider Cost
      ↓
AXLE Usage
      ↓
Customer Billing
```

Dashboard:

```text
Usage
 ├── AI Requests
 ├── Tokens
 ├── Voice Minutes
 ├── Estimated Cost
 └── Current Period
```

---

# PHASE 12 — SUBSCRIPTION SYSTEM

Example plans:

```text
Free
Starter
Business
Enterprise
```

Possible limits:

```text
Agents
Knowledge Storage
AI Requests
Tokens
Voice Minutes
API Requests
Channels
```

Do not implement subscription billing before Phase 11 usage tracking is reliable.

---

# PHASE 13 — SECURITY & PRODUCTION HARDENING

Perform a complete security review.

Requirements include:

- [ ] Tenant isolation
- [ ] Authentication review
- [ ] Authorization review
- [ ] API key rotation
- [ ] Encryption
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Input validation
- [ ] File upload restrictions
- [ ] File size limits
- [ ] URL validation
- [ ] SSRF protection
- [ ] Prompt injection defenses
- [ ] Tool restrictions
- [ ] Audit logs
- [ ] Usage limits
- [ ] Database backups
- [ ] Error handling
- [ ] Secure headers

Never trust external URLs.

Never allow a business's knowledge importer to access internal/private network resources.

---

# PHASE 14 — ADMIN PANEL

AXLE administrators should be able to view:

```text
Businesses
Users
Agents
Knowledge Bases
Conversations
Usage
API Requests
Providers
Billing
System Health
Logs
```

Admin access must be completely separated from normal business users.

---

# PHASE 15 — PRODUCTION DEPLOYMENT

Production target:

```text
Hostinger VPS
```

Architecture:

```text
Internet
   ↓
Nginx
   ↓
AXLE Web
   ↓
AXLE API
   ↓
PostgreSQL
   ↓
pgvector
```

Optional later:

```text
Redis
Queue Worker
```

Deployment requirements:

- [ ] Docker production configuration
- [ ] Nginx
- [ ] SSL
- [ ] PostgreSQL
- [ ] pgvector
- [ ] Environment secrets
- [ ] Database backups
- [ ] Log management
- [ ] Health monitoring
- [ ] Restart policy
- [ ] Production CORS
- [ ] Production rate limits

---

# 14. Features NOT TO BUILD YET

These are deliberately postponed.

Do not build them unless a future phase explicitly requires them.

```text
❌ Visual workflow builder
❌ Complex multi-agent orchestration
❌ Autonomous agents
❌ Agent marketplace
❌ MCP marketplace
❌ 20+ AI providers
❌ Kubernetes
❌ Microservices
❌ Custom LLM training
❌ Fine-tuning platform
❌ Complex event engine
❌ Enterprise workflow engine
```

The objective is to build a reliable product first.

---

# 15. Database Principles

Use PostgreSQL as the primary database.

Never create a fake in-memory production database.

Development may use test fixtures, but production logic must use PostgreSQL.

Potential tables:

```text
users
businesses
business_members

ai_providers
ai_provider_credentials

agents

knowledge_bases
knowledge_documents
knowledge_chunks

conversations
messages

api_keys

usage_records

subscriptions
billing_records
```

Tables should be introduced only when required by their phase.

Do not create 50 tables during Phase 0.

---

# 16. API Design Principles

Use predictable REST endpoints.

Example:

```text
/api/auth/*
/api/businesses/*
/api/agents/*
/api/knowledge/*
/api/conversations/*
/api/providers/*
/api/voice/*
/api/v1/*
```

Use appropriate HTTP methods:

```text
GET
POST
PUT/PATCH
DELETE
```

Return consistent JSON.

Example success:

```json
{
  "success": true,
  "data": {}
}
```

Example error:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request"
  }
}
```

---

# 17. Error Handling

Never allow unhandled exceptions to crash the API.

The backend must have:

```text
Validation
Error Middleware
Logging
Safe Error Responses
```

Never return:

```text
Stack traces
Database credentials
Provider API keys
Internal secrets
```

to public users.

---

# 18. Logging

Development logs should make debugging easy.

Example:

```text
[INFO] API started
[INFO] Database connected
[INFO] User authenticated
[INFO] Agent request
[INFO] AI provider request
[ERROR] AI provider failed
```

Do not log sensitive information.

Never log:

```text
API keys
Passwords
JWT secrets
Encryption keys
```

---

# 19. Testing Rules

Every phase must include testing.

At minimum:

```text
Manual functional testing
Build test
Database test
API test
Security/tenant test where applicable
```

As the project grows, add automated tests.

Recommended:

```text
Unit Tests
Integration Tests
API Tests
End-to-End Tests
```

---

# 20. Phase Completion Protocol

At the end of EVERY phase, create a completion report.

Example:

```text
PHASE 3 COMPLETION REPORT

Status:
COMPLETE

Implemented:
- Agent creation
- Agent editing
- Agent deletion
- Playground
- Provider selection

Tests:
- Build: PASS
- API: PASS
- Database: PASS
- Authentication: PASS
- Tenant isolation: PASS
- Playground: PASS

Known Issues:
None

Next Phase:
PHASE 4
```

If there are known blocking issues:

```text
Status:
INCOMPLETE

Blocking Issues:
1. Playground fails with Gemini
2. Tenant isolation test fails

Next Phase:
BLOCKED
```

---

# 21. AI Coding Agent Rules

This project may be developed using AI coding tools such as Kilo Code.

The AI coding agent MUST follow these rules.

## Rule 1 — Read Before Editing

Before modifying code:

```text
Read relevant files.
Understand existing architecture.
Do not blindly overwrite code.
```

## Rule 2 — Work Only on Current Phase

If the current phase is:

```text
PHASE 2
```

do not implement:

```text
PHASE 7 Voice
PHASE 10 WhatsApp
PHASE 12 Billing
```

unless explicitly requested.

## Rule 3 — Do Not Invent Requirements

If something is not defined:

```text
Use the simplest reasonable implementation.
```

Do not introduce a complex architecture without justification.

## Rule 4 — Keep Files Small

Avoid files containing thousands of lines.

Prefer:

```text
routes
controllers
services
repositories
providers
utils
```

## Rule 5 — No Fake Implementations

Do not claim:

```text
RAG implemented
```

when the system only returns hardcoded data.

Do not claim:

```text
PostgreSQL implemented
```

when the application uses an in-memory Map.

Do not claim:

```text
Voice implemented
```

when audio is not actually processed.

## Rule 6 — No Silent Fallbacks

Do not silently fall back to fake/mock systems in production.

If a required service is unavailable:

```text
Return a clear error.
```

## Rule 7 — Test After Changes

After implementing functionality:

```text
Install
Build
Run
Test
Fix
Retest
```

---

# 22. AI Coding Agent Phase Gate

Before beginning a new phase, the AI coding agent must verify:

```text
CURRENT PHASE COMPLETE?
       │
       ├── NO → STOP
       │
       └── YES
            ↓
      Run tests
            ↓
      All tests pass?
       │
       ├── NO → STOP
       │
       └── YES
            ↓
      Update documentation
            ↓
      Commit changes
            ↓
      Next phase
```

The AI agent must NEVER say:

> "We can fix that later."

for a blocking issue in the current phase.

---

# 23. Git Strategy

Use a commit after every completed phase.

Example:

```text
phase-0-foundation-complete
phase-1-auth-business-complete
phase-2-ai-provider-complete
phase-3-agent-complete
phase-4-rag-complete
```

If a phase is incomplete:

```text
phase-4-rag-wip
```

Do not mark it complete.

---

# 24. Development Commands

The exact commands may change according to implementation, but the project should eventually support simple commands such as:

```bash
npm install
```

Start development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Test:

```bash
npm test
```

Database migration:

```bash
npm run db:migrate
```

Database seed:

```bash
npm run db:seed
```

Docker:

```bash
docker compose up -d
```

Stop Docker:

```bash
docker compose down
```

---

# 25. Local Development Requirement

The application MUST be easy to run on a normal Windows PC.

The developer should not need:

```text
Google Cloud SQL
Kubernetes
AWS
Complex cloud infrastructure
```

for local development.

The local environment should be:

```text
Windows
 ↓
Docker Desktop
 ↓
PostgreSQL
 ↓
AXLE API
 ↓
AXLE Web
```

---

# 26. Health Check

The API should provide:

```http
GET /health
```

Example:

```json
{
  "status": "ok",
  "database": "connected"
}
```

Later this can include:

```text
AI Provider
Database
Redis
Queue
```

but do not overcomplicate Phase 0.

---

# 27. Definition of Done Philosophy

A phase is NOT complete because:

```text
Code exists.
```

A phase is complete only when:

```text
Code exists
+
Application runs
+
Feature works
+
Tests pass
+
Errors are fixed
+
Security requirements pass
+
Documentation is updated
```

Therefore:

> **"Implemented" does not mean "Complete."**

---

# 28. The Golden Rule

## One Phase → One Goal → One Verification

Never build the whole platform at once.

Example:

### Wrong

```text
Build AXLE
├── Login
├── RAG
├── Voice
├── WhatsApp
├── SIP
├── Billing
├── Admin
└── Deployment
```

### Correct

```text
Phase 0
Foundation
   ↓
Verify

Phase 1
Authentication
   ↓
Verify

Phase 2
AI Providers
   ↓
Verify

Phase 3
Agent
   ↓
Verify

Phase 4
RAG
   ↓
Verify

...
```

---

# 29. MVP Target

The first major target is:

```text
PHASE 0
+
PHASE 1
+
PHASE 2
+
PHASE 3
+
PHASE 4
+
PHASE 5
+
PHASE 6
+
PHASE 7
+
PHASE 8
```

At that point AXLE should provide:

```text
Business Account
       ↓
Business Dashboard
       ↓
Knowledge Base
       ↓
AI Agent
       ↓
RAG
       ↓
Website Chat
       ↓
Voice Agent
       ↓
Floating Call Button
       ↓
Conversation Storage
```

This is the first production-oriented MVP.

---

# 30. Final Development Instruction

### READ THIS BEFORE EVERY DEVELOPMENT SESSION

```text
You are working on AXLE 2.0.

AXLE is being built phase-by-phase.

You MUST identify the current phase before making changes.

You MUST NOT implement features from future phases.

You MUST NOT skip the current phase.

You MUST NOT declare a phase complete until every item in its Definition of Done has been verified.

If any required item fails, STOP and fix it.

Do not move to the next phase with known blocking errors.

Do not replace real implementations with fake/mock production implementations.

Do not introduce unnecessary complexity.

Do not create huge monolithic files.

Keep the architecture simple and modular.

After completing a phase:
1. Build the project.
2. Run the application.
3. Test the phase.
4. Verify the Definition of Done.
5. Fix all blocking issues.
6. Update documentation.
7. Create a completion report.
8. Commit the phase.
9. Only then proceed to the next phase.

If the current phase is incomplete, the correct action is:

STOP.

Do not proceed.
```

---

# AXLE 2.0 Development Order

```text
┌──────────────────────────────┐
│ PHASE 0 — FOUNDATION         │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ PHASE 1 — AUTH + BUSINESS    │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ PHASE 2 — AI PROVIDERS       │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ PHASE 3 — AI AGENT           │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ PHASE 4 — KNOWLEDGE / RAG    │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ PHASE 5 — WEB CHAT           │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ PHASE 6 — CONVERSATIONS      │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ PHASE 7 — VOICE AGENT        │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ PHASE 8 — CALL BUTTON        │
└──────────────┬───────────────┘
               ↓
             MVP
               ↓
┌──────────────────────────────┐
│ PHASE 9 — PUBLIC API         │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ PHASE 10 — CHANNELS          │
│ WhatsApp / SIP / Phone       │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ PHASE 11 — USAGE / BILLING  │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ PHASE 12 — SUBSCRIPTIONS     │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ PHASE 13 — SECURITY          │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ PHASE 14 — ADMIN             │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ PHASE 15 — PRODUCTION        │
└──────────────────────────────┘
```

---

# 🚦 STATUS

Current development phase:

```text
PHASE 0 — FOUNDATION
```

Current phase status:

```text
NOT STARTED
```

Next action:

```text
Build and complete PHASE 0 only.
```

**DO NOT START PHASE 1 UNTIL PHASE 0 DEFINITION OF DONE IS 100% VERIFIED.**