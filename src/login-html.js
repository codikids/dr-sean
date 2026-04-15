export const LOGIN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dr.sean — Login</title>
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
<style>
  :root {
    --bg: #090B14; --surface: #161A2B; --border: rgba(140,155,200,0.08); --border-strong: rgba(140,155,200,0.15);
    --text: #ECEEF4; --text-secondary: #A0A8C0; --text-tertiary: #6B7394;
    --accent: #5B8DEF; --accent-dark: #4A7DE0; --accent-soft: rgba(91,141,239,0.12); --accent-glow: rgba(91,141,239,0.25);
    --red: #F06464;
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family:'Inter',system-ui,-apple-system,sans-serif; background:var(--bg); color:var(--text);
    min-height:100vh; min-height:100dvh; display:flex; align-items:center; justify-content:center;
    -webkit-font-smoothing:antialiased;
  }
  .login-card {
    background:var(--surface); border:1px solid var(--border); border-radius:20px;
    padding:44px 32px; width:100%; max-width:360px; margin:0 16px;
    box-shadow:0 12px 40px rgba(0,0,0,0.3);
  }
  .logo { text-align:center; margin-bottom:6px; }
  .logo svg { width:44px; height:44px; }
  .brand { text-align:center; font-size:22px; font-weight:800; letter-spacing:-0.5px; margin-bottom:4px; }
  .brand span { color:var(--accent); }
  .sub { text-align:center; font-size:12px; color:var(--text-tertiary); font-weight:500; letter-spacing:0.5px; text-transform:uppercase; margin-bottom:36px; }
  .field { margin-bottom:16px; }
  .field label { display:block; font-size:11px; font-weight:700; letter-spacing:0.5px; text-transform:uppercase; color:var(--text-tertiary); margin-bottom:6px; }
  .field select, .field input {
    width:100%; padding:12px 14px; background:var(--bg); border:1.5px solid var(--border-strong);
    border-radius:10px; color:var(--text); font-size:15px; font-family:'Inter',sans-serif;
    font-weight:500; outline:none; transition:all 0.2s; -webkit-appearance:none; appearance:none;
  }
  .field select {
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7394' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat:no-repeat; background-position:right 14px center; padding-right:36px; cursor:pointer;
  }
  .field select option { background:var(--surface); color:var(--text); }
  .field input:focus, .field select:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-soft); }
  .field input.input-error { border-color:var(--red); background:rgba(240,100,100,0.04); }
  .field input::placeholder { color:#8A94B0; }
  .error { color:var(--red); font-size:12px; font-weight:600; text-align:center; min-height:18px; margin-bottom:8px; }
  .login-btn {
    width:100%; padding:13px; background:var(--accent); color:#fff; border:none; border-radius:10px;
    font-size:15px; font-weight:700; font-family:'Inter',sans-serif; cursor:pointer; transition:all 0.15s;
    letter-spacing:-0.1px;
  }
  .login-btn:hover { background:var(--accent-dark); transform:translateY(-2px); box-shadow:0 8px 24px var(--accent-glow); }
  .login-btn:active { transform:translateY(0); }
  .login-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
  .login-btn:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
  body { opacity:0; animation:fadeIn 0.3s ease forwards; }
  @keyframes fadeIn { to { opacity:1; } }
  @media(max-width:380px) { .login-card { padding:36px 24px; } }
</style>
</head>
<body>
<div class="login-card">
  <div class="logo">
    <svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="20" fill="#161A2B" stroke="#5B8DEF" stroke-width="1.5"/><path d="M22 10C18.5 15.5 13 17.5 13 23C13 28.5 17 32 22 32C27 32 31 28.5 31 23C31 17.5 25.5 15.5 22 10Z" fill="#5B8DEF" opacity="0.15"/><path d="M22 14C19.5 17.5 17 19.5 17 23C17 26.5 19 29 22 29C25 29 27 26.5 27 23C27 19.5 24.5 17.5 22 14Z" fill="#5B8DEF"/></svg>
  </div>
  <div class="brand">Dr.<span>sean</span></div>
  <div class="sub">Skin Consultation Platform</div>
  <form onsubmit="return doLogin(event)">
    <div class="field"><label>User</label><select id="loginUser"><option value="">Select user</option><option value="sihyun">Sihyun Kim</option><option value="minkyung">Minkyung Jung</option></select></div>
    <div class="field"><label>Password</label><input type="password" id="loginPw" placeholder="Dashboard password" autocomplete="current-password"></div>
    <div class="error" id="loginError"></div>
    <button type="submit" class="login-btn" id="loginBtn">Login</button>
  </form>
</div>
<script>
if(localStorage.getItem('drsean_auth'))location.replace('/dashboard');
const U={sihyun:'Sihyun Kim',minkyung:'Minkyung Jung'};
async function doLogin(e){
  e.preventDefault();
  const uid=document.getElementById('loginUser').value,pw=document.getElementById('loginPw').value,err=document.getElementById('loginError'),btn=document.getElementById('loginBtn');
  if(!uid){err.textContent='Please select a user.';return false;}
  if(!pw){err.textContent='Please enter the password.';return false;}
  btn.disabled=true;btn.textContent='Checking…';err.textContent='';
  try{
    const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw})});
    const d=await r.json();
    if(r.ok&&d.ok){
      localStorage.setItem('drsean_auth',d.token);
      localStorage.setItem('drsean_user',uid);
      localStorage.setItem('drsean_name',U[uid]||uid);
      location.replace('/dashboard');
    } else {
      err.textContent='Incorrect password.';
      const p=document.getElementById('loginPw');p.value='';p.classList.add('input-error');
      p.addEventListener('input',()=>p.classList.remove('input-error'),{once:true});
    }
  }catch(ex){err.textContent='Network error. Please try again.';}
  btn.disabled=false;btn.textContent='Login';
  return false;
}
<\/script>
</body>
</html>`;
