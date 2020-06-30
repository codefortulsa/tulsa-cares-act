import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components/macro';
import FuzzySearch from 'fuzzy-search';
import { Link, useHistory } from 'react-router-dom';
import useProperties from '../hooks/useProperties';
import usePageView from '../hooks/usePageView';
import { analytics } from '../lib/firebase';

import Loader from '../components/Loader';
import Section from '../components/Section';
import Spacer from '../components/Spacer';
import BG from '../img/bg.jpg';
import { ReactComponent as SearchSvg } from '../img/search.svg';
import { ReactComponent as UpArrowSvg } from '../img/up-arrow.svg';
import Footer from '../components/Footer';

// Heading Section
const HeadingWrapper = styled.div`
  background-image: url("${BG}");
  background-size: cover;
  background-position: center;
`;
const Heading = styled.h1`
  max-width: 768px;
  margin: 0 auto;
  padding: 24px 16px;
  border-top: 4px solid ${({ theme }) => theme.primaryAccent};
  border-bottom: 4px solid ${({ theme }) => theme.primaryAccent};
  text-align: center;
  font-size: 36px;
  line-height: 40px;
  @media (min-width: 768px) {
    font-size: 48px;
    line-height: 52px;
  }
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-shadow: 0px 0px 0.553451px rgba(0, 0, 0, 0.101212), 0px 0px 1.33002px rgba(0, 0, 0, 0.145401),
    0px 0px 2.50431px rgba(0, 0, 0, 0.18), 0px 0px 4.46726px rgba(0, 0, 0, 0.214599),
    0px 0px 8.35552px rgba(0, 0, 0, 0.258788), 0px 0px 20px rgba(0, 0, 0, 0.36);
`;
const Subheading = styled.h2`
  max-width: 768px;
  margin: 0 auto;
  padding: 16px 24px 32px;
  text-align: center;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-shadow: 0px 0px 0.553451px rgba(0, 0, 0, 0.101212), 0px 0px 1.33002px rgba(0, 0, 0, 0.145401),
    0px 0px 2.50431px rgba(0, 0, 0, 0.18), 0px 0px 4.46726px rgba(0, 0, 0, 0.214599),
    0px 0px 8.35552px rgba(0, 0, 0, 0.258788), 0px 0px 20px rgba(0, 0, 0, 0.36);
`;
const Copy = styled.p`
  margin: 0;
  padding: 24px 24px 52px;
  text-align: center;
  font-size: 18px;
  line-height: 22px;
  background-color: rgba(17, 86, 111, 0.8);
`;
// Search Section
const SearchWrapper = styled.div`
  z-index: 250;
  position: relative;
  margin: -25px auto -25px;
  max-width: 768px;
  padding: 0 24px;
`;
const StyledSearchSvg = styled(SearchSvg)`
  position: absolute;
  top: 11px;
  left: 32px;
  width: 32px;
  height: 32px;
`;
const SearchInput = styled.input`
  width: 100%;
  padding: 12px 0 12px 42px;

  border-radius: 8px;
  border: 3px solid ${({ theme }) => theme.grey.lightest};
  box-shadow: 0px 0px 0.996336px rgba(13, 13, 13, 0.0383252),
    0px 0px 2.75474px rgba(13, 13, 13, 0.055), 0px 0px 6.63236px rgba(13, 13, 13, 0.0716748),
    0px 0px 22px rgba(13, 13, 13, 0.11);
  &:focus {
    outline: none;
    border: 3px solid ${({ theme }) => theme.primaryAccent};
  }

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  font-size: 18px;
  font-weight: bold;
  line-height: 18px;
  color: ${({ theme }) => theme.black};
  caret-color: ${({ theme }) => theme.primary};
  &::placeholder {
    font-weight: normal;
    color: ${({ theme }) => theme.grey.base};
    opacity: 1;
  }
`;
const ResultsWrapper = styled.div`
  z-index: 225;
  position: relative;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;

  padding: 6px 0 0;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.grey.lightest};
`;
const ResultLink = styled(Link)<{ selected: boolean }>`
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  padding: ${({ selected }) => (selected ? `6px 12px 6px 6px` : '6px 12px')};
  border-left: ${({ selected, theme }) => (selected ? `6px solid ${theme.primaryAccent}` : 'none')};
  background-color: ${({ selected, theme }) => (selected ? theme.white : 'none')};

  font-weight: bold;
  font-size: 18px;
  line-height: 20px;
  text-decoration: none;
  color: ${({ selected, theme }) => (selected ? theme.primary : theme.black)};
  small {
    display: block;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    color: ${({ theme }) => theme.grey.base};
  }
`;
// Post-search Section
const StyledUpArrowSvg = styled(UpArrowSvg)`
  width: 100%;
  height: 24px;
  margin-top: 12px;
  margin-bottom: 4px;
`;
const SearchInstructions = styled.div`
  padding: 0 12px;
  text-align: center;
  line-height: 18px;
  color: ${({ theme }) => theme.grey.light};
`;

