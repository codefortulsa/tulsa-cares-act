import React, { useMemo, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useParams } from 'react-router-dom';
import usePageView from '../hooks/usePageView';
import useProperties from '../hooks/useProperties';
import { analytics } from '../lib/firebase';

import Loader from '../components/Loader';
import Section from '../components/Section';
import BackLink from '../components/BackLink';
import Footer from '../components/Footer';
import Spacer from '../components/Spacer';

const PropertyName = styled.h1`
  margin: 0;
  font-size: 28px;
  line-height: 34px;
`;
const PropertyAddress = styled.h2`
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
  /* Email us */
  small a {
    display: inline-block;
    margin: 8px;
    padding: 0 8px;
    font-size: 14px;
    border: 1px solid ${({ theme }) => theme.colors.grey.dark};
    border-radius: 4px;

    font-weight: normal;
    color: ${({ theme }) => theme.colors.grey.base};
    text-decoration: none;

    &:hover {
      border: 1px solid ${({ theme }) => theme.colors.grey.light};
      color: ${({ theme }) => theme.colors.grey.lighter};
    }
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

const Property: React.FC = () => {
  const { query } = useParams();
  const queryName = decodeURIComponent(query);
  usePageView(`${queryName} | Tulsa County CARES Act - Covered Properties Database`);

  // Evictions properties from GSheet
  const [properties, propertiesAreFetching] = useProperties();

  const result = useMemo(
    () =>
      properties.find(
        ({ name, address }) =>
          name.replace(' ', '').toLowerCase() === queryName.replace(' ', '').toLowerCase() ||
          address.replace(' ', '').toLowerCase() === queryName.replace(' ', '').toLowerCase()
      ),
    [properties, queryName]
  );
  const covered = result?.covered ?? 'maybe';

  // Analytics view event
  useEffect(() => {
    if (!propertiesAreFetching) {
      analytics.logEvent('view-property', { inDatabase: !!result });
    }
  }, [propertiesAreFetching, result]);

  return (
    <>
      {/* Result / Address */}
      <Section primary>
        <BackLink />
        <PropertyName>{queryName}</PropertyName>
        {result && (
          <PropertyAddress>
            {result.address !== queryName && (
              <>
                <strong>{result.address}</strong> ·
              </>
            )}
            {result.city}, OK {result.zip}
          </PropertyAddress>
        )}
        <Spacer height='24px' />
      </Section>
      {/* Show loader if is still loading from GSheets */}
      {propertiesAreFetching && <Loader />}

      {/* "Covered" or not, response ( if finished loading ) */}
      {!propertiesAreFetching && (
        <Section>
          {/* Is covered */}
          {covered === true && (
            <>
              <CoveredHeading>
                <strong>You may be eligible</strong> for eviction protection!
              </CoveredHeading>
              <CoveredCopy>
                Our records show this property is covered under the CARES act.{' '}
                <strong>
                  If you have received an eviction notice or summons, please follow the steps below
                  to find out more:
                </strong>
              </CoveredCopy>
            </>
          )}

          {/* Is not covered */}
          {covered === false && (
            <>
              <CoveredHeading>
                This property <strong>may not be covered</strong> by the CARES act.
              </CoveredHeading>
              <CoveredCopy>
                While this property is not covered according to publicly available information on
                federally-backed mortgages, it may be covered under other provisions of the CARES
                Act.{' '}
                <strong>
                  You may still be able to get support! Please follow the steps below:
                </strong>
              </CoveredCopy>
            </>
          )}

          {/* May be covered */}
          {covered === 'maybe' && (
            <>
              <CoveredHeading>
                This property is <strong>not yet listed</strong>.{' '}
                <small>
                  <a
                    href={`mailto:${encodeURIComponent(
                      'Tulsa CARES Act Admin<erin.willis@housingsolutionstulsa.org>'
                    )}?subject=${encodeURIComponent(
                      'Tulsa CARES Act - Missing Property'
                    )}&body=${encodeURIComponent(
                      `I found an address that is not listed in the Tulsa County CARES Act Covered Properties Database.\n\n${queryName} - https://tulsacaresact.com/${query}`
                    )}`}
                    onClick={() => analytics.logEvent('report-property')}
                  >
                    Email us about it
                  </a>
                </small>
              </CoveredHeading>

              <CoveredCopy>
                We don’t have enough information to know if this address is covered by the CARES act
                or not.{' '}
                <strong>
                  If you have received an eviction notice or summons, please follow the steps below:
                </strong>
              </CoveredCopy>
            </>
          )}

          {/* Next steps */}
          <List>
            <li>
              <a
                href='https://csctulsa.org/211eok/'
                target='_blank'
                rel='noopener noreferrer'
                onClick={() => analytics.logEvent('visit211')}
              >
                Contact 211
              </a>{' '}
              to connect with resources.
            </li>
            <li>
              <strong>Attend your eviction hearing</strong> and connect with resources including
              legal representation and mediation.
            </li>
          </List>
        </Section>
      )}

      {/* Footer */}
      <Footer />
    </>
  );
};
export default Property;
