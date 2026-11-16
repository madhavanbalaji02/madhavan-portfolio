import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { projectsData } from './projectsData';
import scrollToSection from '../scrollToSection';

// ⌘K / Ctrl+K: jump to any section, project or link from the keyboard.
// It appears and disappears instantly, with no animation: something used many times
// should feel immediate (Rauno Freiberg, "Invisible Details of Interaction Design").

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
export const commandKeyLabel = isMac ? '⌘K' : 'Ctrl K';
export const openCommandMenu = () => window.dispatchEvent(new Event('open-command-menu'));

const SECTIONS = [
  ['#about', 'About'], ['#experience', 'Experience'], ['#projects', 'Projects'],
  ['#patent', 'Patent'], ['#writing', 'Writing'], ['#contact', 'Contact'],
];
const EMAIL = 'madhavanbalaji02@gmail.com';

// Lower is better; null means no match
function score(query, text) {
  if (!query) return 0;
  const q = query.toLowerCase(), t = text.toLowerCase();
  if (t.startsWith(q)) return 0;
  if (t.split(/[\s/·,-]+/).some((w) => w.startsWith(q))) return 1;
  if (t.includes(q)) return 2;
  let i = 0;
  for (const ch of t) if (ch === q[i]) i += 1;
  return i === q.length ? 3 : null;
}

export default function CommandMenu({ theme, toggleTheme }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [flash, setFlash] = useState('');
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const lastFocus = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const goSection = useCallback((id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => scrollToSection(id), 250);
    } else {
      scrollToSection(id);
    }
  }, [location.pathname, navigate]);

  const items = useMemo(() => [
    ...SECTIONS.map(([id, label]) => ({ id: `s${id}`, group: 'Sections', label, icon: 'fas fa-hashtag', run: () => goSection(id) })),
    ...projectsData.map((p) => ({
      id: `p-${p.slug}`, group: 'Projects', label: p.title, hint: p.categoryLabel, icon: p.catIcon,
      keywords: `${p.tags.join(' ')} ${p.categoryLabel}`,
      run: () => navigate(p.slug === 'daily-tech-intel' ? '/tech-news/' : `/project/${p.slug}/`),
    })),
    { id: 'l-resume', group: 'Links', label: 'Résumé', hint: 'PDF', icon: 'fas fa-file-lines', run: () => window.open('/resume.html', '_blank', 'noopener') },
    { id: 'l-news', group: 'Links', label: 'Daily Tech Intel', hint: 'Today’s briefing', icon: 'fas fa-newspaper', run: () => navigate('/tech-news/') },
    { id: 'l-github', group: 'Links', label: 'GitHub', icon: 'fab fa-github', run: () => window.open('https://github.com/madhavanbalaji02', '_blank', 'noopener') },
    { id: 'l-linkedin', group: 'Links', label: 'LinkedIn', icon: 'fab fa-linkedin', run: () => window.open('https://www.linkedin.com/in/madhavanbalaji/', '_blank', 'noopener') },
    { id: 'l-medium', group: 'Links', label: 'Medium', icon: 'fab fa-medium', run: () => window.open('https://medium.com/@madhavanbalaji02', '_blank', 'noopener') },
    { id: 'l-hf', group: 'Links', label: 'Hugging Face', icon: 'fas fa-face-smile', run: () => window.open('https://huggingface.co/madhavan02', '_blank', 'noopener') },
    { id: 'a-email', group: 'Actions', label: 'Copy email address', hint: EMAIL, icon: 'fas fa-copy', keep: true,
      run: () => { navigator.clipboard?.writeText(EMAIL).then(() => setFlash('Email copied')).catch(() => { window.location.href = `mailto:${EMAIL}`; }); } },
    { id: 'a-mail', group: 'Actions', label: 'Send an email', icon: 'fas fa-envelope', run: () => { window.location.href = `mailto:${EMAIL}`; } },
    { id: 'a-theme', group: 'Actions', label: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode', icon: theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon', keywords: 'theme appearance', run: toggleTheme },
  ], [goSection, navigate, theme, toggleTheme]);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return items;
    return items
      .map((it) => {
        const s = [score(q, it.label), it.keywords ? score(q, it.keywords) : null, it.hint ? score(q, it.hint) : null]
          .filter((v) => v !== null);
        return s.length ? { it, s: Math.min(...s) + (score(q, it.label) === null ? 0.5 : 0) } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.s - b.s)
      .map((r) => r.it);
  }, [items, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActive(0);
    setFlash('');
    lastFocus.current?.focus?.();
  }, []);

  const run = (item) => {
    if (!item) return;
    if (item.keep) { item.run(); return; }
    close();
    item.run();
  };

  // ⌘K / Ctrl+K toggles; the navbar button opens it through an event
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => { if (!o) lastFocus.current = document.activeElement; return !o; });
      }
    };
    const onOpen = () => { lastFocus.current = document.activeElement; setOpen(true); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-command-menu', onOpen);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('open-command-menu', onOpen); };
  }, []);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  useEffect(() => { setActive(0); setFlash(''); }, [query]);
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(results.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); run(results[active]); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
  };

  let lastGroup = null;
  return (
    <div className="cmdk-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="cmdk" role="dialog" aria-modal="true" aria-label="Command menu">
        <div className="cmdk-input-row">
          <i className="fas fa-magnifying-glass" aria-hidden="true" />
          <input
            ref={inputRef}
            className="cmdk-input"
            placeholder="Search projects, sections and links"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls="cmdk-list"
            aria-activedescendant={results[active] ? `cmdk-${results[active].id}` : undefined}
            autoComplete="off"
            spellCheck="false"
          />
          <kbd className="cmdk-kbd">esc</kbd>
        </div>
        <ul className="cmdk-list" id="cmdk-list" role="listbox" ref={listRef}>
          {results.length === 0 && <li className="cmdk-empty">No matches for “{query}”</li>}
          {results.map((it, i) => {
            const head = it.group !== lastGroup ? it.group : null;
            lastGroup = it.group;
            return (
              <React.Fragment key={it.id}>
                {head && <li className="cmdk-group" role="presentation">{head}</li>}
                <li
                  id={`cmdk-${it.id}`}
                  data-index={i}
                  role="option"
                  aria-selected={i === active}
                  className={`cmdk-item${i === active ? ' is-active' : ''}`}
                  onMouseMove={() => { if (i !== active) setActive(i); }}
                  onClick={() => run(it)}
                >
                  <i className={`${it.icon} cmdk-icon`} aria-hidden="true" />
                  <span className="cmdk-label">{it.label}</span>
                  {it.hint && <span className="cmdk-hint">{flash && it.keep ? flash : it.hint}</span>}
                  {i === active && <kbd className="cmdk-enter" aria-hidden="true">↵</kbd>}
                </li>
              </React.Fragment>
            );
          })}
        </ul>
        <div className="cmdk-foot" aria-hidden="true">
          <span><kbd>↑</kbd><kbd>↓</kbd> to move</span>
          <span><kbd>↵</kbd> to open</span>
          <span><kbd>{commandKeyLabel}</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
