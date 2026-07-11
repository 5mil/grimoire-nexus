# Grimoire Nexus

**The seamless multi-LLM GitHub App for uninterrupted creative development.**

Connects **Perplexity** (deep research & synthesis), **Grok** (sharp reasoning, coding, Zig-native thinking), and **Gemini** (structured analysis & review) directly into your GitHub workflow.

No more context switching. No API key juggling. No flow-breaking copy-paste or tab roulette. Just mention the right spirit in an issue or PR comment, and it arrives with full repo context — ready to research, plan, code, review, or execute actions (comments, branches, PRs).

Built in the spirit of your grimoire projects: a magical nexus (bridge) that lets different AI intelligences collaborate with you inside the sacred flow of code, issues, and creative iteration — without ever breaking immersion.

Perfect companion for arcis, zigllm-os, magister, memecoin branding, advocacy tools (Motus), and any project where deep focus + rapid high-quality iteration matters.

## Vision & Philosophy

- **Flow First**: Every design decision eliminates friction, context loss, or technical ceremony that pulls you out of creative state.
- **Medium Coupling, High Magic**: GitHub App as the sidecar orchestrator. LLM clients as swappable spirits. Your repos remain the source of truth.
- **Multi-Model Power**: Route intelligently or explicitly. Perplexity for "what's the state of X in 2026?". Grok for "help me architect this vtable system in Zig". Gemini for "review this diff for safety and elegance".
- **Human + AI Partnership**: AI proposes and drafts; you approve or refine. Or auto-execute on trusted paths with clear audit trail in Git history.
- **Extensible & Sovereign**: Start with hosted APIs. Later plug in your own arcis inference endpoint or local models. Open source so the community (and your future self) can evolve it.

## Core Features (MVP Roadmap)

### v0.1 - Foundation (Current Focus)
- GitHub App registration + webhook handling (issues, issue_comment, pull_request, pull_request_review_comment)
- Installation-based authentication (no per-user GitHub tokens needed)
- Rich context builder: issue/PR body + comments, diff, file tree summary, keyword/semantic relevant files
- Explicit routing commands: `@grimoire-nexus perplexity ...`, `@grimoire-nexus grok ...`, `@grimoire-nexus gemini ...`
- Basic LLM clients + structured JSON output (plan, summary, suggested edits, next actions)
- Safe action executor: Post detailed comment (always), propose branch + PR (optional auto)
- Vercel deployment ready + env var management

### v0.2 - Flow Enhancements
- Auto task classification & smart default routing (research? perplexity. code gen? grok. review? gemini.)
- "Continue this thread" support for multi-turn within one GitHub issue/PR conversation
- File edit application via GitHub Git Data API (create blobs/trees/commits safely)
- Draft PR creation with AI-generated title/body + linked issue
- Basic cost / token usage logging (comment footer)
- Support for labels as triggers (e.g., `ai-research`, `ai-implement-grok`)

### v0.3+ - Advanced Magic
- Tool calling exposure: Expose GitHub actions as function-calling tools so you can use Perplexity/Grok/Gemini *directly* in their UIs or API with deep repo powers (secured)
- Integration with your arcis (local GGUF inference) as a 4th option for private/sensitive work
- RAG over repo history or grimoire-index for project-specific knowledge
- GitHub project board automation, status checks on PRs from AI reviews
- Multi-AI chaining in one trigger ("research with perplexity then implement with grok")
- Web UI dashboard (optional) for overview of AI-assisted work across repos
- Memecoin/branding mode? Fun themed responses for creative projects

## How It Preserves Creative Flow

1. You stay in GitHub (or your editor with GitHub integration).
2. Natural language mention or label triggers everything.
3. Context is *automatically* gathered and injected — no manual export of diffs or files.
4. Response comes back as a comment in the same thread (threaded for clarity).
5. Suggested code changes are proposed cleanly; one click (or auto) turns them into real branches/PRs.
6. No separate accounts, no "paste this into ChatGPT", no lost history.

The technical details (auth, context assembly, LLM calls, git operations) happen invisibly in the background.

## Architecture

```
GitHub Webhook (issue/PR events)
          ↓
   Grimoire Nexus (Vercel Serverless Functions)
   ├── Webhook Verifier + @octokit/app (installation token)
   ├── Context Builder (Octokit + GraphQL for speed)
   ├── LLM Router (heuristic + explicit)
   │   ├── Perplexity Client (research)
   │   ├── xAI Grok Client (reasoning/coding)
   │   └── Google Gemini Client (structure/review)
   ├── Structured Output (Zod schemas)
   └── Action Executor
           ↓
   GitHub API (comments, create ref/branch, create/update via git data, create PR)
```

**Design Principles**:
- Each major concern is a focused module (sidecar pattern you like).
- Stateless where possible (serverless friendly).
- Clear separation: GitHub concerns vs LLM concerns vs action concerns.
- Easy to test individual pieces.
- Production ready from day one (error handling, retries, logging).

## Setup Instructions (Let's Do This Together)

### 1. Create the GitHub App (You do this in browser)

1. Go to https://github.com/settings/apps/new
2. Fill:
   - **GitHub App name**: `grimoire-nexus` (or your preferred available name)
   - **Homepage URL**: `https://github.com/5mil/grimoire-nexus`
   - **Callback URL**: `https://<your-vercel-domain>.vercel.app/api/callback` (we can add OAuth later if needed; for pure App webhooks, often not required initially)
   - **Webhook URL**: `https://<your-vercel-domain>.vercel.app/api/webhook` (update after first deploy)
   - **Webhook secret**: Generate a strong one (save it!)
