# DeepSeek-R1

> 来源: https://zh.wikipedia.org/wiki/DeepSeek-R1
> 抓取时间: 2026-10-08T10:10:47.487Z
> 最后编辑: 2026-10-05T06:08:37Z by Rcst20
> 引用: 44 条 | 分类: 8 | 其他语言: 3

## 信息框

- **開發者**: 深度求索
- **首次发布**: 2025年1月20日 (2025-01-20)
- **当前版本**: 1.0.0（2025年4月9日；穩定版本）
- **源代码库**: github.com/deepseek-ai/DeepSeek-R1
- **前任**: DeepSeek-R1-Lite
- **繼任**: DeepSeek-V3.1
- **类型**: 大型语言模型 基于转换器的生成式预训练模型 基础模型
- **许可协议**: MIT
- **网站**: www.deepseek.com

## 正文

## 訓練

DeepSeek-R1-Lite是Deepseek R1的預覽版，于2024年11月20日发布，后于2025年1月20日正式发布DeepSeek R1。
DeepSeek-R1与DeepSeek-R1-Zero基于DeepSeek-V3-Base，与其共享了相同的架构。DeepSeek-R1-Distill系列模型由其他预训练的开放权重模型初始化，然后基于R1生成的合成数据进行微调。

DeepSeek-R1-Zero仅使用GRPO强化学习进行训练，未使用SFT。与之前的版本不同，它没有使用基于模型的奖励；所有奖励函数均基于规则，主要分为两种类型 ：准确率奖励和格式奖励。准确率奖励用于检查方框内的答案是否正确或代码是否通过测试。格式奖励用于检查模型是否将其思维轨迹置于<think>...</think>标签内。
DeepSeek-R1的论文中没有公布其训练成本等细节。 不过，此前的论文中，深度求索透露其训练使用的是英伟达因为美国出口管制而，针对中国市场特供的低配版GPU H800，训练成本为557.6万美元，远低于类似西方公司的闭源模型。
外界预估R1的训练成本比DeepSeek-V3略高，或在600万美元上下。

## 衍生型



### DeepSeek-R1-0528

2025年5月28日，深度求索发布DeepSeek-R1-0528，为R1的小版本升级。此版本与原版R1同样基于DeepSeek-V3-Base，并未进行根本性的架构变更，而是通过投入更多算力及在后训练阶段引入算法优化机制，进一步提升了推理深度与推断能力。
在性能方面，R1-0528在AIME 2025测试中的准确率由70%大幅提升至87.5%，每道题的平均思考长度亦由约12,000个token增至约23,000个token，反映出更深层次的推理过程。在编程基准LiveCodeBench上，pass@1成功率由63.5%提升至73.3%；在软件工程基准SWE-Verified上，准确率则由49.2%提升至57.6%。
除性能提升外，R1-0528亦降低了幻觉率，并新增对JSON输出及函数调用的支持，以提升开发者的使用体验。同时，深度求索亦将R1-0528的思维链蒸馏至Qwen3 8B Base，推出了DeepSeek-R1-0528-Qwen3-8B，以便对硬件要求较低的用户使用。

## 特點

DeepSeek稱該模型用了強化學習訓練，並為用户展現了 o1 没有公开的完整思考过程。
Deepseek R1 Lite在回答問題前會花更多時間思考，因此準確度會增強。Deepseek的測試結果表明，在數學競賽上的得分與測驗所允許思考的長度緊密相關，而模型思維鍊長度增加，展現了更高的效率。
DeepSeek-R1關鍵特點就是便宜，與OpenAI o1的價格相差極大。DeepSeek-R1上线时提供的API服务定价为每百万输入tokens 1元人民幣 / 4元 ，每百万输出tokens 16元，输出API价格仅仅只有OpenAI o1的3%。

## 測試成績

Deepseek-R1-Lite在數學、代碼和複雜邏輯推理上，獲得媲美 o1-preview 的推理效果。
在美国数学邀请赛中，DeepSeek 稱，該模型在美國邀請數學考試和 MATH 等既定基準上的表現超過了 OpenAI o1 Preview的水平，在國際數學奧林匹克正確率達到83%，
它還在Codeforces編程競賽中優於89%的參賽者，但在GPQA Diamond，LiveCodeBench和自然語言解謎中較為遜色。

## 應用情況

DeepSeek-R1使用MIT协议开源，意味着任何人都可以自由使用该模型，包括商业用途。
用户可以在DeepSeek官方网站和App使用官方提供的服務，也可通过本地部署、调用API，或者使用第三方平台。

### 公共服务

