import { ButtonType, ConferenceInfoType, MarginType } from '../types';

// Common.Styled interfaces
export interface MarginProps {
  type: MarginType;
  size: number;
}
export interface ButtonProps {
  type: ButtonType;
}

export interface WrapperProps {
  isFrameMin?: boolean;
}

export interface TabProps {
  active: boolean;
}

export interface LoadingWrapProp {
  isTransparent: boolean;
}

export interface VerticalLineProps {
  height: number;
}

// Lists.Styled interfaces
export interface ConferenceInfoWrapProp {
  type: ConferenceInfoType;
}

// Login.Styled interfaces
export interface CustomNotifyProps {
  visible: boolean;
  error: boolean;
}

// Register.Styled interfaces
export interface TermsCheckBoxProps {
  checked: boolean;
}

export interface CodeInputProps {
  visible: boolean;
}

// SessionDetail.Styled interfaces
export interface SessionMainInfoBoxProps {
  imageSource: string;
  isFrameMin: boolean;
}

export interface SessionTransListBoxProps {
  active: boolean;
  isMin: boolean;
}

export interface VolumeControlProp {
  value: number;
}

// Settings.Styled interfaces
export interface LangWrapProps {
  selected: boolean;
}

export interface ModalButtonProps {
  height: number;
}
