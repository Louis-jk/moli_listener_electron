import styled from 'styled-components'
import { ConferenceInfoWrapProp } from '../interfaces/styles.interface'
import { theme } from './Theme'

export const ConferenceMainWrap = styled.div`
  position: relative;
  height: 42vh;

  & > img {
    width: 100vw;
    margin-left: calc(-50vw + 50%);
    height: 30vh;
    object-fit: cover;
  }
`

export const ConferenceInfoWrap = styled.div < ConferenceInfoWrapProp > `
  padding: 1.65rem 1rem;
  background-color: ${theme.colors.LIST_WRAP_COLOR};
  border-radius: 7px;
  cursor: pointer;
  -webkit-app-region: no-drag;

  & small {
    font-size: 0.8rem;
    font-weight: bold;
    line-height: 1.3;
    color: ${theme.colors.POINT_COLOR};
  }

  ${({ type }) =>
    type === 'session'
      ? `
    &:not(:last-child) {
      margin-bottom: 12px;
    }
  `
      : `
    position: absolute;
    left: 0;
    right: 0;
    bottom: -10px;
  `}
`

export const ConferenceTitle = styled.h4`
  font-size: 1.25rem;
  line-height: 1.3;
  color: ${theme.colors.TEXT_WHITE_COLOR};
  margin: 5px auto 10px;
`

export const ConferenceDesc = styled.p < ConferenceInfoWrapProp > `
  line-height: 1.45em;
  color: ${theme.colors.TEXT_WHITE_COLOR};

  ${({ type }) =>
    type === 'session'
      ? `
    width: 95%;
    max-height: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    -webkit-line-clamp: 2;
  `
      : `
  width: 80%
  `}
`

export const ConferenceSessionImgWrap = styled.div`
  position: relative;
  min-width: 85px;
  width: 85px;
  height: 85px;

  &::after {
    position: absolute;
    bottom: -22px;
    right: -22px;
    padding: 2rem;
    content: '';
    background-image: url('images/session_arrow.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
  }
`

export const ConferenceSessionImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
`
