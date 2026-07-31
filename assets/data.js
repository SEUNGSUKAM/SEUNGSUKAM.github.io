/* ============================================================================
 *  data.js — everything on the site lives here. Edit this file only.
 *  (Design: assets/style.css · Rendering: assets/app.js)
 *
 *  Three rules
 *   1) To add an item, copy a { ... } block, paste it, separate with a comma.
 *   2) To hide an item, delete the block or prefix each line with //
 *   3) Your own name is underlined automatically (see profile.meName).
 * ========================================================================== */

window.SITE = {

  /* ── 1. Profile ─────────────────────────────────────────────────────── */
  profile: {
    name:      'Seungsu Kam',
    meName:    'Kam, S.',                 // auto-highlighted in author lists
    role:      'Ph.D. Candidate, Industrial Engineering — UNIST',
    email:     'lewki83@unist.ac.kr',
    photo:     'figs/profile-web.jpg',
    startYear: 2022,

    // Hero band
    heroLine:  'Learning from time that arrives <em class="serif-em">irregularly</em>.',
    heroLead:  'I am a Ph.D. candidate at UNIST building continuous-time models for data that refuses to be evenly sampled — telescope observations that arrive whenever the weather allows, clinical records that appear whenever a patient does.',

    // Banner photo straight under the menu bar. Set src:'' to hide it.
    // caption / year are optional — leave them empty and no caption is drawn.
    heroPhoto: {
      src:     'figs/informs2025-web.jpg',
      alt:     'Seungsu Kam presenting at the INFORMS Annual Meeting',
      caption: '',
      year:    ''
    },

    // About section
    aboutTitle: 'Continuous-time methods, applied where the data is messiest.',
    about: [
      'I am a Ph.D. candidate in Industrial Engineering at <strong>UNIST</strong>, advised by Professor <strong>Sungil Kim</strong>. My research sits at the intersection of <strong>neural differential equations</strong>, <strong>conditional density estimation</strong>, and <strong>survival analysis</strong>.',
      'Most real measurement is irregular. Telescopes observe when the weather allows; patients visit when something feels wrong. Rather than forcing that data onto a fixed grid, I work with models defined at every instant — which turns out to matter for detecting the moment a galactic nucleus changes state, and for deciding a first hormone dose for a patient who has never been treated.',
      'Right now my work centres on four threads: continuous-time modeling, time series foundation models, remaining useful life prediction, and survival analysis — and on what each of them can borrow from the others.'
    ],
    interests: [
      'Continuous-time Modeling',
      'Time Series Foundation Models',
      'Remaining Useful Life',
      'Survival Analysis'
    ],

    // Small fact list printed under the portrait
    facts: [
      { label: 'Affiliation', value: 'Department of Industrial Engineering, UNIST' },
      { label: 'Advisor',     value: 'Prof. Sungil Kim' },
      { label: 'Based in',    value: 'Ulsan, Republic of Korea' },
      { label: 'Working on',  value: 'Continuous-time models for irregular data' }
    ]
  },

  /* ── 2. Links (nav + footer + contact) ──────────────────────────────────
   *  Leave href as '' and the link is skipped everywhere.
   * -------------------------------------------------------------------- */
  links: {
    scholar:  'https://scholar.google.com/citations?user=yP1DmawAAAAJ&hl=ko',
    github:   'https://github.com/seungsukam',
    linkedin: '',            // ← paste your LinkedIn profile URL here
    cv:       ''             // ← optional: e.g. 'files/cv.pdf'
  },

  /* ── 3. Collaborations ──────────────────────────────────────────────────
   *  CURRENTLY HIDDEN — the section was removed from index.html.
   *  To bring it back, re-add this line to index.html:
   *    <section class="logo-wall" id="logoWall"></section>
   *
   *  name : shown as a wordmark
   *  abbr : optional small tag rendered before the name (e.g. 'KAIST')
   *  logo : optional image path — e.g. 'figs/logos/kaist.svg'.
   *         If set, the image replaces the wordmark automatically.
   *  url  : optional link
   * -------------------------------------------------------------------- */
  collaborators: [
    { name: 'HD Hyundai',                                    logo: '', url: '' },
    { name: 'LG Electronics',                                logo: '', url: '' },
    { name: 'Thyroscope',                                    logo: '', url: '' },
    { name: 'Korea Astronomy and Space Science Institute', abbr: 'KASI', logo: '', url: '' },
    { name: 'Yonsei University',                             logo: '', url: '' },
    { name: 'Pusan National University',                     logo: '', url: '' },
    { name: 'KAIST',                                         logo: '', url: '' }
  ],

  // Heading above the Selected work cards.
  // 프로젝트를 추가해도 낡지 않도록 개수를 넣지 않았습니다.
  // 다른 후보: 'Six problems where time is the hard part.'
  //           'What time series look like outside the textbook.'
  //           'From quasars to turbines to patients.'
  workTitle: 'Learning dynamics from telescopes, machines, and patients.',

  /* ── 4. Selected work ───────────────────────────────────────────────────
   *  orb : 'mint' | 'peach' | 'lavender' | 'sky' | 'rose'   atmospheric tint
   *  art : 'anomaly' | 'irregular' | 'survival' | 'dosing' | 'forecast'
   *        drawn illustration shown at the top of the card
   *  image: optional photo/figure path — if set, it replaces the drawing
   * -------------------------------------------------------------------- */
  work: [
    {
      title: 'Real-time anomaly detection in quasars',
      text:  'A streaming detector for changing-state active galactic nuclei, built so that physical priors about accretion constrain what the model is allowed to call an anomaly.',
      tags:  ['Streaming', 'Physics-informed', 'Astronomy'],
      orb:   'sky',
      art:   'anomaly',
      image: 'figs/work/anomaly-quasar.webp'
    },
    {
      title: 'Classifying irregular astronomical light curves',
      text:  'Neural stochastic differential equations that read telescope observations at the times they actually happened — no interpolation, no resampling onto a grid.',
      tags:  ['Neural SDE', 'Irregular sampling', 'Classification'],
      orb:   'lavender',
      art:   'irregular',
      image: 'figs/work/irregular-lightcurves.webp'
    },
    {
      title: 'Longitudinal survival under competing risks',
      text:  'Survival models that keep updating as new measurements arrive, and stay calibrated when several outcomes compete for the same patient.',
      tags:  ['Survival analysis', 'Competing risks', 'Clinical'],
      orb:   'mint',
      art:   'survival',
      image: 'figs/work/survival-competing-risks.webp'
    },
    {
      title: 'Time series foundation models',
      text:  'Pre-training a single backbone across heterogeneous sensor and clinical series, then asking how much of that transfer survives when the sampling is irregular.',
      tags:  ['Foundation model', 'Pre-training', 'Transfer'],
      orb:   'rose',
      art:   'foundation',
      image: 'figs/work/foundation-tsfm.webp'
    },
    {
      title: 'Remaining useful life prediction',
      text:  'Degradation models that estimate how much life a machine has left from its condition-monitoring history, and say how confident that estimate is.',
      tags:  ['Prognostics', 'RUL', 'Industrial'],
      orb:   'sky',
      art:   'rul',
      image: 'figs/work/rul-prognostics.webp'
    },
    {
      title: 'Personalized thyroid hormone dosing',
      text:  'Deep survival models that recommend an initial dose for patients with thyroid hormone disorders, learned from treatment histories rather than fixed protocols.',
      tags:  ['Healthcare', 'Recommendation', 'Deep survival'],
      orb:   'peach',
      art:   'dosing',
      image: 'figs/work/dosing-thyroid.webp'
    }
  ],

  /* ── 5. Publications — journal and conference kept separate ─────────────
   *  links: [{ label:'arXiv', href:'https://…' }]  — omit if none
   * -------------------------------------------------------------------- */
  publications: {
    // Empty groups are skipped automatically — add a journal paper here later.
    journal: [],

    conference: [
      {
        year:    '2025',
        title:   'Modeling irregular astronomical time series with neural stochastic delay differential equations',
        authors: 'Oh, Y.; Kam, S.; Lim, D.; Kim, S.',
        venue:   'CIKM',
        links:   [
          { label: 'ACM DL', href: 'https://dl.acm.org/doi/10.1145/3746252.3760805' },
          { label: 'arXiv',  href: 'https://arxiv.org/abs/2508.17521' }
        ]
      },
      {
        year:    '2025',
        title:   'Comprehensive review of neural differential equations for time series analysis',
        authors: 'Oh, Y.; Kam, S.; Lee, J.; Lim, D.; Kim, S.; Bui, A.',
        venue:   'IJCAI',
        kind:    'Survey Track',
        links:   [
          { label: 'IJCAI', href: 'https://www.ijcai.org/proceedings/2025/1179' },
          { label: 'arXiv', href: 'https://arxiv.org/abs/2502.09885' }
        ]
      }
    ],

    // 심사 중 — 연도 없이 표시됩니다
    underReview: [
      {
        year:    '',
        title:   'ASTRA: Unsupervised fault localization via attention shift in time-series using iTransformer',
        authors: 'Kam, S.; Kang, T.; Kim, S.',
        venue:   'Under review'
      },
      {
        year:    '',
        title:   'EU-Surv: Event uncertainty-aware deep dynamic survival modeling for personalized risk prediction under competing risks',
        authors: 'Kam, S.; Shin, K.; Yoo, W.; Kim, S.',
        venue:   'Under review'
      },
      {
        year:    '',
        title:   'Machine learning method to detect changing states in quasar light curves. I. Online analysis of single-band light curves for stochastic changing states',
        authors: 'Kam, S.; Shin, M.; Yoo, J.; Kim, S.',
        venue:   'Under review'
      }
    ],

    workshop: [
      {
        year:    '2024',
        title:   'Neural Langevin-type stochastic differential equations for astronomical time series classification under irregular observations',
        authors: 'Oh, Y.; Kam, S.; Lim, D.; Kim, S.',
        venue:   'ICLR Workshop'
      },
      {
        year:    '2024',
        title:   'Enhancing astronomical time series classification with neural stochastic differential equations under irregular observations',
        authors: 'Oh, Y.; Kam, S.; Lim, D.; Kim, S.',
        venue:   'AAAI Workshop',
        links:   [{ label: 'Workshop', href: 'https://sites.google.com/vt.edu/kgml-bridge-aaai-24/#h.8bxu7wv3ha6t' }]
      }
    ]
  },

  /* ── 6. Talks & presentations ───────────────────────────────────────────
   *  kind: 'Oral' | 'Poster' | 'Invited' | 'Seminar'   (optional)
   * -------------------------------------------------------------------- */

  talks: [
    {
      year:    '2026',
      title:   'Deep learning framework for personalized antithyroid dose recommendation using dual survival models',
      authors: 'Kam, S.; Shin, K.; Yoo, W.; Kim, S.',
      venue:   'IISE Annual Conference & Expo',
      kind:    'Oral'
    },
    {
      year:    '2025',
      title:   'Detecting temporal state changes in astronomical time series data using neural differential equations',
      authors: 'Kam, S.; Oh, Y.; Shin, M.; Kim, S.',
      venue:   'INFORMS Annual Meeting',
      kind:    'Oral'
    },
    {
      year:    '2025',
      title:   'Unsupervised root-cause localization via feature-level attention shifts in iTransformer',
      authors: 'Kam, S.; Kang, T.; Kim, S.',
      venue:   'KIIE Fall Conference'
    },
    {
      year:    '2025',
      title:   'Personalized survival modeling with event layer in deep learning-based competing risk analysis',
      authors: 'Kam, S.; Shin, K.; Yoo, W.; Kim, S.',
      venue:   'KIIE Spring Conference'
    },
    {
      year:    '2024',
      title:   'Optimal and personalized dose determination for patients with thyroid hormone disorders using deep learning-based survival analysis',
      authors: 'Kam, S.; Cho, J.; Shin, K.; Moon, J.; Kim, S.',
      venue:   'IISE Annual Conference & Expo',
      kind:    'Oral'
    },
    {
      year:    '2024',
      title:   'Advancing irregular time series classification in astronomy with neural stochastic differential equations',
      authors: 'Oh, Y.; Kam, S.; Lim, D.; Kim, S.',
      venue:   'INFORMS Workshop on Data Science',
      kind:    'Oral',
      links:   [{ label: 'Workshop', href: 'https://sites.google.com/view/data-science-2024' }]
    },
    {
      year:    '2024',
      title:   'Addressing spatial gaps in XCO2 monitoring: a machine learning approach for South Korea',
      authors: 'Cho, H.; Kam, S.; Jeon, B.; Lee, K.; Kim, S.',
      venue:   'KIIE Fall Conference',
      links:   [{ label: 'Record', href: 'https://scholarworks.unist.ac.kr/handle/201301/86014' }]
    },
    {
      year:    '2024',
      title:   'Assessing user retention of connected home appliances: a survival analysis',
      authors: 'Cho, H.; Kam, S.; Hur, C.; Kim, S.',
      venue:   'KIIE Spring Conference',
      links:   [{ label: 'Record', href: 'https://scholarworks.unist.ac.kr/handle/201301/82924' }]
    },
    {
      year:    '2023',
      title:   'Optimal and personalized dose determination for patients with thyroid hormone disorders using deep learning-based survival analysis',
      authors: 'Kam, S.; Cho, J.; Shin, K.; Moon, J.; Kim, S.',
      venue:   'KIIE Fall Conference',
      links:   [{ label: 'DBpia', href: 'https://www.dbpia.co.kr/Journal/articleDetail?nodeId=NODE11609748' }]
    },
    {
      year:    '2023',
      title:   'Real-time detection of changing-state active galactic nuclei using a deep learning approach',
      authors: 'Kam, S.; Yoo, J.; Shin, M.; Kim, S.',
      venue:   'KIIE Spring Conference',
      links:   [{ label: 'Record', href: 'https://scholarworks.unist.ac.kr/handle/201301/74710' }]
    }
  ],

  /* ── 7. Teaching ────────────────────────────────────────────────────── */
  teaching: [
    {
      term:   '2026',
      course: 'Probability and Statistics for Safety and Risk Data',
      role:   'Teaching Assistant',
      org:    '2026 · Novatus AI Graduate School',
      note:   ''
    },
    {
      term:   '2024',
      course: 'LG LDC PBL Course',
      role:   'Teaching Assistant',
      org:    'Summer 2024 · LG Learning & Development Center',
      note:   ''
    },
    {
      term:   '2023',
      course: 'Statistical Quality Management',
      role:   'Teaching Assistant',
      org:    'Spring 2023 · UNIST',
      note:   ''
    }
    // ,{
    //   term:   '2025',
    //   course: 'Course name',
    //   role:   'Teaching Assistant',
    //   org:    'Spring 2025 · UNIST',
    //   note:   'Ran lab sessions and graded assignments'
    // }
  ],

  /* ── 8. Education & awards ──────────────────────────────────────────── */
  education: [
    {
      year:   '2022',
      title:  'Ph.D. (Integrated M.S./Ph.D.), Industrial Engineering',
      org:    'UNIST · 2022 – Present',
      note:   'Advisor: Prof. Sungil Kim · Ph.D. Candidate since 2024'
    },
    {
      year:   '2015',
      title:  'B.S., Industrial Engineering',
      org:    'Ajou University · 2015 – 2022'
    }
  ],

  awards: [
    {
      year:  '2026',
      title: 'Finalist, IISE QCRE Data Challenge Competition',
      org:   'Team: Yoo, J.; Lee, Y.; Yu, D.; Kam, S.'
    },
    { year: '2021', title: "Dean's List", org: 'College of Engineering, Ajou University' },
    { year: '2020', title: "Dean's List", org: 'College of Engineering, Ajou University' }
  ],

  /* ── 9. Closing call-to-action ──────────────────────────────────────── */
  cta: {
    title: 'Working on something with irregular data?',
    text:  'I am always glad to talk about continuous-time models, survival analysis, or a dataset that will not sit still.'
  }
};
