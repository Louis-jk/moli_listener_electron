import { LoginType, SnsType } from '../types';

// loginReducer interface
export interface LoginProps {
  login_type: LoginType | null;
  sns_type: SnsType;
  access_token: string | null;
  mt_idx: number;
  mt_type: string;
  mt_id: string;
  mt_name: string;
  mt_level: string | number;
}

// registerReducer
export interface RegisterProps {
  set_lang: string;
  mt_id: string;
  mt_name: string;
  mt_pwd: string;
  mt_pwd_re: string;
}

// locale
export interface LocaleProps {
  locale: string;
}

// join
export interface JoinStateProps {
  isJoin: boolean;
  hours: number;
  minutes: number;
  seconds: number;
}

// frame
export interface FrameConditional {
  isMin: boolean;
}

// code
export interface CodeProps {
  code: string;
}
