/* ============================================================================
 *  app.js — renders assets/data.js into the page.
 *  You normally never need to touch this file. Edit assets/data.js instead.
 * ========================================================================== */
(function () {
  'use strict';

  var S = window.SITE;
  var P = S.profile;
  var L = S.links || {};
  var ME = (P.meName || '').trim();

  /* ------------------------------------------------------------ helpers -- */
  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function markMe(text) {
    var out = esc(text);
    if (!ME) return out;
    var needle = esc(ME).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return out.replace(new RegExp(needle, 'g'), '<u>' + esc(ME) + '</u>');
  }
  function set(id, html) {
    var n = document.getElementById(id);
    if (n) n.innerHTML = html;
    return n;
  }
  function ext(href) {
    return /^https?:/.test(href || '') ? ' target="_blank" rel="noopener"' : '';
  }
  /** Newest first. Lets you paste new entries anywhere in data.js. */
  function byYear(list, key) {
    return (list || []).slice().sort(function (a, b) {
      return parseInt(b[key || 'year'], 10) - parseInt(a[key || 'year'], 10);
    });
  }

  /* ------------------------------------------------------ card artwork --- */
  /* Line drawings for the work cards. Each is a 400×180 SVG that inherits
     the current text colour, so they follow the light / dark theme.        */
  function svg(inner) {
    return '<svg viewBox="0 0 400 180" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
           inner + '</svg>';
  }
  var ART = {
    // an ordinary light curve with one flagged excursion
    anomaly: svg(
      '<path d="M0 132h400" stroke="currentColor" stroke-opacity=".12"/>' +
      '<path d="M4 118 22 113 40 121 58 109 76 116 94 106 112 114 130 108 148 116 166 110 184 118 202 108' +
      ' 220 114 238 52 252 66 266 102 284 110 302 104 320 112 338 106 356 114 374 108 396 112"' +
      ' stroke="currentColor" stroke-opacity=".6" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="M238 66v58" stroke="currentColor" stroke-opacity=".28" stroke-width="1" stroke-dasharray="3 4"/>' +
      '<circle cx="238" cy="52" r="17" stroke="currentColor" stroke-opacity=".9" stroke-width="1.4"/>' +
      '<circle cx="238" cy="52" r="3.4" fill="currentColor"/>' +
      '<g fill="currentColor" fill-opacity=".35">' +
        '<circle cx="94" cy="106" r="2.2"/><circle cx="166" cy="110" r="2.2"/>' +
        '<circle cx="302" cy="104" r="2.2"/><circle cx="374" cy="108" r="2.2"/></g>'
    ),
    // observations that land whenever they land
    irregular: svg(
      '<path d="M0 146h400" stroke="currentColor" stroke-opacity=".18"/>' +
      '<g stroke="currentColor" stroke-opacity=".45" stroke-width="1.4">' +
        '<path d="M18 140v12M32 140v12M40 140v12M66 140v12M104 140v12M118 140v12' +
        'M126 140v12M168 140v12M222 140v12M234 140v12M270 140v12M308 140v12M326 140v12M380 140v12"/></g>' +
      '<path d="M8 96C60 40 96 116 152 84s84-58 132-14 62 46 108 26"' +
      ' stroke="currentColor" stroke-opacity=".55" stroke-width="1.6" stroke-linecap="round"/>' +
      '<g stroke="currentColor" stroke-opacity=".2" stroke-width="1" stroke-dasharray="2 4">' +
        '<path d="M32 78v62M104 96v44M168 82v58M234 58v82M308 62v78"/></g>' +
      '<g fill="currentColor">' +
        '<circle cx="32" cy="78" r="3.2"/><circle cx="104" cy="96" r="3.2"/><circle cx="168" cy="82" r="3.2"/>' +
        '<circle cx="234" cy="58" r="3.2"/><circle cx="308" cy="62" r="3.2"/></g>'
    ),
    // competing risks pulling one cohort apart
    survival: svg(
      '<path d="M0 150h400M12 20v130" stroke="currentColor" stroke-opacity=".14"/>' +
      '<path d="M12 34h58v26h52v28h58v18h72v20h58v14h78"' +
      ' stroke="currentColor" stroke-opacity=".75" stroke-width="1.8" stroke-linejoin="round"/>' +
      '<path d="M12 34h38v40h54v26h56v26h68v20h62v12h88"' +
      ' stroke="currentColor" stroke-opacity=".34" stroke-width="1.6" stroke-dasharray="5 4" stroke-linejoin="round"/>' +
      '<g fill="currentColor" fill-opacity=".55">' +
        '<circle cx="70" cy="60" r="2.6"/><circle cx="122" cy="88" r="2.6"/>' +
        '<circle cx="180" cy="106" r="2.6"/><circle cx="252" cy="126" r="2.6"/></g>'
    ),
    // dose–response densities with a chosen starting point
    dosing: svg(
      '<path d="M0 150h400" stroke="currentColor" stroke-opacity=".14"/>' +
      '<path d="M20 150c46 0 34-84 78-84s34 84 78 84" stroke="currentColor" stroke-opacity=".28" stroke-width="1.5"/>' +
      '<path d="M104 150c46 0 34-104 78-104s34 104 78 104" stroke="currentColor" stroke-opacity=".8" stroke-width="1.8"/>' +
      '<path d="M186 150c46 0 34-70 78-70s34 70 78 70" stroke="currentColor" stroke-opacity=".28" stroke-width="1.5"/>' +
      '<path d="M182 46v104" stroke="currentColor" stroke-opacity=".35" stroke-width="1" stroke-dasharray="3 4"/>' +
      '<circle cx="182" cy="46" r="4" fill="currentColor"/>'
    ),
    // many heterogeneous series pre-trained into one backbone
    foundation: svg(
      '<g stroke="currentColor" stroke-opacity=".38" stroke-width="1.4" stroke-linejoin="round">' +
        '<path d="M6 30 30 22 54 34 78 26 102 32"/>' +
        '<path d="M6 70 30 62 54 76 78 58 102 68"/>' +
        '<path d="M6 110 30 118 54 100 78 112 102 104"/>' +
        '<path d="M6 150 30 142 54 152 78 138 102 146"/></g>' +
      '<g stroke="currentColor" stroke-opacity=".22" stroke-width="1">' +
        '<path d="M104 32 138 74M104 68 138 82M104 104 138 96M104 146 138 106"/></g>' +
      '<rect x="140" y="58" width="62" height="64" rx="10" stroke="currentColor" stroke-opacity=".85" stroke-width="1.6"/>' +
      '<g fill="currentColor" fill-opacity=".5">' +
        '<circle cx="157" cy="78" r="2.4"/><circle cx="171" cy="90" r="2.4"/><circle cx="185" cy="78" r="2.4"/>' +
        '<circle cx="164" cy="104" r="2.4"/><circle cx="178" cy="104" r="2.4"/></g>' +
      '<path d="M204 90h34" stroke="currentColor" stroke-opacity=".3" stroke-width="1"/>' +
      '<path d="M240 90 268 66 296 96 324 54 352 74 392 44"' +
      ' stroke="currentColor" stroke-opacity=".75" stroke-width="1.7" stroke-linejoin="round"/>' +
      '<path d="M324 54c26 4 44-2 68-14" stroke="currentColor" stroke-opacity=".3" stroke-width="1.4" stroke-dasharray="5 4"/>'
    ),
    // health degrading toward a failure threshold, with the life that remains
    rul: svg(
      '<path d="M0 150h400" stroke="currentColor" stroke-opacity=".14"/>' +
      '<path d="M0 126h400" stroke="currentColor" stroke-opacity=".3" stroke-width="1" stroke-dasharray="4 4"/>' +
      '<path d="M10 34C90 40 150 62 210 92s70 30 96 34" stroke="currentColor" stroke-opacity=".8" stroke-width="1.8"/>' +
      '<path d="M210 92c46 22 70 30 96 34" stroke="currentColor" stroke-opacity=".3" stroke-width="1.6" stroke-dasharray="5 4"/>' +
      '<path d="M210 24v126" stroke="currentColor" stroke-opacity=".28" stroke-width="1"/>' +
      '<circle cx="210" cy="92" r="4" fill="currentColor"/>' +
      '<circle cx="306" cy="126" r="4" stroke="currentColor" stroke-opacity=".8" stroke-width="1.4"/>' +
      '<g stroke="currentColor" stroke-opacity=".55" stroke-width="1.3">' +
        '<path d="M214 44h88M214 44l7-4M214 44l7 4M302 44l-7-4M302 44l-7 4"/></g>'
    ),
    // generic fallback
    forecast: svg(
      '<path d="M0 140h400" stroke="currentColor" stroke-opacity=".14"/>' +
      '<path d="M8 118 62 96 116 108 170 70 224 84 278 48 332 62 392 34"' +
      ' stroke="currentColor" stroke-opacity=".7" stroke-width="1.7" stroke-linejoin="round"/>' +
      '<path d="M278 48c34 6 62 0 114-22" stroke="currentColor" stroke-opacity=".3" stroke-width="1.5" stroke-dasharray="5 4"/>'
    )
  };

  /* --------------------------------------------------------------- nav --- */
  var NAV = [
    { id: 'about',        label: 'About' },
    { id: 'work',         label: 'Work' },
    { id: 'publications', label: 'Publications' },
    { id: 'talks',        label: 'Talks' },
    { id: 'teaching',     label: 'Teaching' }
  ];

  document.querySelectorAll('[data-wordmark]').forEach(function (n) {
    n.textContent = P.name;
  });

  set('navMenu', NAV.map(function (n) {
    return '<a href="#' + n.id + '" data-nav="' + n.id + '">' + esc(n.label) + '</a>';
  }).join(''));

  var primaryHref = L.scholar || ('mailto:' + P.email);
  set('navActions',
    '<a class="btn btn-outline btn-sm" href="mailto:' + esc(P.email) + '">Email</a>' +
    (L.scholar ? '<a class="btn btn-primary btn-sm" href="' + esc(L.scholar) + '"' + ext(L.scholar) + '>Google Scholar</a>' : '') +
    '<button class="icon-btn" id="themeBtn" type="button" aria-label="Toggle colour theme">' +
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">' +
      '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
    '</button>' +
    '<button class="icon-btn nav-toggle" id="navToggle" type="button" aria-label="Menu" aria-expanded="false">' +
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">' +
      '<path d="M3 6h18M3 12h18M3 18h18"/></svg>' +
    '</button>');

  /* 최근 논문 3편 — publications 전체에서 최신순으로 자동 선택 */
  function heroRecent() {
    var all = [];
    Object.keys(S.publications || {}).forEach(function (k) {
      (S.publications[k] || []).forEach(function (it) { all.push(it); });
    });
    all = byYear(all).slice(0, 3);
    if (!all.length) return '';
    return '<aside class="hero-aside">' +
             '<p class="eyebrow">Recent</p>' +
             '<ul class="hero-recent">' + all.map(function (it) {
               return '<li>' +
                        '<span class="meta">' + esc(it.year) + ' &middot; ' + esc(it.venue || '') + '</span>' +
                        '<span class="ttl">' + esc(it.title) + '</span>' +
                      '</li>';
             }).join('') + '</ul>' +
             '<a class="btn-text" href="#publications">All publications <span class="arw">&#8594;</span></a>' +
           '</aside>';
  }

  /* -------------------------------------------------------------- hero --- */
  var hp = P.heroPhoto || {};
  set('hero',
    // 1. the banner photograph, edge to edge, straight under the menu bar
    (hp.src
      ? '<figure class="hero-photo">' +
          '<div class="hero-photo-frame">' +
            // 좌우 날개는 같은 사진을 좌우 반전한 것 — 이음선에서 픽셀이 정확히 이어진다
            '<img class="hero-photo-wing wing-l" src="' + esc(hp.src) + '" alt="" aria-hidden="true" />' +
            '<img class="hero-photo-main" src="' + esc(hp.src) + '" alt="' + esc(hp.alt || '') + '" />' +
            '<img class="hero-photo-wing wing-r" src="' + esc(hp.src) + '" alt="" aria-hidden="true" />' +
          '</div>' +
          // caption only when data.js actually provides one
          (hp.caption || hp.year
            ? '<figcaption><div class="container">' +
                '<p>' + esc(hp.caption || '') + '</p>' +
                (hp.year ? '<span>' + esc(hp.year) + '</span>' : '') +
              '</div></figcaption>'
            : '') +
        '</figure>'
      : '') +
    // 2. identity line + thesis
    '<div class="hero-body">' +
      '<div class="orb orb-lavender orb-a"></div>' +
      '<div class="orb orb-mint orb-b"></div>' +
      '<div class="orb orb-peach orb-c"></div>' +
      '<div class="container"><div class="hero-split">' +
        '<div class="hero-copy">' +
          '<p class="identity"><b>' + esc(P.name) + '</b><span>' + esc(P.role) + '</span></p>' +
          '<h1 class="display-mega">' + P.heroLine + '</h1>' +
          '<p class="lead">' + esc(P.heroLead) + '</p>' +
          '<div class="hero-cta">' +
            '<a class="btn btn-primary" href="mailto:' + esc(P.email) + '">Get in touch</a>' +
            '<a class="btn btn-outline" href="#work">Selected work</a>' +
          '</div>' +
        '</div>' +
        heroRecent() +
      '</div></div>' +
    '</div>');

  /* ------------------------------------------------------- logo wall ----- */
  set('logoWall',
    '<div class="container">' +
      '<p class="eyebrow">Research collaborations</p>' +
      '<div class="logo-row">' + (S.collaborators || []).map(function (c) {
        var inner = c.logo
          ? '<img src="' + esc(c.logo) + '" alt="' + esc(c.name) + '" />'
          : (c.abbr ? '<span class="abbr">' + esc(c.abbr) + '</span>' : '') + esc(c.name);
        return c.url
          ? '<a class="logo-item" href="' + esc(c.url) + '"' + ext(c.url) + '>' + inner + '</a>'
          : '<span class="logo-item">' + inner + '</span>';
      }).join('') + '</div>' +
    '</div>');

  /* -------------------------------------------------------------- work --- */
  set('work',
    '<div class="container">' +
      '<div class="sec-head reveal">' +
        '<div><p class="eyebrow">Selected work</p>' +
        '<h2 class="display-lg">Four problems where the clock is not on a grid.</h2></div>' +
      '</div>' +
      '<div class="work-grid">' + (S.work || []).map(function (w, i) {
        var visual = w.image
          ? '<img src="' + esc(w.image) + '" alt="' + esc(w.title) + '" loading="lazy" />'
          : (ART[w.art] || ART.forecast);
        return '<article class="work-card reveal">' +
                 '<div class="work-art">' +
                   '<div class="orb orb-' + esc(w.orb || 'sky') + '"></div>' +
                   visual +
                 '</div>' +
                 '<div class="work-copy">' +
                   '<span class="idx">' + String(i + 1).padStart(2, '0') + '</span>' +
                   '<h3 class="display-sm">' + esc(w.title) + '</h3>' +
                   '<p class="body-md">' + esc(w.text) + '</p>' +
                   '<div class="tags">' + (w.tags || []).map(function (t) {
                     return '<span class="tag">' + esc(t) + '</span>';
                   }).join('') + '</div>' +
                 '</div>' +
               '</article>';
      }).join('') + '</div>' +
    '</div>');

  /* ------------------------------------------------------------ entries -- */
  function entry(o) {
    var links = (o.links || []).filter(function (l) { return l.href; });
    return '<article class="entry reveal">' +
             '<div class="yr">' + esc(o.year) + '</div>' +
             '<div>' +
               '<h4>' + esc(o.title) + '</h4>' +
               (o.authors ? '<p class="authors">' + markMe(o.authors) + '</p>' : '') +
               (o.venue || o.kind
                 ? '<div class="meta-row">' +
                     (o.venue ? '<span class="venue">' + esc(o.venue) + '</span>' : '') +
                     (o.kind ? '<span class="kind">' + esc(o.kind) + '</span>' : '') +
                   '</div>'
                 : '') +
               (o.note ? '<p class="note">' + esc(o.note) + '</p>' : '') +
             '</div>' +
             (links.length
               ? '<div class="entry-links">' + links.map(function (l) {
                   return '<a href="' + esc(l.href) + '"' + ext(l.href) + '>' + esc(l.label) + ' &#8599;</a>';
                 }).join('') + '</div>'
               : '<div></div>') +
           '</article>';
  }
  function subLabel(text, n) {
    return '<div class="sub-label"><span>' + esc(text) + '</span><i></i><b>' +
           String(n).padStart(2, '0') + '</b></div>';
  }
  function emptyRow(msg) { return '<p class="empty">' + esc(msg) + '</p>'; }

  /* ------------------------------------------------------ publications --- */
  var PUB_GROUPS = [
    { key: 'journal',    label: 'Journal' },
    { key: 'conference', label: 'Conference' },
    { key: 'workshop',   label: 'Workshop' }
  ];
  var pubTotal = 0;
  var papersBody = '';
  PUB_GROUPS.forEach(function (g) {
    var list = byYear(S.publications[g.key]);
    if (!list.length) return;                       // 비어 있는 그룹은 아예 생략
    pubTotal += list.length;
    papersBody += subLabel(g.label, list.length) + list.map(entry).join('');
  });
  if (!papersBody) papersBody = emptyRow('Nothing here yet.');

  set('publications',
    '<div class="container">' +
      '<div class="sec-head reveal">' +
        '<div><p class="eyebrow">Publications</p>' +
        '<h2 class="display-lg">Papers</h2></div>' +
        (L.scholar ? '<a class="btn-text" href="' + esc(L.scholar) + '"' + ext(L.scholar) +
          '>All on Google Scholar <span class="arw">&#8594;</span></a>' : '') +
      '</div>' +
      papersBody +
    '</div>');

  /* -------------------------------------------------------------- talks -- */
  var talks = byYear(S.talks);
  set('talks',
    '<div class="container">' +
      '<div class="sec-head reveal">' +
        '<div><p class="eyebrow">Speaking</p>' +
        '<h2 class="display-lg">Talks &amp; presentations</h2></div>' +
      '</div>' +
      (talks.length ? talks.map(entry).join('') : emptyRow('Nothing here yet.')) +
    '</div>');

  /* --------------------------------------------- teaching + education ---- */
  var teaching = byYear(S.teaching, 'term').map(function (t) {
    return entry({ year: t.term, title: t.course, authors: t.org, venue: t.role, note: t.note });
  }).join('');
  var awards = byYear(S.awards).map(function (a) {
    return entry({ year: a.year, title: a.title, authors: a.org });
  }).join('');
  var education = byYear(S.education).map(function (e) {
    return entry({ year: e.year, title: e.title, authors: e.org, note: e.note });
  }).join('');

  set('teaching',
    '<div class="container">' +
      '<div class="two-up">' +
        '<div class="reveal"><p class="eyebrow">Teaching</p>' +
          '<h2 class="display-md">Teaching assistantships</h2>' +
          (teaching || emptyRow('Nothing here yet.')) +
        '</div>' +
        '<div class="reveal"><p class="eyebrow">Background</p>' +
          '<h2 class="display-md">Education &amp; awards</h2>' +
          subLabel('Education', (S.education || []).length) + education +
          subLabel('Awards', (S.awards || []).length) + awards +
        '</div>' +
      '</div>' +
    '</div>');

  /* -------------------------------------------------------------- about -- */
  set('about',
    '<div class="container"><div class="about-grid">' +
      '<div class="about-body reveal">' +
        '<p class="eyebrow">About</p>' +
        '<h2 class="display-md about-title">' + esc(P.aboutTitle) + '</h2>' +
        P.about.map(function (p) { return '<p class="body-md">' + p + '</p>'; }).join('') +
        '<div class="interest-list">' + (P.interests || []).map(function (t) {
          return '<span class="tag">' + esc(t) + '</span>';
        }).join('') + '</div>' +
        '<div class="about-cta">' +
          '<a class="btn btn-primary" href="#publications">See publications</a>' +
          (L.scholar ? '<a class="btn-text" href="' + esc(L.scholar) + '"' + ext(L.scholar) +
            '>Google Scholar <span class="arw">&#8594;</span></a>' : '') +
        '</div>' +
      '</div>' +
      '<div class="about-side reveal">' +
        '<figure class="about-portrait">' +
          '<img src="' + esc(P.photo) + '" alt="' + esc(P.name) + '" />' +
          '<figcaption>' + esc(P.name) + '</figcaption>' +
        '</figure>' +
        (P.facts && P.facts.length
          ? '<dl class="facts">' + P.facts.map(function (f) {
              return '<dt>' + esc(f.label) + '</dt><dd>' + esc(f.value) + '</dd>';
            }).join('') + '</dl>'
          : '') +
      '</div>' +
    '</div></div>');

  /* ---------------------------------------------------------------- cta -- */
  set('cta',
    '<div class="container"><div class="cta-band reveal">' +
      '<div class="orb orb-sky orb-a"></div>' +
      '<div class="orb orb-rose orb-b"></div>' +
      '<h2 class="display-lg">' + esc(S.cta.title) + '</h2>' +
      '<p class="body-md">' + esc(S.cta.text) + '</p>' +
      '<div class="btns">' +
        '<a class="btn btn-on-dark" href="mailto:' + esc(P.email) + '">' + esc(P.email) + '</a>' +
        (L.linkedin ? '<a class="btn btn-outline" href="' + esc(L.linkedin) + '"' + ext(L.linkedin) + '>LinkedIn</a>' : '') +
      '</div>' +
    '</div></div>');

  /* ------------------------------------------------------------- footer -- */
  function fLink(label, href) {
    return href ? '<li><a href="' + esc(href) + '"' + ext(href) + '>' + esc(label) + '</a></li>' : '';
  }
  set('footer',
    '<div class="container">' +
      '<div class="footer-grid">' +
        '<div class="footer-brand">' +
          '<div class="wordmark" data-wordmark>' + esc(P.name) + '</div>' +
          '<p>' + esc(P.role) + '</p>' +
        '</div>' +
        '<div><h5>Sections</h5><ul>' +
          NAV.map(function (n) { return '<li><a href="#' + n.id + '">' + esc(n.label) + '</a></li>'; }).join('') +
        '</ul></div>' +
        '<div><h5>Elsewhere</h5><ul>' +
          fLink('Google Scholar', L.scholar) +
          fLink('GitHub', L.github) +
          fLink('LinkedIn', L.linkedin) +
          fLink('Curriculum Vitae', L.cv) +
        '</ul></div>' +
        '<div><h5>Contact</h5><ul>' +
          '<li><a href="mailto:' + esc(P.email) + '">' + esc(P.email) + '</a></li>' +
          '<li><a href="https://www.unist.ac.kr" target="_blank" rel="noopener">UNIST</a></li>' +
        '</ul></div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span>&copy; ' + new Date().getFullYear() + ' ' + esc(P.name) + '</span>' +
        '<span>Ulsan, Republic of Korea</span>' +
      '</div>' +
    '</div>');

  /* ==========================================================================
   *  Behaviour
   * ========================================================================*/

  /* colour theme */
  (function () {
    var KEY = 'theme', root = document.documentElement;
    function apply(v) { root.setAttribute('data-theme', v); try { localStorage.setItem(KEY, v); } catch (e) {} }
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    apply(saved === 'light' || saved === 'dark'
      ? saved
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
    var btn = document.getElementById('themeBtn');
    if (btn) btn.addEventListener('click', function () {
      apply(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  })();

  /* mobile menu */
  (function () {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  })();

  /* scroll reveal + active nav link */
  (function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(function (n) { n.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (rows) {
        rows.forEach(function (r) {
          if (r.isIntersecting) { r.target.classList.add('in'); io.unobserve(r.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: .06 });
      document.querySelectorAll('.reveal').forEach(function (n) { io.observe(n); });
    }

    var links = {};
    document.querySelectorAll('[data-nav]').forEach(function (a) { links[a.dataset.nav] = a; });
    var spy = new IntersectionObserver(function (rows) {
      rows.forEach(function (r) {
        var a = links[r.target.id];
        if (!a) return;
        if (r.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove('active'); });
          a.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    NAV.forEach(function (n) {
      var s = document.getElementById(n.id);
      if (s) spy.observe(s);
    });
  })();

})();
