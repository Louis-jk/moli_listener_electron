import React from 'react';
import { Route, HashRouter, Routes } from 'react-router-dom';
import Splash from '../components/Splash';
import Code from '../components/Code';
import List from '../components/List';
import SessionDetail from '../components/SessionDetail';

export default function Pages() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Splash />} />
        <Route path='/code' element={<Code />} />
        <Route path='/list' element={<List />} />
        <Route path='/sessionDetail' element={<SessionDetail />} />
      </Routes>
    </HashRouter>
  );
}
