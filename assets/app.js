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
      // 연도가 비어 있으면(심사 중 등) 원래 순서를 유지한다
      return (parseInt(b[key || 'year'], 10) || 0) - (parseInt(a[key || 'year'], 10) || 0);
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
    // ordinary light curve + one flagged excursion
    anomaly: svg(
      '<g stroke="currentColor" stroke-opacity=".08"><path d="M0 60h400M0 108h400"/></g>' +
      '<path d="M0 118 20 112 40 122 60 104 80 116 100 100 120 112 140 102 160 114 180 104 200 116' +
      ' 220 106 242 36 262 60 280 104 300 112 320 102 340 114 360 104 380 112 400 106' +
      ' L400 180 L0 180 Z" fill="var(--tint)" fill-opacity=".5"/>' +
      '<path d="M0 118 20 112 40 122 60 104 80 116 100 100 120 112 140 102 160 114 180 104 200 116' +
      ' 220 106 242 36 262 60 280 104 300 112 320 102 340 114 360 104 380 112 400 106"' +
      ' stroke="currentColor" stroke-opacity=".85" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M242 58v100" stroke="currentColor" stroke-opacity=".35" stroke-width="1.4" stroke-dasharray="4 5"/>' +
      '<circle cx="242" cy="36" r="21" stroke="currentColor" stroke-width="2.4"/>' +
      '<circle cx="242" cy="36" r="5" fill="currentColor"/>'
    ),
    // observations that land whenever they land
    irregular: svg(
      '<path d="M0 92C56 34 96 112 156 78s86-56 132-12 60 44 112 22 L400 180 L0 180 Z"' +
      ' fill="var(--tint)" fill-opacity=".5"/>' +
      '<path d="M0 92C56 34 96 112 156 78s86-56 132-12 60 44 112 22"' +
      ' stroke="currentColor" stroke-opacity=".85" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M0 152h400" stroke="currentColor" stroke-opacity=".3" stroke-width="1.6"/>' +
      '<g stroke="currentColor" stroke-opacity=".55" stroke-width="2">' +
        '<path d="M22 146v12M38 146v12M46 146v12M74 146v12M112 146v12M126 146v12M134 146v12' +
        'M176 146v12M228 146v12M240 146v12M276 146v12M312 146v12M330 146v12M382 146v12"/></g>' +
      '<g stroke="currentColor" stroke-opacity=".28" stroke-width="1.2" stroke-dasharray="3 5">' +
        '<path d="M38 70v82M112 90v62M176 74v78M240 50v102M312 56v96"/></g>' +
      '<g fill="currentColor">' +
        '<circle cx="38" cy="70" r="4.5"/><circle cx="112" cy="90" r="4.5"/><circle cx="176" cy="74" r="4.5"/>' +
        '<circle cx="240" cy="50" r="4.5"/><circle cx="312" cy="56" r="4.5"/></g>'
    ),
    // competing risks pulling one cohort apart
    survival: svg(
      '<path d="M0 26h62v28h56v30h60v22h74v22h60v16h88 L400 180 L0 180 Z"' +
      ' fill="var(--tint)" fill-opacity=".5"/>' +
      '<path d="M0 26h62v28h56v30h60v22h74v22h60v16h88"' +
      ' stroke="currentColor" stroke-opacity=".85" stroke-width="2.6" stroke-linejoin="round"/>' +
      '<path d="M0 26h40v46h58v30h60v28h72v22h66v14h104"' +
      ' stroke="currentColor" stroke-opacity=".38" stroke-width="2" stroke-dasharray="6 5" stroke-linejoin="round"/>' +
      '<path d="M0 158h400" stroke="currentColor" stroke-opacity=".25" stroke-width="1.6"/>' +
      '<g stroke="currentColor" stroke-opacity=".7" stroke-width="2">' +
        '<path d="M90 48v12M170 78v12M262 100v12M330 122v12"/></g>'
    ),
    // dose-response densities with a chosen starting point
    dosing: svg(
      '<path d="M14 180c50 0 36-102 84-102s34 102 84 102z" fill="currentColor" fill-opacity=".08"/>' +
      '<path d="M14 180c50 0 36-102 84-102s34 102 84 102" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/>' +
      '<path d="M218 180c50 0 36-88 84-88s34 88 84 88z" fill="currentColor" fill-opacity=".08"/>' +
      '<path d="M218 180c50 0 36-88 84-88s34 88 84 88" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/>' +
      '<path d="M116 180c50 0 36-148 84-148s34 148 84 148z" fill="var(--tint)" fill-opacity=".55"/>' +
      '<path d="M116 180c50 0 36-148 84-148s34 148 84 148" stroke="currentColor" stroke-opacity=".85" stroke-width="2.6"/>' +
      '<path d="M200 32v148" stroke="currentColor" stroke-opacity=".4" stroke-width="1.4" stroke-dasharray="4 5"/>' +
      '<circle cx="200" cy="32" r="6" fill="currentColor"/>' +
      '<path d="M0 174h400" stroke="currentColor" stroke-opacity=".25" stroke-width="1.6"/>'
    ),
    // heterogeneous series pre-trained into one backbone
    foundation: svg(
      '<g stroke="currentColor" stroke-opacity=".45" stroke-width="2" stroke-linejoin="round">' +
        '<path d="M8 34 34 24 60 38 86 28 112 36"/>' +
        '<path d="M8 78 34 68 60 84 86 62 112 74"/>' +
        '<path d="M8 122 34 132 60 110 86 124 112 114"/>' +
        '<path d="M8 164 34 154 60 166 86 150 112 158"/></g>' +
      '<g stroke="currentColor" stroke-opacity=".25" stroke-width="1.4">' +
        '<path d="M116 36 146 76M116 74 146 84M116 114 146 100M116 158 146 110"/></g>' +
      '<rect x="148" y="52" width="76" height="76" rx="14" fill="var(--tint)" fill-opacity=".6"/>' +
      '<rect x="148" y="52" width="76" height="76" rx="14" stroke="currentColor" stroke-width="2.4"/>' +
      '<g fill="currentColor" fill-opacity=".55">' +
        '<circle cx="170" cy="76" r="3.4"/><circle cx="186" cy="90" r="3.4"/><circle cx="202" cy="76" r="3.4"/>' +
        '<circle cx="178" cy="106" r="3.4"/><circle cx="194" cy="106" r="3.4"/></g>' +
      '<path d="M228 90h26" stroke="currentColor" stroke-opacity=".3" stroke-width="1.6"/>' +
      '<path d="M256 92 288 62 320 96 352 48 400 70"' +
      ' stroke="currentColor" stroke-opacity=".85" stroke-width="2.6" stroke-linejoin="round"/>' +
      '<path d="M352 48c22 6 34 2 48-8" stroke="currentColor" stroke-opacity=".35" stroke-width="2" stroke-dasharray="6 5"/>'
    ),
    // health degrading toward a failure threshold, with the life that remains
    rul: svg(
      '<rect x="214" y="0" width="106" height="180" fill="var(--tint)" fill-opacity=".55"/>' +
      '<path d="M0 130h400" stroke="currentColor" stroke-opacity=".4" stroke-width="1.6" stroke-dasharray="6 5"/>' +
      '<path d="M0 26C92 32 156 56 214 90" stroke="currentColor" stroke-opacity=".85" stroke-width="2.8"/>' +
      '<path d="M214 90c48 22 74 32 106 40" stroke="currentColor" stroke-opacity=".4" stroke-width="2.4" stroke-dasharray="7 5"/>' +
      '<path d="M214 8v164" stroke="currentColor" stroke-opacity=".45" stroke-width="1.6"/>' +
      '<circle cx="214" cy="90" r="6" fill="currentColor"/>' +
      '<circle cx="320" cy="130" r="6.5" fill="none" stroke="currentColor" stroke-width="2.4"/>' +
      '<g stroke="currentColor" stroke-opacity=".7" stroke-width="2">' +
        '<path d="M220 44h94M220 44l9-6M220 44l9 6M314 44l-9-6M314 44l-9 6"/></g>' +
      '<path d="M0 172h400" stroke="currentColor" stroke-opacity=".25" stroke-width="1.6"/>'
    ),
    // generic fallback
    forecast: svg(
      '<path d="M0 120 60 96 120 108 180 66 240 82 300 44 360 60 400 32 L400 160 L0 160 Z"' +
      ' fill="var(--tint)" fill-opacity=".5"/>' +
      '<path d="M0 120 60 96 120 108 180 66 240 82 300 44 360 60 400 32"' +
      ' stroke="currentColor" stroke-opacity=".85" stroke-width="2.4" stroke-linejoin="round"/>'
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
        '<h2 class="display-lg">' + esc(S.workTitle || 'Where the clock is not on a grid.') + '</h2></div>' +
      '</div>' +
      '<div class="work-grid">' + (S.work || []).map(function (w, i) {
        // 이미지가 있으면 이미지, 없거나 로드에 실패하면 그려둔 일러스트
        var visual = w.image
          ? '<img src="' + esc(w.image) + '" alt="' + esc(w.title) + '" loading="lazy"' +
            ' data-art="' + esc(w.art || 'forecast') + '" />'
          : (ART[w.art] || ART.forecast);
        return '<article class="work-card reveal tint-' + esc(w.orb || 'sky') + '">' +
                 '<div class="work-art' + (w.image ? ' has-image' : '') + '">' + visual + '</div>' +
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

  /* 이미지 파일이 아직 없으면 조용히 기존 일러스트로 되돌린다 */
  document.querySelectorAll('.work-art img[data-art]').forEach(function (img) {
    img.addEventListener('error', function () {
      var panel = img.parentNode;
      panel.classList.remove('has-image');
      panel.innerHTML = ART[img.dataset.art] || ART.forecast;
    });
  });

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
  /* 논문 섹션에 표시되는 순서. 순서를 바꾸려면 이 배열의 줄 순서만 바꾸면 된다. */
  var PUB_GROUPS = [
    { key: 'underReview', label: 'Under review' },
    { key: 'journal',     label: 'Journal' },
    { key: 'conference',  label: 'Conference' },
    { key: 'workshop',    label: 'Workshop' }
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
