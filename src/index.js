/**
 * Dr.sean — Instagram DM Auto-Reply Worker
 * Cloudflare Workers + KV + Claude AI
 */

import { handleWebhook, verifyWebhook } from './webhook.js';
import { serveDashboard, handleDashboardAPI, serveLogin } from './dashboard.js';

const PRIVACY_HTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Privacy Policy</title><style>body{font-family:-apple-system,sans-serif;max-width:600px;margin:40px auto;padding:0 20px;color:#333;line-height:1.6}h1{font-size:24px}h2{font-size:18px;margin-top:24px}</style></head><body><h1>Privacy Policy</h1><p>Last updated: April 3, 2026</p><h2>What We Collect</h2><p>When you send a direct message to our Instagram account, we process your message content to provide automated responses. We also store your Instagram user ID and message history temporarily to maintain conversation context.</p><h2>How We Use Your Data</h2><p>Your data is used solely to provide automated DM responses. We do not sell or share your personal data with third parties.</p><h2>Data Retention</h2><p>Conversation history is automatically deleted after 7 days. DM logs are retained for up to 30 days.</p><h2>Data Security</h2><p>All data is stored securely using Cloudflare infrastructure with encryption at rest and in transit.</p><h2>Your Rights</h2><p>You may request deletion of your data at any time by contacting us via Instagram DM.</p></body></html>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // ── Login ──
    if (path === '/' || path === '/login') {
      return serveLogin();
    }

    // ── Dashboard ──
    if (path === '/dashboard') {
      return serveDashboard(env);
    }

    // ── Privacy Policy ──
    if (path === '/privacy') {
      return new Response(PRIVACY_HTML, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // ── Static assets ──
    if (path === '/manifest.json') {
      return new Response(JSON.stringify({"name":"Dr.sean","short_name":"Dr.sean","description":"Skin Consultation DM Bot","start_url":"/dashboard","display":"standalone","background_color":"#090B14","theme_color":"#5B8DEF","icons":[{"src":"/icon.svg","sizes":"any","type":"image/svg+xml"}]}), { headers: { 'Content-Type': 'application/json' } });
    }
    if (path === '/icon.svg' || path === '/favicon.svg') {
      const svg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><rect width="512" height="512" rx="112" fill="#0F1221"/><circle cx="256" cy="256" r="180" fill="none" stroke="#5B8DEF" stroke-width="12"/><path d="M256 120C220 175 160 195 160 265C160 315 200 355 256 355C312 355 352 315 352 265C352 195 292 175 256 120Z" fill="#5B8DEF" opacity="0.15"/><path d="M256 160C232 195 205 215 205 255C205 285 225 310 256 310C287 310 307 285 307 255C307 215 280 195 256 160Z" fill="#5B8DEF"/></svg>`;
      return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' } });
    }
    if (path === '/icon-512.png' || path === '/apple-touch-icon.png' || path === '/og-image.png') {
      const png = await env.KV.get('static:icon-512.png', 'arrayBuffer');
      if (png) return new Response(png, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' } });
    }

    // ── Dashboard API ──
    if (path.startsWith('/api/')) {
      return handleDashboardAPI(request, env, path);
    }

    // ── Instagram Webhook verification (GET) ──
    if (path === '/webhook' && request.method === 'GET') {
      return verifyWebhook(request, env);
    }

    // ── Instagram Webhook events (POST) ──
    if (path === '/webhook' && request.method === 'POST') {
      return handleWebhook(request, env);
    }

    return new Response('Not Found', { status: 404 });
  }
};
