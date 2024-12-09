import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/sdk';

import { StateContextProvider } from './context';
import App from './App';
import './index.css';

// Add a null check to satisfy TypeScript's type system
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element not found. Check your HTML.");
}

const root = ReactDOM.createRoot(rootElement);

// TSX supports JSX syntax with type checking
root.render(
  <React.StrictMode>
    <ThirdwebProvider desiredChainId={ChainId.Sepolia}> 
      <Router>
        <StateContextProvider>
          <App />
        </StateContextProvider>
      </Router>
    </ThirdwebProvider>
  </React.StrictMode>
);

