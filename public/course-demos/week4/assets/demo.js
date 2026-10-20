/* ==========================================================================
   COMP6080 Week 4 · 演示页公共脚本
   职责：页面导航 / 目录渲染 / 代码高亮 / 复制按钮 / 日志面板 / 小工具
   注意：本文件只放"脚手架"，教学用的 XHR / fetch / Promise 代码一律写在各页
        自己的 <script> 里，方便学生直接查看源码。
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- 页码表 */
  var PAGES = [
    {
      id: '01',
      file: '01-数据交换格式-JSON.html',
      title: '数据交换格式与 JSON',
      short: '数据交换格式',
      desc: 'JSON / YAML / XML 的取舍，以及 JSON.stringify、JSON.parse 与 localStorage 的配合。',
      tags: ['JSON', 'stringify', 'parse', 'localStorage']
    },
    {
      id: '02',
      file: '02-远程获取数据-XHR.html',
      title: '远程获取数据：XMLHttpRequest',
      short: 'XMLHttpRequest',
      desc: '用 XHR 拉远程接口并动态插入页面，看清 readyState、onload / onerror 与 HTTP 状态码的分工。',
      tags: ['XHR', 'readyState', 'onload / onerror', '状态码']
    },
    {
      id: '03',
      file: '03-fetch-网络请求.html',
      title: 'fetch 与 Response',
      short: 'fetch',
      desc: 'fetch 返回 Promise、只认网络错误，404 不 reject —— 必须自己判 res.ok。',
      tags: ['fetch', 'Response', 'res.ok', 'CORS']
    },
    {
      id: '04',
      file: '04-Promise.html',
      title: 'Promise 的状态与编排',
      short: 'Promise',
      desc: 'pending / fulfilled / rejected / settled，then / catch / finally，以及 all / race / allSettled 的差别。',
      tags: ['状态机', '链式调用', 'Promise.all', 'unhandledrejection']
    },
    {
      id: '05',
      file: '05-async-await.html',
      title: 'async / await',
      short: 'async / await',
      desc: '本质是 Promise 的语法糖：async 总返回 Promise，await 暂停并取值、失败就抛出，错误处理回归 try/catch。',
      tags: ['协程', 'await', 'try / catch', '串行 vs 并行']
    }
  ];

  var INDEX_FILE = 'index.html';

  /* ---------------------------------------------------------------- 小工具 */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function sleep(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function pretty(value) {
    try { return JSON.stringify(value, null, 2); }
    catch (e) { return String(value); }
  }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  function clock() {
    var d = new Date();
    return pad2(d.getHours()) + ':' + pad2(d.getMinutes()) + ':' + pad2(d.getSeconds());
  }

  function hash(text) {
    var h = 0;
    for (var i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0;
    return h.toString(16).slice(0, 6);
  }

  /* ------------------------------------------------------- 语法高亮（自研） */
  var RE_JS = new RegExp([
    '(\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*)',                                   // 1 注释
    "('(?:\\\\.|[^'\\\\\\n])*'|\"(?:\\\\.|[^\"\\\\\\n])*\"|`(?:\\\\.|[^`\\\\])*`)", // 2 字符串
    '(&(?:lt|gt|amp|quot|#\\d+);)',                                          // 3 实体
    '\\b(0[xX][\\da-fA-F]+|\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)\\b',           // 4 数字
    '\\b(true|false|null|undefined|NaN|Infinity)\\b',                          // 5 字面量
    '\\b(const|let|var|function|return|if|else|for|of|in|while|do|new|class|extends|super|this|try|catch|finally|throw|await|async|import|from|export|default|typeof|instanceof|delete|break|continue|switch|case|yield|static|void|with)\\b', // 6 关键字
    '([A-Za-z_$][\\w$]*)(?=\\s*\\()',                                        // 7 函数调用
    '([{}()\\[\\];,.:=+\\-*%<>!|?&/~^]+)'                                    // 8 标点
  ].join('|'), 'g');

  var RE_XML = new RegExp([
    '(&lt;!--[\\s\\S]*?--&gt;)',                    // 1 注释
    '(&lt;\\/?)([\\w:.-]+)',                        // 2,3 标签开合 + 标签名
    '([\\w:.-]+)(=)("[^"]*"|\'[^\']*\')',           // 4,5,6 属性 + 等号 + 值
    '(&gt;|&lt;\\?|\\?&gt;)',                       // 7 尖括号
    '(&(?:lt|gt|amp|quot|#\\d+);)'                  // 8 实体
  ].join('|'), 'g');

  var RE_BASH = new RegExp([
    '(#[^\\n]*)',                                   // 1 注释
    "('[^']*'|\"[^\"]*\")",                         // 2 字符串
    '\\b(cd|ls|npm|npx|node|python3|curl|git|port|http\\.server)\\b', // 3 命令
    '(--?[\\w-]+)'                                  // 4 参数
  ].join('|'), 'g');

  function wrap(match, cls) {
    return '<span class="' + cls + '">' + match + '</span>';
  }

  function highlight(text, lang) {
    var src = escapeHtml(text);
    if (lang === 'text' || lang === 'plain') return src;

    if (lang === 'xml' || lang === 'html') {
      return src.replace(RE_XML, function (m, c, open, name, attr, eq, val, angle, ent) {
        if (c) return wrap(c, 'tok-c');
        if (open) return wrap(open, 'tok-p') + wrap(name, 'tok-t');
        if (attr) return wrap(attr, 'tok-a') + wrap(eq, 'tok-p') + wrap(val, 'tok-s');
        if (angle) return wrap(angle, 'tok-p');
        if (ent) return wrap(ent, 'tok-p');
        return m;
      });
    }

    if (lang === 'bash' || lang === 'sh') {
      return src.replace(RE_BASH, function (m, c, s, cmd, flag) {
        if (c) return wrap(c, 'tok-c');
        if (s) return wrap(s, 'tok-s');
        if (cmd) return wrap(cmd, 'tok-k');
        if (flag) return wrap(flag, 'tok-n');
        return m;
      });
    }

    return src.replace(RE_JS, function (m, comment, str, ent, num, lit, kw, fn, punct) {
      if (comment) return wrap(comment, 'tok-c');
      if (str) return wrap(str, 'tok-s');
      if (ent) return wrap(ent, 'tok-p');
      if (num) return wrap(num, 'tok-n');
      if (lit) return wrap(lit, 'tok-b');
      if (kw) return wrap(kw, 'tok-k');
      if (fn) return wrap(fn, 'tok-f');
      if (punct) return wrap(punct, 'tok-p');
      return m;
    });
  }

  /* ----------------------------------------------------------- 代码块增强 */
  function enhanceCode() {
    $$('pre > code[data-lang]').forEach(function (code) {
      var raw = code.textContent.replace(/^\n/, '').replace(/\s+$/, '');
      var lang = code.getAttribute('data-lang') || 'js';
      code.innerHTML = highlight(raw, lang);
      code.dataset.raw = raw;

      var pre = code.parentElement;
      var box = pre.closest('.code');
      if (!box) {
        box = document.createElement('div');
        box.className = 'code';
        pre.parentNode.insertBefore(box, pre);
        box.appendChild(pre);
      }
      var head = box.querySelector('.code-head');
      if (!head) {
        head = document.createElement('div');
        head.className = 'code-head';
        box.insertBefore(head, pre);
      }
      if (!head.querySelector('.code-lang')) {
        var label = document.createElement('span');
        label.className = 'code-lang';
        label.textContent = lang === 'js' ? 'javascript' : lang;
        head.insertBefore(label, head.firstChild);
      }
      if (!head.querySelector('.copy-btn')) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'copy-btn';
        btn.textContent = '复制';
        btn.addEventListener('click', function () {
          copyText(code.dataset.raw, btn);
        });
        head.appendChild(btn);
      }
    });
  }

  function copyText(text, btn) {
    var done = function () {
      if (!btn) return;
      var old = btn.textContent;
      btn.textContent = '已复制';
      btn.classList.add('done');
      setTimeout(function () {
        btn.textContent = old;
        btn.classList.remove('done');
      }, 1400);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(); });
    } else {
      fallback();
    }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { /* 忽略 */ }
      document.body.removeChild(ta);
    }
  }

  /* ------------------------------------------------------------- 日志面板 */
  function log(el, msg, kind, tag) {
    if (!el) return;
    if (!el.dataset.t0) el.dataset.t0 = String(performance.now());
    var t = (performance.now() - Number(el.dataset.t0)) / 1000;
    var line = document.createElement('div');
    line.className = 'log-line ' + (kind || 'info');
    line.innerHTML =
      '<span class="t">+' + t.toFixed(2) + 's</span>' +
      '<span class="k">' + escapeHtml(String(tag || kind || 'info').toUpperCase()) + '</span>' +
      '<span class="m">' + escapeHtml(msg) + '</span>';
    el.appendChild(line);
    el.scrollTop = el.scrollHeight;
  }

  function resetLog(el) {
    if (!el) return;
    el.innerHTML = '';
    el.dataset.t0 = String(performance.now());
  }

  function clearLogOnly(el) {
    if (el) el.innerHTML = '';
  }

  /* ---------------------------------------------------- 页面导航 / 目录 */
  function currentPage() {
    var id = document.body.getAttribute('data-page');
    for (var i = 0; i < PAGES.length; i++) if (PAGES[i].id === id) return { page: PAGES[i], index: i };
    return { page: null, index: -1 };
  }

  function renderTopbar() {
    var host = $('[data-topbar]');
    if (!host) return;
    var cur = currentPage();
    var html = '<a href="' + INDEX_FILE + '">Week 4</a>' +
      '<span class="sep">/</span>';
    if (cur.page) {
      html += '<span class="now">' + cur.page.id + ' · ' + cur.page.short + '</span>';
    } else {
      html += '<span class="now">知识点演示</span>';
    }
    host.innerHTML = html;

    var badge = $('[data-topbar-badge]');
    if (badge && cur.page) badge.textContent = cur.page.id + ' / 05';
  }

  function renderPager() {
    var host = $('[data-pager]');
    if (!host || host.children.length) return;
    var cur = currentPage();
    if (!cur.page) return;

    var prev = cur.index > 0 ? PAGES[cur.index - 1] : null;
    var next = cur.index < PAGES.length - 1 ? PAGES[cur.index + 1] : null;

    host.innerHTML = (prev
      ? '<a class="prev" href="' + encodeURI(prev.file) + '">' +
          '<span class="dir">← 上一节</span>' +
          '<span class="ttl">' + prev.id + ' · ' + prev.title + '</span>' +
          '<span class="sub">' + prev.desc + '</span>' +
        '</a>'
      : '<a class="prev ghost" href="' + INDEX_FILE + '"><span class="dir">← 目录</span></a>') +
      (next
        ? '<a class="next" href="' + encodeURI(next.file) + '">' +
            '<span class="dir">下一节 →</span>' +
            '<span class="ttl">' + next.id + ' · ' + next.title + '</span>' +
            '<span class="sub">' + next.desc + '</span>' +
          '</a>'
        : '<a class="next" href="' + INDEX_FILE + '">' +
            '<span class="dir">回到目录 →</span>' +
            '<span class="ttl">Week 4 全部知识点</span>' +
            '<span class="sub">看完 5 节后可以回到目录复习或跳转。</span>' +
          '</a>');
  }

  function renderCatalog() {
    var host = $('[data-catalog]');
    if (!host || host.children.length) return;
    host.innerHTML = PAGES.map(function (p, i) {
      return '<a class="cat-card reveal" href="' + encodeURI(p.file) + '" style="--d:' + (i * 70 + 120) + 'ms">' +
        '<span class="cat-num">' + p.id + '</span>' +
        '<h3 class="cat-title">' + p.title + '</h3>' +
        '<p class="cat-desc">' + p.desc + '</p>' +
        '<span class="cat-tags">' + p.tags.map(function (t) {
          return '<span class="tag">' + t + '</span>';
        }).join('') + '</span>' +
        '<span class="cat-go">打开演示 <span class="arw">→</span></span>' +
      '</a>';
    }).join('');
  }

  /* --------------------------------------------------------------- 挂载 */
  function mount() {
    renderTopbar();
    renderPager();
    renderCatalog();
    enhanceCode();
  }

  document.addEventListener('DOMContentLoaded', function () {
    try { mount(); } catch (e) { /* 保持页面可用 */ }
  });

  /* ------------------------------------------------------------ 对外 API */
  window.W4 = {
    PAGES: PAGES,
    INDEX_FILE: INDEX_FILE,
    $: $, $$: $$,
    escapeHtml: escapeHtml,
    highlight: highlight,
    sleep: sleep,
    pretty: pretty,
    clock: clock,
    hash: hash,
    log: log,
    resetLog: resetLog,
    clearLogOnly: clearLogOnly,
    copyText: copyText,
    currentPage: currentPage,
    /* 便捷方法：构造带时间戳的日志元素 */
    logEl: function (sel) { return typeof sel === 'string' ? $(sel) : sel; },
    /* 本地兜底数据地址（课堂断网时走这里，返回结构与远程接口同构） */
    FALLBACK_URL: 'assets/fallback-users.json',
    REMOTE_API: 'https://jsonplaceholder.typicode.com'
  };
})();
