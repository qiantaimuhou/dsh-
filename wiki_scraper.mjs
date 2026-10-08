#!/usr/bin/env node
/* wiki_scraper.mjs —— 维基百科词条抓取脚本
 *
 * 用法: node wiki_scraper.mjs [词条] [语言代码] [输出目录]
 *   例: node wiki_scraper.mjs DeepSeek-R1 zh .
 *
 * 代理: 脚本自动读取系统代理(HKCU Internet Settings)。
 *       Node 的代理支持必须在进程启动前配置，所以脚本会带好环境变量自我重启。
 *       可用 WIKI_PROXY 显式指定，置为空字符串则强制直连。
 *
 * 输出: <词条>.json / -infobox.csv / -sections.csv / -references.csv / .md
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const TITLE = process.argv[2] || 'DeepSeek-R1';
const LANG = process.argv[3] || 'zh';
const OUTDIR = process.argv[4] || '.';
const UA = 'wiki-scraper/1.0 (personal research)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------------- 代理：必要时自我重启 ---------------- */

function detectProxy() {
  if (process.env.WIKI_PROXY !== undefined) return process.env.WIKI_PROXY;
  try {
    const out = execSync('reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyServer', { encoding: 'utf8' });
    const m = out.match(/ProxyServer\s+REG_SZ\s+(\S+)/);
    if (m) {
      const v = m[1].trim();
      return /^https?:\/\//.test(v) ? v : 'http://' + v;
    }
  } catch (e) { /* 无系统代理 */ }
  return '';
}

const PROXY = detectProxy();

if (process.env.DSH_WIKI_RELAUNCH !== '1' && process.env.NODE_USE_ENV_PROXY !== '1' && PROXY) {
  const env = { ...process.env };
  env.SystemRoot = env.SystemRoot || 'C:\\Windows';
  env.PATH = env.PATH || ('C:\\Windows\\System32;' + path.dirname(process.execPath));
  env.NODE_USE_ENV_PROXY = '1';
  env.HTTPS_PROXY = PROXY;
  env.HTTP_PROXY = PROXY;
  env.NO_PROXY = 'localhost,127.0.0.1';
  env.DSH_WIKI_RELAUNCH = '1';
  const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), ...process.argv.slice(2)], { stdio: 'inherit', env: env });
  process.exit(r.status === null ? 1 : r.status);
}

/* ---------------- 带重试与限流退避的 API ---------------- */

async function api(params, host) {
  const h = host || (LANG + '.wikipedia.org');
  const url = 'https://' + h + '/w/api.php?' + params;
  let lastErr = null;
  for (let i = 0; i < 8; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(45000) });
      if (r.status === 429) {
        const wait = Math.min(parseInt(r.headers.get('retry-after') || '10', 10) * 1000, 60000);
        console.log('    [rate limited] waiting ' + Math.round(wait / 1000) + 's');
        await sleep(wait);
        continue;
      }
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return JSON.parse(await r.text());
    } catch (e) {
      lastErr = e;
      await sleep(Math.min(1000 * (i + 1), 8000));
    }
  }
  throw new Error('request failed: ' + url + ' -> ' + (lastErr ? lastErr.message : 'unknown'));
}

/* ---------------- 解析 ---------------- */

function splitTopLevel(s) {
  const out = [];
  let db = 0, dk = 0, cur = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '{') db++;
    else if (ch === '}') db--;
    else if (ch === '[') dk++;
    else if (ch === ']') dk--;
    if (ch === '|' && db === 0 && dk === 0) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function unescapeHtml(s) {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (m, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (m, d) => String.fromCharCode(Number(d)))
    .replace(/[\u200b-\u200f\u202a-\u202e\ufeff]/g, '');
}

function stripHtml(s) {
  return unescapeHtml(
    s.replace(/<style[\s\S]*?<\/style>/gi, '')
     .replace(/<sup[\s\S]*?<\/sup>/gi, '')
     .replace(/<[^>]+>/g, '')
  ).replace(/\s+/g, ' ').trim();
}

function extractInfoboxFromHtml(html) {
  const start = html.search(/<table[^>]*class="[^"]*\binfobox\b/i);
  if (start === -1) return {};
  const tagRe = /<\/?table\b[^>]*>/gi;
  tagRe.lastIndex = start;
  let depth = 0, end = -1, m;
  while ((m = tagRe.exec(html))) {
    if (m[0][1] === '/') { depth--; if (depth === 0) { end = tagRe.lastIndex; break; } }
    else depth++;
  }
  if (end === -1) return {};
  const table = html.slice(start, end);
  const fields = {};
  const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let r;
  while ((r = rowRe.exec(table))) {
    const row = r[1];
    if (/<table/i.test(row)) continue;
    const th = row.match(/<th[^>]*>([\s\S]*?)<\/th>/i);
    const td = row.match(/<td[^>]*>([\s\S]*?)<\/td>/i);
    if (th && td) {
      const k = stripHtml(th[1]);
      const v = stripHtml(td[1]);
      if (k && v && k !== v) fields[k] = v;
    }
  }
  return fields;
}

