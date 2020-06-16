import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';

interface Props {
  hideAbout?: true;
}

const OuterWrapper = styled.div<Props>`
  z-index: 300;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.grey.darkest};
`;
const InnerWrapper = styled.div`
  margin: 0 auto;
  max-width: 768px;
  padding: 0 16px;

  display: flex;
  align-items: center;
`;
const Button = styled.button<{ active?: boolean }>`
  appearance: none;
  background: none;
  border: none;
  padding: 16px 8px;
  text-decoration: ${({ active }) => (active ? 'underline' : 'none')};
  color: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.grey.light)};
  &:hover {
    text-decoration: underline;
  }
`;
const Expanded = styled.div`
  flex: 1;
`;

const Footer: React.FC<Props> = ({ hideAbout }) => (
  <OuterWrapper hideAbout={hideAbout}>
    <InnerWrapper>
      {/* Language Selectors */}
      {/* <Button active>English</Button>
      <Button>Español</Button> */}

      <Expanded />

      {/* About page link ( hidden on about page ) */}
      {!hideAbout && (
        <Button as={Link} to='/about'>
          About this website
        </Button>
      )}

      <Expanded />
    </InnerWrapper>
  </OuterWrapper>
);

export default Footer;
