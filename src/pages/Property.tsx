import React, { useMemo, useEffect, useState } from 'react';
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
  color: ${({ theme }) => theme.grey.base};
  strong {
    color: ${({ theme }) => theme.grey.dark};
  }
`;
const CoveredHeading = styled.h3`
  margin: 0;
  padding: 24px 0 8px;
  font-size: 24px;
  line-height: 28px;
  color: ${({ theme }) => theme.white};
  strong {
    text-decoration: underline;
    color: ${({ theme }) => theme.primaryAccent};
  }
  /* Email us */
  small a {
    display: inline-block;
    margin: 8px;
    padding: 0 8px;
    font-size: 14px;
    border: 1px solid ${({ theme }) => theme.grey.dark};
    border-radius: 4px;

    font-weight: normal;
    color: ${({ theme }) => theme.grey.base};
    text-decoration: none;

    &:hover {
      border: 1px solid ${({ theme }) => theme.grey.light};
      color: ${({ theme }) => theme.grey.lighter};
    }
  }
`;
const CoveredCopy = styled.p`
  margin: 0;
  padding: 0 0 24px;
  line-height: 20px;
  color: ${({ theme }) => theme.grey.light};
  strong {
    color: ${({ theme }) => theme.grey.lighter};
  }
`;
const List = styled.ul`
  list-style: none;
  font-size: 20px;
  line-height: 22px;
  padding: 0;
  color: ${({ theme }) => theme.grey.light};
  strong {
    color: ${({ theme }) => theme.grey.lighter};
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
      background-color: ${({ theme }) => theme.primaryAccent};
      border-radius: 50%;
    }
  }
  a {
    color: ${({ theme }) => theme.primaryAccent};
  }
`;
const FlyerButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  padding: 12px 24px 12px 16px;
  margin: 32px auto;

  appearance: none;
  outline: none;
  border: 2px solid ${({ theme }) => theme.grey.darkest};
  background-color: ${({ theme }) => theme.grey.darkest};
  border-radius: 6px;

  &:hover {
    border: 2px solid ${({ theme }) => theme.primary};
    img {
      transform: scale(1.2) rotate(-3deg);
    }
  }

  img {
    margin: -24px 24px -24px 0;
    width: 64px;
    border-radius: 2px;
    transform: rotate(-9deg);
    transition: transform 400ms ease;
  }
  div {
    text-align: left;
    color: ${({ theme }) => theme.grey.lighter};
    strong {
      font-size: 18px;
      color: ${({ theme }) => theme.primaryAccent};
    }
  }
`;
const FlyerModal = styled.div<{ show: boolean }>`
  z-index: 1000;
  position: fixed;
  top: 12px;
  left: 12px;
  height: calc(100vh - 24px);
  width: calc(100vw - 24px);
  background-color: ${({ theme }) => theme.grey.lightest};
  border-radius: 12px;
  box-shadow: 0px 0px 0.996336px rgba(13, 13, 13, 0.0383252),
    0px 0px 2.75474px rgba(13, 13, 13, 0.055), 0px 0px 6.63236px rgba(13, 13, 13, 0.0716748),
    0px 0px 22px rgba(13, 13, 13, 0.11);
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;

  transform: ${({ show }) => (show ? 'scale(1)' : 'scale(0)')};
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: transform 400ms ease, opacity 400ms ease;

  img {
    display: block;
    width: calc(100% - 24px);
    max-width: 768px;
    margin: 16px auto;
    border-radius: 8px;
    box-shadow: 0px 0px 0.996336px rgba(13, 13, 13, 0.0383252),
      0px 0px 2.75474px rgba(13, 13, 13, 0.055), 0px 0px 6.63236px rgba(13, 13, 13, 0.0716748),
      0px 0px 22px rgba(13, 13, 13, 0.11);
  }
`;
const ModalHeader = styled.div`
  position: sticky;
  display: flex;
  top: 0;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.white};
  box-shadow: 0px 0px 0.996336px rgba(13, 13, 13, 0.0383252),
    0px 0px 2.75474px rgba(13, 13, 13, 0.055), 0px 0px 6.63236px rgba(13, 13, 13, 0.0716748),
    0px 0px 22px rgba(13, 13, 13, 0.11);
  button {
    background: none;
    font-size: 20px;
    border: none;
    color: ${({ theme }) => theme.primary};
    font-weight: bold;
  }
  span {
    flex: 1;
  }
  /* box-shadow: 0px 0px 0.996336px rgba(13, 13, 13, 0.0383252),
    0px 0px 2.75474px rgba(13, 13, 13, 0.055), 0px 0px 6.63236px rgba(13, 13, 13, 0.0716748),
    0px 0px 22px rgba(13, 13, 13, 0.11); */
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

  // Show/hid eviction flyer state
  const [showFlyer, setShowFlyer] = useState(false);

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
              <a href='tel:211' onClick={() => analytics.logEvent('dial-211')}>
                Dial 2-1-1
              </a>{' '}
              or visit{' '}
              <a
                href='https://csctulsa.org/211eok/'
                target='_blank'
                rel='noopener noreferrer'
                onClick={() => analytics.logEvent('visit-211')}
              >
                www.211eok.org
              </a>{' '}
              to connect with 2-1-1 of Eastern Oklahoma.
            </li>
            <li>
              <strong>Attend your eviction hearing</strong> and connect with resources including
              legal representation and mediation.
            </li>
          </List>
          {/* Eviction Resource Flyer ( Button ) */}
          <FlyerButton
            onClick={() => {
              setShowFlyer(true);
              analytics.logEvent('view-flyer');
            }}
          >
            <img
              src='/img/CSC_211EOK-EvictionResourceFlyer_6.11.20-small.png'
              alt='Eviction Resource Flyer - Thumbnail'
            />
            <div>
              Review our <strong>Eviction Resource Flyer</strong>
            </div>
          </FlyerButton>
        </Section>
      )}

      {/* Footer */}
      <Footer />

      {/* Eviction Resource Flyer ( Modal ) */}
      <FlyerModal show={showFlyer}>
        <ModalHeader>
          <span />
          <button
            onClick={() => {
              setShowFlyer(false);
              analytics.logEvent('hide-flyer');
            }}
          >
            Close
          </button>
        </ModalHeader>
        <img
          src='/img/CSC_211EOK-EvictionResourceFlyer_6.11.20.png'
          alt='Eviction Resource Flyer'
        />
      </FlyerModal>
    </>
  );
};
export default Property;
