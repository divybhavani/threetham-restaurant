import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initPerformanceTier } from './lib/perf';

// decide "full" or "lite" effects before anything is drawn
initPerformanceTier();

createRoot(document.getElementById('root')!).render(<App />);
