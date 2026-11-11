import { useNavigate } from 'react-router-dom';

// Tech News opens in a new tab on desktop, but on phones a new tab is clumsy,
// so there the link navigates in place (client-side, starting at the top).
const PHONE = '(max-width: 768px)';

export default function useTechNewsLink() {
  const navigate = useNavigate();
  return (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || !window.matchMedia(PHONE).matches) return;
    e.preventDefault();
    navigate('/tech-news/');
    window.scrollTo(0, 0);
  };
}
