import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SplashContainer } from '../styles/Splash.Styled'

const Splash = () => {
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      navigate('/code')
    }, 2000)
  }, [])

  return (
    <SplashContainer>
      <img
        src='/assets/images/login_img.png'
        alt='MOLI 로고'
        title='MOLI 로고'
      />
    </SplashContainer>
  )
};

export default Splash
