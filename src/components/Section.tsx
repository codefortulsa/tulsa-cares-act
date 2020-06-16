import React from 'react';
import styled from 'styled-components/macro';

interface Props {
  primary?: true;
}

const OuterWrapper = styled.div<Props>`
  z-index: ${({ primary }) => (primary ? 100 : 200)};
  /* position: ${({ primary }) => (primary ? 'sticky' : 'relative')}; */
  top: 0;
  width: 100%;
  background-color: ${({ primary, theme }) => (primary ? theme.colors.white : theme.colors.black)};
  color: ${({ primary, theme }) => (primary ? theme.colors.black : theme.colors.white)};
`;
const InnerWrapper = styled.div`
  margin: 0 auto;
  max-width: 768px;
  padding: 0 24px;
`;

const Section: React.FC<Props> = ({ primary, children }) => {
  return (
    <OuterWrapper primary={primary}>
      <InnerWrapper>{children}</InnerWrapper>
    </OuterWrapper>
  );
};
export default Section;