function extractReferences(wikitext) {
  const refs = [];
  const seen = new Set();
  const re = /<ref[^>]*>([\s\S]*?)<\/ref>/gi;
  let m;
  while ((m = re.exec(wikitext))) {
    const cite = m[1].match(/\{\{\s*(?:[Cc]ite|citation)[^|}]*\|([\s\S]*?)\}\}\s*$/);
    if (!cite) continue;
    const params = {};
    for (const p of splitTopLevel(cite[1])) {
      const i = p.indexOf('=');
      if (i > 0) params[p.slice(0, i).trim().toLowerCase()] = p.slice(i + 1).trim();
    }
    const clean = (v) => (v || '')
      .replace(/\{\{!\}\}/g, '|')
      .replace(/\{\{[^{}]*\}\}/g, '')
      .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
      .replace(/\[\[([^\]]+)\]\]/g, '$1')
      .replace(/'''?/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    const title = clean(params.title || params['trans-title'] || '');
    const url = (params.url || params['archive-url'] || '').trim();
    if (!title && !url) continue;
    const key = title + '|' + url;
    if (seen.has(key)) continue;
    seen.add(key);
    refs.push({
      title: title,
      url: url,
      publisher: clean(params.website || params.work || params.publisher || ''),
      date: (params.date || '').trim(),
      accessDate: (params['access-date'] || '').trim(),
      language: (params.language || '').trim()
    });
  }
  return refs;
}

function splitSections(text) {
  const re = /^(={2,6})\s*(.+?)\s*\1\s*$/gm;
  const marks = [];
  let m;
  while ((m = re.exec(text))) marks.push({ level: m[1].length, title: m[2].trim(), start: m.index, bodyStart: re.lastIndex });
  const out = [];
  if (marks.length && marks[0].start > 0) {
    const lead = text.slice(0, marks[0].start).trim();
    if (lead) out.push({ level: 0, title: '导语', plaintext: lead });
  }
  marks.forEach((mk, i) => {
    const end = i + 1 < marks.length ? marks[i + 1].start : text.length;
    out.push({ level: mk.level, title: mk.title, plaintext: text.slice(mk.bodyStart, end).trim() });
  });
  return out;
}

const csvEsc = (v) => '"' + String(v === undefined || v === null ? '' : v).replace(/"/g, '""').replace(/\r?\n/g, ' ') + '"';
const csvRow = (arr) => arr.map(csvEsc).join(',');

/* ---------------- 主流程 ---------------- */

async function main() {
  const t = encodeURIComponent(TITLE);
  console.log('代理: ' + (PROXY || '(直连)'));

  // 单次 query 合并 info / revisions / categories / langlinks / extracts，减少请求数以免触发限流
  const q = await api('action=query&titles=' + t + '&prop=info|revisions|categories|langlinks|extracts&rvprop=content|timestamp|user|size|comment&rvslots=main&explaintext=1&cllimit=max&lllimit=max&inprop=url|displaytitle&format=json&formatversion=2&redirects=1');
  const page = q.query && q.query.pages ? q.query.pages[0] : null;
  if (!page || page.missing) throw new Error('page not found: ' + TITLE);
  const resolved = page.title;
  const rt = encodeURIComponent(resolved);
  const rev = page.revisions && page.revisions[0] ? page.revisions[0] : {};
  const wikitext = (rev.slots && rev.slots.main && rev.slots.main.content) || '';
  const plaintext = page.extract || '';
  const categories = (page.categories || []).map((c) => c.title);
  const langlinks = (page.langlinks || []).map((l) => ({ lang: l.lang, title: l.title }));
  console.log('[1/5] page: ' + resolved + ' (pageid=' + page.pageid + ', ' + page.length + ' bytes)');
  console.log('[2/5] categories=' + categories.length + ' langlinks=' + langlinks.length + ' wikitext=' + wikitext.length + ' plaintext=' + plaintext.length);

  await sleep(1500);

  // 单次 parse 合并 sections + HTML
  const ph = await api('action=parse&page=' + rt + '&prop=sections|text&format=json&redirects=1');
  const sectionsMeta = ((ph.parse && ph.parse.sections) || []).map((s) => ({ index: Number(s.index), level: Number(s.level), title: s.line, anchor: s.anchor }));
  const html = (ph.parse && ph.parse.text && ph.parse.text['*']) || '';

  const infobox = extractInfoboxFromHtml(html);
  console.log('[3/5] html=' + html.length + ' infobox=' + Object.keys(infobox).length + ' fields');

  const references = extractReferences(wikitext);
  const allSections = splitSections(plaintext);
  const lead = (allSections.length && allSections[0].level === 0) ? allSections.shift().plaintext : '';
  const parsedSections = allSections;
  const refs = (wikitext.match(/<ref/g) || []).length;
  const images = Array.from(new Set(Array.from(wikitext.matchAll(/\[\[(?:File|文件|檔案|Image):([^\]|]+)/gi)).map((m) => m[1].trim())));
  console.log('[4/5] refs=' + refs + ' parsedRefs=' + references.length + ' images=' + images.length);

  const result = {
    scrapedAt: new Date().toISOString(),
    source: { site: LANG + '.wikipedia.org', url: page.fullurl, proxy: PROXY || '(direct)' },
    page: {
      pageid: page.pageid,
      title: resolved,
      displayTitle: page.displaytitle,
      language: page.pagelanguage,
      lengthBytes: page.length,
      lastRevId: page.lastrevid,
      lastEdited: rev.timestamp,
      lastEditor: rev.user,
      lastComment: rev.comment,
      touched: page.touched
    },
    stats: {
      sectionCount: sectionsMeta.length,
      referenceCount: refs,
      parsedReferenceCount: references.length,
      categoryCount: categories.length,
      languageCount: langlinks.length,
      imageCount: images.length,
      wikitextChars: wikitext.length,
      plaintextChars: plaintext.length
    },
    infobox: infobox,
    references: references,
    categories: categories,
    languages: langlinks,
    images: images,
    sections: parsedSections,
    lead: lead,
    plaintext: plaintext,
    wikitext: wikitext
  };

  fs.mkdirSync(OUTDIR, { recursive: true });
  const base = path.join(OUTDIR, resolved.replace(/[\\/:*?"<>|]/g, '_'));

  fs.writeFileSync(base + '.json', JSON.stringify(result, null, 2), 'utf8');

  const secCsv = ['index,level,title,anchor,plaintextLen']
    .concat(sectionsMeta.map((s, i) => csvRow([i + 1, s.level, s.title, s.anchor, (parsedSections[i] ? parsedSections[i].plaintext : '').length])))
    .join('\n');
  fs.writeFileSync(base + '-sections.csv', '\uFEFF' + secCsv, 'utf8');

  const infoCsv = ['field,value'].concat(Object.entries(infobox).map(([k, v]) => csvRow([k, v]))).join('\n');
  fs.writeFileSync(base + '-infobox.csv', '\uFEFF' + infoCsv, 'utf8');

  const refCsv = ['index,title,publisher,date,url']
    .concat(references.map((r, i) => csvRow([i + 1, r.title, r.publisher, r.date, r.url])))
    .join('\n');
  fs.writeFileSync(base + '-references.csv', '\uFEFF' + refCsv, 'utf8');

  const mdLines = [
    '# ' + resolved,
    '',
    '> 来源: ' + page.fullurl,
    '> 抓取时间: ' + result.scrapedAt,
    '> 最后编辑: ' + rev.timestamp + ' by ' + rev.user,
    '> 引用: ' + refs + ' 条 | 分类: ' + categories.length + ' | 其他语言: ' + langlinks.length,
    '',
    '## 信息框',
    ''
  ];
  for (const [k, v] of Object.entries(infobox)) mdLines.push('- **' + k + '**: ' + v);
  mdLines.push('', '## 正文', '');
  for (const s of parsedSections) mdLines.push('#'.repeat(Math.min(s.level, 6)) + ' ' + s.title, '', s.plaintext, '');
  mdLines.push('', '## 参考资料', '');
  references.forEach((r, i) => mdLines.push((i + 1) + '. ' + r.title + (r.publisher ? ' — ' + r.publisher : '') + (r.date ? ' (' + r.date + ')' : '') + (r.url ? ' <' + r.url + '>' : '')));
  fs.writeFileSync(base + '.md', mdLines.join('\n'), 'utf8');

  console.log('[5/5] written: ' + base + '.json / -sections.csv / -infobox.csv / -references.csv / .md');
  console.log('INFOBOX: ' + JSON.stringify(infobox));
}

main().catch((e) => { console.error('FAILED: ' + e.message); process.exit(1); });
