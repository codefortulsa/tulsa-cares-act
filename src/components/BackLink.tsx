import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';

import { ReactComponent as BackArrowSvg } from '../img/back-arrow.svg';

interface Props {
  hideAbout?: true;
}

const StyledBackLink = styled(Link)`
  padding: 12px 4px 4px;
  margin: 0 0 8px -4px;

  display: inline-flex;
  align-items: center;

  color: ${({ theme }) => theme.grey.base};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
const StyledBackArrowSvg = styled(BackArrowSvg)`
  width: 18px;
  height: 18px;
  margin-right: 4px;
`;

const BackLink: React.FC<Props> = ({ hideAbout }) => (
  <StyledBackLink to='/'>
    <StyledBackArrowSvg />
    <div>Back to search</div>
  </StyledBackLink>
);

export default BackLink;
