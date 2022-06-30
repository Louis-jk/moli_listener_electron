import React from 'react';
import { Route, HashRouter, Routes } from 'react-router-dom';
import Splash from '../screens/Splash';
import Login from '../screens/Login';
import EmailLogin from '../screens/Login/EmailLogin';
import ChangePwd from '../screens/Login/ChangePwd';
import Code from '../screens/Code';
import List from '../screens/Conference/List';
import SessionDetail from '../screens/Conference/SessionDetail';
import ConferenceDetail from '../screens/Conference/ConferenceDetail';
import Terms from '../screens/Register/Terms';
import Register from '../screens/Register/Register';
import RegisterCode from '../screens/Register/RegisterCode';
import Settings from '../screens/Settings';
import TermsOfUse from '../screens/TermsOfUse';
import PrivacyPolicy from '../screens/TermsOfUse/PrivacyPolicy';

export default function Pages() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Splash />} />
        <Route path='/login' element={<Login />} />
        <Route path='/emailLogin' element={<EmailLogin />} />
        <Route path='/changePwd' element={<ChangePwd />} />
        <Route path='/code' element={<Code />} />
        <Route path='/list' element={<List />} />
        <Route path='/sessionDetail' element={<SessionDetail />} />
        <Route path='/conferenceDetail/:id' element={<ConferenceDetail />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/register' element={<Register />} />
        <Route path='/registerCode' element={<RegisterCode />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/termsOfUse' element={<TermsOfUse />} />
        <Route path='/privacyPolicy' element={<PrivacyPolicy />} />
      </Routes>
    </HashRouter>
  );
}
