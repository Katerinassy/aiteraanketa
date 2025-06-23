import React from 'react';
import { createRoot } from 'react-dom/client'; // Импортируем createRoot
import App from './App';

const root = createRoot(document.getElementById('root')); // Создаём root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);