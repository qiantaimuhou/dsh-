#!/usr/bin/env node
/* sync-git-proxy.mjs —— 自动检测系统代理并同步到本仓库的 git 配置
 *
 *   检测到系统代理 -> 写入 http.proxy / https.proxy
 *   没有系统代理   -> 清除这两项，走直连
 *
 * 用法:
 *   node tools/sync-git-proxy.mjs           # 同步并输出结果
 *   node tools/sync-git-proxy.mjs --quiet   # 静默（供 git hook 调用）
 *   GIT_PROXY=http://... node tools/...     # 强制指定代理
 *   GIT_PROXY= node tools/...               # 强制直连
 */

import { execFileSync } from 'node:child_process';

const quiet = process.argv.includes('--quiet');
const log = (...a) => { if (!quiet) console.log(...a); };

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function systemProxy() {
  if (process.env.GIT_PROXY !== undefined) return process.env.GIT_PROXY;

  // 非 Windows: 用常见的环境变量
  if (process.platform !== 'win32') {
    return process.env.HTTPS_PROXY || process.env.https_proxy || '';
  }

  // Windows: 读系统代理设置，并确认它处于启用状态
  try {
    const out = execFileSync('reg', ['query', 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings'], { encoding: 'utf8' });
    const enabled = /ProxyEnable\s+REG_DWORD\s+0x([0-9a-f]+)/i.exec(out);
    const server = /ProxyServer\s+REG_SZ\s+(\S+)/i.exec(out);
    if (!enabled || parseInt(enabled[1], 16) !== 1 || !server) return '';
    const v = server[1].trim();
    return /^https?:\/\//i.test(v) ? v : 'http://' + v;
  } catch {
    return '';
  }
}

const proxy = systemProxy();

if (proxy) {
  git(['config', '--local', 'http.proxy', proxy]);
  git(['config', '--local', 'https.proxy', proxy]);
  log('git 代理已启用: ' + proxy);
} else {
  for (const key of ['http.proxy', 'https.proxy']) {
    try { git(['config', '--local', '--unset', key]); } catch { /* 本来就没设 */ }
  }
  log('未检测到系统代理，git 走直连');
}