2025年2月起，中国多地政府部门相继将DeepSeek接入政务服务系统，用于公文写作、政策解读等方面。
2025年2月8日，广东省深圳市龙岗区政务服务和数据管理局就已经在政务外网部署了DeepSeek-R1模型。
2025年2月16日，深圳市正式为全市各区及各部门提供DeepSeek模型应用服务；其中，福田区基于DeepSeek开发了首批70名AI「数智员工」。
2025年2月17日，佛山市「江义村智慧乡村平台」正式接入DeepSeek。
2025年2月18日，北京市丰台区在政务云本地部署DeepSeek大模型。

### 其他

瀋陽飛機設計研究所在研發新戰機的過程中，引入了DeepSeek。
多家汽車製造商，包括BMW、東風汽車、比亞迪、廣汽、零跑、本田、日產，宣佈與DeepSeek合作，將其AI系統和中國版汽車結合。
在2025年緬甸地震的救援行動中，中國國家緊急語言服務團與北京語言大學團隊基於DeepSeek的大模型，研發中緬英互譯系統，支援中國國際救援隊進行救災工作，並在未來開源與其他地區使用。

## 外界反应

1月27日，DeepSeek超越ChatGPT，登顶苹果App Store美国区免费APP下载排行榜。
DeepSeek-R1爆火，引发全球投资者大量抛售人工智能相关股票。1月27日，英伟达美股股价下跌近17%，单日市值蒸发5890亿美元，为美国股市历史上最大。
DeepSeek-R1发布后不久，Meta首席执行官马克·扎克伯格就宣布，Meta计划在2025年投入超600亿美元，加大对人工智能的投入。据媒体1月27日报道，Meta成立了四个研究小组，专门研究DeepSeek的模型。其中两个小组研究其开发者如何降低训练和运行DeepSeek的成本，第三个小组研究训练模型可能使用了哪些数据，第四个小组研究基于DeepSeek模型属性重构其LLaMA模型的新技术。
OpenAI表示，其有证据表明DeepSeek使用OpenAI的专有模型来训练自己的开源模型，这违反了OpenAI的服务条款。在R1的Nature论文释出的同行评议文件中，DeepSeek-R1的研究人员称，R1 并没有使用OpenAI专有模型生成的样本但同时承认与大多数的生成模型一样，在训练过程中不可避免地使用了互联网上的由其他AI生成样本。

## 参见

DeepSeek-V2.5
DeepSeek V3
DeepSeek-V4
OpenAI o1

## 注释



## 参考资料



## 外部链接



### 官方网页

DeepSeek-R1-Lite 发布 （页面存档备份，存于互联网档案馆）
DeepSeek-R1 发布，性能对标 OpenAI o1 正式版 （页面存档备份，存于互联网档案馆）
deepseek-ai/DeepSeek-R1 （页面存档备份，存于互联网档案馆）

### 媒体专题

【专题】DeepSeek改写AI战局 - 澎湃新闻 （页面存档备份，存于互联网档案馆）


## 参考资料

