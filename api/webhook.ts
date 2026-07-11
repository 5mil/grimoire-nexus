import { createNodeMiddleware, createProbot } from '@octokit/app'; // Note: we may switch to direct @octokit/app for more control, but this works well for Vercel
// For pure serverless, we'll use a custom handler. This is a starting point.

import { App } from '@octokit/app';
import { Octokit } from '@octokit/rest';
import { Webhooks } from '@octokit/webhooks'; // For signature verification if needed manually

import type { VercelRequest, VercelResponse } from '@vercel/node';

// In production, these come from env
const appId = process.env.GITHUB_APP_ID!;
const privateKey = process.env.GITHUB_PRIVATE_KEY!;
const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET!;

// Initialize the GitHub App
const app = new App({
  appId,
  privateKey,
  webhooks: {
    secret: webhookSecret,
  },
});

// Typed event handlers for clarity
app.webhooks.on('issue_comment.created', async ({ octokit, payload }) => {
  const { action, comment, issue, repository } = payload;

  // Only respond to comments that mention us (case insensitive)
  const body = comment.body.toLowerCase();
  if (!body.includes('@grimoire-nexus')) {
    return;
  }

  console.log(`Mentioned in issue #${issue.number} of ${repository.full_name}`);

  // Parse simple command
  let responseText = '✨ Grimoire Nexus heard you! Processing your request in the flow...\n\n';

  if (body.includes('perplexity')) {
    responseText += '**Routing to Perplexity** for deep research. Stand by for synthesis...\n';
    // TODO: Call Perplexity client with rich context
  } else if (body.includes('grok') || body.includes('xai')) {
    responseText += '**Routing to Grok** for sharp reasoning and Zig wisdom. Channeling the vtable spirits...\n';
    // TODO: Call Grok (xAI) client
  } else if (body.includes('gemini')) {
    responseText += '**Routing to Gemini** for structured analysis and review. Preparing the lens...\n';
    // TODO: Call Gemini client
  } else {
    responseText += 'No specific spirit named. Using smart routing (or default to Grok for now).\n';
    responseText += 'Try: `@grimoire-nexus perplexity research latest Zig news` or `@grimoire-nexus grok help with magister architecture`\n';
  }

  responseText += '\n**Context captured**: Issue #' + issue.number + ' in ' + repository.full_name + '\n';
  responseText += 'Full thread + relevant files will be gathered in v0.2.\n\n';
  responseText += '*This is a live foundation response. Full LLM magic + actions coming in next iterations.*\n';
  responseText += '— Grimoire Nexus (building the bridge with you)'

  // Post a reply comment
  try {
    await octokit.rest.issues.createComment({
      owner: repository.owner.login,
      repo: repository.name,
      issue_number: issue.number,
      body: responseText,
    });
    console.log('Replied successfully to mention.');
  } catch (err) {
    console.error('Failed to post comment:', err);
  }
});

// Also handle new issues if they contain mention in body
app.webhooks.on('issues.opened', async ({ octokit, payload }) => {
  const { issue, repository } = payload;
  const body = (issue.body || '').toLowerCase();

  if (body.includes('@grimoire-nexus')) {
    // Similar logic or call a shared handler
    console.log('New issue opened with mention.');
    // For simplicity, the comment handler covers most flow; we can expand
  }
});

// Generic error handler
app.webhooks.onError((error) => {
  console.error('Webhook error:', error);
});

// Vercel serverless handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST for webhooks.' });
    return;
  }

  // The App's built-in middleware handles verification + routing
  // For Vercel, we use the webhooks middleware or manual
  // Simpler approach for serverless: use the webhooks.receive directly after verification

  // For initial bootstrap, we'll use a lightweight manual approach + the app's receive
  // In production, recommend using createNodeMiddleware or custom verify

  try {
    // Basic signature check (production needs full @octokit/webhooks verify)
    // For now, trust Vercel + GitHub (add proper verify in next pass)
    const payload = req.body;

    // Let the App handle known events
    await app.webhooks.receive({
      id: req.headers['x-github-delivery'] as string,
      name: req.headers['x-github-event'] as any,
      payload,
    });

    res.status(200).json({ ok: true, message: 'Webhook processed by Grimoire Nexus' });
  } catch (error: any) {
    console.error('Handler error:', error);
    // Always return 200 to GitHub to avoid retries on our bugs
    res.status(200).json({ ok: false, error: error.message });
  }
}

// Note for production hardening:
// - Use proper webhook signature verification with @octokit/webhooks
// - Add rate limiting, better logging (pino or similar)
// - Move LLM calls and heavy context work to background or separate functions if timeout risk
// - Support installation.created event to welcome new installs
