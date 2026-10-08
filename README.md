# 维基百科词条抓取

通过 MediaWiki API 抓取维基百科词条的结构化数据。

## 内容

| 文件 | 说明 |
|---|---|
| `wiki_scraper.mjs` | 抓取脚本（零依赖，Node 18+） |
| `ChatGPT.*` | 词条 ChatGPT 的抓取结果 |
| `DeepSeek-R1.*` | 词条 DeepSeek-R1 的抓取结果 |
| `tools/sync-git-proxy.mjs` | 自动同步系统代理到 git 配置 |
| `hooks/pre-push` | push 前自动同步代理 |

## 用法

    node wiki_scraper.mjs <词条> [语言代码] [输出目录]
    node wiki_scraper.mjs ChatGPT zh .

产出 `<词条>.json`、`-infobox.csv`、`-sections.csv`、`-references.csv`、`<词条>.md`。

## 代理

抓取脚本自动读取系统代理（Windows 上为 `HKCU\...\Internet Settings`）。
Node 的代理支持必须在进程启动前配置，因此脚本会带好环境变量**自我重启**一次。
可用 `WIKI_PROXY` 覆盖；置为空字符串则强制直连。

git 侧代理由 `tools/sync-git-proxy.mjs` 同步：

    node tools/sync-git-proxy.mjs

- 检测到系统代理 → 写入本仓库的 `http.proxy` / `https.proxy`
- 没有系统代理 → 清除这两项，走直连

仓库启用了 `core.hooksPath=hooks`，`pre-push` 会在推送前自动同步一次。

## 数据结构

`<词条>.json` 的字段：

- `page` — pageid、标题、最后编辑者与时间、字节数
- `infobox` — 信息框字段（解析自 MediaWiki 渲染后的 HTML 表格）
- `sections` — 章节层级与纯文本
- `references` — 参考资料（标题 / 来源 / 日期 / 链接）
- `categories` / `languages` / `images`
- `plaintext` / `wikitext` — 渲染后纯文本与原始 wikitext
- `stats` — 各项计数

## 说明

中文维基上 `DeepSeek-R1` 是独立词条；英文维基上它只是重定向（指向 `DeepSeek#R1`）。

## 推送到 GitHub

远程为 `git@github.com:qiantaimuhou/dsh-.git`，走 SSH。

- GitHub 的 22 端口在本机被挡，配置中改走 `ssh.github.com:443`
- SSH 配置与密钥放在 `D:\dsh-ssh\`（纯 ASCII 路径；中文用户名会让 Git 自带的 ssh 解析不了配置）
- git 已设 `core.sshCommand` 指向该配置，直接 `git push` 即可

```
git push origin main
```
