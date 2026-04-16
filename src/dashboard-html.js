export const DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
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
    --chart-label: #E0E4F0; --chart-grid: rgba(140,155,200,0.06);
  }
  .light {
    --bg: #F5F6FA; --bg-elevated: #FFFFFF; --surface: #FFFFFF; --surface-2: #F0F1F5; --surface-3: #E8E9EF;
    --border: rgba(0,0,0,0.08); --border-hover: rgba(0,0,0,0.15);
    --text: #1A1D2E; --text-secondary: #4A5068; --text-tertiary: #6B7394;
    --accent: #4A7ADE; --accent-soft: rgba(74,122,222,0.1); --accent-glow: rgba(74,122,222,0.2);
    --green: #2BB573; --green-soft: rgba(43,181,115,0.1);
    --red: #E05252; --red-soft: rgba(224,82,82,0.1);
    --amber: #D9982F; --amber-soft: rgba(217,152,47,0.1);
    --cyan: #2EACC8; --purple: #8B6FD6;
    --shadow: 0 2px 8px rgba(0,0,0,0.06); --shadow-lg: 0 8px 32px rgba(0,0,0,0.1);
    --chart-label: #4A5068; --chart-grid: rgba(0,0,0,0.06);
  }
  * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color: transparent; }
  body { font-family:'Inter',system-ui,-apple-system,sans-serif; background:var(--bg); color:var(--text); min-height:100vh; min-height:100dvh; overflow-x:hidden; -webkit-font-smoothing:antialiased; }

  /* ── Header ── */
  .header {
    position:sticky; top:0; z-index:50; background:var(--bg-elevated); opacity:0.95; backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
    padding:14px 20px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--border);
  }
  .header-left { display:flex; align-items:center; gap:10px; }
  .header h1 { font-size:17px; font-weight:800; letter-spacing:-0.3px; }
  .header h1 span { color:var(--accent); }
  .header-right { display:flex; align-items:center; gap:8px; }
  .bot-pill {
    display:flex; align-items:center; gap:5px; padding:5px 12px; border-radius:20px; font-size:11px; font-weight:600; letter-spacing:0.2px;
    cursor:pointer; transition:all 0.15s;
  }
  .bot-pill:hover { opacity:0.8; transform:scale(1.03); }
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
  .content { max-width:600px; margin:0 auto; padding:16px 16px calc(var(--nav-h) + 20px); }
  .section { padding-bottom:10px; max-width:520px; margin-left:auto; margin-right:auto; }

  /* ── Cards ── */
  .card {
    background:var(--surface); border:1px solid var(--border); border-radius:var(--radius);
    padding:18px; margin-bottom:12px; transition:border-color 0.2s;
  }
  .card:hover { border-color:var(--border-hover); transform:translateY(-1px); box-shadow:0 4px 12px rgba(0,0,0,0.1); }
  .card-header { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:var(--text-secondary); margin-bottom:14px; }

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
  .stat-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.6px; color:var(--text-secondary); margin-bottom:4px; }
  .stat-value { font-size:22px; font-weight:800; letter-spacing:-0.5px; line-height:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .stat-sub { font-size:10px; color:var(--text-secondary); margin-top:4px; font-weight:500; }

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
  .log-badges { display:flex; gap:5px; flex-wrap:wrap; align-items:center; }
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
  .log-no-country { opacity:1; }

  /* ── Review/Actions ── */
  .log-actions { display:flex; gap:6px; margin-top:10px; flex-wrap:wrap; align-items:center; }
  .log-action-btn { background:var(--surface-2); border:1px solid var(--border); color:var(--text-tertiary); padding:5px 10px; border-radius:6px; cursor:pointer; font-size:11px; font-weight:600; font-family:'Inter',sans-serif; transition:all 0.15s; display:flex; align-items:center; gap:4px; }
  .log-action-btn:hover { border-color:var(--border-hover); color:var(--text); }
  .log-action-btn.active { background:var(--green-soft); border-color:var(--green); color:var(--green); }
  .log-item.reviewed { border-left:none; opacity:0.6; }
  .log-item.unreviewed { border-left:none; opacity:1; }
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
  .settings-list { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; }
  .setting-section { border-bottom:1px solid var(--border); }
  .setting-section:last-child { border-bottom:none; }
  .setting-header {
    display:flex; align-items:center; gap:12px; padding:16px 16px; cursor:pointer; transition:background 0.15s;
    -webkit-user-select:none; user-select:none;
  }
  .setting-header:hover { background:var(--surface-2); }
  .setting-header:active { background:var(--surface-3); }
  .setting-icon { display:flex; width:20px; height:20px; flex-shrink:0; align-items:center; justify-content:center; background:none !important; }
  .setting-icon svg { width:16px; height:16px; stroke:var(--text-tertiary); fill:none; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
  .setting-info { flex:1; min-width:0; }
  .setting-title { font-size:14px; font-weight:600; letter-spacing:-0.1px; }
  .setting-desc { font-size:11px; color:var(--text-tertiary); margin-top:1px; }
  .setting-arrow { color:var(--text-tertiary); font-size:14px; transition:transform 0.2s; margin-left:8px; }
  .setting-section.open .setting-arrow { transform:rotate(90deg); }
  .setting-body { padding:8px 16px 16px; display:none; border-top:1px solid var(--border); }
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
  .desktop-tabs { display:none !important; }
  @media(min-width:768px) {
    .content { padding-bottom:24px; }
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
    <button class="header-btn" onclick="openNotifPanel()" title="Notifications" style="position:relative;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
      <span id="notifBadge" style="display:none;position:absolute;top:2px;right:2px;width:8px;height:8px;background:var(--red);border-radius:50%;"></span>
    </button>
    <button class="header-btn" onclick="location.reload()" title="Refresh">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
    </button>
  </div>
</div>

<!-- Notification Panel -->
<div id="notifPanel" style="display:none;position:fixed;top:52px;right:8px;width:300px;max-height:400px;overflow-y:auto;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:0 12px 40px rgba(0,0,0,0.4);z-index:999;padding:12px;">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
    <span style="font-size:12px;font-weight:700;color:var(--text);">New DMs</span>
    <span onclick="clearNotifs()" style="font-size:10px;color:var(--text-tertiary);cursor:pointer;">Clear all</span>
  </div>
  <div id="notifList" style="display:flex;flex-direction:column;gap:6px;">
    <div style="text-align:center;padding:20px;font-size:11px;color:var(--text-tertiary);">No new messages</div>
  </div>
</div>

<!-- ── Desktop Tabs (hidden on mobile) ── -->
<div class="desktop-tabs" style="display:none; max-width:600px; margin:0 auto; padding:12px 16px 0; gap:4px;">
  <button class="nav-item active" onclick="switchTab('home',this)" style="flex-direction:row;gap:6px;padding:8px 16px;">
    <span class="nav-label" style="font-size:13px;">Home</span>
  </button>
  <button class="nav-item" onclick="switchTab('logs',this)" style="flex-direction:row;gap:6px;padding:8px 16px;">
    <span class="nav-label" style="font-size:13px;">Logs</span>
  </button>
  <button class="nav-item" onclick="switchTab('analytics',this)" style="flex-direction:row;gap:6px;padding:8px 16px;">
    <span class="nav-label" style="font-size:13px;">Analytics</span>
  </button>
  <button class="nav-item" onclick="switchTab('insights',this)" style="flex-direction:row;gap:6px;padding:8px 16px;">
    <span class="nav-label" style="font-size:13px;">Insights</span>
  </button>
  <button class="nav-item" onclick="switchTab('settings',this)" style="flex-direction:row;gap:6px;padding:8px 16px;">
    <span class="nav-label" style="font-size:13px;">Settings</span>
  </button>
</div>

<!-- ── Content ── -->
<div class="content">

  <!-- HOME -->
  <div class="section active" id="sec-home">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
      <div style="width:32px;height:32px;border-radius:10px;background:var(--accent-soft);display:flex;align-items:center;justify-content:center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      </div>
      <div><div style="font-size:15px;font-weight:700;">Dashboard</div><div style="font-size:10px;color:var(--text-tertiary);">Instagram performance overview</div></div>
    </div>
    <div id="homeError"></div>

    <!-- Profile + Bot Status -->
    <div class="profile" id="profileCard">
      <img class="profile-pic" id="profilePic" src="" alt="" onerror="this.src='/icon.svg'">
      <div style="flex:1;">
        <h3 id="profileName"><span class="skeleton skel-text" style="width:120px;display:inline-block">&nbsp;</span></h3>
        <p id="profileUsername"><span class="skeleton skel-text" style="width:80px;display:inline-block">&nbsp;</span></p>
      </div>
    </div>

    <!-- Stats -->
    <div class="stat-grid stat-grid-4">
      <div class="stat-card"><div class="stat-label" style="color:var(--accent);">Followers</div><div class="stat-value" id="statFollowers">-</div></div>
      <div class="stat-card"><div class="stat-label" style="color:var(--green);">Posts</div><div class="stat-value" id="statPosts">-</div></div>
      <div class="stat-card"><div class="stat-label">Likes</div><div class="stat-value" id="statLikes">-</div><div class="stat-sub">All posts</div></div>
      <div class="stat-card"><div class="stat-label">Comments</div><div class="stat-value" id="statComments">-</div><div class="stat-sub">All posts</div></div>
    </div>

    <div class="stat-grid stat-grid-4">
      <div class="stat-card"><div class="stat-label">Views</div><div class="stat-value" id="statViews">-</div><div class="stat-sub">All posts</div></div>
      <div class="stat-card"><div class="stat-label">Eng. Rate</div><div class="stat-value" id="statEngRate">-</div><div class="stat-sub">Avg per post</div></div>
    </div>

    <!-- Bot Performance -->
    <div id="botPerformance"></div>

    <!-- Chart -->
    <div class="chart-card">
      <div class="card-header">Post Engagement — All Posts</div>
      <div style="display:flex;gap:6px;margin:8px 0;" id="engToggle">
        <button onclick="engSwitch(0)" style="flex:1;padding:6px;border:none;border-radius:6px;font-size:10px;font-weight:700;font-family:Inter,sans-serif;cursor:pointer;background:#4AC8E8;color:#fff;">Views</button>
        <button onclick="engSwitch(1)" style="flex:1;padding:6px;border:none;border-radius:6px;font-size:10px;font-weight:700;font-family:Inter,sans-serif;cursor:pointer;background:var(--bg);color:var(--text-tertiary);">Likes</button>
        <button onclick="engSwitch(2)" style="flex:1;padding:6px;border:none;border-radius:6px;font-size:10px;font-weight:700;font-family:Inter,sans-serif;cursor:pointer;background:var(--bg);color:var(--text-tertiary);">Comments</button>
      </div>
      <div class="chart-wrap chart-wrap-lg"><canvas id="chartEngagement"></canvas></div>
    </div>

    <!-- Hot Post -->
    <div id="hotPost"></div>
  </div>

  <!-- DM ANALYTICS -->
  <div class="section" id="sec-analytics">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
      <div style="width:32px;height:32px;border-radius:10px;background:var(--green-soft);display:flex;align-items:center;justify-content:center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
      </div>
      <div><div style="font-size:15px;font-weight:700;">Analytics</div><div style="font-size:10px;color:var(--text-tertiary);">DM activity & patient breakdown</div></div>
    </div>
    <div id="analyticsError"></div>

    <!-- ━━ OVERVIEW ━━ -->
    <div style="font-size:9px;font-weight:700;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:1px;margin:4px 0 8px;">Overview</div>
    <div class="stat-grid stat-grid-3">
      <div class="stat-card"><div class="stat-label">Total DMs</div><div class="stat-value" id="statDMs">-</div></div>
      <div class="stat-card"><div class="stat-label">Unique Users</div><div class="stat-value" id="statUniqueUsers">-</div></div>
      <div class="stat-card"><div class="stat-label">AI Handled</div><div class="stat-value" id="statAiRatio">-</div></div>
    </div>
    <div class="stat-grid stat-grid-3">
      <div class="stat-card"><div class="stat-label">Top Country</div><div class="stat-value" id="statTopCountry" style="font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">-</div></div>
      <div class="stat-card"><div class="stat-label">Top Concern</div><div class="stat-value" id="statTopTag" style="font-size:12px;">-</div></div>
      <div class="stat-card"><div class="stat-label">Peak Time</div><div class="stat-value" id="statPeakTime" style="font-size:14px;">-</div></div>
    </div>

    <!-- Weekly Growth (inline) -->
    <div class="chart-card">
      <div class="card-header">This Week</div>
      <div id="weeklyGrowth" style="padding:4px 0;"></div>
    </div>

    <!-- ━━ ACTIVITY ━━ -->
    <div style="font-size:9px;font-weight:700;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:1px;margin:18px 0 8px;">Activity</div>
    <div class="chart-card">
      <div class="card-header">DM Activity — Last 7 Days</div>
      <div class="chart-wrap"><canvas id="chartActivity"></canvas></div>
    </div>
    <div class="chart-card">
      <div class="card-header">Peak Hours (KST)</div>
      <div class="chart-wrap"><canvas id="chartHourly"></canvas></div>
    </div>

    <!-- ━━ FUNNEL ━━ -->
    <div style="font-size:9px;font-weight:700;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:1px;margin:18px 0 8px;">Patient Journey</div>
    <div class="chart-card">
      <div class="card-header">Funnel Conversion</div>
      <div id="funnelConversion" style="padding:4px 0;"></div>
    </div>

    <!-- ━━ BREAKDOWN ━━ -->
    <div style="font-size:9px;font-weight:700;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:1px;margin:18px 0 8px;">Breakdown</div>
    <div class="chart-card">
      <div style="display:flex;gap:6px;margin-bottom:8px;" id="anaToggle">
        <button onclick="anaSwitch(0)" style="flex:1;padding:6px;border:none;border-radius:6px;font-size:10px;font-weight:700;font-family:Inter,sans-serif;cursor:pointer;background:var(--accent);color:#fff;">Country</button>
        <button onclick="anaSwitch(1)" style="flex:1;padding:6px;border:none;border-radius:6px;font-size:10px;font-weight:700;font-family:Inter,sans-serif;cursor:pointer;background:var(--bg);color:var(--text-tertiary);">Concerns</button>
        <button onclick="anaSwitch(2)" style="flex:1;padding:6px;border:none;border-radius:6px;font-size:10px;font-weight:700;font-family:Inter,sans-serif;cursor:pointer;background:var(--bg);color:var(--text-tertiary);">By Country</button>
      </div>
      <div id="anaChartWrap0" class="chart-wrap"><canvas id="chartCountry"></canvas></div>
      <div id="anaChartWrap1" class="chart-wrap" style="display:none;"><canvas id="chartTags"></canvas></div>
      <div id="anaChartWrap2" class="chart-wrap chart-wrap-lg" style="display:none;"><canvas id="chartCountryConcerns"></canvas></div>
    </div>
    <div class="chart-card">
      <div class="card-header">Country Conversion Rate</div>
      <div id="countryConversion" style="padding:4px 0;"></div>
    </div>
  </div>

  <!-- SETTINGS -->
  <div class="section" id="sec-settings">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
      <div style="width:32px;height:32px;border-radius:10px;background:var(--amber-soft);display:flex;align-items:center;justify-content:center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
      </div>
      <div><div style="font-size:15px;font-weight:700;">Settings</div><div style="font-size:10px;color:var(--text-tertiary);">Configure your bot & clinic</div></div>
    </div>

    <div class="settings-list">
    <!-- 1. Clinic Info + Treatments -->
    <div class="setting-section">
      <div class="setting-header" onclick="toggleSetting(this)">
        <div class="setting-icon"><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
        <div class="setting-info"><div class="setting-title">Clinic Info</div><div class="setting-desc">Name, address, hours, treatments</div></div>
        <span class="setting-arrow">›</span>
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
        <label class="form-label">Treatments & Pricing</label>
        <textarea class="form-textarea" id="treatments" rows="5" placeholder="e.g. Botox: from \$200"></textarea>
        <button class="btn-save-card" onclick="saveConfig()">Save</button>
      </div>
    </div>

    <!-- 3. Conversation Flow -->
    <div class="setting-section">
      <div class="setting-header" onclick="toggleSetting(this)">
        <div class="setting-icon"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg></div>
        <div class="setting-info"><div class="setting-title">Conversation Flow</div><div class="setting-desc">Greeting, country, purpose & reply messages</div></div>
        <span class="setting-arrow">›</span>
      </div>
      <div class="setting-body">
        <label class="form-label" style="margin-top:0;">1. Greeting Message</label>
        <div style="font-size:9px;color:var(--text-tertiary);margin-bottom:4px;">First message when a new patient DMs</div>
        <textarea class="form-textarea" id="greeting" rows="3"></textarea>

        <label class="form-label">2. Country Question</label>
        <div style="font-size:9px;color:var(--text-tertiary);margin-bottom:4px;">Sent right after greeting</div>
        <textarea class="form-textarea" id="msgCountryAsk" rows="2"></textarea>

        <label class="form-label">3. Purpose Question</label>
        <div style="font-size:9px;color:var(--text-tertiary);margin-bottom:4px;">After country is selected</div>
        <textarea class="form-textarea" id="msgPurposeAsk" rows="2"></textarea>

        <label class="form-label">4. Skin Consultation Reply</label>
        <div style="font-size:9px;color:var(--text-tertiary);margin-bottom:4px;">When "Skin Consultation" is selected → asks for concern</div>
        <textarea class="form-textarea" id="msgSkinReply" rows="2"></textarea>

        <label class="form-label">5. Booking Reply</label>
        <div style="font-size:9px;color:var(--text-tertiary);margin-bottom:4px;">When "Booking Inquiry" is selected</div>
        <textarea class="form-textarea" id="msgBookingReply" rows="3"></textarea>

        <label class="form-label">6. Business Reply</label>
        <div style="font-size:9px;color:var(--text-tertiary);margin-bottom:4px;">When "Business" is selected → auto-pauses bot</div>
        <textarea class="form-textarea" id="msgBusinessReply" rows="2"></textarea>

        <button class="btn-save-card" onclick="saveConfig()">Save</button>
      </div>
    </div>

    <!-- 3. Quick Reply Buttons -->
    <div class="setting-section">
      <div class="setting-header" onclick="toggleSetting(this)">
        <div class="setting-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg></div>
        <div class="setting-info"><div class="setting-title">Quick Reply Buttons</div><div class="setting-desc">Country & skin concern selection options</div></div>
        <span class="setting-arrow">›</span>
      </div>
      <div class="setting-body">
        <label class="form-label">Country Buttons</label>
        <p style="font-size:10px;color:var(--text-tertiary);margin-bottom:6px;">Comma separated. "Others" lets users type their country.</p>
        <input class="form-input" id="countryOptions" placeholder="e.g. United States, Singapore, Australia, Canada, Others">
        <label class="form-label">Concern Buttons</label>
        <p style="font-size:10px;color:var(--text-tertiary);margin-bottom:6px;">Shown after country selection. "Others" lets them type freely.</p>
        <input class="form-input" id="concernOptions" placeholder="e.g. Botox, Filler, Lifting, Anti-aging, Acne, Skincare, Others">
        <button class="btn-save-card" onclick="saveConfig()">Save</button>
      </div>
    </div>

    <!-- 4. AI Settings -->
    <div class="setting-section">
      <div class="setting-header" onclick="toggleSetting(this)">
        <div class="setting-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
        <div class="setting-info"><div class="setting-title">AI Settings</div><div class="setting-desc">Prompt, rules & fallback message</div></div>
        <span class="setting-arrow">›</span>
      </div>
      <div class="setting-body">
        <label class="form-label">AI Consultation Prompt</label>
        <div style="display:flex;justify-content:flex-end;margin-bottom:6px;">
          <button onclick="resetPrompt()" style="background:var(--surface-2);border:1px solid var(--border);color:var(--text-tertiary);padding:4px 10px;border-radius:6px;cursor:pointer;font-size:10px;font-weight:600;font-family:Inter,sans-serif;">Reset to Default</button>
        </div>
        <textarea class="form-textarea" id="aiPrompt" rows="14" style="font-size:13px;line-height:1.6;font-family:'Courier New',monospace;"></textarea>
        <label class="form-label">Extra Rules</label>
        <textarea class="form-textarea" id="customRules" rows="3" placeholder="e.g. Never mention competitors"></textarea>
        <label class="form-label">Fallback Message (when AI fails)</label>
        <input class="form-input" id="fallback" placeholder="e.g. Sorry, try again shortly!">
        <button class="btn-save-card" onclick="saveConfig()">Save</button>
      </div>
    </div>

    <!-- 7. AI Integration -->
    <div class="setting-section">
      <div class="setting-header" onclick="toggleSetting(this)">
        <div class="setting-icon"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
        <div class="setting-info"><div class="setting-title">AI Integration</div><div class="setting-desc">Claude API key & monthly usage limit</div></div>
        <span class="setting-arrow">›</span>
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
        <label class="form-label" style="margin-top:14px;">Reply Delay (seconds)</label>
        <div style="display:flex;gap:6px;">
          <div style="flex:1;"><label style="font-size:9px;color:var(--text-tertiary);">Short</label><input class="form-input" id="delayShort" type="number" placeholder="30" min="0" step="5" style="font-size:12px;"></div>
          <div style="flex:1;"><label style="font-size:9px;color:var(--text-tertiary);">Medium</label><input class="form-input" id="delayMedium" type="number" placeholder="60" min="0" step="5" style="font-size:12px;"></div>
          <div style="flex:1;"><label style="font-size:9px;color:var(--text-tertiary);">Long</label><input class="form-input" id="delayLong" type="number" placeholder="120" min="0" step="5" style="font-size:12px;"></div>
        </div>
        <p style="font-size:10px;color:var(--text-tertiary);margin-top:4px;">Simulates human typing speed. Set 0 for instant reply.</p>
        <button class="btn-save-card" onclick="saveConfig()">Save</button>
      </div>
    </div>

    <!-- 8. Comment Auto-Reply -->
    <div class="setting-section">
      <div class="setting-header" onclick="toggleSetting(this)">
        <div class="setting-icon"><svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg></div>
        <div class="setting-info">
          <div class="setting-title" style="display:flex;align-items:center;gap:8px;">Comment Auto-Reply
            <label style="display:flex;align-items:center;gap:4px;cursor:pointer;margin:0;font-size:11px;color:var(--text-tertiary);font-weight:500;" onclick="event.stopPropagation()">
              <input type="checkbox" id="commentReplyEnabled" style="width:14px;height:14px;accent-color:var(--accent);cursor:pointer;"> On
            </label>
          </div>
          <div class="setting-desc">Auto-reply to post comments</div>
        </div>
        <span class="setting-arrow">›</span>
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
        <div class="setting-icon"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <div class="setting-info"><div class="setting-title">Bot Performance Tracking</div><div class="setting-desc">Set start date & initial followers to track growth</div></div>
        <span class="setting-arrow">›</span>
      </div>
      <div class="setting-body">
        <label class="form-label">Bot Start Date</label>
        <input class="form-input" id="botStartDate" type="date">
        <label class="form-label">Followers at Start</label>
        <input class="form-input" id="botStartFollowers" type="number" placeholder="e.g. 1200">
        <button class="btn-save-card" onclick="saveConfig()">Save</button>
      </div>
    </div>
    <!-- Notifications -->
    <div class="setting-section">
      <div class="setting-header" onclick="toggleNotifSetting()" style="cursor:pointer;">
        <div class="setting-icon"><svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg></div>
        <div class="setting-info"><div class="setting-title">Notifications</div><div class="setting-desc">DM alerts when dashboard is open</div></div>
        <span id="notifToggleLabel" style="font-size:10px;font-weight:600;padding:3px 8px;border-radius:4px;"></span>
      </div>
    </div>
    <!-- Appearance -->
    <div class="setting-section">
      <div class="setting-header" onclick="toggleTheme()" style="cursor:pointer;">
        <div class="setting-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg></div>
        <div class="setting-info"><div class="setting-title">Appearance</div><div class="setting-desc">Toggle light / dark mode</div></div>
        <span id="themeLabel" style="font-size:10px;font-weight:600;color:var(--text-tertiary);"></span>
      </div>
    </div>
    <!-- Logout -->
    <div class="setting-section">
      <div class="setting-header" onclick="logout()" style="cursor:pointer;">
        <div class="setting-icon"><svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></div>
        <div class="setting-info"><div class="setting-title" style="color:var(--red);">Logout</div><div class="setting-desc">Sign out of dashboard</div></div>
      </div>
    </div>
    </div><!-- settings-list -->
  </div>

  <!-- KEYWORDS -->
  <!-- INSIGHTS -->
  <div class="section" id="sec-insights">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
      <div style="width:32px;height:32px;border-radius:10px;background:rgba(169,132,255,0.12);display:flex;align-items:center;justify-content:center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A984FF" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
      </div>
      <div>
        <div style="font-size:16px;font-weight:700;letter-spacing:-0.2px;">AI Insights</div>
        <div style="font-size:11px;color:var(--text-tertiary);">Powered by your DM data</div>
      </div>
    </div>
    <div id="insightsContent" style="display:flex;flex-direction:column;gap:10px;">
      <div style="text-align:center;padding:40px;color:var(--text-tertiary);">Loading insights...</div>
    </div>
  </div>

  <!-- LOGS -->
  <div class="section" id="sec-logs">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
      <div style="width:32px;height:32px;border-radius:10px;background:rgba(74,200,232,0.12);display:flex;align-items:center;justify-content:center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
      </div>
      <div><div style="font-size:15px;font-weight:700;">Patient Logs</div><div style="font-size:10px;color:var(--text-tertiary);">DM conversations & patient funnel</div></div>
    </div>
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
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;">
          <span class="badge badge-country" id="modalCountry"></span>
          <span class="badge" id="modalPurpose" style="display:none;"></span>
          <span class="badge badge-tag" id="modalConcern" style="display:none;"></span>
          <span class="badge" id="modalFunnel"></span>
          <span class="badge" id="modalVipBadge" style="display:none;"></span>
          <span class="badge" id="modalPausedBadge" style="display:none;"></span>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:10px;">
          <button class="log-action-btn" id="modalBookedBtn" onclick="toggleModalBooked()">Booked</button>
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
          <textarea class="reply-input" id="modalReplyInput" placeholder="Type a message..." rows="1" oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px';" style="resize:none;overflow:hidden;min-height:38px;"></textarea>
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
  <button class="nav-item" onclick="switchTab('logs',this)">
    <span class="nav-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></span>
    <span class="nav-label">Logs</span>
  </button>
  <button class="nav-item" onclick="switchTab('analytics',this)">
    <span class="nav-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></span>
    <span class="nav-label">Analytics</span>
  </button>
  <button class="nav-item" onclick="switchTab('insights',this)">
    <span class="nav-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></span>
    <span class="nav-label">Insights</span>
  </button>
  <button class="nav-item" onclick="switchTab('settings',this)">
    <span class="nav-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg></span>
    <span class="nav-label">Settings</span>
  </button>
</div>

<div class="toast" id="toast"></div>

<script>
// ── 인증 체크 + fetch 인터셉터 ──
(function(){
  const auth = localStorage.getItem('drsean_auth');
  if (!auth) { location.replace('/'); return; }
  const origFetch = window.fetch;
  window.fetch = function(input, init) {
    init = init || {};
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    if (url.startsWith('/api/')) {
      init.headers = new Headers(init.headers || {});
      if (!init.headers.has('Authorization')) init.headers.set('Authorization', 'Bearer ' + auth);
    }
    return origFetch(input, init).then(r => {
      if (r.status === 401 && url.startsWith('/api/')) {
        localStorage.removeItem('drsean_auth');
        location.replace('/');
      }
      return r;
    });
  };
})();

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
7. For booking: You're at Fine Clinic through April 2026, moving to AB Clinic starting June 1st 2026. Booking system also opens June 1st — NOT before. During May you're transitioning. Both clinics have great doctors — recommend them.\`;

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
  const tabs=['home','logs','analytics','insights','settings'];
  document.querySelectorAll('.bottom-nav .nav-item').forEach((n,i)=>{n.classList.toggle('active',tabs[i]===name);});
  localStorage.setItem('drsean_tab',name);
  window.scrollTo(0,0);
  if(name==='home') loadHome();
  if(name==='analytics') loadAnalytics();
  if(name==='logs') loadLogs();
  if(name==='insights') loadInsights();
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

  // Bot Performance
  try{
    const lr=await fetch('/api/logs');const bpLogs=await lr.json();
    if(Array.isArray(bpLogs)){
      const bp=document.getElementById('botPerformance');
      if(bp && config.botStartDate){
        const startDate=new Date(config.botStartDate);
        const daysActive=Math.max(1,Math.floor((Date.now()-startDate.getTime())/864e5));
        const startFollowers=config.botStartFollowers||0;
        const followerGrowth=ig.followers-startFollowers;
        const followerPct=startFollowers>0?((followerGrowth/startFollowers)*100).toFixed(1):'-';
        const nfC={};bpLogs.forEach(l=>{const k=l.username||'';if(!k)return;if(!(k in nfC))nfC[k]=true;if(!(l.replied||'').includes('[Follow request'))nfC[k]=false;});
        const bpUsers=new Set(bpLogs.map(l=>l.username).filter(k=>k&&!nfC[k])).size;
        const bpCountries=new Set(bpLogs.map(l=>cleanC(l.country)).filter(Boolean)).size;
        const consulted=bpLogs.filter(l=>l.tag&&!SKIP_TAGS.has(l.tag)).length;
        const bpConv=bpLogs.length>0?Math.round(consulted/bpLogs.length*100):0;
        const uf={},ul2={};bpLogs.forEach(l=>{const k=l.username||'';if(!k||!l.createdAt)return;const t=new Date(l.createdAt).getTime();if(!uf[k]||t<uf[k])uf[k]=t;if(!ul2[k]||t>ul2[k])ul2[k]=t;});
        const retTotal=Object.keys(uf).length;const returning=Object.keys(uf).filter(k=>ul2[k]-uf[k]>86400000).length;const retRate=retTotal>0?Math.round(returning/retTotal*100):0;
        bp.innerHTML=\`<div class="card" style="background:linear-gradient(135deg,var(--surface),var(--surface-2));margin-bottom:12px;">
          <div onclick="var b=this.nextElementSibling;var a=this.querySelector('.bp-arrow');if(b.style.display==='none'){b.style.display='';a.style.transform='rotate(90deg)';}else{b.style.display='none';a.style.transform='rotate(0)';}" class="card-header" style="display:flex;align-items:center;gap:6px;cursor:pointer;user-select:none;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <span style="flex:1;">Bot Performance — \${daysActive} days active</span>
            <span class="bp-arrow" style="font-size:14px;color:var(--text-tertiary);transition:transform 0.2s;transform:rotate(0);">›</span>
          </div>
          <div style="display:none;">
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
              <div style="padding:8px;background:var(--bg);border-radius:8px;"><div style="font-size:9px;color:var(--text-tertiary);font-weight:600;text-transform:uppercase;">Followers</div><div style="font-size:18px;font-weight:800;margin-top:3px;color:\${followerGrowth>=0?'var(--green)':'var(--red)'};">\${followerGrowth>=0?'+':''}\${fmt(followerGrowth)}</div><div style="font-size:9px;color:var(--text-tertiary);">\${followerPct}%</div></div>
              <div style="padding:8px;background:var(--bg);border-radius:8px;"><div style="font-size:9px;color:var(--text-tertiary);font-weight:600;text-transform:uppercase;">Replied</div><div style="font-size:18px;font-weight:800;margin-top:3px;color:var(--accent);">\${bpLogs.length}</div><div style="font-size:9px;color:var(--text-tertiary);">\${(bpLogs.length/daysActive).toFixed(1)}/day</div></div>
              <div style="padding:8px;background:var(--bg);border-radius:8px;"><div style="font-size:9px;color:var(--text-tertiary);font-weight:600;text-transform:uppercase;">Consulted</div><div style="font-size:18px;font-weight:800;margin-top:3px;color:var(--green);">\${consulted}</div><div style="font-size:9px;color:var(--text-tertiary);">\${bpConv}% conv.</div></div>
              <div style="padding:8px;background:var(--bg);border-radius:8px;"><div style="font-size:9px;color:var(--text-tertiary);font-weight:600;text-transform:uppercase;">Patients</div><div style="font-size:18px;font-weight:800;margin-top:3px;">\${bpUsers}</div><div style="font-size:9px;color:var(--text-tertiary);">\${bpCountries} countries</div></div>
              <div style="padding:8px;background:var(--bg);border-radius:8px;"><div style="font-size:9px;color:var(--text-tertiary);font-weight:600;text-transform:uppercase;">Time Saved</div><div style="font-size:18px;font-weight:800;margin-top:3px;color:var(--cyan);">\${bpLogs.length>=60?Math.round(bpLogs.length/60)+'h':bpLogs.length+'m'}</div><div style="font-size:9px;color:var(--text-tertiary);">~1 min/reply</div></div>
              <div style="padding:8px;background:var(--bg);border-radius:8px;"><div style="font-size:9px;color:var(--text-tertiary);font-weight:600;text-transform:uppercase;">Return Rate</div><div style="font-size:18px;font-weight:800;margin-top:3px;color:var(--cyan);">\${retRate}%</div><div style="font-size:9px;color:var(--text-tertiary);">\${returning}/\${retTotal} returned</div></div>
            </div>
          </div>
        </div>\`;
      }
    }
  }catch(e){}

  if(ig.posts?.length){
    const p=[...ig.posts].reverse();
    const labels=p.map(x=>x.date?new Date(x.date).toLocaleDateString('en',{month:'short',day:'numeric'}):'');
    const ds=[
      {label:'Views',data:p.map(x=>x.views||0),backgroundColor:'rgba(74,200,232,0.7)',hoverBackgroundColor:'#4AC8E8',borderRadius:20,barPercentage:0.4,hidden:false,borderSkipped:false},
      {label:'Likes',data:p.map(x=>x.likes),backgroundColor:'rgba(91,141,239,0.7)',hoverBackgroundColor:'#5B8DEF',borderRadius:20,barPercentage:0.4,hidden:true,borderSkipped:false},
      {label:'Comments',data:p.map(x=>x.comments),backgroundColor:'rgba(61,214,140,0.7)',hoverBackgroundColor:'#3DD68C',borderRadius:20,barPercentage:0.4,hidden:true,borderSkipped:false},
    ];
    const engOpts=cOpts();engOpts.plugins.legend={display:false};engOpts.animation={duration:300,easing:'easeOutQuart'};engOpts.transitions={active:{animation:{duration:300}}};engOpts.scales.x.ticks.maxRotation=0;engOpts.scales.x.ticks.autoSkip=true;engOpts.scales.x.ticks.maxTicksLimit=8;
    window._engChart=new Chart(document.getElementById('chartEngagement'),{
      type:'bar',
      data:{labels,datasets:ds},
      options:engOpts
    });

    // 핫 게시물 — 카테고리별 TOP 1 (차트 토글 연동)
    window._engPosts=ig.posts;
    renderHotPost(0);
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

  // ── 사용자 기준 집계 ──
  const userFirst={};
  const userLogs={};  // 사용자별 전체 로그
  const umNF={};  // 미팔로우 사용자
  logs.forEach(l=>{
    const k=l.username||l.senderId||'';if(!k)return;
    if(!userFirst[k])userFirst[k]={country:'',concern:'',raw:''};
    if(!userLogs[k])userLogs[k]=[];
    userLogs[k].push(l);
    if(!userFirst[k].country&&cleanC(l.country)){userFirst[k].country=cleanC(l.country);userFirst[k].raw=l.country;}
    if(!userFirst[k].concern&&l.tag&&!SKIP_TAGS.has(l.tag))userFirst[k].concern=l.tag;
    if((l.replied||'').includes('Follow request'))umNF[k]=true;
  });

  const uniqueUsers=Object.keys(userFirst).length;
  document.getElementById('statUniqueUsers').textContent=uniqueUsers;

  // 평균 대화 턴 수 (미팔로우 제외)
  // Peak Time (KST)
  const peakHourRaw=new Array(24).fill(0);
  logs.forEach(l=>{const d=new Date(l.createdAt||l.timestamp);if(!isNaN(d))peakHourRaw[(d.getUTCHours()+9)%24]++;});
  const peakIdx=peakHourRaw.indexOf(Math.max(...peakHourRaw));
  document.getElementById('statPeakTime').textContent=peakHourRaw[peakIdx]>0?((peakIdx%12||12)+(peakIdx<12?'AM':'PM')):'-';

  // AI vs Manual 비율
  const aiCount=logs.filter(l=>l.tag!=='direct'&&!(l.replied||'').startsWith('[')).length;
  const aiPct=logs.length?Math.round(aiCount/logs.length*100):0;
  document.getElementById('statAiRatio').textContent=aiPct+'%';

  // 국가/태그 집계
  const countries={},tags={},ct={},countryRaw={};
  Object.values(userFirst).forEach(u=>{
    const c=u.country;
    if(c){countries[c]=(countries[c]||0)+1;if(!countryRaw[c])countryRaw[c]=u.raw;if(!ct[c])ct[c]={};if(u.concern)ct[c][u.concern]=(ct[c][u.concern]||0)+1;}
    if(u.concern)tags[u.concern]=(tags[u.concern]||0)+1;
  });
  const tc=Object.entries(countries).sort((a,b)=>b[1]-a[1])[0];
  const tt=Object.entries(tags).sort((a,b)=>b[1]-a[1])[0];
  document.getElementById('statTopCountry').textContent=tc?shortC(countryRaw[tc[0]]||tc[0]):'-';
  document.getElementById('statTopTag').textContent=tt?tt[0]:'-';

  // ── Funnel Conversion ──
  const funnelCounts={follow:0,stuck:0,interest:0,consulted:0};
  Object.entries(userFirst).forEach(([k,u])=>{
    if(umNF[k])return;
    const uL=userLogs[k]||[];
    const country=uL.find(x=>cleanC(x.country))?.country||'';
    const stage=getUserStage(uL,country);
    funnelCounts[stage]=(funnelCounts[stage]||0)+1;
  });
  const totalFollowers=Object.keys(userFirst).filter(k=>!umNF[k]).length;
  const funnelEl=document.getElementById('funnelConversion');
  if(funnelEl&&totalFollowers>0){
    const stages=[
      {key:'follow',label:'Follow',color:'var(--red)',count:funnelCounts.follow},
      {key:'stuck',label:'Stuck',color:'var(--amber)',count:funnelCounts.stuck},
      {key:'interest',label:'Interest',color:'var(--cyan)',count:funnelCounts.interest},
      {key:'consulted',label:'Consulted',color:'var(--green)',count:funnelCounts.consulted},
    ];
    const cumulative=[totalFollowers,totalFollowers-funnelCounts.follow,totalFollowers-funnelCounts.follow-funnelCounts.stuck,funnelCounts.consulted];
    funnelEl.innerHTML=stages.map((s,i)=>{
      const pct=Math.round(s.count/totalFollowers*100);
      const convPct=i>0?Math.round(cumulative[i]/totalFollowers*100):100;
      return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;'+(i<3?'border-bottom:1px solid var(--border);':'')+'">'+
        '<div style="width:70px;font-size:10px;font-weight:700;color:'+s.color+';">'+s.label+'</div>'+
        '<div style="flex:1;height:22px;background:var(--bg);border-radius:6px;overflow:hidden;position:relative;">'+
          '<div style="height:100%;width:'+pct+'%;background:'+s.color+';opacity:0.7;border-radius:6px;transition:width 0.5s;"></div>'+
          '<span style="position:absolute;right:8px;top:50%;transform:translateY(-50%);font-size:10px;font-weight:700;color:var(--text-secondary);">'+s.count+'</span>'+
        '</div>'+
        '<div style="width:40px;text-align:right;font-size:11px;font-weight:800;color:'+s.color+';">'+pct+'%</div>'+
      '</div>';
    }).join('')+
    '<div style="text-align:center;margin-top:8px;font-size:10px;color:var(--text-tertiary);">Follow → Consulted conversion: <span style="font-weight:800;color:var(--green);">'+Math.round(funnelCounts.consulted/totalFollowers*100)+'%</span></div>';
  }

  // ── Weekly Growth ──
  const now=new Date();
  const thisWeekStart=new Date(now);thisWeekStart.setDate(now.getDate()-now.getDay());thisWeekStart.setHours(0,0,0,0);
  const lastWeekStart=new Date(thisWeekStart);lastWeekStart.setDate(lastWeekStart.getDate()-7);
  const thisWeekLogs=logs.filter(l=>{const d=new Date(l.createdAt||l.timestamp);return d>=thisWeekStart;});
  const lastWeekLogs=logs.filter(l=>{const d=new Date(l.createdAt||l.timestamp);return d>=lastWeekStart&&d<thisWeekStart;});
  const thisWeekUsers=new Set(thisWeekLogs.map(l=>l.username||l.senderId).filter(Boolean));
  const lastWeekUsers=new Set(lastWeekLogs.map(l=>l.username||l.senderId).filter(Boolean));
  const newUsersThisWeek=[...thisWeekUsers].filter(u=>!lastWeekLogs.some(l=>(l.username||l.senderId)===u)).length;
  const growthEl=document.getElementById('weeklyGrowth');
  if(growthEl){
    const dmChange=lastWeekLogs.length?Math.round((thisWeekLogs.length-lastWeekLogs.length)/lastWeekLogs.length*100):thisWeekLogs.length>0?100:0;
    const userChange=lastWeekUsers.size?Math.round((thisWeekUsers.size-lastWeekUsers.size)/lastWeekUsers.size*100):thisWeekUsers.size>0?100:0;
    const arrow=(v)=>v>0?'<span style="color:var(--green);">▲ +'+v+'%</span>':v<0?'<span style="color:var(--red);">▼ '+v+'%</span>':'<span style="color:var(--text-tertiary);">— 0%</span>';
    growthEl.innerHTML='<div style="display:flex;justify-content:space-around;">'+
      '<div style="text-align:center;padding:6px 0;"><div style="font-size:18px;font-weight:800;color:var(--text);">'+thisWeekLogs.length+'</div><div style="font-size:8px;color:var(--text-tertiary);margin-top:1px;">DMs</div><div style="font-size:9px;margin-top:2px;">'+arrow(dmChange)+'</div></div>'+
      '<div style="text-align:center;padding:6px 0;"><div style="font-size:18px;font-weight:800;color:var(--text);">'+thisWeekUsers.size+'</div><div style="font-size:8px;color:var(--text-tertiary);margin-top:1px;">Users</div><div style="font-size:9px;margin-top:2px;">'+arrow(userChange)+'</div></div>'+
      '<div style="text-align:center;padding:6px 0;"><div style="font-size:18px;font-weight:800;color:var(--green);">'+newUsersThisWeek+'</div><div style="font-size:8px;color:var(--text-tertiary);margin-top:1px;">New</div><div style="font-size:9px;margin-top:2px;color:var(--text-tertiary);">first time</div></div>'+
    '</div>';
  }

  // ── Hourly Heatmap (3h blocks) ──
  const hourRaw=new Array(24).fill(0);
  logs.forEach(l=>{
    const d=new Date(l.createdAt||l.timestamp);
    if(!isNaN(d))hourRaw[(d.getUTCHours()+9)%24]++;
  });
  const hourBlocks=[0,3,6,9,12,15,18,21].map(s=>hourRaw[s]+hourRaw[s+1]+hourRaw[s+2]);
  const hourBlockLabels=['0-2','3-5','6-8','9-11','12-14','15-17','18-20','21-23'];
  const maxHour=Math.max(...hourBlocks);
  const hourBarOpts=cOpts();hourBarOpts.plugins.legend={display:false};
  hourBarOpts.plugins.tooltip={...hourBarOpts.plugins.tooltip,callbacks:{label:ctx=>ctx.raw+' DMs'}};
  new Chart(document.getElementById('chartHourly'),{type:'bar',data:{labels:hourBlockLabels,datasets:[{data:hourBlocks,backgroundColor:hourBlocks.map(v=>{const r=maxHour?v/maxHour:0;return r>0.7?'rgba(91,141,239,0.9)':r>0.3?'rgba(91,141,239,0.5)':'rgba(91,141,239,0.2)';}),hoverBackgroundColor:'#5B8DEF',borderRadius:8,barPercentage:0.5,borderSkipped:false}]},options:hourBarOpts});

  // ── Drop-off Analysis ──
  const dropoffEl=document.getElementById('dropoffAnalysis');
  if(dropoffEl&&totalFollowers>0){
    // 사용자별 마지막 활동 기준 drop-off 판단 (7일 이상 비활동 = drop-off)
    const dropStages={greeting:0,country:0,purpose:0,concern:0,consultation:0};
    Object.entries(userFirst).forEach(([k,u])=>{
      if(umNF[k])return;
      const uL=userLogs[k]||[];
      const lastLog=uL[0];  // logs are newest-first
      const daysSinceLast=lastLog?(now-new Date(lastLog.createdAt||lastLog.timestamp))/(1000*60*60*24):999;
      if(daysSinceLast<3)return;  // still active, not dropped off
      const country=uL.find(x=>cleanC(x.country))?.country||'';
      const hasConcern=uL.some(l=>l.tag&&!SKIP_TAGS.has(l.tag));
      const hasPurpose=uL.some(l=>['business','booking'].includes(l.tag))||hasConcern;
      if(hasConcern)dropStages.consultation++;
      else if(hasPurpose)dropStages.concern++;
      else if(country)dropStages.purpose++;
      else if(uL.length>1)dropStages.country++;
      else dropStages.greeting++;
    });
    const dropTotal=Object.values(dropStages).reduce((s,v)=>s+v,0);
    const dropItems=[
      {label:'After Greeting',count:dropStages.greeting,color:'var(--red)'},
      {label:'At Country',count:dropStages.country,color:'var(--amber)'},
      {label:'At Purpose',count:dropStages.purpose,color:'var(--amber)'},
      {label:'At Concern',count:dropStages.concern,color:'var(--cyan)'},
      {label:'After Consult',count:dropStages.consultation,color:'var(--green)'},
    ];
    if(dropTotal>0){
      dropoffEl.innerHTML=dropItems.filter(d=>d.count>0).map(d=>{
        const pct=Math.round(d.count/dropTotal*100);
        return '<div style="display:flex;align-items:center;gap:10px;padding:6px 0;">'+
          '<div style="width:90px;font-size:10px;font-weight:600;color:'+d.color+';">'+d.label+'</div>'+
          '<div style="flex:1;height:16px;background:var(--bg);border-radius:4px;overflow:hidden;">'+
            '<div style="height:100%;width:'+pct+'%;background:'+d.color+';opacity:0.6;border-radius:4px;"></div>'+
          '</div>'+
          '<div style="width:50px;text-align:right;font-size:10px;color:var(--text-secondary);font-weight:700;">'+d.count+' ('+pct+'%)</div>'+
        '</div>';
      }).join('');
    } else { dropoffEl.closest('.chart-card').style.display='none'; }
  }

  // ── Country Conversion Rate ──
  const countryConvEl=document.getElementById('countryConversion');
  if(countryConvEl){
    const countryStages={};
    Object.entries(userFirst).forEach(([k,u])=>{
      if(umNF[k]||!u.country)return;
      const c=u.country;
      if(!countryStages[c])countryStages[c]={total:0,consulted:0,raw:u.raw};
      countryStages[c].total++;
      const uL=userLogs[k]||[];
      const country=uL.find(x=>cleanC(x.country))?.country||'';
      if(getUserStage(uL,country)==='consulted')countryStages[c].consulted++;
    });
    const sorted=Object.entries(countryStages).sort((a,b)=>b[1].total-a[1].total).slice(0,8);
    countryConvEl.innerHTML=sorted.length?
      sorted.map(([c,d])=>{
        const pct=d.total?Math.round(d.consulted/d.total*100):0;
        return '<div style="display:flex;align-items:center;gap:10px;padding:6px 0;">'+
          '<div style="width:80px;font-size:10px;font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+shortC(d.raw||c)+'</div>'+
          '<div style="flex:1;height:16px;background:var(--bg);border-radius:4px;overflow:hidden;">'+
            '<div style="height:100%;width:'+pct+'%;background:var(--green);opacity:0.6;border-radius:4px;min-width:'+(pct>0?'4px':'0')+';"></div>'+
          '</div>'+
          '<div style="width:60px;text-align:right;font-size:10px;font-weight:700;"><span style="color:var(--green);">'+pct+'%</span> <span style="color:var(--text-tertiary);">('+d.consulted+'/'+d.total+')</span></div>'+
        '</div>';
      }).join(''):
      (()=>{countryConvEl.closest('.chart-card').style.display='none';return'';})();
  }

  // ── Charts ──
  const cl=chartColor(),cg=chartGrid();

  // Activity — Last 7 Days
  const days=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push(d.toISOString().split('T')[0]);}
  new Chart(document.getElementById('chartActivity'),{type:'line',data:{labels:days.map(d=>d.slice(5)),datasets:[{label:'DMs',data:days.map(d=>logs.filter(l=>(l.createdAt||'').startsWith(d)).length),borderColor:'#5B8DEF',backgroundColor:'rgba(91,141,239,0.06)',fill:true,tension:0.4,pointRadius:5,pointBackgroundColor:'#5B8DEF',pointBorderColor:'#fff',pointBorderWidth:2,pointHoverRadius:7,borderWidth:2.5}]},options:cOpts()});

  // Country bar
  const anaBarOpts=cOpts();anaBarOpts.plugins.legend={display:false};anaBarOpts.animation={duration:300,easing:'easeOutQuart'};
  if(Object.keys(countries).length){const s=Object.entries(countries).sort((a,b)=>b[1]-a[1]).slice(0,8);new Chart(document.getElementById('chartCountry'),{type:'bar',data:{labels:s.map(x=>shortC(countryRaw[x[0]]||x[0])),datasets:[{data:s.map(x=>x[1]),backgroundColor:'rgba(91,141,239,0.7)',hoverBackgroundColor:'#5B8DEF',borderRadius:20,barPercentage:0.4,borderSkipped:false}]},options:anaBarOpts});}

  // Tags bar
  if(Object.keys(tags).length){const s=Object.entries(tags).sort((a,b)=>b[1]-a[1]).slice(0,8);new Chart(document.getElementById('chartTags'),{type:'bar',data:{labels:s.map(x=>x[0]),datasets:[{data:s.map(x=>x[1]),backgroundColor:'rgba(61,214,140,0.7)',hoverBackgroundColor:'#3DD68C',borderRadius:20,barPercentage:0.4,borderSkipped:false}]},options:anaBarOpts});}

  // Country Concerns stacked bar
  if(Object.keys(ct).length){
    const ccl=Object.keys(ct).sort((a,b)=>Object.values(ct[b]).reduce((s,v)=>s+v,0)-Object.values(ct[a]).reduce((s,v)=>s+v,0)).slice(0,8);
    const at=[...new Set(ccl.flatMap(c=>Object.keys(ct[c])))];
    const stackOpts=cOpts();stackOpts.scales.x.stacked=true;stackOpts.scales.y={display:false,stacked:true,beginAtZero:true};stackOpts.plugins.legend={labels:{color:chartColor(),font:{size:9,family:'Inter'},usePointStyle:true,pointStyleWidth:6,padding:6}};
    new Chart(document.getElementById('chartCountryConcerns'),{type:'bar',data:{labels:ccl.map(c=>shortC(countryRaw[c]||c)),datasets:at.map((t,i)=>({label:t,data:ccl.map(c=>ct[c][t]||0),backgroundColor:CC[i%CC.length]+'B3',hoverBackgroundColor:CC[i%CC.length],borderRadius:4,borderSkipped:false}))},options:stackOpts});
  }

}

const ANA_COLORS=['var(--accent)','var(--green)','var(--amber)'];
function anaSwitch(idx){
  for(let i=0;i<3;i++){const w=document.getElementById('anaChartWrap'+i);if(w)w.style.display=i===idx?'':'none';}
  const btns=document.querySelectorAll('#anaToggle button');
  btns.forEach((b,i)=>{b.style.background=i===idx?ANA_COLORS[i]:'var(--bg)';b.style.color=i===idx?'#fff':'var(--text-tertiary)';});
}
const ENG_COLORS=['#4AC8E8','#5B8DEF','#3DD68C'];
function engSwitch(idx){
  if(!window._engChart)return;
  const c=window._engChart;
  c.data.datasets.forEach((ds,i)=>{ds.hidden=i!==idx;});
  c.update({duration:300,easing:'easeOutQuart'});
  const btns=document.querySelectorAll('#engToggle button');
  btns.forEach((b,i)=>{b.style.background=i===idx?ENG_COLORS[i]:'var(--bg)';b.style.color=i===idx?'#fff':'var(--text-tertiary)';});
  renderHotPost(idx);
}
function renderHotPost(idx){
  try{
  const hp=document.getElementById('hotPost');
  if(!hp||!window._engPosts?.length){if(hp)hp.innerHTML='';return;}
  const sortKey=['views','likes','comments'][idx]||'views';
  const labels=['Most Viewed','Most Liked','Most Commented'][idx];
  const colors=['var(--cyan)','#5B8DEF','var(--green)'][idx];
  const top5=[...window._engPosts].sort((a,b)=>(b[sortKey]||0)-(a[sortKey]||0)).slice(0,5);
  if(!top5.length){hp.innerHTML='';return;}
  hp.innerHTML='<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);margin-top:10px;overflow:hidden;">'+
    '<div style="padding:12px 14px 8px;font-size:9px;font-weight:700;color:'+colors+';text-transform:uppercase;">'+labels+' — Top 5</div>'+
    top5.map((hot,i)=>{
      const thumb=hot.type==='VIDEO'?(hot.thumbnail||hot.media):(hot.media||hot.thumbnail);
      const date=hot.date?new Date(hot.date).toLocaleDateString('en',{month:'short',day:'numeric'}):'';
      const val=sortKey==='views'?fmt(hot.views||0)+' views':sortKey==='likes'?fmt(hot.likes)+' likes':fmt(hot.comments)+' comments';
      const link=hot.permalink||'';
      return '<a href="'+(link||'#')+'" target="_blank" rel="noopener" style="display:flex;gap:10px;align-items:center;padding:8px 14px;text-decoration:none;color:inherit;'+(i<4?'border-bottom:1px solid var(--border);':'')+'">'+
        '<div style="font-size:14px;font-weight:800;color:'+colors+';width:18px;text-align:center;flex-shrink:0;">'+(i+1)+'</div>'+
        (thumb?'<img src="'+thumb+'" style="width:44px;height:44px;object-fit:cover;border-radius:6px;flex-shrink:0;" onerror="this.remove()">':'')+
        '<div style="min-width:0;flex:1;">'+
        '<div style="font-size:10px;color:var(--text);font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+esc(hot.caption||'No caption')+'</div>'+
        '<div style="font-size:9px;color:var(--text-tertiary);margin-top:2px;">'+val+' · '+date+'</div>'+
        '</div></a>';
    }).join('')+
    '</div>';
  }catch(e){console.error('renderHotPost error:',e);}
}
function chartColor(){return getComputedStyle(document.documentElement).getPropertyValue('--chart-label').trim()||'#E0E4F0';}
function chartGrid(){return getComputedStyle(document.documentElement).getPropertyValue('--chart-grid').trim()||'rgba(140,155,200,0.06)';}
function cOpts(){const cl=chartColor();return{responsive:true,maintainAspectRatio:false,animation:{duration:400,easing:'easeOutQuart'},plugins:{legend:{display:false},tooltip:{backgroundColor:'#1E2338',titleColor:'#fff',bodyColor:'#fff',borderColor:'rgba(255,255,255,0.1)',borderWidth:1,cornerRadius:8,padding:10,displayColors:false,titleFont:{size:11,weight:700,family:'Inter'},bodyFont:{size:12,weight:600,family:'Inter'}}},scales:{x:{ticks:{color:cl,font:{size:9,family:'Inter',weight:500},maxRotation:45,autoSkip:false},grid:{display:false},border:{display:false}},y:{display:false,beginAtZero:true}}};}
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
  // Flow messages
  document.getElementById('msgCountryAsk').value=config.msgCountryAsk||'Quick question — where are you based? This helps me give you more accurate advice for your skin and climate!';
  document.getElementById('msgPurposeAsk').value=config.msgPurposeAsk||'What brings you here today? Tap below!';
  document.getElementById('msgSkinReply').value=config.msgSkinReply||'Great! What specific skin concern can I help you with?';
  document.getElementById('msgBookingReply').value=config.msgBookingReply||"Hey! So I'm at Fine Clinic through April, and then moving to AB Clinic starting June 1st. Unfortunately I won't be able to see patients during May while I'm transitioning — but both clinics have amazing doctors, so feel free to book with them in the meantime!\\n\\nThe reservation system is going to change too — I'll announce all the details once everything is set up! Make sure you're following so you don't miss the update 😊\\n\\nIn the meantime, if you have any skin questions, feel free to ask! I'm happy to help right here";
  document.getElementById('msgBusinessReply').value=config.msgBusinessReply||"Thanks for reaching out! For business inquiries, please email drsean.skin@gmail.com — Dr. Sean will personally get back to you there 🙏";
  // aiPrompt가 비어있으면 기본값 표시
  if(!document.getElementById('aiPrompt').value) document.getElementById('aiPrompt').value=DEFAULT_PROMPT;
  // 국가 버튼
  document.getElementById('countryOptions').value = (config.countryOptions || ['United States','Singapore','Australia','Canada','Others']).join(', ');
  document.getElementById('concernOptions').value = (config.concernOptions || ['Botox','Filler','Lifting','Anti-aging','Acne','Skincare','Others']).join(', ');
  // AI Integration
  document.getElementById('claudeApiKey').value = config.claudeApiKey || '';
  document.getElementById('claudeModel').value = config.claudeModel || 'claude-haiku-4-5-20251001';
  document.getElementById('claudeMonthlyLimit').value = config.claudeMonthlyLimit || '';
  document.getElementById('delayShort').value = config.delayShort || 30;
  document.getElementById('delayMedium').value = config.delayMedium || 60;
  document.getElementById('delayLong').value = config.delayLong || 120;
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
  ['clinicName','address','hours','phone','booking','treatments','greeting','aiPrompt','customRules','fallback','commentDefaultReply','msgCountryAsk','msgPurposeAsk','msgSkinReply','msgBookingReply','msgBusinessReply'].forEach(k=>{const e=document.getElementById(k);if(e)config[k]=e.value;});
  config.commentReplyEnabled = document.getElementById('commentReplyEnabled').checked;
  config.claudeApiKey = document.getElementById('claudeApiKey').value;
  config.claudeModel = document.getElementById('claudeModel').value;
  config.claudeMonthlyLimit = parseInt(document.getElementById('claudeMonthlyLimit').value) || 0;
  config.delayShort = parseInt(document.getElementById('delayShort').value) || 30;
  config.delayMedium = parseInt(document.getElementById('delayMedium').value) || 60;
  config.delayLong = parseInt(document.getElementById('delayLong').value) || 120;
  config.botStartDate = document.getElementById('botStartDate').value;
  config.botStartFollowers = parseInt(document.getElementById('botStartFollowers').value) || 0;
  const coVal = document.getElementById('countryOptions').value;
  config.countryOptions = coVal ? coVal.split(',').map(s=>s.trim()).filter(Boolean) : null;
  const ccVal = document.getElementById('concernOptions').value;
  config.concernOptions = ccVal ? ccVal.split(',').map(s=>s.trim()).filter(Boolean) : null;
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
let allLogs=[],filteredLogs=[],lp=0;const LPP=10;
// ── Insights ──
async function loadInsights(){
  const el=document.getElementById('insightsContent');
  try{
    await loadPatientData();
    const lr=await fetch('/api/logs');const logs=await lr.json();
    if(!Array.isArray(logs)||!logs.length){el.innerHTML='<div style="text-align:center;padding:40px;color:var(--text-tertiary);">Not enough data yet. Insights will appear as DMs come in.</div>';return;}

    // 미팔로우 체크
    const nfCheck={};
    logs.forEach(l=>{const k=l.username||'';if(!k)return;if(!(k in nfCheck))nfCheck[k]=true;if(!(l.replied||'').includes('[Follow request - not following]'))nfCheck[k]=false;});
    const activeLogs=logs.filter(l=>!nfCheck[l.username||'']);

    // 데이터 집계 — 사용자당 1건 (첫 concern + 첫 국가)
    const userFirst={};
    activeLogs.forEach(l=>{
      const k=l.username||l.senderId||'';if(!k)return;
      if(!userFirst[k])userFirst[k]={country:'',concern:'',raw:''};
      if(!userFirst[k].country&&cleanC(l.country)){userFirst[k].country=cleanC(l.country);userFirst[k].raw=l.country;}
      if(!userFirst[k].concern&&l.tag&&!SKIP_TAGS.has(l.tag))userFirst[k].concern=l.tag;
    });
    const users=new Set(Object.keys(userFirst));
    const concerns={},countries={},countryRawMap={};
    Object.values(userFirst).forEach(u=>{
      if(u.concern)concerns[u.concern]=(concerns[u.concern]||0)+1;
      if(u.country){countries[u.country]=(countries[u.country]||0)+1;if(!countryRawMap[u.country])countryRawMap[u.country]=u.raw;}
    });
    // 퍼널 계산
    const stages={follow:0,stuck:0,interest:0,consulted:0};
    const userLogsMap={};
    activeLogs.forEach(l=>{const k=l.username||'';if(!k)return;if(!userLogsMap[k])userLogsMap[k]=[];userLogsMap[k].push(l);});
    Object.entries(userLogsMap).forEach(([k,ul])=>{
      const country=ul.find(l=>cleanC(l.country))?.country||'';
      const stage=getUserStage(ul,country);
      stages[stage]++;
    });
    const totalFunnel=stages.follow+stages.stuck+stages.interest+stages.consulted;
    const convRate=totalFunnel>0?Math.round(stages.consulted/totalFunnel*100):0;
    const stuckRate=totalFunnel>0?Math.round(stages.stuck/totalFunnel*100):0;
    const bookedCount=Object.values(patientData).filter(p=>p.booked).length;

    // 시간대 분석 (24시간)
    const hours=Array(24).fill(0);
    activeLogs.forEach(l=>{if(l.createdAt){const h=(new Date(l.createdAt).getUTCHours()+9)%24;hours[h]++;}});
    const maxHour=Math.max(...hours)||1;
    const peakH=hours.indexOf(Math.max(...hours));

    // ── 카드 생성 ──
    let html='';

    // 1. AI Summary
    const summaryParts=[];
    summaryParts.push('You have <b>'+users.size+' active patients</b> across <b>'+Object.keys(countries).length+' countries</b>.');
    if(convRate>=50)summaryParts.push('<span style="color:var(--green);">Strong conversion rate at '+convRate+'%.</span>');
    else if(convRate>=30)summaryParts.push('Conversion rate is '+convRate+'% — room to grow.');
    else summaryParts.push('<span style="color:var(--amber);">Conversion rate is '+convRate+'% — focus on engaging Interest patients.</span>');
    if(stages.stuck>0)summaryParts.push('<span style="color:var(--amber);">'+stages.stuck+' patient'+(stages.stuck>1?'s are':' is')+' stuck in onboarding.</span> Reach out directly via DM.');
    if(bookedCount>0)summaryParts.push('<span style="color:#E879F9;">'+bookedCount+' booking'+(bookedCount>1?'s':'')+ ' confirmed!</span>');
    const peakStr=(peakH%12||12)+(peakH<12?'AM':'PM');
    summaryParts.push('Peak DM time is <b>'+peakStr+' KST</b>.');
    html+=\`<div style="background:linear-gradient(135deg,rgba(169,132,255,0.08),rgba(91,141,239,0.06));border:1px solid rgba(169,132,255,0.2);border-radius:var(--radius);padding:16px;">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
        <div style="width:20px;height:20px;border-radius:6px;background:rgba(169,132,255,0.15);display:flex;align-items:center;justify-content:center;">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#A984FF" stroke-width="2.5" stroke-linecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        </div>
        <span style="font-size:11px;font-weight:700;color:#A984FF;">AI SUMMARY</span>
      </div>
      <div style="font-size:12px;color:var(--text-secondary);line-height:1.8;">\${summaryParts.join(' ')}</div>
    </div>\`;

    // 2.5. World Heatmap — 국가별 환자 분포 (Dot Map)
    if(Object.keys(countries).length){
      const MAP_POS={
        'United States':[22,38],'Canada':[21,25],'Brazil':[35,65],'Mexico':[18,48],
        'Argentina':[30,78],'Colombia':[27,55],
        'UK':[47,28],'France':[48,35],'Germany':[50,30],'Spain':[46,38],
        'Italy':[51,36],'Netherlands':[49,29],'Sweden':[52,20],'Norway':[50,18],
        'Switzerland':[50,33],'Romania':[54,33],'Ireland':[45,28],
        'Russia':[65,22],'Turkey':[56,37],'Egypt':[55,44],'South Africa':[55,75],
        'Nigeria':[50,52],
        'India':[70,47],'Pakistan':[67,42],'Bangladesh':[73,47],'Sri Lanka':[71,54],
        'Nepal':[72,43],
        'China':[77,37],'Japan':[85,35],'Korea':[83,35],'South Korea':[83,35],
        'Taiwan':[82,44],'Mongolia':[77,28],
        'Thailand':[77,50],'Vietnam':[79,50],'Indonesia':[80,60],
        'Malaysia':[78,57],'Philippines':[83,50],'Singapore':[78,58],
        'Myanmar':[76,48],'Cambodia':[78,52],
        'Australia':[85,72],'New Zealand':[92,78],
        'UAE':[62,44],'Saudi Arabia':[59,44],'Qatar':[61,44],'Israel':[56,40]
      };
      const allC=Object.entries(countries).sort((a,b)=>b[1]-a[1]);
      const maxC=allC[0]?allC[0][1]:1;
      const uid='hm'+Date.now();
      const dots=allC.map(([name,count])=>{
        const pos=MAP_POS[name];
        if(!pos)return'';
        const pct=count/maxC;
        const r=Math.max(5,Math.round(6+pct*14));
        const op=(0.5+pct*0.5).toFixed(2);
        const raw=countryRawMap[name]||name;
        const emoji=(raw.match(/[\u{1F1E0}-\u{1F1FF}]{2}/u)||[''])[0];
        return'<div onclick="var lb=this.querySelector(\\'.hm-label\\'),wasOpen=lb.style.display===\\'flex\\';document.querySelectorAll(\\'.hm-label\\').forEach(function(e){e.style.display=\\'none\\'});if(!wasOpen)lb.style.display=\\'flex\\'" style="position:absolute;left:'+pos[0]+'%;top:'+pos[1]+'%;transform:translate(-50%,-50%);z-index:'+(10+Math.round(pct*10))+';cursor:pointer;" title="'+esc(name)+': '+count+'">'
          +'<div class="'+uid+'-pulse" style="width:'+r*2+'px;height:'+r*2+'px;border-radius:50%;background:rgba(91,141,239,'+op+');box-shadow:0 0 '+(4+pct*12)+'px '+(2+pct*6)+'px rgba(91,141,239,'+(0.3+pct*0.4).toFixed(2)+');display:flex;align-items:center;justify-content:center;">'
          +'<span style="font-size:'+(Math.max(7,r-3))+'px;color:#fff;font-weight:700;text-shadow:0 1px 3px rgba(0,0,0,0.6);pointer-events:none;letter-spacing:-0.3px;">'+({'United States':'US','United Kingdom':'UK','South Korea':'KR','Australia':'AU','Netherlands':'NL','Switzerland':'CH','New Zealand':'NZ','South Africa':'ZA','Saudi Arabia':'SA','Singapore':'SG','Indonesia':'ID','Philippines':'PH','Bangladesh':'BD','Sri Lanka':'LK','Thailand':'TH','Vietnam':'VN','Malaysia':'MY','Myanmar':'MM','Cambodia':'KH','Mongolia':'MN','Romania':'RO','Colombia':'CO','Argentina':'AR','Pakistan':'PK','Brazil':'BR','Mexico':'MX','Canada':'CA','France':'FR','Germany':'DE','Spain':'ES','Italy':'IT','Sweden':'SE','Norway':'NO','Ireland':'IE','Russia':'RU','Turkey':'TR','Egypt':'EG','Nigeria':'NG','India':'IN','China':'CN','Japan':'JP','Korea':'KR','Taiwan':'TW','UAE':'AE','Qatar':'QA','Israel':'IL','Nepal':'NP'}[name]||name.substring(0,2).toUpperCase())+'</span>'
          +'</div>'
          +'<div class="hm-label" style="display:none;position:absolute;left:50%;top:-28px;transform:translateX(-50%);background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:3px 8px;white-space:nowrap;font-size:9px;font-weight:700;color:var(--text);box-shadow:var(--shadow);align-items:center;gap:3px;z-index:99;">'+(emoji||'')+' '+esc(name)+' <span style="color:var(--accent);">'+count+'</span></div>'
          +'</div>';
      }).join('');
      html+=\`<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-top:10px;">
        <style>
          .hm-bg{opacity:0.12;filter:brightness(2) contrast(0.5);}
          .light .hm-bg{opacity:0.25;filter:brightness(0.8) contrast(1.2);}
          @keyframes \${uid}-glow{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.35);opacity:0.6}}
          .\${uid}-pulse{animation:\${uid}-glow 2.5s ease-in-out infinite;}
        </style>
        <div style="font-size:11px;font-weight:700;color:var(--accent);text-transform:uppercase;margin-bottom:8px;">Patient Map</div>
        <div style="position:relative;width:100%;aspect-ratio:2/1;background:var(--bg);border-radius:8px;overflow:hidden;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/1280px-World_map_blank_without_borders.svg.png" class="hm-bg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" onerror="this.remove()">
          \${dots}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px 12px;margin-top:10px;padding-top:10px;border-top:1px solid var(--border);">
          \${allC.map(([c,n])=>{const raw=countryRawMap[c]||c;const emoji=(raw.match(/[\\u{1F1E0}-\\u{1F1FF}]{2}/u)||[''])[0];const pct=n/maxC;const bg='rgba(91,141,239,'+(0.1+pct*0.15).toFixed(2)+')';return'<span style="display:inline-flex;align-items:center;gap:4px;font-size:10px;color:var(--text-secondary);background:'+bg+';padding:2px 8px;border-radius:20px;"><span style="font-size:12px;">'+emoji+'</span> '+esc(c)+' <b style="color:var(--accent);">'+n+'</b></span>';}).join('')}
        </div>
      </div>\`;
    }

    // 3. Needs Reply — 봇 꺼진 상태에서 대기 중인 환자
    const needsReply=[];
    const needsReplySet=new Set();
    // 1) patientData에서 paused인 사람 전부
    Object.entries(patientData).forEach(([k,v])=>{
      if(!v.paused)return;
      needsReplySet.add(k);
      const ul=userLogsMap[k]||[];
      const last=ul[0];
      const ago=last?Math.round((Date.now()-new Date(last.createdAt||last.timestamp))/(1000*60*60)):0;
      const isBiz=ul.some(l=>l.tag==='business');
      needsReply.push({username:k,senderId:last?.senderId||'',lastMsg:(last?.received||'').substring(0,60),ago,tag:isBiz?'business':'paused'});
    });
    // 2) 로그 기반 (Bot paused 메시지)
    Object.entries(userLogsMap).forEach(([k,ul])=>{
      if(needsReplySet.has(k))return;
      const last=ul[0];
      if(!last)return;
      const rep=last.replied||'';
      if(rep.includes('Bot paused')||rep.includes('waiting for manual')||last.tag==='paused'||last.tag==='business'){
        const ago=Math.round((Date.now()-new Date(last.createdAt||last.timestamp))/(1000*60*60));
        needsReply.push({username:k,senderId:last.senderId,lastMsg:(last.received||'').substring(0,60),ago,tag:last.tag});
      }
    });
    needsReply.sort((a,b)=>a.ago-b.ago);
    if(needsReply.length){
      html+=\`<div style="background:var(--surface);border:1px solid rgba(240,100,100,0.2);border-radius:var(--radius);padding:16px;margin-top:12px;">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;">
          <div style="width:20px;height:20px;border-radius:6px;background:rgba(240,100,100,0.15);display:flex;align-items:center;justify-content:center;">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2.5" stroke-linecap="round"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4z"/></svg>
          </div>
          <span style="font-size:11px;font-weight:700;color:var(--red);">NEEDS YOUR REPLY</span>
          <span style="font-size:9px;color:var(--text-tertiary);margin-left:auto;">\${needsReply.length} waiting</span>
        </div>
        \${(()=>{const uid='nr'+Date.now();const ri=p=>'<div onclick="goToPatient(&quot;'+esc(p.username)+'&quot;,&quot;'+esc(p.senderId||'')+'&quot;)" style="display:flex;align-items:center;gap:10px;padding:10px 0;border-top:1px solid var(--border);cursor:pointer;"><div style="width:32px;height:32px;border-radius:50%;background:rgba(240,100,100,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:12px;font-weight:700;color:var(--red);">'+esc(p.username.charAt(0).toUpperCase())+'</div><div style="min-width:0;flex:1;"><div style="font-size:11px;font-weight:700;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">@'+esc(p.username)+'<span style="margin-left:6px;font-size:9px;font-weight:600;color:'+(p.tag==='business'?'#E879F9':'var(--amber)')+';">'+(p.tag==='business'?'Business':'Paused')+'</span></div><div style="font-size:10px;color:var(--text-tertiary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:1px;">'+esc(p.lastMsg)+'</div></div><div style="font-size:9px;color:var(--text-tertiary);white-space:nowrap;flex-shrink:0;">'+(p.ago<1?'just now':p.ago<24?p.ago+'h ago':Math.round(p.ago/24)+'d ago')+'</div></div>';const f=needsReply.slice(0,5).map(ri).join('');const r=needsReply.length>5?'<div id="'+uid+'" style="display:none;">'+needsReply.slice(5).map(ri).join('')+'</div><div onclick="toggleMore(&quot;'+uid+'&quot;,'+(needsReply.length-5)+')" style="text-align:center;padding:8px;font-size:10px;font-weight:600;color:var(--red);cursor:pointer;border-top:1px solid var(--border);">+'+(needsReply.length-5)+' more...</div>':'';return f+r;})()}
      </div>\`;
    }

    // 4. Hot Leads — 예약 의향 보인 환자 (booking 태그 or 예약 키워드)
    const BOOKING_WORDS=['book','reserve','appointment','schedule','visit','come in','coming to','travel','trip','flying','how to book','make a booking'];
    const matchesBooking=(text)=>{const t=(text||'').toLowerCase();return BOOKING_WORDS.some(w=>t.includes(w));};
    const allUserLogs={};
    logs.forEach(l=>{const k=l.username||'';if(!k)return;if(!allUserLogs[k])allUserLogs[k]=[];allUserLogs[k].push(l);});
    const hotLeads=[];
    Object.entries(allUserLogs).forEach(([k,ul])=>{
      if((patientData[k]||{}).booked)return;
      if(nfCheck[k])return;
      const hasBookingTag=ul.some(l=>l.tag==='booking');
      const hasBookingMsg=ul.some(l=>matchesBooking(l.received));
      if(!hasBookingTag&&!hasBookingMsg)return;
      const isPaused=(patientData[k]||{}).paused;
      const country=ul.find(l=>cleanC(l.country))?.country||'';
      const concerns=[...new Set(ul.map(l=>l.tag).filter(t=>t&&!SKIP_TAGS.has(t)&&t!=='booking'))];
      const last=ul[0];
      const ago=Math.round((Date.now()-new Date(last.createdAt||last.timestamp))/(1000*60*60*24));
      hotLeads.push({username:k,senderId:last.senderId,concerns:concerns.length?concerns:['booking'],ago,country:shortC(country),paused:isPaused});
    });
    hotLeads.sort((a,b)=>a.ago-b.ago);
    if(hotLeads.length){
      html+=\`<div style="background:var(--surface);border:1px solid rgba(61,214,140,0.2);border-radius:var(--radius);padding:16px;margin-top:12px;">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;">
          <div style="width:20px;height:20px;border-radius:6px;background:rgba(61,214,140,0.15);display:flex;align-items:center;justify-content:center;">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          </div>
          <span style="font-size:11px;font-weight:700;color:var(--green);">HOT LEADS</span>
          <span style="font-size:9px;color:var(--text-tertiary);margin-left:auto;">\${hotLeads.length} booking intent</span>
        </div>
        \${(()=>{const uid='hl'+Date.now();const ri=p=>'<div onclick="goToPatient(&quot;'+esc(p.username)+'&quot;,&quot;'+esc(p.senderId||'')+'&quot;)" style="display:flex;align-items:center;gap:10px;padding:10px 0;border-top:1px solid var(--border);cursor:pointer;"><div style="width:32px;height:32px;border-radius:50%;background:rgba(61,214,140,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:12px;font-weight:700;color:var(--green);">'+esc(p.username.charAt(0).toUpperCase())+'</div><div style="min-width:0;flex:1;"><div style="font-size:11px;font-weight:700;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">@'+esc(p.username)+(p.paused?' <span style="font-size:8px;color:var(--amber);font-weight:600;">Paused</span>':'')+' <span style="font-size:9px;color:var(--text-tertiary);">'+esc(p.country)+'</span></div><div style="font-size:10px;color:var(--green);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:1px;">'+p.concerns.slice(0,3).map(c=>esc(c)).join(', ')+'</div></div><div style="font-size:9px;color:var(--text-tertiary);white-space:nowrap;flex-shrink:0;">'+(p.ago<1?'today':p.ago+'d ago')+'</div></div>';const f=hotLeads.slice(0,5).map(ri).join('');const r=hotLeads.length>5?'<div id="'+uid+'" style="display:none;">'+hotLeads.slice(5).map(ri).join('')+'</div><div onclick="toggleMore(&quot;'+uid+'&quot;,'+(hotLeads.length-5)+')" style="text-align:center;padding:8px;font-size:10px;font-weight:600;color:var(--green);cursor:pointer;border-top:1px solid var(--border);">+'+(hotLeads.length-5)+' more...</div>':'';return f+r;})()}
      </div>\`;
    }

    // 5. Gone Silent — 대화하다 조용해진 환자 (3일+)
    const goneSilent=[];
    Object.entries(userLogsMap).forEach(([k,ul])=>{
      if(nfCheck[k])return;
      const country=ul.find(l=>cleanC(l.country))?.country||'';
      const stage=getUserStage(ul,country);
      if(stage==='follow'||stage==='stuck')return;  // 아직 온보딩도 안 된 환자 제외
      if((patientData[k]||{}).booked)return;  // 이미 예약한 환자 제외
      const last=ul[0];
      const rep=last.replied||'';
      if(rep.includes('Bot paused')||rep.includes('waiting for manual'))return;  // needsReply에 이미 있음
      const ago=Math.round((Date.now()-new Date(last.createdAt||last.timestamp))/(1000*60*60*24));
      if(ago>=3)goneSilent.push({username:k,senderId:last.senderId,ago,stage,country:shortC(country)});
    });
    goneSilent.sort((a,b)=>a.ago-b.ago);
    if(goneSilent.length){
      html+=\`<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-top:12px;">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;">
          <div style="width:20px;height:20px;border-radius:6px;background:rgba(91,141,239,0.15);display:flex;align-items:center;justify-content:center;">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          </div>
          <span style="font-size:11px;font-weight:700;color:var(--accent);">GONE SILENT</span>
          <span style="font-size:9px;color:var(--text-tertiary);margin-left:auto;">\${goneSilent.length} inactive 3d+</span>
        </div>
        \${goneSilent.slice(0,5).map(p=>{const stageColor={interest:'var(--cyan)',consulted:'var(--green)'}[p.stage]||'var(--text-tertiary)';return'<div onclick="goToPatient(&quot;'+esc(p.username)+'&quot;,&quot;'+esc(p.senderId||'')+'&quot;)" style="display:flex;align-items:center;gap:10px;padding:10px 0;border-top:1px solid var(--border);cursor:pointer;"><div style="width:32px;height:32px;border-radius:50%;background:var(--bg);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:12px;font-weight:700;color:var(--text-tertiary);">'+esc(p.username.charAt(0).toUpperCase())+'</div><div style="min-width:0;flex:1;"><div style="font-size:11px;font-weight:700;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">@'+esc(p.username)+' <span style="font-size:9px;color:var(--text-tertiary);">'+esc(p.country)+'</span></div><div style="font-size:10px;color:'+stageColor+';margin-top:1px;">'+esc(p.stage)+'</div></div><div style="font-size:9px;color:'+(p.ago>=7?'var(--red)':'var(--text-tertiary)')+';white-space:nowrap;flex-shrink:0;">'+p.ago+'d ago</div></div>';}).join('')}
      </div>\`;
    }

    // 6. Conversion Tips — 데이터 기반 AI 추천
    const tips=[];
    if(stages.stuck>2)tips.push({icon:'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" stroke-width="2.5" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',color:'var(--amber)',text:'<b>'+stages.stuck+' patients stuck</b> at onboarding. <span onclick="switchTab(&quot;logs&quot;,null);setTimeout(function(){filterByFunnel(&quot;stuck&quot;)},300)" style="text-decoration:underline;cursor:pointer;color:var(--amber);">View stuck →</span>'});
    if(convRate<30&&totalFunnel>=5)tips.push({icon:'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" stroke-width="2.5" stroke-linecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',color:'var(--cyan)',text:'Conversion rate is <b>'+convRate+'%</b>. Try a follow-up DM to Interest patients. <span onclick="switchTab(&quot;logs&quot;,null);setTimeout(function(){filterByFunnel(&quot;interest&quot;)},300)" style="text-decoration:underline;cursor:pointer;color:var(--cyan);">View interest →</span>'});
    if(goneSilent.length>=3)tips.push({icon:'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',color:'var(--accent)',text:'<b>'+goneSilent.length+' patients</b> went silent. A quick check-in DM can re-engage 30% of inactive leads.'});
    const topC=Object.entries(concerns).sort((a,b)=>b[1]-a[1])[0];
    if(topC&&topC[1]>=3)tips.push({icon:'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5" stroke-linecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></svg>',color:'var(--green)',text:'<b>'+esc(topC[0])+'</b> is your #1 concern with <b>'+topC[1]+' patients</b>. Highlight this treatment on your Instagram stories for more conversions.'});
    const topCountry=Object.entries(countries).sort((a,b)=>b[1]-a[1])[0];
    if(topCountry&&topCountry[1]>=3){
      const tcConv=Object.entries(userLogsMap).filter(([k])=>{const uf=userFirst[k];return uf&&uf.country===topCountry[0];});
      const tcConsulted=tcConv.filter(([k,ul])=>getUserStage(ul,ul.find(l=>cleanC(l.country))?.country||'')==='consulted').length;
      const tcRate=tcConv.length?Math.round(tcConsulted/tcConv.length*100):0;
      if(tcRate>=50)tips.push({icon:'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#E879F9" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>',color:'#E879F9',text:'Patients from <b>'+esc(topCountry[0])+'</b> convert at <b>'+tcRate+'%</b>. Consider targeted content for this audience.'});
    }
    const waiting24=needsReply.filter(p=>p.ago>=24);
    if(waiting24.length)tips.push({icon:'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',color:'var(--red)',text:waiting24.map(p=>'<b style="cursor:pointer;text-decoration:underline;" onclick="goToPatient(&quot;'+esc(p.username)+'&quot;,&quot;'+esc(p.senderId||'')+'&quot;)">@'+esc(p.username)+'</b>').join(', ')+' waiting <b>'+Math.round(Math.max(...waiting24.map(p=>p.ago))/24)+'d+</b> for your reply.'});
    if(tips.length){
      html+=\`<div style="background:linear-gradient(135deg,rgba(91,141,239,0.05),rgba(61,214,140,0.05));border:1px solid rgba(91,141,239,0.15);border-radius:var(--radius);padding:16px;margin-top:12px;">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;">
          <div style="width:20px;height:20px;border-radius:6px;background:rgba(91,141,239,0.15);display:flex;align-items:center;justify-content:center;">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><circle cx="12" cy="12" r="10"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <span style="font-size:11px;font-weight:700;color:var(--accent);">CONVERSION TIPS</span>
        </div>
        \${tips.map(t=>'<div style="display:flex;gap:8px;padding:8px 0;border-top:1px solid var(--border);"><div style="width:20px;height:20px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">'+t.icon+'</div><div style="font-size:11px;color:var(--text-secondary);line-height:1.6;">'+t.text+'</div></div>').join('')}
      </div>\`;
    }


    el.innerHTML=html;
  }catch(e){
    console.error('loadInsights error:',e);
    el.innerHTML='<div style="text-align:center;padding:40px;color:var(--text-tertiary);">Failed to load insights.</div>';
  }
}

function toggleMore(id,total,color){
  const el=document.getElementById(id);
  const btn=el.nextElementSibling;
  if(el.style.display==='none'){el.style.display='';btn.textContent='Show less';}
  else{el.style.display='none';btn.textContent='+'+total+' more...';}
}
async function dismissHumanReq(username){
  if(!patientData[username])return;
  delete patientData[username].humanRequest;
  delete patientData[username].humanRequestAt;
  await fetch('/api/patients',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(patientData)});
  renderTodaySummary(allLogs);
  toast('Dismissed @'+username);
}
async function goToPatient(username,senderId){
  switchTab('logs',null);
  await loadLogs();
  openPatient(username,senderId);
}
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
  // Unreviewed: 고객 단위 (한 명이라도 unreviewed 로그가 있으면 1명)
  const unreviewedUsers=new Set();
  logs.forEach(l=>{if(!l.reviewed){const k=l.username||l.senderId||'';if(k)unreviewedUsers.add(k);}});
  const unreviewed=unreviewedUsers.size;
  // 퍼널 — 계정 기준 (중복 제거)
  const userMap={},userAllNotFollow={};
  logs.forEach(l=>{
    const key=l.username||l.senderId||'';
    if(!key)return;
    if(!userMap[key]) userMap[key]={follow:false,stuck:false,interest:false,consulted:false};
    if(!(key in userAllNotFollow))userAllNotFollow[key]=true;
    if(!(l.replied||'').includes('[Follow request - not following]'))userAllNotFollow[key]=false;
    if((l.replied||'').includes('[Follow request')) userMap[key].follow=true;
    if(l.tag==='stuck') userMap[key].stuck=true;
    if(l.tag&&l.tag!=='stuck'&&l.tag!=='paused'&&l.tag!=='direct') userMap[key].consulted=true;
    if(cleanC(l.country)&&!l.tag) userMap[key].interest=true;
  });
  // 미팔로우 사용자 퍼널 제외
  Object.keys(userAllNotFollow).forEach(k=>{if(userAllNotFollow[k])delete userMap[k];});
  // getUserStage 기반으로 카운트
  const stageCounts={follow:0,stuck:0,interest:0,consulted:0};
  Object.keys(userMap).forEach(k=>{
    const uLogs=logs.filter(l=>(l.username||l.senderId)===k);
    const country=uLogs.find(l=>cleanC(l.country))?.country||'';
    const stage=getUserStage(uLogs,country);
    stageCounts[stage]++;
  });
  const stuckCount=stageCounts.stuck;
  const consultedCount=stageCounts.consulted;
  const countries={},countryRawToday={};todayLogs.forEach(l=>{const c=cleanC(l.country);if(c){countries[c]=(countries[c]||0)+1;if(!countryRawToday[c])countryRawToday[c]=l.country;}});
  const topC=Object.entries(countries).sort((a,b)=>b[1]-a[1])[0];
  const tags={};todayLogs.forEach(l=>{if(l.tag&&l.tag!=='direct'&&l.tag!=='paused'&&l.tag!=='stuck')tags[l.tag]=(tags[l.tag]||0)+1;});
  const topT=Object.entries(tags).sort((a,b)=>b[1]-a[1])[0];
  const followOnly=stageCounts.follow;
  const interestOnly=stageCounts.interest;
  // Not Following 카운트
  const nfCount=Object.values(userAllNotFollow).filter(Boolean).length;
  // Booked 카운트 (수동 마킹)
  const bookedCount=Object.values(patientData).filter(p=>p.booked).length;
  // Purpose 카운트 (business 무조건 유지, booking은 skin에도 중복 집계, tag 기준만)
  const purposeCounts={skin:0,booking:0,business:0};
  Object.keys(userMap).forEach(k=>{
    const uLogs=logs.filter(l=>(l.username||l.senderId)===k);
    const hasBiz=uLogs.some(l=>l.tag==='business');
    const hasBook=uLogs.some(l=>l.tag==='booking');
    if(hasBiz){purposeCounts.business++;}
    else{purposeCounts.skin++;if(hasBook)purposeCounts.booking++;}
  });
  el.innerHTML=\`
    <div style="grid-column:span 2;display:flex;gap:6px;">
      <div class="stat-card" style="flex:1;padding:10px;">
        <div class="stat-label">Today</div>
        <div class="stat-value">\${new Set(todayLogs.map(l=>l.username||l.senderId).filter(Boolean)).size}</div>
      </div>
      <div class="stat-card" style="flex:1;padding:10px;">
        <div class="stat-label" style="color:\${unreviewed>0?'var(--amber)':'var(--green)'};">Unreviewed</div>
        <div class="stat-value" style="color:\${unreviewed>0?'var(--amber)':'var(--green)'}">\${unreviewed}</div>
      </div>
    </div>
\`; el.innerHTML+=\`
    <div class="summary-card" style="grid-column:span 2;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
        <div class="stat-label" style="margin:0;">Patient Funnel</div>
        <div style="display:flex;gap:10px;font-size:10px;font-weight:600;">
          <span data-purpose="skin" onclick="filterByPurpose('skin')" style="cursor:pointer;color:var(--green);padding:2px 8px;border-radius:10px;transition:all 0.2s;">Skin \${purposeCounts.skin}</span>
          <span data-purpose="booking" onclick="filterByPurpose('booking')" style="cursor:pointer;color:#5B8DEF;padding:2px 8px;border-radius:10px;transition:all 0.2s;">Booking \${purposeCounts.booking}</span>
          <span data-purpose="business" onclick="filterByPurpose('business')" style="cursor:pointer;color:#FF8C42;padding:2px 8px;border-radius:10px;transition:all 0.2s;">Biz \${purposeCounts.business}</span>
        </div>
      </div>
      <div style="display:flex;gap:4px;flex-wrap:nowrap;">
        <div onclick="filterByFunnel('notfollow')" data-funnel="notfollow" style="flex:1;text-align:center;padding:6px 2px;background:var(--bg);border-radius:8px;cursor:pointer;min-width:0;transition:all 0.2s;">
          <div style="font-size:16px;font-weight:800;color:var(--text-tertiary);">\${nfCount}</div>
          <div style="font-size:8px;color:var(--text-tertiary);margin-top:2px;">No follow</div>
        </div>
        <div style="flex:0;display:flex;align-items:center;color:var(--text-tertiary);font-size:9px;">→</div>
        <div onclick="filterByFunnel('follow')" data-funnel="follow" style="flex:1;text-align:center;padding:6px 2px;background:var(--bg);border-radius:8px;cursor:pointer;min-width:0;transition:all 0.2s;">
          <div style="font-size:16px;font-weight:800;color:var(--red);">\${followOnly}</div>
          <div style="font-size:8px;color:var(--text-tertiary);margin-top:2px;">Follow</div>
        </div>
        <div style="flex:0;display:flex;align-items:center;color:var(--text-tertiary);font-size:9px;">→</div>
        <div onclick="filterByFunnel('stuck')" data-funnel="stuck" style="flex:1;text-align:center;padding:6px 2px;background:var(--bg);border-radius:8px;cursor:pointer;min-width:0;transition:all 0.2s;">
          <div style="font-size:16px;font-weight:800;color:var(--amber);">\${stuckCount}</div>
          <div style="font-size:8px;color:var(--text-tertiary);margin-top:2px;">Stuck</div>
        </div>
      </div>
      <div style="display:flex;gap:4px;margin:3px 0;flex-wrap:nowrap;">
        <div style="flex:1;min-width:0;"></div>
        <div style="flex:0;display:flex;align-items:center;color:transparent;font-size:9px;">→</div>
        <div style="flex:1;min-width:0;"></div>
        <div style="flex:0;display:flex;align-items:center;color:transparent;font-size:9px;">→</div>
        <div style="flex:1;min-width:0;text-align:center;color:var(--text-tertiary);font-size:9px;">↓</div>
      </div>
      <div style="display:flex;gap:4px;flex-wrap:nowrap;">
        <div onclick="filterByFunnel('booked')" data-funnel="booked" style="flex:1;text-align:center;padding:6px 2px;background:var(--bg);border-radius:8px;cursor:pointer;min-width:0;transition:all 0.2s;">
          <div style="font-size:16px;font-weight:800;color:#E879F9;">\${bookedCount}</div>
          <div style="font-size:8px;color:var(--text-tertiary);margin-top:2px;">Booked</div>
        </div>
        <div style="flex:0;display:flex;align-items:center;color:var(--text-tertiary);font-size:9px;">←</div>
        <div onclick="filterByFunnel('consulted')" data-funnel="consulted" style="flex:1;text-align:center;padding:6px 2px;background:var(--bg);border-radius:8px;cursor:pointer;min-width:0;transition:all 0.2s;">
          <div style="font-size:16px;font-weight:800;color:var(--green);">\${consultedCount}</div>
          <div style="font-size:8px;color:var(--text-tertiary);margin-top:2px;">Consulted</div>
        </div>
        <div style="flex:0;display:flex;align-items:center;color:var(--text-tertiary);font-size:9px;">←</div>
        <div onclick="filterByFunnel('interest')" data-funnel="interest" style="flex:1;text-align:center;padding:6px 2px;background:var(--bg);border-radius:8px;cursor:pointer;min-width:0;transition:all 0.2s;">
          <div style="font-size:16px;font-weight:800;color:var(--cyan);">\${interestOnly}</div>
          <div style="font-size:8px;color:var(--text-tertiary);margin-top:2px;">Interest</div>
        </div>
      </div>
    </div>
  \`;
  // "Wants Dr. Sean" — AI 대신 직접 상담 요청한 환자
  const humanReqUsers=Object.entries(patientData).filter(([k,v])=>v.humanRequest&&v.paused);
  const hrList=humanReqUsers.map(([k,v])=>{
    const uLogs=logs.filter(l=>(l.username||l.senderId)===k);
    const last=uLogs[0];
    const ago=last?Math.round((Date.now()-new Date(v.humanRequestAt||last?.createdAt||last?.timestamp))/(1000*60*60)):0;
    return{username:k,senderId:last?.senderId||'',ago};
  }).sort((a,b)=>a.ago-b.ago);
  el.innerHTML+=\`<div style="grid-column:span 2;background:linear-gradient(135deg,rgba(240,100,100,0.06),rgba(240,178,74,0.04));border:1px solid rgba(240,100,100,0.2);border-radius:var(--radius);padding:12px;margin-top:2px;">
    <div style="display:flex;align-items:center;gap:6px;\${hrList.length?'margin-bottom:8px;':''}">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red)" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      <span style="font-size:11px;font-weight:700;color:var(--red);">Wants Dr. Sean</span>
      <span style="font-size:9px;color:var(--text-tertiary);margin-left:auto;">\${hrList.length?hrList.length+' waiting':'None'}</span>
    </div>
    \${(()=>{if(!hrList.length)return'';const uid='hr'+Date.now();const ri=p=>'<div style="display:flex;align-items:center;gap:8px;padding:6px 0;'+(hrList.indexOf(p)>0?'border-top:1px solid var(--border);':'')+'"><div onclick="goToPatient(&quot;'+esc(p.username)+'&quot;,&quot;'+esc(p.senderId)+'&quot;)" style="display:flex;align-items:center;gap:8px;flex:1;cursor:pointer;"><div style="width:26px;height:26px;border-radius:50%;background:rgba(240,100,100,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:10px;font-weight:700;color:var(--red);">'+esc(p.username.charAt(0).toUpperCase())+'</div><div style="flex:1;font-size:11px;font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">@'+esc(p.username)+'</div><div style="font-size:9px;color:var(--text-tertiary);">'+(p.ago<1?'now':p.ago<24?p.ago+'h':Math.round(p.ago/24)+'d')+'</div></div><div onclick="event.stopPropagation();dismissHumanReq(&quot;'+esc(p.username)+'&quot;)" style="width:20px;height:20px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-tertiary);font-size:14px;flex-shrink:0;border-radius:4px;opacity:0.5;" title="Dismiss">×</div></div>';const first3=hrList.slice(0,3).map(ri).join('');const rest=hrList.length>3?'<div id="'+uid+'" style="display:none;">'+hrList.slice(3).map(ri).join('')+'</div><div onclick="toggleMore(&quot;'+uid+'&quot;,'+(hrList.length-3)+')" style="text-align:center;padding:6px;font-size:10px;font-weight:600;color:var(--red);cursor:pointer;border-top:1px solid var(--border);">+'+(hrList.length-3)+' more...</div>':'';return first3+rest;})()}
  </div>\`;
}

let funnelFilter='',purposeFilter='';
function filterByPurpose(type){
  if(purposeFilter===type){purposeFilter='';} else {purposeFilter=type;}
  funnelFilter='';
  // 퍼널 효과 리셋
  document.querySelectorAll('[data-funnel]').forEach(el=>{el.style.outline='none';el.style.transform='scale(1)';el.style.boxShadow='none';});
  // Purpose 선택 효과
  const pColors={skin:'rgba(61,214,140,0.15)',booking:'rgba(91,141,239,0.15)',business:'rgba(255,140,66,0.15)'};
  document.querySelectorAll('[data-purpose]').forEach(el=>{
    if(el.dataset.purpose===purposeFilter){
      el.style.background=pColors[purposeFilter]||'transparent';
      el.style.fontWeight='800';
    }else{
      el.style.background='transparent';
      el.style.fontWeight='';
    }
  });
  applyFilters();
}
function filterByFunnel(type){
  purposeFilter='';
  if(funnelFilter===type){funnelFilter='';} else {funnelFilter=type;}
  // 퍼널 항목 선택 효과
  // Purpose 효과 리셋
  document.querySelectorAll('[data-purpose]').forEach(el=>{el.style.background='transparent';el.style.fontWeight='';});
  const fColors={notfollow:['#8A94B0','rgba(138,148,176,0.3)'],follow:['#F06464','rgba(240,100,100,0.3)'],stuck:['#F0B24A','rgba(240,178,74,0.3)'],interest:['#4AC8E8','rgba(74,200,232,0.3)'],consulted:['#3DD68C','rgba(61,214,140,0.3)'],booked:['#E879F9','rgba(232,121,249,0.3)']};
  document.querySelectorAll('[data-funnel]').forEach(el=>{
    const fc=fColors[el.dataset.funnel];
    if(el.dataset.funnel===funnelFilter&&fc){
      el.style.outline='2px solid '+fc[0];
      el.style.outlineOffset='-2px';
      el.style.transform='scale(1.05)';
      el.style.boxShadow='0 0 12px '+fc[1];
    }else{
      el.style.outline='none';
      el.style.transform='scale(1)';
      el.style.boxShadow='none';
    }
  });
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
  // Purpose 필터
  if(purposeFilter){
    const umNF={};
    allLogs.forEach(l=>{const k=l.username||'';if(!k)return;if(!(k in umNF))umNF[k]=true;if(!(l.replied||'').includes('[Follow request - not following]'))umNF[k]=false;});
    const userPurpose={};const userHasBooking={};
    const userLogsGrp={};
    allLogs.forEach(l=>{const k=l.username||l.senderId||'';if(!k||umNF[k])return;if(!userLogsGrp[k])userLogsGrp[k]=[];userLogsGrp[k].push(l);});
    Object.entries(userLogsGrp).forEach(([k,ul])=>{
      const hasBiz=ul.some(l=>l.tag==='business');
      const hasBook=ul.some(l=>l.tag==='booking');
      if(hasBiz)userPurpose[k]='business';
      else userPurpose[k]='skin';
      if(hasBook&&!hasBiz)userHasBooking[k]=true;
    });
    if(purposeFilter==='skin'){
      const skinUsers=new Set(Object.entries(userPurpose).filter(([k,v])=>v!=='business').map(([k])=>k));
      logs=logs.filter(l=>skinUsers.has(l.username||l.senderId||''));
    }else if(purposeFilter==='booking'){
      const bUsers=new Set(Object.keys(userHasBooking));
      logs=logs.filter(l=>bUsers.has(l.username||l.senderId||''));
    }else{
      const pUsers=new Set(Object.entries(userPurpose).filter(([k,v])=>v===purposeFilter).map(([k])=>k));
      logs=logs.filter(l=>pUsers.has(l.username||l.senderId||''));
    }
  }
  // 퍼널 필터 — getUserStage 통일
  if(funnelFilter){
    const umNF={};
    allLogs.forEach(l=>{const k=l.username||'';if(!k)return;if(!(k in umNF))umNF[k]=true;if(!(l.replied||'').includes('[Follow request - not following]'))umNF[k]=false;});
    if(funnelFilter==='notfollow'){
      const nfUsers=new Set(Object.entries(umNF).filter(([k,v])=>v).map(([k])=>k));
      logs=logs.filter(l=>nfUsers.has(l.username||l.senderId||''));
    }else if(funnelFilter==='booked'){
      const bUsers=new Set(Object.entries(patientData).filter(([k,v])=>v.booked).map(([k])=>k));
      logs=logs.filter(l=>bUsers.has(l.username||l.senderId||''));
    }else{
      // getUserStage 기반 필터
      const userLogsMap={};
      allLogs.forEach(l=>{const k=l.username||l.senderId||'';if(!k||umNF[k])return;if(!userLogsMap[k])userLogsMap[k]=[];userLogsMap[k].push(l);});
      const fUsers=new Set();
      Object.entries(userLogsMap).forEach(([k,ul])=>{
        const country=ul.find(l=>cleanC(l.country))?.country||'';
        if(getUserStage(ul,country)===funnelFilter)fUsers.add(k);
      });
      logs=logs.filter(l=>fUsers.has(l.username||l.senderId||''));
    }
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
  // 미팔로우 사용자 감지
  const notFollowUsers=new Set();
  const userFollowCheck={};
  allLogs.forEach(l=>{
    const key=l.username||l.senderId||'';if(!key)return;
    if(!(key in userFollowCheck))userFollowCheck[key]=true;
    if(!(l.replied||'').includes('[Follow request - not following]'))userFollowCheck[key]=false;
  });
  Object.entries(userFollowCheck).forEach(([k,v])=>{if(v)notFollowUsers.add(k);});
  // 사용자별 가장 구체적인 concern 태그 계산 (미팔로우 제외)
  const userBestTag={};
  allLogs.forEach(l=>{
    const key=l.username||l.senderId||'';
    if(!key||notFollowUsers.has(key))return;
    const t=l.tag;
    if(t&&!SKIP_TAGS.has(t)){
      if(!userBestTag[key])userBestTag[key]=t;
    }
  });
  // 사용자별 purpose 맵 (booking은 skin과 중복 가능)
  const userPurposeMap={};const userIsBooking={};
  const uLogsGrp={};allLogs.forEach(l=>{const k=l.username||l.senderId||'';if(!k)return;if(!uLogsGrp[k])uLogsGrp[k]=[];uLogsGrp[k].push(l);});
  Object.entries(uLogsGrp).forEach(([k,ul])=>{
    const hasBiz=ul.some(l=>l.tag==='business');
    const hasBook=ul.some(l=>l.tag==='booking');
    if(hasBiz)userPurposeMap[k]='business';
    else userPurposeMap[k]='skin';
    if(hasBook&&!hasBiz)userIsBooking[k]=true;
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
    const globalIdx=allLogs.findIndex(x=>x.createdAt===l.createdAt&&x.senderId===l.senderId);
    return \`<div class="log-item \${noCountry?'log-no-country':''} \${isReviewed?'reviewed':'unreviewed'}" style="cursor:pointer;" onclick="if(!event.target.closest('button,.log-action-btn,.log-expand,input,textarea,.review-dot'))openPatient('\${esc(l.username)}','\${esc(l.senderId)}')">
      <div class="log-header">
        <div class="log-badges">
          <span class="review-dot" onclick="event.stopPropagation();toggleReviewDot(\${globalIdx})" style="display:inline-flex;align-items:center;justify-content:center;width:12px;height:12px;border-radius:50%;background:\${isReviewed?'var(--border)':'var(--green)'};margin-right:6px;flex-shrink:0;cursor:pointer;transition:all 0.2s;vertical-align:middle;" title="\${isReviewed?'Mark unread':'Unread'}"></span>
          \${l.username?'<span class="badge badge-user">@'+esc(l.username)+'</span>':''}
        </div>
        <div class="log-time-relative">\${ago}</div>
      </div>
      <div style="display:flex;align-items:center;gap:0;margin:-4px 0 6px;font-size:10px;font-weight:600;flex-wrap:nowrap;overflow:hidden;">
        \${(()=>{const k=l.username||l.senderId;const nf=notFollowUsers.has(k);const parts=[];
          if(!noCountry)parts.push('<span style="color:#7EB0D5;">'+esc(shortC(l.country))+'</span>');
          if(!nf){const p=userPurposeMap[k];if(p==='business')parts.push('<span style="color:#FF8C42;">Business</span>');else{parts.push('<span style="color:var(--green);">Skin</span>');if(userIsBooking[k])parts.push('<span style="color:#5B8DEF;">Booking</span>');}}
          const bt=userBestTag[k];if(bt)parts.push('<span style="color:#A984FF;">'+esc(bt)+'</span>');
          const badge=getFunnelBadge(l,userBestTag,notFollowUsers);if(badge)parts.push(badge);
          return parts.join('<span style="color:var(--border);margin:0 6px;">│</span>');
        })()}
      </div>
      <div class="log-bubble log-bubble-in"><div class="log-bubble-label">Received</div><div>\${esc(l.received)}</div></div>
      <div class="log-bubble log-bubble-out"><div class="log-bubble-label">Replied</div><div class="log-bubble-text\${longReply?'':' expanded'}" id="\${id}">\${esc(l.replied)}</div>\${longReply?'<button class="log-expand" onclick="toggleLogExpand(\\''+id+'\\',this)">Show more</button>':''}</div>
    </div>\`;
  }).join('')+(tp>1?\`<div class="page-nav"><button class="page-btn" onclick="pl()" \${lp===0?'disabled':''}>Prev</button><span style="color:var(--text-tertiary);font-size:12px;font-weight:600">\${lp+1}/\${tp}</span><button class="page-btn" onclick="nl()" \${lp>=tp-1?'disabled':''}>Next</button></div>\`:'');
  }catch(e){console.error('renderLogs error:',e);el.innerHTML='<p class="empty">Error rendering logs.</p>';}
}
// 공용 퍼널 단계 계산 — 모든 곳에서 이 함수 사용
const SKIP_TAGS=new Set(['','stuck','paused','direct','consultation','none','business','booking','skin']);
function getUserStage(userLogs,country){
  const hasConsulted=userLogs.some(l=>l.tag&&!SKIP_TAGS.has(l.tag));
  if(hasConsulted)return'consulted';
  const hasStuck=userLogs.some(l=>l.tag==='stuck');
  if(hasStuck)return'stuck';
  const hasCountry=!!country;
  if(hasCountry)return'interest';
  return'follow';
}
function getFunnelBadge(l,ubt,nfUsers){
  const key=l.username||l.senderId||'';
  // 미팔로우 사용자
  if(nfUsers&&nfUsers.has(key))return'<span style="color:var(--text-tertiary);">Not following</span>';
  const userLogs=allLogs.filter(x=>(x.username||x.senderId)===(l.username||l.senderId));
  const country=userLogs.find(x=>cleanC(x.country))?.country||'';
  const stage=getUserStage(userLogs,country);
  const colors={consulted:'var(--green)',interest:'var(--cyan)',stuck:'var(--amber)',follow:'var(--red)'};
  const labels={consulted:'Consulted',interest:'Interest',stuck:'Stuck',follow:'Follow'};
  return'<span style="color:'+(colors[stage]||'var(--text-tertiary)')+';">'+(labels[stage]||'')+'</span>';
}
function toggleLogExpand(id,btn){const el=document.getElementById(id);if(!el)return;el.classList.toggle('expanded');btn.textContent=el.classList.contains('expanded')?'Show less':'Show more';}
function pl(){if(lp>0){lp--;renderLogs();}}
function nl(){if((lp+1)*LPP<filteredLogs.length){lp++;renderLogs();}}
function esc(s){const d=document.createElement('div');d.textContent=s||'';return d.innerHTML;}

// ── Review Toggle ──
async function toggleReviewDot(idx){
  if(!allLogs[idx])return;
  const newState=!allLogs[idx].reviewed;
  const username=allLogs[idx].username||allLogs[idx].senderId;
  allLogs.forEach(l=>{if((l.username||l.senderId)===username)l.reviewed=newState;});
  renderLogs();renderTodaySummary(allLogs);
  // 서버 저장 (벌크 — 1회 요청)
  try{
    await fetch('/api/logs/review',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,reviewed:newState})});
  }catch(e){}
}
async function toggleReview(idx){
  if(!allLogs[idx])return;
  const newState=!allLogs[idx].reviewed;
  const username=allLogs[idx].username||allLogs[idx].senderId;
  // 같은 사용자의 전체 로그를 함께 처리
  const promises=[];
  allLogs.forEach((l,i)=>{
    if((l.username||l.senderId)===username){
      l.reviewed=newState;
      promises.push(fetch('/api/logs/review',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({index:i,reviewed:newState})}));
    }
  });
  renderLogs();renderTodaySummary(allLogs);
  await Promise.all(promises);
  // 서버와 동기화 — 로그 다시 fetch
  allLogs=await(await fetch('/api/logs')).json();
  if(!Array.isArray(allLogs))allLogs=[];
  applyFilters();
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
  // 자동 reviewed 처리 — 즉시 UI + 벌크 서버 저장
  let hasUnread=false;
  allLogs.forEach(l=>{if((l.username||l.senderId)===username&&!l.reviewed){l.reviewed=true;hasUnread=true;}});
  if(hasUnread){
    renderTodaySummary(allLogs);renderLogs();
    fetch('/api/logs/review',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,reviewed:true})});
  }
  document.getElementById('modalTitle').textContent='@'+username;
  // Country
  const userLogs=allLogs.filter(l=>l.username===username);
  const country=userLogs.find(l=>cleanC(l.country))?.country||'';
  document.getElementById('modalCountry').textContent=country?shortC(country):'No country';
  // 미팔로우 체크
  const isNotFollow=userLogs.length>0&&userLogs.every(l=>(l.replied||'').includes('[Follow request - not following]'));
  // Purpose 표시
  const pEl=document.getElementById('modalPurpose');
  const hasBiz=userLogs.some(l=>l.tag==='business');
  const hasBooking=userLogs.some(l=>l.tag==='booking');
  if(hasBiz){pEl.textContent='Business';pEl.style.cssText='display:inline;background:rgba(255,140,66,0.12);color:#FF8C42;';}
  else if(!isNotFollow){pEl.innerHTML=(hasBooking?'<span style="background:rgba(61,214,140,0.08);color:var(--green);padding:2px 6px;border-radius:6px;">Skin</span> <span style="background:rgba(91,141,239,0.12);color:#5B8DEF;padding:2px 6px;border-radius:6px;">Booking</span>':'Skin');pEl.style.cssText='display:inline;'+(hasBooking?'':'background:rgba(61,214,140,0.08);color:var(--green);');}
  else{pEl.style.display='none';}
  // Concern tag + Funnel (getUserStage 공용 함수 사용)
  const stage=getUserStage(userLogs,country);
  const skinTags=isNotFollow?[]:userLogs.map(l=>l.tag).filter(t=>t&&!SKIP_TAGS.has(t));
  const bestTag=skinTags[0]||'';
  const cEl=document.getElementById('modalConcern');
  if(bestTag){cEl.textContent=bestTag;cEl.style.display='inline';}else{cEl.style.display='none';}
  const fEl=document.getElementById('modalFunnel');
  if(isNotFollow){
    fEl.textContent='Not following';fEl.style.cssText='display:inline;background:rgba(100,100,100,0.2);color:var(--text-tertiary);';
  }else{
    const stageStyles={consulted:'background:var(--green-soft);color:var(--green);',interest:'background:rgba(74,200,232,0.12);color:var(--cyan);',stuck:'background:rgba(240,178,74,0.12);color:var(--amber);',follow:'background:var(--red-soft);color:var(--red);'};
    const stageLabels={consulted:'Consulted',interest:'Interest only',stuck:'Stuck',follow:'Follow only'};
    fEl.textContent=stageLabels[stage]||'Follow only';
    fEl.style.cssText='display:inline;'+(stageStyles[stage]||stageStyles.follow);
  }
  // Booked/VIP/Pause state
  const pd=patientData[username]||{};
  document.getElementById('modalBookedBtn').className='log-action-btn'+(pd.booked?' active':'');
  document.getElementById('modalBookedBtn').textContent=pd.booked?'Booked ✓':'Booked';
  document.getElementById('modalBookedBtn').style.cssText=pd.booked?'background:#E879F9;color:#fff;border-color:#E879F9;':'';
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
  hist.innerHTML=[...userLogs].reverse().map(l=>{
    const isDr=l.tag==='direct'&&!l.received;
    const tagLabel=l.tag&&l.tag!=='direct'?' · '+l.tag:'';
    if(isDr) return \`<div style="margin-bottom:10px;">
      <div style="font-size:10px;color:var(--accent);margin-bottom:4px;">\${timeAgo(l.createdAt)} · Dr. reply</div>
      <div class="log-bubble log-bubble-out" style="border-left:3px solid var(--accent);"><div style="font-size:12px;">\${esc(l.replied)}</div></div>
    </div>\`;
    return \`<div style="margin-bottom:10px;">
      <div style="font-size:10px;color:var(--text-tertiary);margin-bottom:4px;">\${timeAgo(l.createdAt)}\${tagLabel}</div>
      \${l.received?'<div class="log-bubble log-bubble-in" style="margin-bottom:4px;"><div style="font-size:12px;">'+esc(l.received)+'</div></div>':''}
      \${l.replied?'<div class="log-bubble log-bubble-out"><div style="font-size:12px;">'+esc(l.replied)+'</div></div>':''}
    </div>\`;
  }).join('')||'<p class="empty">No conversation history.</p>';
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
async function toggleModalBooked(){
  if(!patientData[currentModalUser])patientData[currentModalUser]={};
  patientData[currentModalUser].booked=!patientData[currentModalUser].booked;
  await fetch('/api/patients',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(patientData)});
  openPatient(currentModalUser,currentModalSenderId);renderTodaySummary(allLogs);renderLogs();
  toast(patientData[currentModalUser].booked?'@'+currentModalUser+' marked as Booked':'@'+currentModalUser+' booking removed');
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
  const res=await fetch('/api/reply',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({senderId:currentModalSenderId,username:currentModalUser,message:msg})});
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
function toggleTheme(){
  document.documentElement.classList.toggle('light');
  const isLight=document.documentElement.classList.contains('light');
  localStorage.setItem('drsean_theme',isLight?'light':'dark');
  // 캐시 초기화 + 차트 다시 그리기
  homeOk=false;anaOk=false;
  const activeTab=document.querySelector('.section.active')?.id?.replace('sec-','');
  if(activeTab==='home')loadHome();
  if(activeTab==='analytics')loadAnalytics();
  if(activeTab==='insights')loadInsights();
  const tl=document.getElementById('themeLabel');
  if(tl)tl.textContent=isLight?'Light':'Dark';
}
// 저장된 테마 복원
if(localStorage.getItem('drsean_theme')==='light'){document.documentElement.classList.add('light');}
(function(){const tl=document.getElementById('themeLabel');if(tl)tl.textContent=document.documentElement.classList.contains('light')?'Light':'Dark';})();
function logout(){localStorage.removeItem('drsean_user');localStorage.removeItem('drsean_name');localStorage.removeItem('drsean_auth');location.replace('/');}

// ── Notification Polling ──
let lastLogCount=0;
let notifItems=[];
let notifCleared=false;
function openNotifPanel(){
  const p=document.getElementById('notifPanel');
  p.style.display=p.style.display==='none'?'':'none';
}
function clearNotifs(){
  notifItems=[];
  notifCleared=true;
  localStorage.setItem('drsean_notif_cleared_at',new Date().toISOString());
  document.getElementById('notifList').innerHTML='<div style="text-align:center;padding:20px;font-size:11px;color:var(--text-tertiary);">No new messages</div>';
  document.getElementById('notifBadge').style.display='none';
  document.getElementById('notifPanel').style.display='none';
}
document.addEventListener('click',function(e){
  const p=document.getElementById('notifPanel');
  if(p.style.display!=='none'&&!p.contains(e.target)&&!e.target.closest('[title="Notifications"]'))p.style.display='none';
});
async function pollNewDMs(){
  if(!isNotifOn())return;
  try{
    const r=await fetch('/api/logs');const logs=await r.json();
    if(!Array.isArray(logs))return;
    if(lastLogCount===0){
      lastLogCount=logs.length;
      const clearedAt=localStorage.getItem('drsean_notif_cleared_at');
      if(notifCleared||clearedAt)return;
      // 초기 로드: humanRequest 환자 알림에 추가
      try{
        await loadPatientData();
        Object.entries(patientData).forEach(([k,v])=>{
          if(!v.humanRequest||!v.paused)return;
          const ul=logs.find(l=>l.username===k);
          notifItems.push({username:k,msg:'Requested to talk to Dr. Sean',time:v.humanRequestAt||new Date().toISOString(),senderId:ul?.senderId||'',isPaused:true});
        });
        if(notifItems.length){
          document.getElementById('notifBadge').style.display='';
          const list=document.getElementById('notifList');
          list.innerHTML=notifItems.map(n=>{
            const ago=Math.round((Date.now()-new Date(n.time))/(1000*60));
            const agoStr=ago<1?'now':ago<60?ago+'m':Math.round(ago/60)+'h';
            const bg=n.isPaused?'rgba(240,100,100,0.08)':'var(--bg)';
            const ac=n.isPaused?'var(--red)':'var(--accent)';
            return '<div onclick="goToPatient(&quot;'+esc(n.username)+'&quot;,&quot;'+esc(n.senderId)+'&quot;);document.getElementById(&quot;notifPanel&quot;).style.display=&quot;none&quot;" style="display:flex;align-items:center;gap:8px;padding:8px;background:'+bg+';border-radius:8px;cursor:pointer;"><div style="width:28px;height:28px;border-radius:50%;background:'+ac+'20;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:11px;font-weight:700;color:'+ac+';">'+esc(n.username.charAt(0).toUpperCase())+'</div><div style="min-width:0;flex:1;"><div style="font-size:11px;font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">@'+esc(n.username)+(n.isPaused?' <span style="color:var(--red);font-size:9px;">Needs you</span>':'')+'</div><div style="font-size:10px;color:var(--text-tertiary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+esc(n.msg)+'</div></div><div style="font-size:9px;color:var(--text-tertiary);flex-shrink:0;">'+agoStr+'</div></div>';
          }).join('');
        }
      }catch(e){}
      return;
    }
    const newCount=logs.length-lastLogCount;
    if(newCount<=0){lastLogCount=logs.length;return;}
    notifCleared=false;localStorage.removeItem('drsean_notif_cleared_at');  // 새 DM 오면 clear 리셋
    const newLogs=logs.slice(0,newCount);
    lastLogCount=logs.length;
    // 알림 아이템 추가
    newLogs.forEach(l=>{
      if(l.tag==='direct')return;  // 직접 답장 제외
      const isPaused=l.tag==='paused'||(l.replied||'').includes('Bot paused')||(l.replied||'').includes('get Dr. Sean');
      const label=isPaused?'Wants direct consultation':'New DM';
      notifItems.unshift({username:l.username||'Unknown',msg:isPaused?'Requested to talk to Dr. Sean':(l.received||'').substring(0,50),time:l.createdAt||new Date().toISOString(),senderId:l.senderId||'',isPaused});
    });
    if(notifItems.length>20)notifItems=notifItems.slice(0,20);
    // UI 업데이트
    const badge=document.getElementById('notifBadge');
    const list=document.getElementById('notifList');
    if(notifItems.length){
      badge.style.display='';
      list.innerHTML=notifItems.map(n=>{
        const ago=Math.round((Date.now()-new Date(n.time))/(1000*60));
        const agoStr=ago<1?'now':ago<60?ago+'m':Math.round(ago/60)+'h';
        const bg=n.isPaused?'rgba(240,100,100,0.08)':'var(--bg)';
        const ac=n.isPaused?'var(--red)':'var(--accent)';
        return '<div onclick="goToPatient(&quot;'+esc(n.username)+'&quot;,&quot;'+esc(n.senderId)+'&quot;);document.getElementById(&quot;notifPanel&quot;).style.display=&quot;none&quot;" style="display:flex;align-items:center;gap:8px;padding:8px;background:'+bg+';border-radius:8px;cursor:pointer;"><div style="width:28px;height:28px;border-radius:50%;background:'+ac+'20;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:11px;font-weight:700;color:'+ac+';">'+esc(n.username.charAt(0).toUpperCase())+'</div><div style="min-width:0;flex:1;"><div style="font-size:11px;font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">@'+esc(n.username)+(n.isPaused?' <span style="color:var(--red);font-size:9px;">Needs you</span>':'')+'</div><div style="font-size:10px;color:var(--text-tertiary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+esc(n.msg)+'</div></div><div style="font-size:9px;color:var(--text-tertiary);flex-shrink:0;">'+agoStr+'</div></div>';
      }).join('');
    }
    // 브라우저 알림
    if(newLogs.length&&Notification.permission==='granted'){
      const first=newLogs[0];
      const isPaused=first.tag==='paused'||(first.replied||'').includes('get Dr. Sean');
      const title=isPaused?'Dr.sean — Patient needs you!':'Dr.sean — New DM';
      const body=isPaused?'@'+(first.username||'Unknown')+' wants to talk to Dr. Sean directly':'@'+(first.username||'Unknown')+': '+(first.received||'').substring(0,60);
      new Notification(title,{body,icon:'/favicon.svg'});
    }
  }catch(e){}
}
// 알림 on/off
function isNotifOn(){return localStorage.getItem('drsean_notif')!=='off';}
function updateNotifLabel(){
  const el=document.getElementById('notifToggleLabel');
  if(!el)return;
  const on=isNotifOn();
  el.textContent=on?'On':'Off';
  el.style.color=on?'var(--green)':'var(--text-tertiary)';
  el.style.background=on?'rgba(61,214,140,0.1)':'var(--bg)';
}
function toggleNotifSetting(){
  const on=isNotifOn();
  if(on){
    localStorage.setItem('drsean_notif','off');
    toast('Notifications off');
  }else{
    localStorage.removeItem('drsean_notif');
    if('Notification' in window&&Notification.permission==='default')Notification.requestPermission();
    toast('Notifications on');
  }
  updateNotifLabel();
}
setTimeout(updateNotifLabel,500);

// ── Session ──
if(!localStorage.getItem('drsean_user'))location.replace('/');
(async()=>{
  try{ await Promise.all([loadConfig(),loadStatus()]); }catch(e){ console.error('Init error:',e); }
  // 저장된 탭 복원
  const savedTab=localStorage.getItem('drsean_tab')||'home';
  switchTab(savedTab,null);
  document.querySelector('.content').classList.add('loaded');
  // 초기 로그 카운트 설정 + 폴링 시작
  await pollNewDMs();
  setInterval(pollNewDMs,30000);
})();
<\/script>
</body>
</html>`;
