import React from 'react'
import { Route, HashRouter, Routes } from 'react-router-dom'
import Code from '../components/Code'
import List from '../components/List'
import Splash from '../components/Splash'

export default function Pages () {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Splash />} />
        <Route path='/code' element={<Code />} />
        <Route path='/list' element={<List />} />
      </Routes>
    </HashRouter>
  )
}
