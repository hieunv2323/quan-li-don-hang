import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core'; // Import MantineProvider
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@mantine/core/styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS
    theme={{
      colorScheme: 'light', // hoặc 'dark'
      primaryColor: 'blue', // hoặc màu khác
    }}>
      <App />
    </MantineProvider>
  </React.StrictMode>
);

reportWebVitals();
