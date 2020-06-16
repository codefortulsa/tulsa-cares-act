import React, { useMemo } from 'react';
import styled from 'styled-components/macro';
import { useParams } from 'react-router-dom';

import Section from '../components/Section';
import BackLink from '../components/BackLink';
import Footer from '../components/Footer';

// Temporary Data
import data from '../tmp-data';
import Spacer from '../components/Spacer';

const SearchName = styled.h1`
  margin: 0;
  font-size: 28px;
  line-height: 34px;
`;
const SearchAddress = styled.h2`
  font-family: 'Karla';
  margin: 0;
  font-size: 16px;
  line-height: 20px;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.grey.base};
  strong {
    color: ${({ theme }) => theme.colors.grey.dark};
  }
`;
const CoveredHeading = styled.h3`
  margin: 0;
  padding: 24px 0 8px;
  font-size: 24px;
  line-height: 28px;
  color: ${({ theme }) => theme.colors.white};
  strong {
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.primary};
  }
`;
const CoveredCopy = styled.p`
  margin: 0;
  padding: 0 0 24px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.grey.light};
  strong {
    color: ${({ theme }) => theme.colors.grey.lighter};
  }
`;
const List = styled.ul`
  list-style: none;
  font-size: 20px;
  line-height: 22px;
  padding: 0;
  color: ${({ theme }) => theme.colors.grey.light};
  strong {
    color: ${({ theme }) => theme.colors.grey.lighter};
  }
  li {
    padding: 0 0 16px 24px;
    position: relative;
    display: block;
    &::before {
      position: absolute;
      content: '';
      width: 12px;
      height: 12px;
      top: 5px;
      left: 0;
      background-color: ${({ theme }) => theme.colors.primary};
      border-radius: 50%;
    }
  }
`;

const Search: React.FC = () => {
  const { query } = useParams();
  const queryName = decodeURIComponent(query);

  const result = useMemo(
    () =>
      data.find(
        ({ name, address }) =>
          name.replace(' ', '').toLowerCase() === queryName.replace(' ', '').toLowerCase() ||
          address.replace(' ', '').toLowerCase() === queryName.replace(' ', '').toLowerCase()
      ),
    [queryName]
  );
  const covered = result?.covered ?? 'maybe';

  return (
    <>
      {/* Result / Address */}
      <Section primary>
        <BackLink />
        <SearchName>{queryName}</SearchName>
        {result && (
          <SearchAddress>
            {result.address !== queryName && (
              <>
                <strong>{result.address}</strong> ·
              </>
            )}
            {result.city}, OK {result.zip}
          </SearchAddress>
        )}
        <Spacer height='24px' />
      </Section>

      {/* "Covered" or not, response */}
      <Section>
        {/* Is covered */}
        {covered === true && (
          <>
            <CoveredHeading>
              <strong>You may be eligible</strong> for eviction relief!
            </CoveredHeading>
            <CoveredCopy>
              Our records show this property is covered under the CARES act.{' '}
              <strong>
                If you have received an eviction notice, please follow the steps below to find out
                more:
              </strong>
            </CoveredCopy>
            <List>
              <li>
                <a href='https://csctulsa.org/211eok/' target='_blank' rel='noopener noreferrer'>
                  Contact 211
                </a>{' '}
                to connect with resources.
              </li>
              <li>
                <strong>Attend your eviction hearing</strong> and visit the resource table located
                onsite to connect with legal representation and other resources.
              </li>
            </List>
          </>
        )}

        {/* Is not covered */}
        {covered === false && (
          <>
            <CoveredHeading>
              This property is <strong>not covered</strong> by the CARES act.
            </CoveredHeading>
            <CoveredCopy>
              Our records show this property does not meet the requirements to be eligible for
              eviction relief.{' '}
              <strong>
                However, you may still be able to receive assitance! If you have received an
                eviction notice, please follow the steps below:
              </strong>
            </CoveredCopy>
            <List>
              <li>
                <a href='https://csctulsa.org/211eok/' target='_blank' rel='noopener noreferrer'>
                  Contact 211
                </a>{' '}
                to connect with resources.
              </li>
              <li>
                <strong>Attend your eviction hearing</strong> and visit the resource table located
                onsite to connect with legal representation and other resources.
              </li>
            </List>
          </>
        )}

        {/* May be covered */}
        {covered === 'maybe' && (
          <>
            <CoveredHeading>
              This property is <strong>not yet listed</strong>.
            </CoveredHeading>
            <CoveredCopy>
              We don’t have enough information to know if this address is covered by the CARES act
              or not.{' '}
              <strong>
                If you have received an eviction notice, please follow the steps below:
              </strong>
            </CoveredCopy>
            <List>
              <li>
                <a href='https://csctulsa.org/211eok/' target='_blank' rel='noopener noreferrer'>
                  Contact 211
                </a>{' '}
                to connect with resources.
              </li>
              <li>
                <strong>Attend your eviction hearing</strong> and visit the resource table located
                onsite to connect with legal representation and other resources.
              </li>
            </List>
          </>
        )}
      </Section>

      {/* Footer */}
      <Footer />
    </>
  );
};
export default Search;
