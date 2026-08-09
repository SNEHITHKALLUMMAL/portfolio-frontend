import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import store from './redux/store';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        {/*
          reducedMotion="user" makes every Framer Motion animation in the
          app respect the OS-level prefers-reduced-motion setting
          automatically — transform/opacity animations collapse to instant
          state changes for users who've asked for that, without having to
          thread a check through every individual motion.div. The CSS rule
          in index.css handles plain CSS transitions/keyframes; this
          handles everything driven by Framer Motion specifically.
        */}
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