1. DeepSeek横空出世，美中AI竞争会迎来根本性改变吗？ — 美国之音 (2025-01-28) <https://www.voachinese.com/a/deepseek-china-us-20250127/7952341.html>
2. DeepSeek推理模型预览版上线，解密o1推理过程 | DeepSeek API Docs — api-docs.deepseek.com <https://api-docs.deepseek.com/zh-cn/news/news1120>
3. DeepSeek-R1 发布，性能对标 OpenAI o1 正式版 — DeepSeek API Docs (2025-01-20) <https://api-docs.deepseek.com/zh-cn/news/news250120>
4. Release DeepSeek-R1 · deepseek-ai/DeepSeek-R1@23807ce — GitHub <https://github.com/deepseek-ai/DeepSeek-R1/commit/23807ced51627276434655dd9f27725354818974>
5. DeepSeek-R1 incentivizes reasoning in LLMs through reinforcement learning — Springer Science and Business Media LLC (2025-09-17)
6. DeepSeek-R1/DeepSeek_R1.pdf at main · deepseek-ai/DeepSeek-R1 <https://github.com/deepseek-ai/DeepSeek-R1/blob/main/DeepSeek_R1.pdf>
7. DeepSeek-V3/DeepSeek_V3.pdf at main · deepseek-ai/DeepSeek-V3 <https://github.com/deepseek-ai/DeepSeek-V3/blob/main/DeepSeek_V3.pdf>
8. 量化巨头幻方创始人梁文锋参加总理座谈会并发言，他还创办了"AI界拼多多" — 澎湃新闻 (2025-01-22) <https://www.thepaper.cn/newsDetail_forward_29988888>
9. DeepSeek"恐惧感"支配硅谷！Meta被曝组建4个小组专门研究 — 澎湃新闻 (2025-01-27) <https://www.thepaper.cn/newsDetail_forward_30042298>
10. DeepSeek-R1-0528 Release — DeepSeek API Docs (2025-05-28) <https://api-docs.deepseek.com/news/news250528>
11. deepseek-ai/DeepSeek-R1-0528 — Hugging Face <https://huggingface.co/deepseek-ai/DeepSeek-R1-0528>
12. DeepSeek R1-0528 arrives in powerful open source challenge to OpenAI o3 and Google Gemini 2.5 Pro — VentureBeat (2025-05-28) <https://venturebeat.com/ai/deepseek-r1-0528-arrives-in-powerful-open-source-challenge-to-openai-o3-and-google-gemini-2-5-pro/>
13. “价格屠夫”DeepSeek的理想主义：开源、降本与AI普惠 — 财联社 (2025-01-28) <https://www.cls.cn/detail/1931111>
14. DeepSeek’s first reasoning model R1-Lite-Preview turns heads, beating OpenAI o1 performance — VentureBeat (2024-11-20) <https://venturebeat.com/ai/deepseeks-first-reasoning-model-r1-lite-preview-turns-heads-beating-openai-o1-performance/>
15. 多地政务系统接入DeepSeek意味着什么？ — 新华网 <https://www.news.cn/local/20250219/92e940caa34f4f4f8008d6ab1888389d/c.html>
16. 广州、深圳政务系统接入DeepSeek — 新浪新闻 <https://news.sina.com.cn/c/2025-02-16/doc-inekshpa5027464.shtml>
17. 深圳70名“AI公务员”上岗，公文处理、招商引资等场景均有覆盖 — 澎湃新闻 <https://www.thepaper.cn/newsDetail_forward_30184250>
18. 首批“AI公务员”上岗！人类“饭碗”不保？ — 新浪财经 <https://finance.sina.com.cn/tech/2025-02-20/doc-inemarzm4048969.shtml#:~:text=DeepSeek%E8%87%AA%E5%B7%B1%E7%9A%84%E5%9B%9E%E7%AD%94%E6%98%AF%EF%BC%8C%E8%BF%99%E6%98%AF%E4%B8%80%E4%B8%AA%E5%A4%8D%E6%9D%82%E4%B8%94%E5%A4%9A%E7%BB%B4%E7%9A%84%E9%97%AE%E9%A2%98%EF%BC%8C%E6%B6%89%E5%8F%8A%E6%8A%80%E6%9C%AF%E8%BF%9B%E6%AD%A5%E3%80%81%E5%B0%B1%E4%B8%9A%E7%BB%93%E6%9E%84%E3%80%81%E7%A4%BE%E4%BC%9A%E6%94%BF%E7%AD%96%E7%AD%89%E5%A4%9A%E4%B8%AA%E6%96%B9%E9%9D%A2%E3%80%82%20AI%E5%9C%A8%E5%A4%84%E7%90%86%E5%A4%A7%E9%87%8F%E6%95%B0%E6%8D%AE%E3%80%81%E6%89%A7%E8%A1%8C%E9%87%8D%E5%A4%8D%E6%80%A7%E4%BB%BB%E5%8A%A1%E3%80%81%E6%8F%90%E9%AB%98%E6%95%88%E7%8E%87%E5%92%8C%E5%87%8F%E5%B0%91%E9%94%99%E8%AF%AF%E6%96%B9%E9%9D%A2%E5%85%B7%E6%9C%89%E6%98%BE%E8%91%97%E4%BC%98%E5%8A%BF%E3%80%82,%E4%BD%86AI%E7%9B%AE%E5%89%8D%E4%BB%8D%E6%97%A0%E6%B3%95%E5%AE%8C%E5%85%A8%E6%9B%BF%E4%BB%A3%E4%BA%BA%E7%B1%BB%E7%9A%84%E5%88%9B%E9%80%A0%E5%8A%9B%E3%80%81%E6%83%85%E6%84%9F%E6%99%BA%E8%83%BD%E5%92%8C%E5%A4%8D%E6%9D%82%E5%86%B3%E7%AD%96%E8%83%BD%E5%8A%9B%E3%80%82%20%E5%85%AC%E5%8A%A1%E5%91%98%E5%B7%A5%E4%BD%9C%E4%B8%AD%E6%B6%89%E5%8F%8A%E7%9A%84%E8%AE%B8%E5%A4%9A%E4%BB%BB%E5%8A%A1%EF%BC%8C%E5%A6%82%E6%94%BF%E7%AD%96%E5%88%B6%E5%AE%9A%E3%80%81%E5%85%AC%E4%BC%97%E6%B2%9F%E9%80%9A%E3%80%81%E5%8D%B1%E6%9C%BA%E7%AE%A1%E7%90%86%E7%AD%89%EF%BC%8C%E4%BB%8D%E7%84%B6%E9%9C%80%E8%A6%81%E4%BA%BA%E7%B1%BB%E7%9A%84%E5%88%A4%E6%96%AD%E5%92%8C%E5%90%8C%E7%90%86%E5%BF%83%E3%80%82>
19. 深圳福田引入 70 個 AI 公務員 基於 DeepSeek R1、錯誤率5% 內 — 香港 unwire.hk 玩生活．樂科技 (2025-02-17) <https://unwire.hk/2025/02/17/shenzhen-ai-civil-servants/ai/>
20. 佛山“江义村智慧乡村平台”接入DeepSeek — 腾讯网 <https://news.qq.com/rain/a/20250218A05C6H00>
21. 中國引入 DeepSeek 開發新戰機 AI 協助決策系統革新 — 香港 unwire.hk 玩生活．樂科技 (2025-05-06) <https://unwire.hk/2025/05/06/deepseek-aero/ai/>
22. BMW 在中國車款接入 DeepSeek 推動車輛智能化升級 — 香港 unwire.hk 玩生活．樂科技 (2025-04-24) <https://unwire.hk/2025/04/24/bmw-deepseek/ai/>
23. DeepSeek 席捲中國汽車市場 東風、比亞迪、上汽紛紛加入 AI — 香港 unwire.hk 玩生活．樂科技 (2025-03-24) <https://unwire.hk/2025/03/24/deepseek-ai-in-car/ai/>
24. Honda 中國車款接入 DeepSeek 並與 Momenta、寧德時代等中國廠商合作 — 香港 unwire.hk 玩生活．樂科技 (2025-04-24) <https://unwire.hk/2025/04/24/honda-deepseek/life-tech/auto/>
25. 日產 N7 搭載 DeepSeek AI 技術 反攻中國市場 — 香港 unwire.hk 玩生活．樂科技 (2025-02-13) <https://unwire.hk/2025/02/13/nissan-n7-deepseek-ai/life-tech/auto/>
26. DeepSeek 應用緬甸地震救災 7 小時開發中英緬互譯系統 — 香港 unwire.hk 玩生活．樂科技 (2025-04-02) <https://unwire.hk/2025/04/02/7-hours-develop-deepseek-translator/ai/>
27. DeepSeek、衛星+AI、半機械昆蟲 人工智能助力緬甸地震救災 — 香港文匯網 <https://www.wenweipo.com/a/202504/06/AP67f1f58ce4b04c1848ef87c3.html>
28. 緬甸地震︱DeepSeek協助救災 7小時開發中緬英互譯系統 — 星島頭條 (2025-04-02) <https://www.stheadline.com/realtime-china/3443417/%E7%B7%AC%E7%94%B8%E5%9C%B0%E9%9C%87DeepSeek%E5%8D%94%E5%8A%A9%E6%95%91%E7%81%BD-7%E5%B0%8F%E6%99%82%E9%96%8B%E7%99%BC%E4%B8%AD%E7%B7%AC%E8%8B%B1%E4%BA%92%E8%AD%AF%E7%B3%BB%E7%B5%B1>
29. DeepSeek超越ChatGPT，登顶苹果美国区免费APP下载排行榜 — 澎湃新闻 (2025-01-27) <https://www.thepaper.cn/newsDetail_forward_30041291>
30. ナスダック大幅下落 中国企業ディープシーク 生成AI開発受け — NHKニュース (2025-01-28) <https://www3.nhk.or.jp/news/html/20250128/k10014705511000.html>
31. 英伟达市值蒸发近6000亿美元，规模创美股史上最大，市值跌至全球第三 — 华尔街见闻 (2025-01-28) <https://wallstreetcn.com/articles/3740143>
32. Meta Scrambles After Chinese AI Equals Its Own, Upending Silicon Valley — The Information (2024-01-27) <https://www.theinformation.com/articles/meta-scrambles-after-chinese-ai-equals-its-own-upending-silicon-valley>
33. DeepSeek震撼硅谷 Meta组建四个研究小组专门破解 — 财联社 (2025-01-27) <https://www.cls.cn/detail/1930881>
34. OpenAI称有证据表明DeepSeek利用其模型训练竞争对手 — RFI - 法国国际广播电台 (2025-01-29) <https://www.rfi.fr/cn/%E5%9B%BD%E9%99%85/20250129-openai%E7%A7%B0%E6%9C%89%E8%AF%81%E6%8D%AE%E8%A1%A8%E6%98%8Edeepseek%E5%88%A9%E7%94%A8%E5%85%B6%E6%A8%A1%E5%9E%8B%E8%AE%AD%E7%BB%83%E7%AB%9E%E4%BA%89%E5%AF%B9%E6%89%8B>
35. Secrets of DeepSeek AI model revealed in landmark paper (2025-09-17) <https://www.nature.com/articles/d41586-025-03015-6>