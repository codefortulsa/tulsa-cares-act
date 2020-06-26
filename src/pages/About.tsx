import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import usePageView from '../hooks/usePageView';
import { analytics } from '../lib/firebase';

import Section from '../components/Section';
import BackLink from '../components/BackLink';
import Footer from '../components/Footer';
import Spacer from '../components/Spacer';

const Heading = styled.h1`
  margin: 0;
  padding: 0 0 12px;
  font-size: 28px;
  line-height: 34px;
`;
const Description = styled.p`
  margin: 0;
  padding: 0 0 24px;
  line-height: 20px;
  color: ${({ theme }) => theme.grey.base};
  strong {
    color: ${({ theme }) => theme.grey.dark};
  }
`;
const LogoRow = styled.div`
  display: flex;
  align-items: stretch;
  padding: 0 0 32px;
  @media only screen and (max-width: 512px) {
    flex-direction: column;
  }
`;
const LogoLink = styled.a`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  @media only screen and (max-width: 512px) {
    padding: 12px 64px;
  }
  margin: 0 12px 12px 0;
  &::last-child {
    margin: 0;
  }
  background-color: ${({ theme }) => theme.primary};
  border-radius: 8px;
  img {
    width: 100%;
  }
`;
const SecondaryHeading = styled.h2`
  margin: 0;
  padding: 0 0 12px;
  font-size: 28px;
  line-height: 34px;
  color: ${({ theme }) => theme.white};
`;
const Copy = styled.p`
  margin: 0;
  padding: 0 0 24px;
  line-height: 20px;
  color: ${({ theme }) => theme.grey.light};
  strong,
  a {
    color: ${({ theme }) => theme.primaryAccent};
  }
`;
const Break = styled.div`
  width: 100%;
  height: 2px;
  background-color: ${({ theme }) => theme.grey.darker};
`;

const About: React.FC = () => {
  usePageView('About | Tulsa County CARES Act - Covered Properties Database');

  return (
    <>
      <Section primary>
        <BackLink />
        <Heading>About this site</Heading>
        <Description>
          The <strong>Tulsa County CARES Act Covered Properties Database</strong> is a comprehensive
          listing of rental properties inside Tulsa County. This database was developed using the
          <a href='https://nlihc.org/federal-moratoriums' target='_blank' rel='noopener noreferrer'>
            National Low-Income Housing Coalition database
          </a>
          , the{' '}
          <a
            href='https://www.oscn.net/dockets/Search.aspx'
            target='_blank'
            rel='noopener noreferrer'
          >
            Tulsa County Supreme Court database
          </a>
          , and other trusted sources to verify federally backed mortgages and federally funded
          subsidies listed for each property. This database is developed and maintained by{' '}
          <a
            href='https://www.facebook.com/pages/category/Cause/Housing-Solutions-Tulsa-105568634392642/'
            target='_blank'
            rel='noopener noreferrer'
          >
            Housing Solutions Tulsa
          </a>
          , in partnership with{' '}
          <a href='https://codefortulsa.org/' target='_blank' rel='noopener noreferrer'>
            Code for Tulsa
          </a>
          ,{' '}
          <a href='https://www.restorehope.org/' target='_blank' rel='noopener noreferrer'>
            Restore Hope Ministries
          </a>
          ,{' '}
          <a href='https://www.legalaidok.org/' target='_blank' rel='noopener noreferrer'>
            Legal Aid Services Oklahoma
          </a>
          , and the{' '}
          <a href='https://www.cityoftulsa.org/' target='_blank' rel='noopener noreferrer'>
            City of Tulsa
          </a>
          .
        </Description>
        <LogoRow>
          <LogoLink
            href='https://www.facebook.com/pages/category/Cause/Housing-Solutions-Tulsa-105568634392642/'
            target='_blank'
            rel='noopener noreferrer'
            onClick={() =>
              analytics.logEvent('visit-sponsor-link', { sponsor: 'Housing Solutions' })
            }
          >
            <img src='/img/HousingSolutions_Logo.png' alt='Housing Solutions - Logo' />
          </LogoLink>
          <LogoLink
            href='https://csctulsa.org/211eok/'
            target='_blank'
            rel='noopener noreferrer'
            onClick={() => analytics.logEvent('visit-sponsor-link', { sponsor: '211' })}
          >
            <img src='/img/211EasternOklahoma_Logo.png' alt='211 Eastern Oklahoma - Logo' />
          </LogoLink>
          <LogoLink
            href='https://codefortulsa.org/'
            target='_blank'
            rel='noopener noreferrer'
            onClick={() => analytics.logEvent('visit-sponsor-link', { sponsor: 'Code for Tulsa' })}
          >
            <img src='/img/CodeForTulsa_Logo.png' alt='Code for Tulsa - Logo' />
          </LogoLink>
        </LogoRow>
      </Section>

      <Section>
        <Spacer height='32px' />
        <SecondaryHeading>Using this site</SecondaryHeading>
        <Copy>
          To search, begin typing the property name or address on the <Link to='/'>home page</Link>.
          The search will return one of the following answers:
        </Copy>
        <Copy>
          <strong>Is covered</strong> indicates that a federally backed mortgage was confirmed for
          this property. Any eviction filed for non-payment of rent is illegal. This protection ends
          on July 25, 2020.
        </Copy>
        <Copy>
          <strong>May not be covered</strong> indicates that a federally backed mortgage was not
          found for this property. However, even if your property is not backed by a federal
          mortgage, if a federal subsidy is being utilized this unit may be covered under the CARES
          Act. Examples of federal subsidies include: section 8 vouchers, tax credit units, etc.
        </Copy>
        <Copy>
          <strong>Not listed</strong> indicates this property is not in our database. Please contact
          us so we can add it.
        </Copy>

        <Spacer height='16px' />
        <Break />
        <Spacer height='24px' />
        <Copy>
          Additional questions about this database can be sent to{' '}
          <a href='mailto:evictions@housingsolutionstulsa.org'>
            evictions@housingsolutionstulsa.org
          </a>
        </Copy>
      </Section>

      {/* Footer */}
      <Footer hideAbout />
    </>
  );
};
export default About;
