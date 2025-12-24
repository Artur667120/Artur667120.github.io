:root {
  --bg: #0f1117;
  --panel: #1c1f26;
  --text: #fff;
  --accent: #667eea;
}

.light {
  --bg: #f4f4f4;
  --panel: #ffffff;
  --text: #000;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: Arial, sans-serif;
}

.app {
  max-width: 1200px;
  margin: auto;
}

.top {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background: var(--panel);
}

.main {
  display: flex;
  gap: 15px;
  padding: 15px;
}

.sidebar {
  width: 220px;
  background: var(--panel);
  border-radius: 12px;
  padding: 15px;
}

.compose-btn {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  background: var(--accent);
  border: none;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}

.menu-item {
  padding: 10px;
  cursor: pointer;
  border-radius: 8px;
}

.menu-item.active {
  background: var(--accent);
}

.content {
  flex: 1;
  display: flex;
  gap: 15px;
}

.emails, .reader {
  background: var(--panel);
  border-radius: 12px;
  padding: 15px;
  flex: 1;
}

.email {
  display: flex;
  gap: 10px;
  padding: 10px;
  cursor: pointer;
}

.email.unread {
  background: rgba(102,126,234,0.2);
}

.avatar {
  width: 32px;
  height: 32px;
  background: var(--accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  position: fixed;
  inset: 0;
  display: none;
  background: rgba(0,0,0,0.5);
  justify-content: center;
  align-items: center;
}

.modal-box {
  background: var(--panel);
  padding: 20px;
  border-radius: 12px;
  width: 300px;
}

.modal-box input,
.modal-box textarea {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
}

.lang {
  position: fixed;
  bottom: 10px;
  right: 10px;
}
