import { useNavigate } from 'react-router-dom';

// Internal pages such as Tech News open in a new tab on desktop, but on phones a new
// tab is clumsy, so there the link navigates in place (client-side, starting at the top).
// Works in both themes. External URLs, desktop clicks and Cmd/Ctrl/Shift-clicks keep
// their normal new-tab behavior.
const PHONE = '(max-width: 768px)';

export default function useTechNewsLink(path = '/tech-news/') {
  const navigate = useNavigate();
  return (e) => {
    if (!path || !path.startsWith('/')) return;                  // external link
    if (e.metaKey || e.ctrlKey || e.shiftKey || !window.matchMedia(PHONE).matches) return;
    e.preventDefault();
    navigate(path);
    window.scrollTo(0, 0);
  };
}
