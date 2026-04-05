export const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Dr.sean — Dashboard</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/icon.svg">
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#5B8DEF">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Dr.sean">
<meta property="og:title" content="Dr.sean — Skin Consultation Bot">
<meta property="og:description" content="AI-powered Instagram DM auto-reply for dermatology consultations">
<meta property="og:image" content="https://dr-sean.anjs920820.workers.dev/og-image.png">
<meta property="og:type" content="website">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"><\/script>
<style>
  :root {
    --bg: #090B14; --bg-elevated: #0F1221; --surface: #161A2B; --surface-2: #1E2338; --surface-3: #262B42;
    --border: rgba(140,155,200,0.08); --border-hover: rgba(140,155,200,0.15);
    --text: #ECEEF4; --text-secondary: #B0B8D0; --text-tertiary: #8A94B0;
    --accent: #5B8DEF; --accent-soft: rgba(91,141,239,0.12); --accent-glow: rgba(91,141,239,0.25);
    --green: #3DD68C; --green-soft: rgba(61,214,140,0.12);
    --red: #F06464; --red-soft: rgba(240,100,100,0.12);
    --amber: #F0B24A; --amber-soft: rgba(240,178,74,0.12);
    --cyan: #4AC8E8; --purple: #A78BFA;
    --radius: 16px; --radius-sm: 10px; --radius-xs: 6px;
    --shadow: 0 2px 8px rgba(0,0,0,0.15); --shadow-lg: 0 8px 32px rgba(0,0,0,0.25);
    --nav-h: 64px;
  }
  * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color: transparent; }
  body { font-family:'Inter',system-ui,-apple-system,sans-serif; background:var(--bg); color:var(--text); min-height:100vh; min-height:100dvh; overflow-x:hidden; -webkit-font-smoothing:antialiased; }

  /* ── Header ── */
  .header {
    position:sticky; top:0; z-index:50; background:rgba(9,11,20,0.85); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
    padding:14px 20px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--border);
  }
  .header-left { display:flex; align-items:center; gap:10px; }
  .header h1 { font-size:17px; font-weight:800; letter-spacing:-0.3px; }
  .header h1 span { color:var(--accent); }
  .header-right { display:flex; align-items:center; gap:8px; }
  .bot-pill {
    display:flex; align-items:center; gap:5px; padding:5px 12px; border-radius:20px; font-size:11px; font-weight:600; letter-spacing:0.2px;
  }
  .bot-pill.on { background:var(--green-soft); color:var(--green); }
  .bot-pill.off { background:var(--red-soft); color:var(--red); }
  .bot-pill .dot { width:6px; height:6px; border-radius:50%; }
  .bot-pill.on .dot { background:var(--green); box-shadow:0 0 6px var(--green); }
  .bot-pill.off .dot { background:var(--red); }
  .header-btn {
    width:34px; height:34px; border-radius:10px; border:1px solid var(--border); background:transparent;
    color:var(--text-secondary); cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:15px; transition:all 0.15s;
  }
  .header-btn:hover { background:var(--surface); border-color:var(--border-hover); }

  /* ── Bottom Nav ── */
  .bottom-nav {
    position:fixed; bottom:0; left:0; right:0; z-index:50; height:var(--nav-h);
    background:rgba(9,11,20,0.92); backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px);
    border-top:1px solid var(--border); display:flex; justify-content:space-around; align-items:center; padding:0 8px;
    padding-bottom:env(safe-area-inset-bottom);
  }
  .nav-item {
    display:flex; flex-direction:column; align-items:center; gap:3px; padding:8px 12px;
    cursor:pointer; border:none; background:none; color:var(--text-tertiary); transition:all 0.2s; border-radius:12px; min-width:56px; min-height:48px; justify-content:center;
  }
  .nav-item.active { color:var(--accent); background:rgba(91,141,239,0.08); }
  .nav-item .nav-icon { font-size:20px; line-height:1; }
  .nav-item .nav-label { font-size:10px; font-weight:600; letter-spacing:0.3px; font-family:'Inter',sans-serif; }
  .nav-item.active .nav-label { color:var(--accent); }

  /* ── Content ── */
  .content { max-width:600px; margin:0 auto; padding:16px 16px calc(var(--nav-h) + 16px); }

  /* ── Cards ── */
  .card {
    background:var(--surface); border:1px solid var(--border); border-radius:var(--radius);
    padding:18px; margin-bottom:12px; transition:border-color 0.2s;
  }
  .card:hover { border-color:var(--border-hover); transform:translateY(-1px); box-shadow:0 4px 12px rgba(0,0,0,0.1); }
  .card-header { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--text-tertiary); margin-bottom:14px; }

  /* ── Profile ── */
  .profile {
    display:flex; align-items:center; gap:14px; padding:20px; background:linear-gradient(135deg, var(--surface), var(--surface-2));
    border:1px solid var(--border); border-radius:var(--radius); margin-bottom:12px;
  }
  .profile-pic { width:52px; height:52px; border-radius:14px; background:var(--surface-3); object-fit:cover; border:2px solid var(--border); }
  .profile h3 { font-size:16px; font-weight:700; letter-spacing:-0.2px; }
  .profile p { font-size:13px; color:var(--text-tertiary); font-weight:500; }

  /* ── Stat Grid ── */
  .stat-grid { display:grid; gap:10px; margin-bottom:12px; }
  .stat-grid-4 { grid-template-columns:repeat(2,1fr); }
  .stat-grid-3 { grid-template-columns:repeat(3,1fr); }
  .stat-card {
    background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-sm);
    padding:14px; transition:all 0.2s; overflow:hidden; min-width:0;
  }
  .stat-card:hover { border-color:var(--border-hover); transform:translateY(-1px); }
  .stat-icon { font-size:18px; margin-bottom:8px; }
  .stat-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:var(--text-tertiary); margin-bottom:4px; }
  .stat-value { font-size:22px; font-weight:800; letter-spacing:-0.5px; line-height:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .stat-sub { font-size:10px; color:var(--text-tertiary); margin-top:4px; font-weight:500; }

  /* ── Charts ── */
  .chart-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:18px; margin-bottom:12px; }
  .chart-card .card-header { margin-bottom:12px; }
  .chart-wrap { position:relative; height:200px; }
  .chart-wrap-lg { height:260px; }

  /* ── Form ── */
  .form-label { display:block; font-size:10px; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; color:var(--text-tertiary); margin-bottom:5px; margin-top:12px; }
  .form-label:first-of-type { margin-top:0; }
  .form-input, .form-textarea {
    width:100%; max-width:100%; padding:9px 12px; background:var(--bg); border:1.5px solid var(--border);
    border-radius:var(--radius-sm); color:var(--text); font-size:13px; font-family:'Inter',sans-serif;
    font-weight:500; outline:none; transition:all 0.2s; text-align:left;
  }
  .form-input[type="date"] { -webkit-appearance:none; text-align:left; -webkit-text-align:left; }
  .form-input[type="date"]::-webkit-date-and-time-value { text-align:left; }
  .form-input:focus, .form-textarea:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-soft); }
  .form-textarea { resize:vertical; min-height:80px; }
  .form-input::placeholder, .form-textarea::placeholder { color:#8A94B0; font-weight:400; }

  /* ── Buttons ── */
  .btn {
    padding:11px 24px; border-radius:var(--radius-sm); border:none; cursor:pointer;
    font-size:14px; font-weight:700; font-family:'Inter',sans-serif; letter-spacing:-0.1px; transition:all 0.15s;
  }
  .btn-primary { background:var(--accent); color:#fff; }
  .btn-primary:hover { background:#4A7DE0; transform:translateY(-1px); box-shadow:0 4px 12px var(--accent-glow); }
  .btn-primary:active { transform:translateY(0); }

  /* ── Keywords ── */
  .kw-item { background:var(--bg); border:1px solid var(--border); border-radius:var(--radius-sm); padding:14px; margin-bottom:8px; position:relative; }
  .kw-item .form-input { margin-bottom:8px; }
  .kw-remove { position:absolute; top:8px; right:8px; background:var(--red-soft); border:none; color:var(--red); cursor:pointer; font-size:13px; width:44px; height:44px; border-radius:10px; display:flex; align-items:center; justify-content:center; }
  .kw-add {
    background:transparent; border:1.5px dashed var(--border); color:var(--accent); padding:12px;
    border-radius:var(--radius-sm); width:100%; cursor:pointer; font-size:13px; font-weight:600;
    font-family:'Inter',sans-serif; margin-top:8px; transition:all 0.15s;
  }
  .kw-add:hover { border-color:var(--accent); background:var(--accent-soft); }

  /* ── Log Filters ── */
  .log-filters { display:flex; gap:8px; margin-bottom:14px; flex-wrap:wrap; }
  .log-filter {
    padding:8px 10px; background:var(--bg); border:1.5px solid var(--border); border-radius:var(--radius-sm);
    color:var(--text-secondary); font-size:11px; font-weight:500; font-family:'Inter',sans-serif; min-height:36px;
    outline:none; cursor:pointer; -webkit-appearance:none; appearance:none; min-width:0; flex:1;
  }
  .log-filter:focus { border-color:var(--accent); }
  .log-filter option { background:var(--surface); }

  /* ── Logs ── */
  .log-item { padding:14px; margin-bottom:8px; background:var(--bg-elevated); border:1px solid var(--border); border-radius:var(--radius-sm); }
  .log-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
  .log-time { font-size:10px; color:var(--text-tertiary); font-weight:600; letter-spacing:0.3px; }
  .log-badges { display:flex; gap:5px; flex-wrap:wrap; }
  .badge { padding:3px 8px; border-radius:var(--radius-xs); font-size:10px; font-weight:600; letter-spacing:0.2px; }
  .badge-user { background:var(--accent-soft); color:var(--accent); }
  .badge-country { background:rgba(100,140,180,0.15); color:#7EB0D5; white-space:nowrap; }
  .badge-tag { background:rgba(169,132,255,0.12); color:#A984FF; }
  .log-bubble { padding:10px 14px; border-radius:12px; font-size:13px; line-height:1.5; margin-top:6px; word-break:break-word; }
  .log-bubble-in { background:var(--surface-2); color:var(--text-secondary); border-bottom-left-radius:4px; }
  .log-bubble-out { background:var(--accent-soft); color:var(--text); border-bottom-right-radius:4px; margin-left:20px; }
  .log-bubble-label { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-tertiary); margin-bottom:3px; }
  .page-nav { display:flex; justify-content:center; align-items:center; gap:16px; padding:16px 0; }
  .page-btn {
    background:var(--surface-2); border:1px solid var(--border); color:var(--text-secondary);
    padding:8px 18px; border-radius:var(--radius-sm); cursor:pointer; font-size:13px; font-weight:600; font-family:'Inter',sans-serif; transition:all 0.15s;
  }
  .page-btn:hover { background:var(--surface-3); }
  .page-btn:disabled { opacity:0.25; cursor:not-allowed; }
  .page-btn:disabled:hover { background:var(--surface-2); }

  /* ── Focus visible (keyboard) ── */
  .btn:focus-visible, .header-btn:focus-visible, .nav-item:focus-visible, .page-btn:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }

  /* ── Card transition ── */
  .card, .stat-card, .chart-card, .setting-section { transition:border-color 0.2s, box-shadow 0.2s, transform 0.2s; }
  .log-count { font-size:11px; color:var(--text-tertiary); font-weight:500; margin-bottom:12px; }
  .log-bubble-text { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
  .log-bubble-text.expanded { display:block; -webkit-line-clamp:unset; }
  .log-expand { background:none; border:none; color:var(--accent); font-size:11px; font-weight:600; cursor:pointer; padding:4px 0; font-family:'Inter',sans-serif; }
  .log-time-relative { color:var(--accent); font-size:10px; font-weight:600; white-space:nowrap; flex-shrink:0; }
  .log-no-country { opacity:0.6; }

  /* ── Review/Actions ── */
  .log-actions { display:flex; gap:6px; margin-top:10px; flex-wrap:wrap; align-items:center; }
  .log-action-btn { background:var(--surface-2); border:1px solid var(--border); color:var(--text-tertiary); padding:5px 10px; border-radius:6px; cursor:pointer; font-size:11px; font-weight:600; font-family:'Inter',sans-serif; transition:all 0.15s; display:flex; align-items:center; gap:4px; }
  .log-action-btn:hover { border-color:var(--border-hover); color:var(--text); }
  .log-action-btn.active { background:var(--green-soft); border-color:var(--green); color:var(--green); }
  .log-item.reviewed { border-left:3px solid var(--green); }
  .log-item.unreviewed { border-left:3px solid var(--amber); }
  .badge-vip { background:rgba(245,158,11,0.15); color:#F0B24A; }
  .badge-paused { background:var(--red-soft); color:var(--red); }
  .badge-direct { background:rgba(167,139,250,0.12); color:var(--purple); }
  .badge-stuck { background:var(--red-soft); color:var(--red); }
  .badge-paused-tag { background:rgba(240,178,74,0.12); color:var(--amber); }

  /* ── Patient Modal ── */
  .modal-overlay { position:fixed; inset:0; z-index:100; background:rgba(0,0,0,0.6); backdrop-filter:blur(4px); display:none; align-items:center; justify-content:center; padding:16px; }
  .modal-overlay.show { display:flex; }
  .modal { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); max-width:500px; width:100%; max-height:85vh; overflow-y:auto; }
  .modal-header { display:flex; align-items:center; justify-content:space-between; padding:16px 18px; border-bottom:1px solid var(--border); position:sticky; top:0; background:var(--surface); z-index:1; }
  .modal-header h3 { font-size:15px; font-weight:700; }
  .modal-close { width:36px; height:36px; border-radius:8px; border:1px solid var(--border); background:none; color:var(--text-tertiary); cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:16px; }
  .modal-body { padding:16px 18px; }
  .modal-section { margin-bottom:16px; }
  .modal-section-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-tertiary); margin-bottom:8px; }

  /* ── Reply Box ── */
  .reply-box { display:none; margin-top:8px; }
  .reply-box.show { display:flex; gap:8px; }
  .reply-input { flex:1; padding:10px 12px; background:var(--bg); border:1.5px solid var(--border); border-radius:var(--radius-sm); color:var(--text); font-size:14px; font-family:'Inter',sans-serif; outline:none; }
  .reply-input:focus { border-color:var(--accent); }
  .reply-send { background:var(--accent); color:#fff; border:none; padding:10px 16px; border-radius:var(--radius-sm); font-size:13px; font-weight:600; cursor:pointer; white-space:nowrap; }

  /* ── Today Summary ── */
  .summary-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:8px; margin-bottom:12px; }
  .summary-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px; }
  .summary-card .stat-label { margin-bottom:4px; }
  .summary-card .stat-value { font-size:18px; }
  .funnel-tip { position:absolute; bottom:calc(100% + 8px); left:50%; transform:translateX(-50%); background:var(--surface-3); color:var(--text); padding:8px 12px; border-radius:8px; font-size:11px; font-weight:500; line-height:1.4; white-space:nowrap; box-shadow:var(--shadow-lg); z-index:10; pointer-events:none; opacity:0; transition:opacity 0.2s; }
  .funnel-tip.show { opacity:1; }
  .funnel-tip::after { content:''; position:absolute; top:100%; left:50%; transform:translateX(-50%); border:5px solid transparent; border-top-color:var(--surface-3); }
  .funnel-item:hover { background:var(--surface) !important; }

  /* ── Toast ── */
  .toast {
    position:fixed; top:20px; left:50%; transform:translateX(-50%); z-index:100;
    background:var(--surface-2); border:1px solid var(--border); color:var(--text);
    padding:10px 20px; border-radius:var(--radius-sm); font-size:13px; font-weight:600;
    opacity:0; transition:all 0.3s; pointer-events:none; box-shadow:var(--shadow-lg);
  }
  .toast.show { opacity:1; }

  /* ── Sections ── */
  .section { display:none; }
  .section.active { display:block; }

  /* ── Loading & Fade-in ── */
  .content { opacity:0; transition:opacity 0.4s ease; }
  .content.loaded { opacity:1; }

  /* ── Skeleton ── */
  .skeleton { background:linear-gradient(90deg,var(--surface) 25%,var(--surface-2) 50%,var(--surface) 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:var(--radius-xs); }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  .skel-text { height:14px; width:60%; margin-bottom:6px; }
  .skel-value { height:28px; width:40%; }
  .skel-chart { height:200px; width:100%; }
  .skel-profile { height:52px; width:52px; border-radius:14px; }

  /* ── Settings Accordion ── */
  .setting-section { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); margin-bottom:10px; overflow:hidden; }
  .setting-header {
    display:flex; align-items:center; gap:12px; padding:16px 18px; cursor:pointer; transition:background 0.15s;
    -webkit-user-select:none; user-select:none;
  }
  .setting-header:hover { background:var(--surface-2); }
  .setting-header:active { background:var(--surface-3); }
  .setting-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .setting-icon svg { width:18px; height:18px; stroke:currentColor; fill:none; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
  .setting-info { flex:1; min-width:0; }
  .setting-title { font-size:13px; font-weight:700; letter-spacing:-0.1px; }
  .setting-desc { font-size:10px; color:var(--text-tertiary); margin-top:2px; }
  .setting-arrow { color:var(--text-tertiary); font-size:12px; transition:transform 0.2s; }
  .setting-section.open .setting-arrow { transform:rotate(180deg); }
  .setting-body { padding:0 14px 14px; display:none; }
  .btn-save-card { width:100%;margin-top:12px;padding:10px;background:var(--accent);color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;font-family:'Inter',sans-serif;cursor:pointer;transition:all 0.15s; }
  .btn-save-card:hover { opacity:0.9; }
  .btn-save-card:active { transform:scale(0.98); }
  .setting-section.open .setting-body { display:block; }

  /* ── Keyword Cards ── */
  .kw-card { background:var(--bg); border:1px solid var(--border); border-radius:var(--radius-sm); padding:16px; margin-bottom:10px; position:relative; transition:border-color 0.2s; }
  .kw-card:hover { border-color:var(--border-hover); }
  .kw-triggers { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px; }
  .kw-trigger-badge { background:var(--accent-soft); color:var(--accent); padding:4px 10px; border-radius:20px; font-size:12px; font-weight:600; }
  .kw-reply-preview { font-size:13px; color:var(--text-secondary); line-height:1.5; background:var(--surface); padding:10px 14px; border-radius:8px; border-left:3px solid var(--accent); }
  .kw-edit-area { display:none; margin-top:12px; }
  .kw-card.editing .kw-edit-area { display:block; }
  .kw-card.editing .kw-preview-area { display:none; }
  .kw-actions { position:absolute; top:12px; right:12px; display:flex; gap:6px; }
  .kw-action-btn { width:36px; height:36px; border-radius:8px; border:1px solid var(--border); background:var(--surface); color:var(--text-tertiary); cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:13px; transition:all 0.15s; }
  .kw-action-btn:hover { border-color:var(--border-hover); color:var(--text); }
  .kw-action-btn.delete:hover { border-color:var(--red); color:var(--red); background:var(--red-soft); }
  .kw-empty { text-align:center; padding:32px 20px; color:var(--text-tertiary); font-size:13px; line-height:1.6; }
  .kw-count { font-size:11px; color:var(--text-tertiary); font-weight:600; }

  /* ── Error Banner ── */
  .error-banner { background:var(--red-soft); border:1px solid rgba(240,100,100,0.2); border-radius:var(--radius-sm); padding:12px 16px; margin-bottom:12px; display:flex; align-items:center; gap:10px; }
  .error-banner-text { font-size:13px; color:var(--red); font-weight:500; flex:1; }
  .error-banner-btn { background:var(--red); color:#fff; border:none; padding:6px 14px; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; font-family:'Inter',sans-serif; white-space:nowrap; }

  /* ── Empty State ── */
  .empty { text-align:center; padding:48px 20px; color:var(--text-tertiary); font-size:14px; font-weight:500; line-height:1.6; }
  .empty::before { content:''; display:block; width:48px; height:48px; margin:0 auto 14px; border-radius:50%; background:var(--surface-2); border:2px dashed var(--border); }

  /* ── Responsive ── */
  @media(min-width:768px) {
    .bottom-nav { display:none; }
    .content { padding-bottom:24px; }
    .desktop-tabs { display:flex !important; }
  }
  @media(max-width:767px) {
    .desktop-tabs { display:none !important; }
  }
  @media(max-width:480px) {
    .log-bubble-out { margin-left:10px; }
    .stat-grid-3 { grid-template-columns:repeat(3,1fr); }
    .stat-value { font-size:18px; }
    .profile h3 { font-size:15px; }
    #sec-analytics [style*="grid-template-columns:1fr 1fr"] { grid-template-columns:1fr !important; }
  }
</style>
</head>
<body>

<!-- ── Header ── -->
<div class="header">
  <div class="header-left">
    <h1>Dr.<span>sean</span></h1>
  </div>
  <div class="header-right">
    <div class="bot-pill on" id="botPill" onclick="toggleBot()">
      <div class="dot"></div>
      <span id="botLabel">Active</span>
    </div>
    <button class="header-btn" onclick="logout()" title="Logout">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
    </button>
  </div>
</div>

<!-- ── Desktop Tabs (hidden on mobile) ── -->
<div class="desktop-tabs" style="display:none; max-width:600px; margin:0 auto; padding:12px 16px 0; gap:4px;">
  <button class="nav-item active" onclick="switchTab('home',this)" style="flex-direction:row;gap:6px;padding:8px 16px;">
    <span class="nav-label" style="font-size:13px;">Home</span>
  </button>
  <button class="nav-item" onclick="switchTab('analytics',this)" style="flex-direction:row;gap:6px;padding:8px 16px;">
    <span class="nav-label" style="font-size:13px;">Analytics</span>
  </button>
  <button class="nav-item" onclick="switchTab('logs',this)" style="flex-direction:row;gap:6px;padding:8px 16px;">
    <span class="nav-label" style="font-size:13px;">Logs</span>
  </button>
  <button class="nav-item" onclick="switchTab('keywords',this)" style="flex-direction:row;gap:6px;padding:8px 16px;">
    <span class="nav-label" style="font-size:13px;">Keywords</span>
  </button>
  <button class="nav-item" onclick="switchTab('settings',this)" style="flex-direction:row;gap:6px;padding:8px 16px;">
    <span class="nav-label" style="font-size:13px;">Settings</span>
  </button>
</div>

<!-- ── Content ── -->
<div class="content">

  <!-- HOME -->
  <div class="section active" id="sec-home">
    <div id="homeError"></div>

    <!-- Profile + Bot Status -->
    <div class="profile" id="profileCard">
      <img class="profile-pic" id="profilePic" src="" alt="" onerror="this.src='/icon.svg'">
      <div style="flex:1;">
        <h3 id="profileName"><span class="skeleton skel-text" style="width:120px;display:inline-block">&nbsp;</span></h3>
        <p id="profileUsername"><span class="skeleton skel-text" style="width:80px;display:inline-block">&nbsp;</span></p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
      <button onclick="switchTab('analytics',document.querySelectorAll('.nav-item')[1])" style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;cursor:pointer;text-align:left;transition:all 0.15s;">
        <div style="font-size:12px;font-weight:700;color:var(--accent);margin-bottom:2px;">DM Analytics</div>
        <div style="font-size:20px;font-weight:800;color:var(--text);" id="quickDMs">-</div>
        <div style="font-size:10px;color:var(--text-tertiary);margin-top:2px;">Total conversations</div>
      </button>
      <button onclick="switchTab('logs',document.querySelectorAll('.nav-item')[2])" style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;cursor:pointer;text-align:left;transition:all 0.15s;">
        <div style="font-size:12px;font-weight:700;color:var(--green);margin-bottom:2px;">Today's DMs</div>
        <div style="font-size:20px;font-weight:800;color:var(--text);" id="quickToday">-</div>
        <div style="font-size:10px;color:var(--text-tertiary);margin-top:2px;">View all logs</div>
      </button>
    </div>

    <!-- Stats -->
    <div class="stat-grid stat-grid-4">
      <div class="stat-card"><div class="stat-label">Followers</div><div class="stat-value" id="statFollowers">-</div></div>
      <div class="stat-card"><div class="stat-label">Posts</div><div class="stat-value" id="statPosts">-</div></div>
      <div class="stat-card"><div class="stat-label">Likes</div><div class="stat-value" id="statLikes">-</div><div class="stat-sub">Last 30 days</div></div>
      <div class="stat-card"><div class="stat-label">Comments</div><div class="stat-value" id="statComments">-</div><div class="stat-sub">Last 30 days</div></div>
    </div>

    <div class="stat-grid stat-grid-4">
      <div class="stat-card"><div class="stat-label">Views</div><div class="stat-value" id="statViews">-</div><div class="stat-sub">Last 30 days</div></div>
      <div class="stat-card"><div class="stat-label">Eng. Rate</div><div class="stat-value" id="statEngRate">-</div><div class="stat-sub">Likes+Comments / Followers</div></div>
    </div>

    <!-- Bot Performance -->
    <div id="botPerformance"></div>

    <!-- Chart -->
    <div class="chart-card">
      <div class="card-header">Post Engagement — Last 30 Days</div>
      <div class="chart-wrap chart-wrap-lg"><canvas id="chartEngagement"></canvas></div>
    </div>
  </div>

  <!-- DM ANALYTICS -->
  <div class="section" id="sec-analytics">
    <div id="analyticsError"></div>
    <div class="stat-grid stat-grid-3">
      <div class="stat-card"><div class="stat-label">Total DMs</div><div class="stat-value" id="statDMs">-</div></div>
      <div class="stat-card"><div class="stat-label">Top Country</div><div class="stat-value" id="statTopCountry" style="font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">-</div></div>
      <div class="stat-card"><div class="stat-label">Top Concern</div><div class="stat-value" id="statTopTag" style="font-size:12px;">-</div></div>
    </div>

    <div class="chart-card">
      <div class="card-header">DM Activity — Last 7 Days</div>
      <div class="chart-wrap"><canvas id="chartActivity"></canvas></div>
    </div>

    <div class="chart-card">
      <div class="card-header">DM by Country</div>
      <div class="chart-wrap"><canvas id="chartCountry"></canvas></div>
    </div>

    <div class="chart-card">
      <div class="card-header">Skin Concerns</div>
      <div class="chart-wrap"><canvas id="chartTags"></canvas></div>
    </div>

    <div class="chart-card">
      <div class="card-header">Concerns by Country</div>
      <div class="chart-wrap chart-wrap-lg"><canvas id="chartCountryConcerns"></canvas></div>
    </div>
  </div>

  <!-- SETTINGS -->
  <div class="section" id="sec-settings">

    <!-- 1. Clinic Info -->
    <div class="setting-section">
      <div class="setting-header" onclick="toggleSetting(this)">
        <div class="setting-icon" style="background:var(--accent-soft);color:var(--accent);"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
        <div class="setting-info"><div class="setting-title">Clinic Info</div><div class="setting-desc">Name, address, hours, booking</div></div>
        <span class="setting-arrow">&#9660;</span>
      </div>
      <div class="setting-body">
        <label class="form-label">Clinic Name</label>
        <input class="form-input" id="clinicName" placeholder="e.g. Skin Source Dermatology">
        <label class="form-label">Address</label>
        <input class="form-input" id="address" placeholder="e.g. 123 Main St, Los Angeles, CA" style="font-size:11px;">
        <label class="form-label">Hours</label>
        <input class="form-input" id="hours" placeholder="e.g. Mon-Fri 9am-6pm">
        <label class="form-label">Phone</label>
        <input class="form-input" id="phone" placeholder="e.g. (310) 555-1234">
        <label class="form-label">Booking</label>
        <input class="form-input" id="booking" placeholder="e.g. DM, phone call, or link">
        <button class="btn-save-card" onclick="saveConfig()">Save</button>
      </div>
    </div>

    <!-- 2. Treatments -->
    <div class="setting-section">
      <div class="setting-header" onclick="toggleSetting(this)">
        <div class="setting-icon" style="background:var(--green-soft);color:var(--green);"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
        <div class="setting-info"><div class="setting-title">Treatments</div><div class="setting-desc">Services & pricing list</div></div>
        <span class="setting-arrow">&#9660;</span>
      </div>
      <div class="setting-body">
        <label class="form-label">Treatments & Pricing</label>
        <textarea class="form-textarea" id="treatments" rows="5" placeholder="e.g. Botox: from \$200"></textarea>
        <button class="btn-save-card" onclick="saveConfig()">Save</button>
      </div>
    </div>

    <!-- 3. Greeting Message -->
    <div class="setting-section">
      <div class="setting-header" onclick="toggleSetting(this)">
        <div class="setting-icon" style="background:rgba(74,200,232,0.12);color:var(--cyan);"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg></div>
        <div class="setting-info"><div class="setting-title">Greeting Message</div><div class="setting-desc">First DM auto-reply</div></div>
        <span class="setting-arrow">&#9660;</span>
      </div>
      <div class="setting-body">
        <label class="form-label">First DM auto-message</label>
        <textarea class="form-textarea" id="greeting" rows="4"></textarea>
        <button class="btn-save-card" onclick="saveConfig()">Save</button>
      </div>
    </div>

    <!-- 4. Country Buttons -->
    <div class="setting-section">
      <div class="setting-header" onclick="toggleSetting(this)">
        <div class="setting-icon" style="background:rgba(61,214,140,0.12);color:var(--green);"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg></div>
        <div class="setting-info"><div class="setting-title">Country Buttons</div><div class="setting-desc">Quick reply options for country selection</div></div>
        <span class="setting-arrow">&#9660;</span>
      </div>
      <div class="setting-body">
        <p style="font-size:12px;color:var(--text-tertiary);margin-bottom:10px;line-height:1.5;">These buttons appear when a new user DMs. Max 13 options. "Others" lets users type their country. Comma separated.</p>
        <input class="form-input" id="countryOptions" placeholder="e.g. United States, Singapore, Australia, Canada, Others">
        <button class="btn-save-card" onclick="saveConfig()">Save</button>
      </div>
    </div>

    <!-- 5. AI Consultation Prompt -->
    <div class="setting-section">
      <div class="setting-header" onclick="toggleSetting(this)">
        <div class="setting-icon" style="background:rgba(167,139,250,0.12);color:var(--purple);"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
        <div class="setting-info"><div class="setting-title">AI Consultation Prompt</div><div class="setting-desc">Controls AI personality, tone & medical rules</div></div>
        <span class="setting-arrow">&#9660;</span>
      </div>
      <div class="setting-body">
        <div style="display:flex;justify-content:flex-end;margin-bottom:10px;">
          <button onclick="resetPrompt()" style="background:var(--surface-2);border:1px solid var(--border);color:var(--text-tertiary);padding:6px 12px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;font-family:Inter,sans-serif;">Reset to Default</button>
        </div>
        <textarea class="form-textarea" id="aiPrompt" rows="14" style="font-size:13px;line-height:1.6;font-family:'Courier New',monospace;"></textarea>
        <button class="btn-save-card" onclick="saveConfig()">Save</button>
      </div>
    </div>

    <!-- 6. Additional Rules -->
    <div class="setting-section">
      <div class="setting-header" onclick="toggleSetting(this)">
        <div class="setting-icon" style="background:var(--amber-soft);color:var(--amber);"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
        <div class="setting-info"><div class="setting-title">Additional Rules</div><div class="setting-desc">Extra AI rules & fallback message</div></div>
        <span class="setting-arrow">&#9660;</span>
      </div>
      <div class="setting-body">
        <label class="form-label">Extra rules (appended to prompt)</label>
        <textarea class="form-textarea" id="customRules" rows="3" placeholder="e.g. Never mention competitors"></textarea>
        <label class="form-label">Fallback message (when AI fails)</label>
        <input class="form-input" id="fallback" placeholder="e.g. Sorry, try again shortly!">
        <button class="btn-save-card" onclick="saveConfig()">Save</button>
      </div>
    </div>

    <!-- 7. AI Integration -->
    <div class="setting-section">
      <div class="setting-header" onclick="toggleSetting(this)">
        <div class="setting-icon" style="background:rgba(169,132,255,0.12);color:#A984FF;"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
        <div class="setting-info"><div class="setting-title">AI Integration</div><div class="setting-desc">Claude API key & monthly usage limit</div></div>
        <span class="setting-arrow">&#9660;</span>
      </div>
      <div class="setting-body">
        <label class="form-label">Claude API Key</label>
        <div style="position:relative;">
          <input class="form-input" id="claudeApiKey" type="password" placeholder="sk-ant-api03-..." style="padding-right:40px;">
          <button onclick="const i=document.getElementById('claudeApiKey');i.type=i.type==='password'?'text':'password';this.textContent=i.type==='password'?'Show':'Hide';" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--accent);font-size:11px;cursor:pointer;font-weight:600;">Show</button>
        </div>
        <p style="font-size:10px;color:var(--text-tertiary);margin-top:4px;">Get your key at <a href="https://console.anthropic.com/settings/keys" target="_blank" style="color:var(--accent);">console.anthropic.com</a></p>
        <label class="form-label">AI Model</label>
        <select class="form-input" id="claudeModel" style="font-size:12px;">
          <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5 (cheapest, fast)</option>
          <option value="claude-sonnet-4-6">Claude Sonnet 4.6 (balanced)</option>
          <option value="claude-opus-4-6">Claude Opus 4.6 (best quality)</option>
        </select>
        <label class="form-label">Monthly Spending Limit (USD)</label>
        <div style="position:relative;"><span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-tertiary);font-weight:600;font-size:13px;">$</span><input class="form-input" id="claudeMonthlyLimit" type="number" placeholder="e.g. 10" min="1" step="1" style="padding-left:24px;"></div>
        <p style="font-size:10px;color:var(--text-tertiary);margin-top:4px;">AI replies stop when limit is reached. Fallback message will be used instead.</p>
        <div id="aiUsageInfo" style="margin-top:12px;padding:10px;background:var(--bg);border-radius:8px;"></div>
        <button class="btn-save-card" onclick="saveConfig()">Save</button>
      </div>
    </div>

    <!-- 8. Comment Auto-Reply -->
    <div class="setting-section">
      <div class="setting-header" onclick="toggleSetting(this)">
        <div class="setting-icon" style="background:var(--red-soft);color:var(--red);"><svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg></div>
        <div class="setting-info">
          <div class="setting-title" style="display:flex;align-items:center;gap:8px;">Comment Auto-Reply
            <label style="display:flex;align-items:center;gap:4px;cursor:pointer;margin:0;font-size:11px;color:var(--text-tertiary);font-weight:500;" onclick="event.stopPropagation()">
              <input type="checkbox" id="commentReplyEnabled" style="width:14px;height:14px;accent-color:var(--accent);cursor:pointer;"> On
            </label>
          </div>
          <div class="setting-desc">Auto-reply to post comments</div>
        </div>
        <span class="setting-arrow">&#9660;</span>
      </div>
      <div class="setting-body">
        <label class="form-label">Default Reply</label>
        <input class="form-input" id="commentDefaultReply" placeholder="e.g. Thanks! DM me for a consultation">
        <div style="margin-top:14px;">
          <label class="form-label">Keyword Rules</label>
          <div id="commentRulesList"></div>
          <button class="kw-add" onclick="addCommentRule()">+ Add Rule</button>
        </div>
        <button class="btn-save-card" onclick="saveConfig()">Save</button>
      </div>
    </div>

    <!-- 9. Bot Performance Tracking -->
    <div class="setting-section">
      <div class="setting-header" onclick="toggleSetting(this)">
        <div class="setting-icon" style="background:rgba(61,214,140,0.12);color:var(--green);"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <div class="setting-info"><div class="setting-title">Bot Performance Tracking</div><div class="setting-desc">Set start date & initial followers to track growth</div></div>
        <span class="setting-arrow">&#9660;</span>
      </div>
      <div class="setting-body">
        <label class="form-label">Bot Start Date</label>
        <input class="form-input" id="botStartDate" type="date">
        <label class="form-label">Followers at Start</label>
        <input class="form-input" id="botStartFollowers" type="number" placeholder="e.g. 1200">
        <button class="btn-save-card" onclick="saveConfig()">Save</button>
      </div>
    </div>
  </div>

  <!-- KEYWORDS -->
  <div class="section" id="sec-keywords">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
      <div>
        <div style="font-size:16px;font-weight:700;letter-spacing:-0.2px;">Keyword Rules</div>
        <div style="font-size:12px;color:var(--text-tertiary);margin-top:2px;">When a keyword is detected in a DM, a fixed reply is sent instead of AI.</div>
      </div>
      <span class="kw-count" id="kwCount">0 rules</span>
    </div>
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px;margin-bottom:12px;">
      <div style="font-size:11px;color:var(--text-tertiary);font-weight:600;margin-bottom:6px;">HOW IT WORKS</div>
      <div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">
        User sends: <span style="color:var(--accent);">"How much is botox?"</span><br>
        Keyword <span style="background:var(--accent-soft);color:var(--accent);padding:1px 6px;border-radius:4px;font-size:11px;font-weight:600;">price</span> detected → fixed reply sent instantly (no AI cost)
      </div>
    </div>
    <div id="kwList"></div>
    <button class="kw-add" onclick="addKeyword()" style="margin-top:4px;">+ Add Keyword Rule</button>
    <button class="btn-save-card" onclick="saveConfig()" style="width:100%;margin-top:12px;">Save</button>
  </div>

  <!-- LOGS -->
  <div class="section" id="sec-logs">
    <!-- Today's Summary -->
    <div class="summary-grid" id="todaySummary"></div>

    <div class="card">
      <div class="card-header" style="display:flex;align-items:center;justify-content:space-between;">
        <span>DM Log</span>
        <div style="display:flex;gap:6px;">
          <button onclick="filterUnreviewed()" class="log-action-btn" id="btnUnreviewed" style="font-size:10px;">Unreviewed</button>
          <button onclick="exportCSV()" class="log-action-btn" style="font-size:10px;">Export CSV</button>
        </div>
      </div>
      <div style="margin-bottom:10px;">
        <input class="form-input" id="logSearch" placeholder="Search by username or message..." oninput="applyFilters()" style="font-size:14px;">
      </div>
      <div class="log-filters">
        <select class="log-filter" id="filterPeriod" onchange="applyFilters()">
          <option value="all">All Time</option>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
        </select>
        <select class="log-filter" id="filterCountry" onchange="applyFilters()">
          <option value="all">All Countries</option>
        </select>
        <select class="log-filter" id="filterTag" onchange="applyFilters()">
          <option value="all">All Concerns</option>
        </select>
      </div>
      <div class="log-count" id="logCount"></div>
      <div id="logList"><p class="empty">Loading...</p></div>
    </div>
  </div>

</div>

<!-- ── Patient Modal ── -->
<div class="modal-overlay" id="patientModal">
  <div class="modal">
    <div class="modal-header">
      <h3 id="modalTitle">@username</h3>
      <button class="modal-close" onclick="closeModal()">&times;</button>
    </div>
    <div class="modal-body">
      <div class="modal-section">
        <div class="modal-section-title">Patient Info</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">
          <span class="badge badge-country" id="modalCountry"></span>
          <span class="badge" id="modalVipBadge" style="display:none;"></span>
          <span class="badge" id="modalPausedBadge" style="display:none;"></span>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:10px;">
          <button class="log-action-btn" id="modalVipBtn" onclick="toggleModalVip()">VIP</button>
          <button class="log-action-btn" id="modalPauseBtn" onclick="toggleModalPause()">Pause Bot</button>
        </div>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">Memo</div>
        <textarea class="form-textarea" id="modalMemo" rows="2" placeholder="e.g. Interested in filler, visiting July" style="font-size:13px;"></textarea>
        <button class="btn btn-primary" onclick="saveModalMemo()" style="margin-top:6px;padding:6px 14px;font-size:12px;">Save Memo</button>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">Conversation History</div>
        <div id="modalHistory"></div>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">Direct Reply</div>
        <div style="display:flex;gap:8px;">
          <input class="reply-input" id="modalReplyInput" placeholder="Type a message...">
          <button class="reply-send" onclick="sendModalReply()">Send</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- ── Bottom Nav (mobile) ── -->
<div class="bottom-nav">
  <button class="nav-item active" onclick="switchTab('home',this)">
    <span class="nav-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span>
    <span class="nav-label">Home</span>
  </button>
  <button class="nav-item" onclick="switchTab('analytics',this)">
    <span class="nav-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></span>
    <span class="nav-label">Analytics</span>
  </button>
  <button class="nav-item" onclick="switchTab('logs',this)">
    <span class="nav-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></span>
    <span class="nav-label">Logs</span>
  </button>
  <button class="nav-item" onclick="switchTab('keywords',this)">
    <span class="nav-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg></span>
    <span class="nav-label">Keywords</span>
  </button>
  <button class="nav-item" onclick="switchTab('settings',this)">
    <span class="nav-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg></span>
    <span class="nav-label">Settings</span>
  </button>
</div>

<div class="toast" id="toast"></div>

<script>
let config = {};
const CC = ['#5B8DEF','#3DD68C','#F0B24A','#F06464','#4AC8E8','#A78BFA','#FB7185','#34D399','#FBBF24','#60A5FA','#C084FC','#F472B6'];

const DEFAULT_PROMPT = \`You ARE the doctor — a 30-something American dermatologist specializing in cosmetic/aesthetic dermatology. Most of your patients come to you for skin beauty treatments — Botox, fillers, laser treatments, chemical peels, acne scars, pigmentation, anti-aging, skin rejuvenation, etc. You're replying to Instagram DMs yourself, personally. You're chill, confident, knowledgeable, and genuinely care about helping people look and feel their best. Think: a cool aesthetic dermatologist friend who knows all the latest treatments.

## Vibe & Tone
- Natural, casual American English. Contractions always (I'd, you'll, that's, we're, gonna, wanna is fine).
- First person — "I", not "we". You're the doctor talking directly.
- Warm but HUMBLE. You're knowledgeable but never overconfident. Use softening language like "generally speaking", "in most cases", "this tends to work well for a lot of people".
- Emojis: subtle and natural, 1-2 max. Don't overdo it.
- Keep it SHORT — this is Instagram DM, NOT an essay. Max 3-4 sentences per reply. No bullet point lists. Think: texting a friend, not writing a blog post.

## Medical Consultation Rules — CRITICAL
1. You CAN give general cosmetic dermatology advice, skincare tips, explain treatments (Botox, fillers, lasers, peels, etc.), compare procedures, and suggest over-the-counter products and routines. BUT always frame advice as general guidance, not a personalized prescription.
2. You MUST be medically accurate. NEVER make up information. If you're not sure, say "I'd need to see that in person to give you a proper answer."
3. NEVER prescribe prescription medications over DM.
4. NEVER provide a definitive diagnosis from photos or descriptions alone. Always recommend an in-person visit for confirmation.
5. For anything serious (suspicious moles, infections, allergic reactions), strongly urge them to see a dermatologist in person ASAP.
6. When recommending products, stick to well-known, evidence-based options (e.g. sunscreen, retinoids, gentle cleansers, moisturizers with ceramides).
7. For booking: direct them to AB Clinic's reservation system (available after May 25th).\`;

function toggleSetting(header) {
  const section = header.parentElement;
  section.classList.toggle('open');
}
function resetPrompt() {
  document.getElementById('aiPrompt').value = DEFAULT_PROMPT;
  toast('Prompt reset to default');
}

const FLAG_CODES = {
  'china':'cn','japan':'jp','thailand':'th','vietnam':'vn','korea':'kr','south korea':'kr',
  'taiwan':'tw','hong kong':'hk','indonesia':'id','malaysia':'my','philippines':'ph',
  'singapore':'sg','india':'in','australia':'au','uk':'gb','united kingdom':'gb',
  'canada':'ca','usa':'us','united states':'us','america':'us','russia':'ru','germany':'de',
  'france':'fr','netherlands':'nl','italy':'it','spain':'es','brazil':'br','mexico':'mx',
  'myanmar':'mm','burma':'mm','cambodia':'kh','laos':'la','bangladesh':'bd','pakistan':'pk',
  'sri lanka':'lk','nepal':'np','mongolia':'mn','turkey':'tr','saudi arabia':'sa','uae':'ae',
  'dubai':'ae','qatar':'qa','egypt':'eg','south africa':'za','new zealand':'nz',
  'sweden':'se','norway':'no','switzerland':'ch','israel':'il','argentina':'ar','colombia':'co',
};
const FLAG_EMOJI={'cn':'\u{1F1E8}\u{1F1F3}','jp':'\u{1F1EF}\u{1F1F5}','th':'\u{1F1F9}\u{1F1ED}','vn':'\u{1F1FB}\u{1F1F3}','kr':'\u{1F1F0}\u{1F1F7}','tw':'\u{1F1F9}\u{1F1FC}','hk':'\u{1F1ED}\u{1F1F0}','id':'\u{1F1EE}\u{1F1E9}','my':'\u{1F1F2}\u{1F1FE}','ph':'\u{1F1F5}\u{1F1ED}','sg':'\u{1F1F8}\u{1F1EC}','in':'\u{1F1EE}\u{1F1F3}','au':'\u{1F1E6}\u{1F1FA}','gb':'\u{1F1EC}\u{1F1E7}','ca':'\u{1F1E8}\u{1F1E6}','us':'\u{1F1FA}\u{1F1F8}','ru':'\u{1F1F7}\u{1F1FA}','de':'\u{1F1E9}\u{1F1EA}','fr':'\u{1F1EB}\u{1F1F7}','nl':'\u{1F1F3}\u{1F1F1}','it':'\u{1F1EE}\u{1F1F9}','es':'\u{1F1EA}\u{1F1F8}','br':'\u{1F1E7}\u{1F1F7}','mx':'\u{1F1F2}\u{1F1FD}','mm':'\u{1F1F2}\u{1F1F2}','kh':'\u{1F1F0}\u{1F1ED}','la':'\u{1F1F1}\u{1F1E6}','bd':'\u{1F1E7}\u{1F1E9}','pk':'\u{1F1F5}\u{1F1F0}','lk':'\u{1F1F1}\u{1F1F0}','np':'\u{1F1F3}\u{1F1F5}','mn':'\u{1F1F2}\u{1F1F3}','tr':'\u{1F1F9}\u{1F1F7}','sa':'\u{1F1F8}\u{1F1E6}','ae':'\u{1F1E6}\u{1F1EA}','qa':'\u{1F1F6}\u{1F1E6}','eg':'\u{1F1EA}\u{1F1EC}','za':'\u{1F1FF}\u{1F1E6}','nz':'\u{1F1F3}\u{1F1FF}','se':'\u{1F1F8}\u{1F1EA}','no':'\u{1F1F3}\u{1F1F4}','ch':'\u{1F1E8}\u{1F1ED}','il':'\u{1F1EE}\u{1F1F1}','ar':'\u{1F1E6}\u{1F1F7}','co':'\u{1F1E8}\u{1F1F4}'};
function flagImg(c){
  if(!c)return'';
  const n=c.replace(/[^a-zA-Z\s]/g,'').trim().toLowerCase();
  const nNoSpace=n.replace(/\s+/g,'');
  for(const[k,v]of Object.entries(FLAG_CODES)){if(n.includes(k)||nNoSpace.includes(k.replace(/\s+/g,''))){return(FLAG_EMOJI[v]||'')+' ';}}
  return'';
}
function cleanC(c){
  if(!c)return'';
  // 첫 ASCII 문자 위치부터 끝까지 추출 (이모지 surrogate pair 안전)
  for(let i=0;i<c.length;i++){
    const code=c.charCodeAt(i);
    if((code>=65&&code<=90)||(code>=97&&code<=122))return c.substring(i).trim();
  }
  return '';
}
const SHORT_NAMES={'United States':'U.S.','United Kingdom':'U.K.','South Korea':'Korea','South Africa':'S. Africa','New Zealand':'N.Z.','Saudi Arabia':'Saudi'};
function shortC(c){
  if(!c)return'';
  const n=cleanC(c);
  const short=SHORT_NAMES[n]||n;
  const emoji=c.match(/[\u{1F1E0}-\u{1F1FF}]{2}/u);
  return emoji?emoji[0]+' '+short:short;
}

// ── Tab Switch ──
function switchTab(name, el) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('sec-'+name).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if(el) el.classList.add('active');
  // sync both navs
  document.querySelectorAll('.bottom-nav .nav-item, .desktop-tabs .nav-item').forEach(n => {
    n.classList.toggle('active', n.textContent.toLowerCase().includes(name === 'analytics' ? 'dm' : name === 'home' ? 'home' : name));
  });
  if(name==='home') loadHome();
  if(name==='analytics') loadAnalytics();
  if(name==='logs') loadLogs();
}

// ── Error banner helper ──
function showError(containerId, msg, retryFn) {
  const el=document.getElementById(containerId);
  if(!el)return;
  el.innerHTML=\`<div class="error-banner"><span class="error-banner-text">\${msg}</span><button class="error-banner-btn" onclick="\${retryFn}">Retry</button></div>\`;
}

// ── Home ──
let homeOk=false;
async function loadHome(){
  if(homeOk)return; homeOk=true;
  let ig;
  try{
    const res=await fetch('/api/instagram');
    if(!res.ok) throw new Error('API error');
    ig=await res.json();
  }catch(e){
    showError('homeError','Failed to load Instagram data.','homeOk=false;loadHome()');
    return;
  }
  if(ig.profilePic)document.getElementById('profilePic').src=ig.profilePic;
  document.getElementById('profileName').textContent=ig.name||ig.username||'-';
  document.getElementById('profileUsername').textContent='@'+(ig.username||'-');
  document.getElementById('statFollowers').textContent=fmt(ig.followers);
  document.getElementById('statPosts').textContent=fmt(ig.mediaCount);
  document.getElementById('statLikes').textContent=fmt(ig.totalLikes);
  document.getElementById('statComments').textContent=fmt(ig.totalComments);
  document.getElementById('statViews').textContent=fmt(ig.totalViews||0);
  const pc=ig.posts?.length||1;
  const engRate=ig.followers>0?((ig.totalLikes+ig.totalComments)/(ig.followers*pc)*100).toFixed(1):'0';
  document.getElementById('statEngRate').textContent=engRate+'%';

  // Quick Actions + Bot Performance — DM counts
  try{
    const lr=await fetch('/api/logs');const logs=await lr.json();
    if(Array.isArray(logs)){
      document.getElementById('quickDMs').textContent=logs.length;
      const td=new Date().toISOString().split('T')[0];
      document.getElementById('quickToday').textContent=logs.filter(l=>(l.createdAt||'').startsWith(td)).length;

      // Bot Performance card
      const bp=document.getElementById('botPerformance');
      if(bp && config.botStartDate){
        const startDate=new Date(config.botStartDate);
        const daysActive=Math.max(1,Math.floor((Date.now()-startDate.getTime())/864e5));
        const startFollowers=config.botStartFollowers||0;
        const followerGrowth=ig.followers-startFollowers;
        const followerPct=startFollowers>0?((followerGrowth/startFollowers)*100).toFixed(1):'-';
        const uniqueUsers=new Set(logs.map(l=>l.username).filter(Boolean)).size;
        const countries=new Set(logs.map(l=>cleanC(l.country)).filter(Boolean)).size;
        const consulted=logs.filter(l=>l.tag&&l.tag!=='stuck'&&l.tag!=='paused'&&l.tag!=='direct').length;
        const convRate=logs.length>0?Math.round(consulted/logs.length*100):0;

        bp.innerHTML=\`<div class="card" style="background:linear-gradient(135deg,var(--surface),var(--surface-2));margin-bottom:12px;">
          <div class="card-header" style="display:flex;align-items:center;gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            Bot Performance — \${daysActive} days active
          </div>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
            <div style="padding:8px;background:var(--bg);border-radius:8px;overflow:hidden;">
              <div style="font-size:9px;color:var(--text-tertiary);font-weight:600;text-transform:uppercase;white-space:nowrap;">Followers</div>
              <div style="font-size:18px;font-weight:800;margin-top:3px;color:\${followerGrowth>=0?'var(--green)':'var(--red)'};">\${followerGrowth>=0?'+':''}\${fmt(followerGrowth)}</div>
              <div style="font-size:9px;color:var(--text-tertiary);">\${followerPct}%</div>
            </div>
            <div style="padding:8px;background:var(--bg);border-radius:8px;overflow:hidden;">
              <div style="font-size:9px;color:var(--text-tertiary);font-weight:600;text-transform:uppercase;white-space:nowrap;">Replied</div>
              <div style="font-size:18px;font-weight:800;margin-top:3px;color:var(--accent);">\${logs.length}</div>
              <div style="font-size:9px;color:var(--text-tertiary);">\${(logs.length/daysActive).toFixed(1)}/day</div>
            </div>
            <div style="padding:8px;background:var(--bg);border-radius:8px;overflow:hidden;">
              <div style="font-size:9px;color:var(--text-tertiary);font-weight:600;text-transform:uppercase;white-space:nowrap;">Consulted</div>
              <div style="font-size:18px;font-weight:800;margin-top:3px;color:var(--green);">\${consulted}</div>
              <div style="font-size:9px;color:var(--text-tertiary);">\${convRate}% conv.</div>
            </div>
            <div style="padding:8px;background:var(--bg);border-radius:8px;overflow:hidden;">
              <div style="font-size:9px;color:var(--text-tertiary);font-weight:600;text-transform:uppercase;white-space:nowrap;">Patients</div>
              <div style="font-size:18px;font-weight:800;margin-top:3px;">\${uniqueUsers}</div>
              <div style="font-size:9px;color:var(--text-tertiary);">\${countries} countries</div>
            </div>
            <div style="padding:8px;background:var(--bg);border-radius:8px;overflow:hidden;">
              <div style="font-size:9px;color:var(--text-tertiary);font-weight:600;text-transform:uppercase;white-space:nowrap;">Time Saved</div>
              <div style="font-size:18px;font-weight:800;margin-top:3px;color:var(--cyan);">\${logs.length>=60?Math.round(logs.length/60)+'h':logs.length+'m'}</div>
              <div style="font-size:9px;color:var(--text-tertiary);">~1 min/reply</div>
            </div>
            <div style="padding:8px;background:var(--bg);border-radius:8px;overflow:hidden;">
              <div style="font-size:9px;color:var(--text-tertiary);font-weight:600;text-transform:uppercase;white-space:nowrap;">Active</div>
              <div style="font-size:18px;font-weight:800;margin-top:3px;">\${daysActive}d</div>
              <div style="font-size:9px;color:var(--text-tertiary);">since \${config.botStartDate}</div>
            </div>
          </div>
          <div style="margin-top:8px;padding:12px;background:var(--bg);border-radius:8px;border-left:3px solid var(--amber);">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
              <div>
                <div style="font-size:11px;color:var(--text-secondary);font-weight:700;text-transform:uppercase;">Booking Intent</div>
                <div style="font-size:10px;color:var(--text-tertiary);margin-top:2px;">Mentioned booking, visiting, or appointments</div>
              </div>
              <div style="font-size:28px;font-weight:800;color:var(--amber);flex-shrink:0;">\${(()=>{const bk=['book','appointment','schedule','reserve','i want to come','i want to visit','planning to come','planning to visit','fly to korea','travel to korea','when can i come','i will visit','i will come','see you at','ready to book'];return new Set(logs.filter(l=>bk.some(k=>(l.received||'').toLowerCase().includes(k))).map(l=>l.username||l.senderId)).size;})()}</div>
            </div>
          </div>
        </div>\`;
      }
    }
  }catch(e){}

  if(ig.posts?.length){
    const p=[...ig.posts].reverse();
    const ds=[
      {label:'Likes',data:p.map(x=>x.likes),backgroundColor:'#5B8DEF',borderRadius:5,barPercentage:0.55},
      {label:'Comments',data:p.map(x=>x.comments),backgroundColor:'#3DD68C',borderRadius:5,barPercentage:0.55},
    ];
    if(p.some(x=>x.views>0))ds.push({label:'Views',data:p.map(x=>x.views||0),backgroundColor:'#4AC8E8',borderRadius:5,barPercentage:0.55});
    new Chart(document.getElementById('chartEngagement'),{
      type:'bar',
      data:{labels:p.map(x=>x.date?new Date(x.date).toLocaleDateString('en',{month:'short',day:'numeric'}):''),datasets:ds},
      options:cOpts()
    });
  }
}

// ── Analytics ──
let anaOk=false;
async function loadAnalytics(){
  if(anaOk)return; anaOk=true;
  let logs;
  try{
    const res=await fetch('/api/logs');
    if(!res.ok) throw new Error('API error');
    logs=await res.json();
    if(!Array.isArray(logs)) logs=[];
  }catch(e){
    showError('analyticsError','Failed to load DM data.','anaOk=false;loadAnalytics()');
    return;
  }
  document.getElementById('statDMs').textContent=logs.length;

  const countries={},tags={},ct={},countryRaw={};
  logs.forEach(l=>{
    const c=cleanC(l.country);
    if(c){countries[c]=(countries[c]||0)+1;if(!countryRaw[c])countryRaw[c]=l.country;if(!ct[c])ct[c]={};if(l.tag&&l.tag!=='stuck'&&l.tag!=='paused'&&l.tag!=='direct'&&l.tag!=='consultation')ct[c][l.tag]=(ct[c][l.tag]||0)+1;}
    if(l.tag&&l.tag!=='stuck'&&l.tag!=='paused'&&l.tag!=='direct'&&l.tag!=='consultation')tags[l.tag]=(tags[l.tag]||0)+1;
  });
  const tc=Object.entries(countries).sort((a,b)=>b[1]-a[1])[0];
  const tt=Object.entries(tags).sort((a,b)=>b[1]-a[1])[0];
  document.getElementById('statTopCountry').textContent=tc?shortC(countryRaw[tc[0]]||tc[0]):'-';
  document.getElementById('statTopTag').textContent=tt?tt[0]:'-';

  const dOpts={responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{color:'#B0B8D0',font:{size:10,family:'Inter'},padding:8,usePointStyle:true,pointStyleWidth:7}}}};

  // Activity
  const days=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push(d.toISOString().split('T')[0]);}
  new Chart(document.getElementById('chartActivity'),{type:'line',data:{labels:days.map(d=>d.slice(5)),datasets:[{label:'DMs',data:days.map(d=>logs.filter(l=>(l.createdAt||'').startsWith(d)).length),borderColor:'#5B8DEF',backgroundColor:'rgba(91,141,239,0.08)',fill:true,tension:0.4,pointRadius:4,pointBackgroundColor:'#5B8DEF',borderWidth:2}]},options:cOpts()});

  // Country
  if(Object.keys(countries).length){const s=Object.entries(countries).sort((a,b)=>b[1]-a[1]).slice(0,8);new Chart(document.getElementById('chartCountry'),{type:'doughnut',data:{labels:s.map(x=>cleanC(x[0])),datasets:[{data:s.map(x=>x[1]),backgroundColor:CC.slice(0,s.length),borderWidth:0}]},options:dOpts});}

  // Tags
  if(Object.keys(tags).length){const s=Object.entries(tags).sort((a,b)=>b[1]-a[1]).slice(0,8);new Chart(document.getElementById('chartTags'),{type:'doughnut',data:{labels:s.map(x=>x[0]),datasets:[{data:s.map(x=>x[1]),backgroundColor:CC.slice(0,s.length),borderWidth:0}]},options:dOpts});}

  // Country Concerns
  if(Object.keys(ct).length){
    const cl=Object.keys(ct).sort((a,b)=>Object.values(ct[b]).reduce((s,v)=>s+v,0)-Object.values(ct[a]).reduce((s,v)=>s+v,0)).slice(0,8);
    const at=[...new Set(cl.flatMap(c=>Object.keys(ct[c])))];
    new Chart(document.getElementById('chartCountryConcerns'),{type:'bar',data:{labels:cl.map(c=>cleanC(c)),datasets:at.map((t,i)=>({label:t,data:cl.map(c=>ct[c][t]||0),backgroundColor:CC[i%CC.length],borderRadius:3}))},options:{...cOpts(),scales:{x:{stacked:true,ticks:{color:'#B0B8D0',font:{size:10}},grid:{display:false},border:{display:false}},y:{stacked:true,ticks:{color:'#8A94B0',font:{size:10}},grid:{color:'rgba(140,155,200,0.05)'},border:{display:false},beginAtZero:true}}}});
  }
}

function cOpts(){return{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#A0A8C0',font:{size:10,family:'Inter'},usePointStyle:true,pointStyleWidth:7,padding:10}}},scales:{x:{ticks:{color:'#6B7394',font:{size:10,family:'Inter'}},grid:{color:'rgba(140,155,200,0.04)'},border:{display:false}},y:{ticks:{color:'#6B7394',font:{size:10,family:'Inter'}},grid:{color:'rgba(140,155,200,0.04)'},border:{display:false},beginAtZero:true}}};}
function fmt(n){if(n>=1e6)return(n/1e6).toFixed(1)+'M';if(n>=1e3)return(n/1e3).toFixed(1)+'K';return String(n||0);}

// ── Config ──
async function loadAiUsage(){
  try{
    const r=await fetch('/api/ai-usage');
    if(!r.ok)return;
    const d=await r.json();
    const el=document.getElementById('aiUsageInfo');
    if(!el)return;
    const limit=config.claudeMonthlyLimit||0;
    const pct=limit>0?Math.min(100,Math.round(d.cost/limit*100)):0;
    const barColor=pct>=90?'var(--red)':pct>=70?'var(--amber)':'var(--green)';
    el.innerHTML=\`
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
        <span style="font-size:10px;color:var(--text-tertiary);font-weight:600;">THIS MONTH USAGE</span>
        <span style="font-size:10px;color:var(--text-tertiary);">\${new Date().toLocaleString('en',{month:'short',year:'numeric'})}</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:baseline;">
        <span style="font-size:18px;font-weight:800;color:var(--text);">$\${d.cost.toFixed(2)}</span>
        <span style="font-size:11px;color:var(--text-tertiary);">\${limit>0?'/ $'+limit+' limit':'no limit set'}</span>
      </div>
      \${limit>0?'<div style="margin-top:6px;height:4px;background:var(--bg);border-radius:2px;overflow:hidden;"><div style="width:'+pct+'%;height:100%;background:'+barColor+';border-radius:2px;"></div></div>':''}
      <div style="display:flex;justify-content:space-between;margin-top:6px;">
        <span style="font-size:10px;color:var(--text-tertiary);">\${d.requests} requests</span>
        <span style="font-size:10px;color:var(--text-tertiary);">\${d.inputTokens+d.outputTokens} tokens</span>
      </div>
    \`;
  }catch(e){}
}
async function loadConfig(){
  const r=await fetch('/api/config');config=await r.json();
  ['clinicName','address','hours','phone','booking','treatments','greeting','aiPrompt','customRules','fallback'].forEach(k=>{const e=document.getElementById(k);if(e)e.value=config[k]||'';});
  // aiPrompt가 비어있으면 기본값 표시
  if(!document.getElementById('aiPrompt').value) document.getElementById('aiPrompt').value=DEFAULT_PROMPT;
  // 국가 버튼
  document.getElementById('countryOptions').value = (config.countryOptions || ['United States','Singapore','Australia','Canada','Others']).join(', ');
  // AI Integration
  document.getElementById('claudeApiKey').value = config.claudeApiKey || '';
  document.getElementById('claudeModel').value = config.claudeModel || 'claude-haiku-4-5-20251001';
  document.getElementById('claudeMonthlyLimit').value = config.claudeMonthlyLimit || '';
  loadAiUsage();
  // Bot performance
  document.getElementById('botStartDate').value = config.botStartDate || '';
  document.getElementById('botStartFollowers').value = config.botStartFollowers || '';
  // 댓글 설정
  document.getElementById('commentReplyEnabled').checked = config.commentReplyEnabled || false;
  document.getElementById('commentDefaultReply').value = config.commentDefaultReply || '';
  renderKw();
  renderCommentRules();
}
async function saveConfig(){
  ['clinicName','address','hours','phone','booking','treatments','greeting','aiPrompt','customRules','fallback','commentDefaultReply'].forEach(k=>{const e=document.getElementById(k);if(e)config[k]=e.value;});
  config.commentReplyEnabled = document.getElementById('commentReplyEnabled').checked;
  config.claudeApiKey = document.getElementById('claudeApiKey').value;
  config.claudeModel = document.getElementById('claudeModel').value;
  config.claudeMonthlyLimit = parseInt(document.getElementById('claudeMonthlyLimit').value) || 0;
  config.botStartDate = document.getElementById('botStartDate').value;
  config.botStartFollowers = parseInt(document.getElementById('botStartFollowers').value) || 0;
  const coVal = document.getElementById('countryOptions').value;
  config.countryOptions = coVal ? coVal.split(',').map(s=>s.trim()).filter(Boolean) : null;
  collectCommentRules();
  collectKw();
  const saveBtns=document.querySelectorAll('[onclick="saveConfig()"]');
  saveBtns.forEach(b=>{b.disabled=true;b.textContent='Saving...';});
  await fetch('/api/config',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(config)});
  saveBtns.forEach(b=>{b.textContent='Saved!';b.style.background='var(--green)';});
  setTimeout(()=>saveBtns.forEach(b=>{b.disabled=false;b.textContent='Save';b.style.background='';}),2000);
  toast('Saved!');
}

// ── Bot ──
async function toggleBot(){const r=await(await fetch('/api/toggle',{method:'POST'})).json();updateBot(r.enabled);}
async function loadStatus(){const r=await(await fetch('/api/status')).json();updateBot(r.enabled);}
function updateBot(on){
  const p=document.getElementById('botPill'),l=document.getElementById('botLabel');
  p.className='bot-pill '+(on?'on':'off');l.textContent=on?'Active':'Paused';
}

// ── Keywords ──
function renderKw(){
  const el=document.getElementById('kwList');if(!el)return;
  const kws=config.keywords||[];
  const countEl=document.getElementById('kwCount');
  if(countEl) countEl.textContent=kws.length+' rule'+(kws.length!==1?'s':'');
  if(!kws.length){el.innerHTML='<div class="kw-empty">No keyword rules yet.<br>Add one to auto-reply without using AI.</div>';return;}
  el.innerHTML=kws.map((kw,i)=>{
    const triggers=kw.triggers.map(t=>'<span class="kw-trigger-badge">'+esc(t)+'</span>').join('');
    const preview=esc((kw.reply||'').substring(0,120))+(kw.reply&&kw.reply.length>120?'...':'');
    return \`<div class="kw-card" id="kw-\${i}">
      <div class="kw-actions">
        <button class="kw-action-btn" onclick="editKw(\${i})" title="Edit"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
        <button class="kw-action-btn delete" onclick="rmKw(\${i})" title="Delete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
      </div>
      <div class="kw-preview-area">
        <div class="kw-triggers">\${triggers||'<span style="color:var(--text-tertiary);font-size:12px;">No keywords set</span>'}</div>
        <div class="kw-reply-preview">\${preview||'<span style="color:var(--text-tertiary);">No reply set</span>'}</div>
      </div>
      <div class="kw-edit-area">
        <label class="form-label">Keywords (comma separated)</label>
        <input class="form-input" value="\${kw.triggers.join(', ')}" placeholder="e.g. price, cost, how much" data-t="\${i}">
        <label class="form-label" style="margin-top:10px">Reply Message</label>
        <textarea class="form-textarea" style="min-height:60px" placeholder="The reply sent when keyword is detected" data-r="\${i}">\${kw.reply}</textarea>
        <button class="btn btn-primary" onclick="closeEditKw(\${i})" style="margin-top:8px;padding:8px 16px;font-size:13px;">Done</button>
      </div>
    </div>\`;
  }).join('');
}
function editKw(i){document.getElementById('kw-'+i)?.classList.add('editing');}
function closeEditKw(i){document.getElementById('kw-'+i)?.classList.remove('editing');collectKw();renderKw();}
function collectKw(){config.keywords=[];document.querySelectorAll('[data-t]').forEach(el=>{const i=el.getAttribute('data-t');const t=el.value.split(',').map(s=>s.trim()).filter(Boolean);const r=document.querySelector('[data-r="'+i+'"]')?.value||'';if(t.length)config.keywords.push({triggers:t,reply:r});});}
function addKeyword(){config.keywords=config.keywords||[];config.keywords.push({triggers:[],reply:''});renderKw();const last=document.getElementById('kw-'+(config.keywords.length-1));if(last){last.classList.add('editing');last.scrollIntoView({behavior:'smooth',block:'center'});}}
function rmKw(i){config.keywords.splice(i,1);renderKw();}

// ── Comment Rules ──
function renderCommentRules(){
  const el=document.getElementById('commentRulesList');if(!el)return;
  el.innerHTML='';
  (config.commentRules||[]).forEach((r,i)=>{
    el.innerHTML+=\`<div class="kw-item"><button class="kw-remove" onclick="rmCR(\${i})">x</button><input class="form-input" value="\${r.triggers.join(', ')}" placeholder="Keywords (comma)" data-ct="\${i}"><input class="form-input" value="\${r.reply}" placeholder="Reply message" data-cr="\${i}" style="margin-top:6px"></div>\`;
  });
}
function collectCommentRules(){config.commentRules=[];document.querySelectorAll('[data-ct]').forEach(el=>{const i=el.getAttribute('data-ct');const t=el.value.split(',').map(s=>s.trim()).filter(Boolean);const r=document.querySelector('[data-cr="'+i+'"]')?.value||'';if(t.length)config.commentRules.push({triggers:t,reply:r});});}
function addCommentRule(){config.commentRules=config.commentRules||[];config.commentRules.push({triggers:[],reply:''});renderCommentRules();}
function rmCR(i){config.commentRules.splice(i,1);renderCommentRules();}

// ── Logs ──
let allLogs=[],filteredLogs=[],lp=0;const LPP=20;
async function loadLogs(){
  try{
    await loadPatientData();
    allLogs=await(await fetch('/api/logs')).json();
    if(!Array.isArray(allLogs))allLogs=[];
    buildFilterOptions();renderTodaySummary(allLogs);applyFilters();
  }catch(e){
    console.error('loadLogs error:',e);
    document.getElementById('logList').innerHTML='<p class="empty">Failed to load logs. Pull down to refresh.</p>';
  }
}
function buildFilterOptions(){
  const countries=new Set(),tags=new Set();
  allLogs.forEach(l=>{
    const c=cleanC(l.country); if(c)countries.add(c);
    if(l.tag&&l.tag!=='general')tags.add(l.tag);
  });
  const cSel=document.getElementById('filterCountry');
  cSel.innerHTML='<option value="all">All Countries</option>'+[...countries].sort().map(c=>'<option value="'+esc(c)+'">'+esc(c)+'</option>').join('');
  const tSel=document.getElementById('filterTag');
  tSel.innerHTML='<option value="all">All Concerns</option>'+[...tags].sort().map(t=>'<option value="'+esc(t)+'">'+esc(t)+'</option>').join('');
}
let patientData={};
let showUnreviewedOnly=false;

async function loadPatientData(){try{const r=await fetch('/api/patients');if(r.ok)patientData=await r.json();else patientData={};}catch(e){patientData={};}}

// ── Today Summary ──
function renderTodaySummary(logs){
  const el=document.getElementById('todaySummary');if(!el)return;
  const today=new Date().toISOString().split('T')[0];
  const todayLogs=logs.filter(l=>(l.createdAt||'').startsWith(today));
  const unreviewed=logs.filter(l=>!l.reviewed).length;
  // 퍼널 — 계정 기준 (중복 제거)
  const userMap={};
  logs.forEach(l=>{
    const key=l.username||l.senderId||'';
    if(!key)return;
    if(!userMap[key]) userMap[key]={follow:false,stuck:false,interest:false,consulted:false};
    if((l.replied||'').includes('[Follow request')) userMap[key].follow=true;
    if(l.tag==='stuck') userMap[key].stuck=true;
    if(l.tag&&l.tag!=='stuck'&&l.tag!=='paused'&&l.tag!=='direct') userMap[key].consulted=true;
    if(cleanC(l.country)&&!l.tag) userMap[key].interest=true;
  });
  const stuckCount=Object.values(userMap).filter(u=>u.stuck&&!u.consulted&&!u.interest).length;
  const consultedCount=Object.values(userMap).filter(u=>u.consulted).length;
  const countries={},countryRawToday={};todayLogs.forEach(l=>{const c=cleanC(l.country);if(c){countries[c]=(countries[c]||0)+1;if(!countryRawToday[c])countryRawToday[c]=l.country;}});
  const topC=Object.entries(countries).sort((a,b)=>b[1]-a[1])[0];
  const tags={};todayLogs.forEach(l=>{if(l.tag&&l.tag!=='direct'&&l.tag!=='paused'&&l.tag!=='stuck')tags[l.tag]=(tags[l.tag]||0)+1;});
  const topT=Object.entries(tags).sort((a,b)=>b[1]-a[1])[0];
  // 최종 상태 결정 (가장 진행된 단계로)
  let followOnly=0,interestOnly=0;
  Object.values(userMap).forEach(u=>{
    if(u.consulted) return;
    if(u.interest){interestOnly++;return;}
    if(u.stuck) return;
    followOnly++; // 팔로우 포함 + 어디에도 안 잡히는 사람
  });
  el.innerHTML=\`
    <div class="summary-card"><div class="stat-label">Today's DMs</div><div class="stat-value">\${todayLogs.length}</div></div>
    <div class="summary-card"><div class="stat-label">Unreviewed</div><div class="stat-value" style="color:\${unreviewed>0?'var(--amber)':'var(--green)'}">\${unreviewed}</div></div>
    <div class="summary-card"><div class="stat-label">Top Country Today</div><div class="stat-value" style="font-size:13px;">\${topC?esc(shortC(countryRawToday[topC[0]]||topC[0])):'-'}</div></div>
    <div class="summary-card"><div class="stat-label">Top Concern Today</div><div class="stat-value" style="font-size:13px;">\${topT?topT[0]:'-'}</div></div>
\`; el.innerHTML+=\`
    <div class="summary-card" style="grid-column:span 2;"><div class="stat-label">Patient Funnel</div>
      <div style="display:flex;gap:4px;margin-top:8px;flex-wrap:nowrap;">
        <div class="funnel-item" onclick="filterByFunnel('follow')" style="flex:1;text-align:center;padding:6px 2px;background:var(--bg);border-radius:8px;cursor:pointer;position:relative;min-width:0;">
          <div style="font-size:16px;font-weight:800;color:var(--red);">\${followOnly}</div>
          <div style="font-size:9px;color:var(--text-tertiary);margin-top:2px;">Follow</div>
        </div>
        <div style="flex:0;display:flex;align-items:center;color:var(--text-tertiary);font-size:9px;">→</div>
        <div class="funnel-item" onclick="filterByFunnel('stuck')" style="flex:1;text-align:center;padding:6px 2px;background:var(--bg);border-radius:8px;cursor:pointer;position:relative;min-width:0;">
          <div style="font-size:16px;font-weight:800;color:var(--amber);">\${stuckCount}</div>
          <div style="font-size:9px;color:var(--text-tertiary);margin-top:2px;">Stuck</div>
        </div>
        <div style="flex:0;display:flex;align-items:center;color:var(--text-tertiary);font-size:9px;">→</div>
        <div class="funnel-item" onclick="filterByFunnel('interest')" style="flex:1;text-align:center;padding:6px 2px;background:var(--bg);border-radius:8px;cursor:pointer;position:relative;min-width:0;">
          <div style="font-size:16px;font-weight:800;color:var(--cyan);">\${interestOnly}</div>
          <div style="font-size:9px;color:var(--text-tertiary);margin-top:2px;">Interest</div>
        </div>
        <div style="flex:0;display:flex;align-items:center;color:var(--text-tertiary);font-size:9px;">→</div>
        <div class="funnel-item" onclick="filterByFunnel('consulted')" style="flex:1;text-align:center;padding:6px 2px;background:var(--bg);border-radius:8px;cursor:pointer;position:relative;min-width:0;">
          <div style="font-size:16px;font-weight:800;color:var(--green);">\${consultedCount}</div>
          <div style="font-size:9px;color:var(--text-tertiary);margin-top:2px;">Consulted</div>
        </div>
      </div>
    </div>\`;
}

let funnelFilter='';
function filterByFunnel(type){
  if(funnelFilter===type){funnelFilter='';} else {funnelFilter=type;}
  // 퍼널 항목 active 표시
  document.querySelectorAll('.funnel-item').forEach(el=>el.style.outline='none');
  if(funnelFilter){
    const idx={follow:0,stuck:1,interest:2,consulted:3}[funnelFilter];
    const items=document.querySelectorAll('.funnel-item');
    if(items[idx]) items[idx].style.outline='2px solid var(--accent)';
  }
  showUnreviewedOnly=false;
  document.getElementById('btnUnreviewed')?.classList.remove('active');
  applyFilters();
}

function showFunnelTip(el,msg){
  // 기존 tooltip 제거
  document.querySelectorAll('.funnel-tip').forEach(t=>t.remove());
  const tip=document.createElement('div');
  tip.className='funnel-tip';tip.textContent=msg;
  el.appendChild(tip);
  requestAnimationFrame(()=>tip.classList.add('show'));
  setTimeout(()=>tip.classList.remove('show'),2500);
  setTimeout(()=>tip.remove(),2800);
}

let showStuckOnly=false;
function filterUnreviewed(){
  showUnreviewedOnly=!showUnreviewedOnly;showStuckOnly=false;
  document.getElementById('btnUnreviewed')?.classList.toggle('active',showUnreviewedOnly);
  document.getElementById('btnStuck')?.classList.remove('active');
  applyFilters();
}
function filterStuck(){
  showStuckOnly=!showStuckOnly;showUnreviewedOnly=false;
  document.getElementById('btnStuck')?.classList.toggle('active',showStuckOnly);
  document.getElementById('btnUnreviewed')?.classList.remove('active');
  applyFilters();
}

function timeAgo(d){
  if(!d)return'';
  const s=Math.floor((Date.now()-new Date(d).getTime())/1000);
  if(s<60)return'Just now';
  if(s<3600)return Math.floor(s/60)+'m ago';
  if(s<86400)return Math.floor(s/3600)+'h ago';
  if(s<172800)return'Yesterday';
  if(s<604800)return Math.floor(s/86400)+'d ago';
  return new Date(d).toLocaleDateString('en',{month:'short',day:'numeric'});
}
function applyFilters(){
  const period=document.getElementById('filterPeriod').value;
  const country=document.getElementById('filterCountry').value;
  const tag=document.getElementById('filterTag').value;
  const search=(document.getElementById('logSearch')?.value||'').toLowerCase();
  let logs=[...allLogs];
  if(period!=='all'){
    const cutoff=new Date(Date.now()-parseInt(period)*24*60*60*1000).toISOString();
    logs=logs.filter(l=>(l.createdAt||'')>=cutoff);
  }
  if(country!=='all') logs=logs.filter(l=>cleanC(l.country)===country);
  if(tag!=='all') logs=logs.filter(l=>l.tag===tag);
  if(search) logs=logs.filter(l=>(l.username||'').toLowerCase().includes(search)||(l.received||'').toLowerCase().includes(search)||(l.replied||'').toLowerCase().includes(search));
  if(showUnreviewedOnly) logs=logs.filter(l=>!l.reviewed);
  // 퍼널 필터 — 사용자 기준으로 최종 단계 계산
  if(funnelFilter){
    const um={};
    allLogs.forEach(l=>{
      const key=l.username||l.senderId||'';if(!key)return;
      if(!um[key])um[key]={follow:false,stuck:false,interest:false,consulted:false};
      if((l.replied||'').includes('[Follow request'))um[key].follow=true;
      if(l.tag==='stuck')um[key].stuck=true;
      if(l.tag&&l.tag!=='stuck'&&l.tag!=='paused'&&l.tag!=='direct')um[key].consulted=true;
      if(cleanC(l.country)&&!l.tag)um[key].interest=true;
    });
    const fUsers=new Set();
    Object.entries(um).forEach(([k,u])=>{
      let stage='';
      if(u.consulted)stage='consulted';
      else if(u.interest)stage='interest';
      else if(u.stuck)stage='stuck';
      else stage='follow';
      if(stage===funnelFilter)fUsers.add(k);
    });
    logs=logs.filter(l=>fUsers.has(l.username||l.senderId||''));
  }
  // 계정당 최신 1건만 (username 기준 중복 제거)
  const seen=new Set();
  const unique=[];
  for(const l of logs){
    const key=l.username||l.senderId||Math.random();
    if(!seen.has(key)){seen.add(key);unique.push(l);}
  }
  filteredLogs=unique;
  lp=0;
  document.getElementById('logCount').textContent=filteredLogs.length+' patient'+(filteredLogs.length!==1?'s':'')+' ('+logs.length+' messages)';
  renderLogs();
}
function renderLogs(){
  const el=document.getElementById('logList');
  try{
  if(!filteredLogs||!filteredLogs.length){el.innerHTML='<p class="empty">No logs found.<br><span style="font-size:12px;">Try adjusting your filters or search.</span></p>';return;}
  const s=lp*LPP,pg=filteredLogs.slice(s,s+LPP),tp=Math.ceil(filteredLogs.length/LPP);
  // 사용자별 가장 구체적인 concern 태그 계산
  const userBestTag={};
  allLogs.forEach(l=>{
    const key=l.username||l.senderId||'';
    if(!key)return;
    const t=l.tag;
    if(t&&t!=='stuck'&&t!=='paused'&&t!=='direct'&&t!=='consultation'){
      if(!userBestTag[key])userBestTag[key]=t;
    }
  });
  let idx=0;
  el.innerHTML=pg.map(l=>{
    const id='log-'+s+'-'+(idx++);
    const ago=timeAgo(l.createdAt);
    const noCountry=!l.country||!cleanC(l.country);
    const longReply=(l.replied||'').length>150;
    const isVip=patientData[l.username]?.vip;
    const isPaused=patientData[l.username]?.paused;
    const isReviewed=l.reviewed;
    const isDirect=l.tag==='direct';
    const globalIdx=allLogs.indexOf(l);
    return \`<div class="log-item \${noCountry?'log-no-country':''} \${isReviewed?'reviewed':'unreviewed'}" style="cursor:pointer;" onclick="if(!event.target.closest('button,.log-action-btn,.log-expand,input,textarea'))openPatient('\${esc(l.username)}','\${esc(l.senderId)}')">
      <div class="log-header">
        <div class="log-badges">
          \${l.username?'<span class="badge badge-user">@'+esc(l.username)+'</span>':''}
        </div>
        <div class="log-time-relative">\${ago}</div>
      </div>
      <div style="display:flex;gap:4px;flex-wrap:wrap;margin:-4px 0 6px;">
        \${!noCountry?'<span class="badge badge-country">'+esc(shortC(l.country))+'</span>':''}
        \${userBestTag[l.username||l.senderId]?'<span class="badge badge-tag">'+esc(userBestTag[l.username||l.senderId])+'</span>':''}
        \${getFunnelBadge(l,userBestTag)}
        \${isVip?'<span class="badge badge-vip">VIP</span>':''}
        \${isPaused?'<span class="badge badge-paused">Bot Paused</span>':''}
        \${isDirect?'<span class="badge badge-direct">Direct</span>':''}
      </div>
      <div class="log-bubble log-bubble-in"><div class="log-bubble-label">Received</div><div>\${esc(l.received)}</div></div>
      <div class="log-bubble log-bubble-out"><div class="log-bubble-label">Replied</div><div class="log-bubble-text\${longReply?'':' expanded'}" id="\${id}">\${esc(l.replied)}</div>\${longReply?'<button class="log-expand" onclick="toggleLogExpand(\\''+id+'\\',this)">Show more</button>':''}</div>
      <div class="log-actions">
        <button class="log-action-btn \${isReviewed?'active':''}" onclick="toggleReview(\${globalIdx})">
          \${isReviewed?'Reviewed':'Mark reviewed'}
        </button>
      </div>
    </div>\`;
  }).join('')+(tp>1?\`<div class="page-nav"><button class="page-btn" onclick="pl()" \${lp===0?'disabled':''}>Prev</button><span style="color:var(--text-tertiary);font-size:12px;font-weight:600">\${lp+1}/\${tp}</span><button class="page-btn" onclick="nl()" \${lp>=tp-1?'disabled':''}>Next</button></div>\`:'');
  }catch(e){console.error('renderLogs error:',e);el.innerHTML='<p class="empty">Error rendering logs.</p>';}
}
function getFunnelBadge(l,ubt){
  const key=l.username||l.senderId||'';
  const bestTag=ubt&&ubt[key];
  const isFollow=(l.replied||'').includes('[Follow request');
  const isStuck=l.tag==='stuck';
  const isConsulted=(l.tag&&l.tag!=='stuck'&&l.tag!=='paused'&&l.tag!=='direct'&&!isFollow)||(!isFollow&&!isStuck&&bestTag);
  const isInterest=cleanC(l.country)&&!l.tag&&!bestTag;
  if(isFollow) return '<span class="badge" style="background:var(--red-soft);color:var(--red);">Follow only</span>';
  if(isStuck) return '<span class="badge" style="background:rgba(240,178,74,0.12);color:var(--amber);">Stuck</span>';
  if(isConsulted) return '<span class="badge" style="background:var(--green-soft);color:var(--green);">Consulted</span>';
  if(isInterest) return '<span class="badge" style="background:rgba(74,200,232,0.12);color:var(--cyan);">Interest only</span>';
  return '<span class="badge" style="background:var(--red-soft);color:var(--red);">Follow only</span>';
}
function toggleLogExpand(id,btn){const el=document.getElementById(id);if(!el)return;el.classList.toggle('expanded');btn.textContent=el.classList.contains('expanded')?'Show less':'Show more';}
function pl(){if(lp>0){lp--;renderLogs();}}
function nl(){if((lp+1)*LPP<filteredLogs.length){lp++;renderLogs();}}
function esc(s){const d=document.createElement('div');d.textContent=s||'';return d.innerHTML;}

// ── Review Toggle ──
async function toggleReview(idx){
  if(!allLogs[idx])return;
  allLogs[idx].reviewed=!allLogs[idx].reviewed;
  renderLogs();
  await fetch('/api/logs/review',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({index:idx,reviewed:allLogs[idx].reviewed})});
}

// ── Direct Reply ──
function showReplyBox(id){const el=document.getElementById(id);if(el)el.classList.toggle('show');}
async function sendDirectReply(senderId,inputId){
  const input=document.getElementById(inputId);if(!input||!input.value.trim())return;
  const msg=input.value.trim();input.value='';
  const res=await fetch('/api/reply',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({senderId,message:msg})});
  if(res.ok){toast('Reply sent!');loadLogs();}else{toast('Failed to send');}
}

// ── Patient Modal ──
let currentModalUser='',currentModalSenderId='';
function openPatient(username,senderId){
  currentModalUser=username;currentModalSenderId=senderId;
  document.getElementById('modalTitle').textContent='@'+username;
  // Country
  const userLogs=allLogs.filter(l=>l.username===username);
  const country=userLogs.find(l=>cleanC(l.country))?.country||'';
  document.getElementById('modalCountry').textContent=country?shortC(country):'No country';
  // VIP/Pause state
  const pd=patientData[username]||{};
  document.getElementById('modalVipBtn').className='log-action-btn'+(pd.vip?' active':'');
  document.getElementById('modalVipBtn').textContent=pd.vip?'VIP (ON)':'VIP';
  document.getElementById('modalPauseBtn').className='log-action-btn'+(pd.paused?' active':'');
  document.getElementById('modalPauseBtn').textContent=pd.paused?'Bot Paused':'Pause Bot';
  document.getElementById('modalVipBadge').style.display=pd.vip?'inline':'none';
  document.getElementById('modalVipBadge').className='badge badge-vip';
  document.getElementById('modalVipBadge').textContent='VIP';
  document.getElementById('modalPausedBadge').style.display=pd.paused?'inline':'none';
  document.getElementById('modalPausedBadge').className='badge badge-paused';
  document.getElementById('modalPausedBadge').textContent='Bot Paused';
  // Memo
  document.getElementById('modalMemo').value=pd.memo||'';
  // History
  const hist=document.getElementById('modalHistory');
  hist.innerHTML=[...userLogs].reverse().map(l=>\`<div style="margin-bottom:10px;">
    <div style="font-size:10px;color:var(--text-tertiary);margin-bottom:4px;">\${timeAgo(l.createdAt)}\${l.tag?' · '+l.tag:''}</div>
    <div class="log-bubble log-bubble-in" style="margin-bottom:4px;"><div style="font-size:12px;">\${esc(l.received)}</div></div>
    <div class="log-bubble log-bubble-out"><div style="font-size:12px;">\${esc(l.replied)}</div></div>
  </div>\`).join('')||'<p class="empty">No conversation history.</p>';
  // Reply input
  document.getElementById('modalReplyInput').value='';
  document.getElementById('patientModal').classList.add('show');
}
function closeModal(){document.getElementById('patientModal').classList.remove('show');}
async function toggleModalVip(){
  if(!patientData[currentModalUser])patientData[currentModalUser]={};
  patientData[currentModalUser].vip=!patientData[currentModalUser].vip;
  await fetch('/api/patients',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(patientData)});
  openPatient(currentModalUser,currentModalSenderId);renderLogs();
}
async function toggleModalPause(){
  if(!patientData[currentModalUser])patientData[currentModalUser]={};
  patientData[currentModalUser].paused=!patientData[currentModalUser].paused;
  await fetch('/api/patients',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(patientData)});
  openPatient(currentModalUser,currentModalSenderId);renderLogs();toast(patientData[currentModalUser].paused?'Bot paused for @'+currentModalUser:'Bot resumed for @'+currentModalUser);
}
async function saveModalMemo(){
  if(!patientData[currentModalUser])patientData[currentModalUser]={};
  patientData[currentModalUser].memo=document.getElementById('modalMemo').value;
  await fetch('/api/patients',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(patientData)});
  toast('Memo saved!');
}
async function sendModalReply(){
  const input=document.getElementById('modalReplyInput');if(!input||!input.value.trim()||!currentModalSenderId)return;
  const msg=input.value.trim();input.value='';
  const res=await fetch('/api/reply',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({senderId:currentModalSenderId,message:msg})});
  if(res.ok){toast('Reply sent to @'+currentModalUser);await loadLogs();openPatient(currentModalUser,currentModalSenderId);}else{toast('Failed to send');}
}
function exportCSV(){
  if(!filteredLogs.length){toast('No data to export');return;}
  const csvEsc=s=>\`"\${(s||'').replace(/"/g,'""')}"\`;
  const header='Date,Username,Country,Concern,Received,Replied';
  const rows=filteredLogs.map(l=>{
    const date=l.createdAt?new Date(l.createdAt).toLocaleString('en'):'';
    return [date,l.username||'',cleanC(l.country),l.tag||'',l.received||'',l.replied||''].map(csvEsc).join(',');
  });
  const csv=header+'\\n'+rows.join('\\n');
  const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='drsean_dm_logs_'+new Date().toISOString().slice(0,10)+'.csv';
  a.click();URL.revokeObjectURL(url);
  toast('CSV exported!');
}
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2000);}
function logout(){sessionStorage.clear();location.replace('/');}

// ── Session ──
if(!sessionStorage.getItem('drsean_user'))location.replace('/');
(async()=>{
  try{ await Promise.all([loadConfig(),loadStatus(),loadHome()]); }catch(e){ console.error('Init error:',e); }
  document.querySelector('.content').classList.add('loaded');
})();
<\/script>
</body>
</html>`;
