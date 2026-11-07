/* research-site reader options. Loaded in <head> (small, blocking) so saved
   choices are applied before first paint. The values here are the design
   system's reader tokens; see references/design-system.md before changing them.
   Every theme/accent pair was checked for WCAG AA (body text >= 4.5:1). */
(function () {
  var doc = document.documentElement;

  var O = window.RS_OPTIONS = {
    themes: [
      { id: 'auto',     label: 'Auto',     bg: 'linear-gradient(135deg,#F6F5F3 50%,#141414 50%)', text: '#7a7a7a' },
      { id: 'paper',    label: 'Paper',    bg: '#F6F5F3', text: '#121212' },
      { id: 'sepia',    label: 'Sepia',    bg: '#F4ECD8', text: '#433422' },
      { id: 'cool',     label: 'Cool',     bg: '#F3F6FA', text: '#1A2430' },
      { id: 'white',    label: 'White',    bg: '#FFFFFF', text: '#1F1F1F' },
      { id: 'dark',     label: 'Dark',     bg: '#141414', text: '#F2F2F0', dark: true },
      { id: 'dusk',     label: 'Dusk',     bg: '#211E1A', text: '#E9E2D6', dark: true },
      { id: 'black',    label: 'Black',    bg: '#000000', text: '#E6E6E6', dark: true },
      { id: 'contrast', label: 'Contrast', bg: '#000000', text: '#FFFFFF', dark: true }
    ],
    /* "theme" = the theme's own accent; swatches show the light or dark value to match the mode */
    accents: [
      { id: 'theme',   label: 'Theme default' },
      { id: 'teal',    label: 'Teal',    light: '#177568', dark: '#3CC2AE' },
      { id: 'blue',    label: 'Blue',    light: '#0B5FD0', dark: '#7AB7FF' },
      { id: 'indigo',  label: 'Indigo',  light: '#3F3FBF', dark: '#A5B4FF' },
      { id: 'violet',  label: 'Violet',  light: '#6D28D9', dark: '#C4B5FD' },
      { id: 'crimson', label: 'Crimson', light: '#B3261E', dark: '#FF8A80' },
      { id: 'rust',    label: 'Rust',    light: '#9A3412', dark: '#F0A868' },
      { id: 'forest',  label: 'Forest',  light: '#2F6B3A', dark: '#7FD08F' },
      { id: 'ink',     label: 'Ink (no colour)', light: 'var(--text)', dark: 'var(--text)' }
    ],
    fonts: [
      { id: 'stix',     label: 'STIX Two',   note: 'Matches the maths',
        stack: '"STIX Two Text"' },
      { id: 'source',   label: 'Source Serif', note: 'Made for screens',
        stack: '"Source Serif 4"' },
      { id: 'literata', label: 'Literata',   note: 'Book-like, for long reads',
        stack: 'Literata' },
      { id: 'inter',    label: 'Inter',      note: 'Clean sans-serif',
        stack: 'Inter' },
      { id: 'atkinson', label: 'Atkinson Hyperlegible', note: 'Letters easy to tell apart',
        stack: '"Atkinson Hyperlegible Next"' },
      { id: 'system',   label: 'System',     note: 'The device\'s own serif',
        stack: '"Iowan Old Style", Charter, Georgia' }
    ],
    sizes: [15, 16, 17, 18, 19, 20, 22, 24, 26],
    leading: [
      { id: 'compact', label: 'Compact', value: 1.45 },
      { id: 'normal',  label: 'Normal',  value: 1.6 },
      { id: 'relaxed', label: 'Relaxed', value: 1.8 },
      { id: 'loose',   label: 'Loose',   value: 2.0 }
    ],
    widths: [
      { id: 'narrow', label: 'Narrow', value: '56ch' },
      { id: 'medium', label: 'Medium', value: '66ch' },
      { id: 'wide',   label: 'Wide',   value: '78ch' }
    ],
    align: [
      { id: 'left',    label: 'Left' },
      { id: 'justify', label: 'Justified' }
    ],
    weight: [
      { id: 'regular', label: 'Regular' },
      { id: 'bold',    label: 'Bolder' }
    ],

    defaults: function () {
      return { theme: 'auto', accent: 'theme', font: 'inter', size: 3,
               leading: 'normal', width: 'medium', align: 'left', weight: 'regular' };
    },
    read: function () {
      var s = O.defaults();
      try {
        var saved = JSON.parse(localStorage.getItem('rs-reader') || '{}');
        for (var k in saved) s[k] = saved[k];
      } catch (e) {}
      if (!(s.size >= 0 && s.size < O.sizes.length)) s.size = 3;
      return s;
    },
    find: function (list, id) {
      for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
      return list[0];
    },
    isDark: function (theme) {
      if (theme === 'auto') return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
      return !!O.find(O.themes, theme).dark;
    },
    apply: function (s) {
      var dark = O.isDark(s.theme);
      var theme = s.theme === 'auto' ? (dark ? 'dark' : 'paper') : s.theme;
      var font = O.find(O.fonts, s.font);
      doc.dataset.theme = theme;
      doc.dataset.mode = dark ? 'dark' : 'light';
      doc.dataset.accent = s.accent;
      doc.dataset.align = s.align;
      doc.dataset.weight = s.weight;
      doc.style.setProperty('--font-read', font.stack);
      doc.style.setProperty('--fs', O.sizes[s.size] + 'px');
      doc.style.setProperty('--lh', O.find(O.leading, s.leading).value);
      doc.style.setProperty('--measure', O.find(O.widths, s.width).value);
    }
  };

  O.apply(O.read());
  /* Auto follows the system when it switches between light and dark */
  if (window.matchMedia) {
    var mq = matchMedia('(prefers-color-scheme: dark)');
    var onChange = function () { var s = O.read(); if (s.theme === 'auto') O.apply(s); };
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
  }
})();
