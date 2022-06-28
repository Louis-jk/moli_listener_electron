import React from 'react';
import { Route, HashRouter, Routes } from 'react-router-dom';
import Splash from '../screens/Splash';
import Login from '../screens/Login';
import EmailLogin from '../screens/Login/EmailLogin';
import Code from '../screens/Code';
import List from '../screens/List';
import SessionDetail from '../screens/SessionDetail';

export default function Pages() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Splash />} />
        <Route path='/login' element={<Login />} />
        <Route path='/emailLogin' element={<EmailLogin />} />
        <Route path='/code' element={<Code />} />
        <Route path='/list' element={<List />} />
        <Route path='/sessionDetail' element={<SessionDetail />} />
      </Routes>
    </HashRouter>
  );
}
