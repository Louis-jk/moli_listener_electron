import React, { useEffect } from 'react';
import '../src/styles/global.css';
import Splash from './components/Splash';
import Pages from './routes';

function App() {
  return (
    <React.StrictMode>
      <Pages />
    </React.StrictMode>
  );
}

export default App;
