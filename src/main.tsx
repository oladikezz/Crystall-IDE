import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { loader } from '@monaco-editor/react';
import './index.css';
import App from './App.tsx';

// Configure offline local Monaco distribution
loader.config({
  paths: {
    vs: './monaco/vs'
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
