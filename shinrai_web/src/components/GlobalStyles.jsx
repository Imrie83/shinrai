const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --ink:          #0f0e0d;
      --paper:        #f7f4ef;
      --cream:        #ede9e2;
      --indigo:       #2c3fa0;
      --indigo-dark:  #1e2d82;
      --indigo-light: #eef0fb;
      --accent:       #c9a84c;
      --muted:        #7a7570;
      --white:        #ffffff;
      --serif:        'DM Serif Display', Georgia, serif;
      --sans:         'DM Sans', system-ui, sans-serif;
      --radius:       16px;
      --shadow-sm:    0 2px 12px rgba(0,0,0,0.05);
      --shadow-lg:    0 16px 48px rgba(44,63,160,0.15);
    }
    html  { scroll-behavior: smooth; }
    body  { font-family: var(--sans); background: var(--paper); color: var(--ink); -webkit-font-smoothing: antialiased; }
    ::selection { background: var(--indigo); color: white; }
    ::-webkit-scrollbar       { width: 5px; }
    ::-webkit-scrollbar-track { background: var(--paper); }
    ::-webkit-scrollbar-thumb { background: var(--indigo); border-radius: 99px; }
    a   { color: inherit; text-decoration: none; }
    .tag {
      display: inline-block;
      background: var(--indigo-light);
      color: var(--indigo);
      font-size: 11px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 99px;
    }
  `}</style>
);

export default GlobalStyles;