// Helpers
function isTouchEnabled() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
/**
 * String.prototype.trimStart() polyfill (for IE)
 * Adapted from polyfill.io
 */
if (!String.prototype.trimStart) {
  // eslint-disable-next-line no-extend-native
  String.prototype.trimStart = function () {
    return this.replace(
      new RegExp(
        '^' +
          // eslint-disable-next-line no-control-regex
          /[\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF]+/
            .source,
        'g'
      ),
      ''
    );
  };
}

const Home: React.FC = () => {
  usePageView('Tulsa County CARES Act - Covered Properties Database');

  const history = useHistory();

  // Eviction properties from GSheet
  const [properties, propertiesAreFetching] = useProperties();

  // Search handling
  const [searchInput, setSearchInput] = useState('');
  const isSearching = !!searchInput.trim();

  // Initialize fuzzy search
  const fuzzySearch = useMemo(
    () => new FuzzySearch(properties, ['name', 'address'], { sort: true }),
    [properties]
  );
  const results = useMemo(() => fuzzySearch.search(searchInput).slice(0, 6), [
    fuzzySearch,
    searchInput,
  ]);

  // Selected result handling
  const [selectIndex, setSelectIndex] = useState(0);
  // Arrow up/down selection ( and enter press )
  const handleArrowSelection = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && selectIndex < results.length) {
        setSelectIndex(prev => prev + 1);
        analytics.logEvent('arrow-navigate', { direction: 'down' });
      }
      if (e.key === 'ArrowUp' && selectIndex !== 0) {
        setSelectIndex(prev => prev - 1);
        analytics.logEvent('arrow-navigate', { direction: 'up' });
      }
      if (e.key === 'Enter' && selectIndex <= results.length) {
        const search =
          selectIndex === results.length
            ? searchInput
            : results[selectIndex].name || results[selectIndex].address;
        analytics.logEvent('select-property', {
          method: selectIndex === results.length ? 'Enter press custom' : 'Enter press',
          resultPosition: selectIndex + 1,
          searchLength: searchInput.trim().length,
        });
        history.push(`/property/${encodeURIComponent(search)}`);
      }
    },
    [history, results, searchInput, selectIndex]
  );
  useEffect(() => {
    window.addEventListener('keydown', handleArrowSelection);
    return () => window.removeEventListener('keydown', handleArrowSelection);
  }, [handleArrowSelection]);
  // When search input ( meaningfully ) changes, reset select index
  const prevSearch = useRef(searchInput);
  useEffect(() => {
    if (
      prevSearch.current.replace(' ', '').toLowerCase() !==
      searchInput.replace(' ', '').toLowerCase()
    ) {
      setSelectIndex(0);
    }

    prevSearch.current = searchInput;
  }, [searchInput]);

  return (
    <>
      {propertiesAreFetching && <Loader />}

      {/* Top/Heading Section */}
      <HeadingWrapper>
        <Spacer height='48px' />
        <Heading>Are you being evicted?</Heading>
        <Subheading>We can connect you to help</Subheading>
        <Copy>Use this resource to find out if your property is covered by the CARES Act</Copy>
      </HeadingWrapper>

      {/* Search Section */}
      <SearchWrapper>
        <StyledSearchSvg />
        <SearchInput
          placeholder='Address or apartment name'
          value={searchInput}
          onChange={e => setSearchInput(e.currentTarget.value.trimStart())}
          // onKeyDown={handleArrowSelection}
          autoFocus={!isTouchEnabled()}
        />
      </SearchWrapper>

      {/* Post-search Section */}
      <Section>
        {/* Offset input negative margin-botton */}
        <Spacer height='25px' />

        {/* Search results ( only shown when searching ) */}
        {isSearching && (
          <ResultsWrapper>
            {results.map(({ name, address }, i) => (
              <ResultLink
                to={`/property/${encodeURIComponent(name || address)}`}
                key={name + address}
                selected={i === selectIndex}
                onClick={() =>
                  analytics.logEvent('select-property', {
                    method: 'Select result',
                    resultPosition: selectIndex + 1,
                    searchLength: searchInput.trim().length,
                  })
                }
              >
                {name || address} <small>{!!name && address}</small>
              </ResultLink>
            ))}
            {/* Always add current input as final result */}
            <ResultLink
              to={`/property/${encodeURIComponent(searchInput)}`}
              selected={selectIndex === results.length}
              onClick={() =>
                analytics.logEvent('select-property', {
                  method: 'Select custom result',
                  resultPosition: selectIndex + 1,
                  searchLength: searchInput.trim().length,
                })
              }
            >
              {searchInput}
            </ResultLink>
          </ResultsWrapper>
        )}

        {/* Instructions ( hidden on search ) */}
        {!isSearching && (
          <>
            <StyledUpArrowSvg />
            <SearchInstructions>
              Search for your address or the name of your apartment complex to learn more.
            </SearchInstructions>
          </>
        )}
      </Section>

      {/* Footer */}
      <Footer />
    </>
  );
};
export default Home;
