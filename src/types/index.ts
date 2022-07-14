// 로그인 관련 타입들
export type LoginType = 'email' | 'sns';
export type SnsType = 'kakao' | 'naver' | 'google' | 'facebook' | '';
export type LoginButtonType = 'login' | 'register';

// 공통 헤더 타입들
export type HeaderType =
  | 'main'
  | 'detail'
  | 'session'
  | 'session_active'
  | 'not'
  | 'code'
  | 'general';

// Style 타입들
export type MarginType = 'top' | 'right' | 'bottom' | 'left';
export type ButtonType = 'full' | 'line' | 'disable' | 'grayLine';
export type ConferenceInfoType = 'conference' | 'session';
