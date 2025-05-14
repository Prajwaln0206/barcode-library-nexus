
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Create the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Create React root and render the app
createRoot(rootElement).render(<App />);
