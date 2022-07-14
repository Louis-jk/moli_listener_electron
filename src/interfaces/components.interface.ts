import { Dispatch, SetStateAction } from 'react';
import { HeaderType } from '../types';

// SessionDetail
export interface ItemProps {
  text: string;
}

// AudioBar
export interface AudioBarProp {
  vol: number;
}

// Header
export interface HeaderProps {
  type: HeaderType;
  title: string | JSX.Element[] | JSX.Element;
}

// TimeCount
export interface TimeCountProp {
  start: boolean;
}

// Loading
export interface LoadingWrapProp {
  isTransparent: boolean;
}

// LanguageModal
export interface LanguageModalProps {
  isOpen: boolean;
  close: () => void;
}

// LeaveModal
export interface LeaveModalProps {
  isOpen: boolean;
  close: () => void;
  setLeaveMemberSuccess: Dispatch<SetStateAction<boolean>>;
  setLeaveMemberError: Dispatch<SetStateAction<boolean>>;
  setLeaveResMsg: Dispatch<SetStateAction<string>>;
}