3. **Permissions** (start minimal, expand as features need):
   - Repository permissions:
     - Contents: Read & write
     - Issues: Read & write
     - Pull requests: Read & write
     - Metadata: Read
   - (Optional later) Organization, Actions, etc.
4. **Subscribe to events**:
   - Issue comment
   - Issues
   - Pull request
   - Pull request review comment
   - (Later) Pull request review, Push for smarter triggers
5. Generate a **private key** (.pem) — download and keep safe.
6. Note down: **App ID**, **Client ID** (if using OAuth), **Webhook secret**.
7. Save the App. Then **Install** it on your personal account or specific repos for testing (e.g., this grimoire-nexus repo itself, or arcis, zigllm-os, etc.).

### 2. Deploy Backend (Vercel - connected service)

1. Import `5mil/grimoire-nexus` into your Vercel dashboard.
2. Add these **Environment Variables** (Production + Preview):
   - `GITHUB_APP_ID` = your App ID
   - `GITHUB_PRIVATE_KEY` = paste the entire PEM content (or base64 encoded)
   - `GITHUB_WEBHOOK_SECRET` = the secret you set
   - `PERPLEXITY_API_KEY` = your Perplexity API key
   - `XAI_API_KEY` = your xAI Grok API key
   - `GOOGLE_API_KEY` = your Google AI Studio / Gemini API key
3. Deploy. Note the production URL (e.g. `https://grimoire-nexus.vercel.app`).
4. Go back to your GitHub App settings → **General** and update the **Webhook URL** to `https://grimoire-nexus.vercel.app/api/webhook`.
5. (Optional but recommended) Set up a custom domain or just use the vercel.app one.

### 3. Test the Magic

- Go to any repo where the App is installed.
- Open or comment on an Issue.
- Try: `@grimoire-nexus perplexity What are the latest developments in Zig package managers in 2026?`
- Or: `@grimoire-nexus grok Help me think through a vtable-based ability system for Magister`
- Watch it reply in the thread with rich context and suggestions.

We will implement the code to make the above work.

## Project Structure (Planned)

```
grimoire-nexus/
├── api/
│   ├── webhook.ts          # Main entry: verifies, routes events, orchestrates
│   └── callback.ts         # Optional for future OAuth
├── lib/
│   ├── github.ts           # Octokit wrappers, installation auth, context gathering
│   ├── llm.ts              # Router + Perplexity / Grok / Gemini clients + prompt templates
│   ├── context.ts          # Builds rich prompt context from GitHub event
│   ├── actions.ts          # Safe execution of comments, branches, file edits, PRs
│   ├── schemas.ts          # Zod schemas for LLM structured output
│   └── utils.ts            # Helpers, logging, error handling
├── types/
│   └── github.ts           # Type augmentations
├── vercel.json             # Rewrites / config for serverless
├── package.json
├── tsconfig.json
├── .env.example
├── README.md
└── CONTRIBUTING.md         # Checklist-driven development process
```

## Tech Stack Choices

- **Language/Runtime**: TypeScript + Node.js 20 (Vercel native)
- **GitHub SDK**: @octokit/app (for App auth), @octokit/rest, @octokit/graphql (efficient queries)
- **LLM SDKs**: @google/generative-ai, fetch (Perplexity has good REST), xAI SDK or OpenAI-compatible client for Grok
- **Validation & Types**: Zod + TypeScript strict
- **Deployment**: Vercel (serverless functions — perfect for webhooks, scales to zero)
- **Why not Probot?** We want full control over the multi-LLM orchestration and structured flows; lightweight custom is clearer for our modular vision.
- **Why not Zig for core?** Excellent idea for hot paths later (e.g., context assembly or a native binary sidecar). For v1, TypeScript gets us to working magic fastest with best GitHub ecosystem. We can extract performance-critical pieces or offer a Zig daemon option.

Fits your preference for medium coupling and clear separation of concerns.

## Development Process & Checklist

Since you value thorough reviews and iterative progress tracking:

We will use issues + this README + comments for coordination. Every major piece gets a checklist.

**Phase 1: Foundation**
- [ ] GitHub App created & installed on test repo
- [ ] Vercel project linked + env vars set
- [ ] Basic webhook handler that logs events and verifies signature
- [ ] Installation token retrieval working
- [ ] Simple "@grimoire-nexus help" responder

**Phase 2: Context & Routing**
- [ ] Context builder that fetches issue + comments + PR diff if applicable
- [ ] File tree summary + relevant file content fetcher (avoid token bloat)
- [ ] LLM router with explicit command parsing
- [ ] Perplexity, Grok, Gemini client stubs that return mock structured data

**Phase 3: Real LLM Integration & Output**
- [ ] Real API calls with proper prompting (system prompt tuned for GitHub context + your style)
- [ ] Zod schema for reliable ` { summary, plan, codeSuggestions, actions } `
- [ ] Comment poster that formats beautifully (markdown, collapsible sections)

**Phase 4: Actions & Safety**
- [ ] Branch creation
- [ ] File edit proposal vs direct apply (toggle)
- [ ] Draft PR creation with rich body
- [ ] Error recovery, rate limit handling, user-friendly messages

**Phase 5: Polish & Deploy**
- [ ] Full end-to-end test on real task (e.g., research + implement small feature)
- [ ] Documentation, .env.example, CONTRIBUTING
- [ ] Optional: Themed responses or protector-kitties easter eggs for fun projects

## Contributing & Collaboration

This is our shared grimoire. Feel free to push ideas, refinements, or even PRs (ironic but fitting).

When we edit code, we'll do thorough reviews here or via the app itself once bootstrapped.

Let's make development feel like casting spells instead of fighting config dragons.

---

*Grimoire Nexus — Where AIs meet GitHub in perfect flow.*
