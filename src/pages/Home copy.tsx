import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components/macro';
import { Link, useHistory } from 'react-router-dom';

import Section from '../components/Section';
import Spacer from '../components/Spacer';
import { ReactComponent as EvictionSvg } from '../img/eviction.svg';
import { ReactComponent as SearchSvg } from '../img/search.svg';
import { ReactComponent as UpArrowSvg } from '../img/up-arrow.svg';
import Footer from '../components/Footer';

// Temporary Data
import data from '../tmp-data';

// Heading Section
const StyledEvictionSvg = styled(EvictionSvg)`
  width: 100%;
  height: 64px;
  margin: 24px auto;
`;
const Heading = styled.h1`
  margin: 0;
  padding: 0 0 16px;
  font-size: 28px;
  line-height: 34px;
  strong {
    text-decoration: underline;
    text-decoration-color: ${({ theme }) => theme.colors.primary};
  }
`;
const Copy = styled.p`
  margin: 0;
  padding: 0 0 64px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.grey.base};
  strong {
    color: ${({ theme }) => theme.colors.grey.dark};
  }
`;
// Search Section
const SearchWrapper = styled.div`
  z-index: 250;
  position: relative;
  margin: -25px auto -25px;
  max-width: 768px;
  padding: 0 24px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
  border: 3px solid ${({ theme }) => theme.colors.grey.lightest};
  box-shadow: 0px 0px 0.996336px rgba(13, 13, 13, 0.0383252),
    0px 0px 2.75474px rgba(13, 13, 13, 0.055), 0px 0px 6.63236px rgba(13, 13, 13, 0.0716748),
    0px 0px 22px rgba(13, 13, 13, 0.11);
  &:focus {
    outline: none;
    border: 3px solid ${({ theme }) => theme.colors.primary};
  }

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  font-size: 18px;
  font-weight: bold;
  line-height: 18px;
  color: ${({ theme }) => theme.colors.black};
  caret-color: ${({ theme }) => theme.colors.primary};
  &::placeholder {
    font-weight: normal;
    color: ${({ theme }) => theme.colors.grey.base};
    opacity: 1;
  }
`;
const ResultsWrapper = styled.div`
  z-index: 225;
  position: relative;
  max-height: 256px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;

  padding: 6px 0 0;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.colors.grey.lightest};
`;
const ResultLink = styled(Link)<{ selected: boolean }>`
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  padding: ${({ selected }) => (selected ? `6px 12px 6px 6px` : '6px 12px')};
  border-left: ${({ selected, theme }) =>
    selected ? `6px solid ${theme.colors.primary}` : 'none'};
  background-color: ${({ selected, theme }) => (selected ? theme.colors.white : 'none')};

  font-family: 'Rubik';
  font-weight: bold;
  font-size: 18px;
  line-height: 20px;
  text-decoration: none;
  color: ${({ selected, theme }) => (selected ? theme.colors.primary : theme.colors.black)};
  small {
    display: block;
    font-family: 'Karla';
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
    color: ${({ theme }) => theme.colors.grey.base};
  }
`;
const NoResultsFound = styled.div`
  padding: 6px 12px 12px;
  text-align: center;
  color: ${({ theme }) => theme.colors.grey.base};
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
  color: ${({ theme }) => theme.colors.grey.light};
`;

function isTouchEnabled() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

const Home: React.FC = () => {
  const history = useHistory();

  // Search handling
  const [searchInput, setSearchInput] = useState('');
  const isSearching = !!searchInput.trim();
  const results = useMemo(
    () =>
      isSearching
        ? data
            .filter(
              ({ name, address }) =>
                name
                  .replace(' ', '')
                  .toLowerCase()
                  .includes(searchInput.replace(' ', '').toLowerCase()) ||
                address
                  .replace(' ', '')
                  .toLowerCase()
                  .includes(searchInput.replace(' ', '').toLowerCase())
            )
            .slice(0, 50)
        : [],
    [isSearching, searchInput]
  );
  useEffect(() => {
    console.log('searchInput', searchInput);
  }, [searchInput]);
  useEffect(() => {
    console.log('results[0]', results[0]);
  }, [results]);

  // Selected result handling
  const [selectIndex, setSelectIndex] = useState(0);
  // Arrow up/down selection ( and enter press )
  const handleArrowSelection = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown' && selectIndex < results.length - 1) {
        setSelectIndex(prev => prev + 1);
      }
      if (e.key === 'ArrowUp' && selectIndex !== 0) {
        setSelectIndex(prev => prev - 1);
      }
      if (e.key === 'Enter' && results[selectIndex]) {
        history.push(
          `/search/${encodeURIComponent(results[selectIndex].name || results[selectIndex].address)}`
        );
      }
    },
    [history, results, selectIndex]
  );
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
      {/* Top/Heading Section */}
      <Section primary>
        <StyledEvictionSvg />
        <Heading>
          Are you <strong>facing eviction</strong> in Tulsa County?
        </Heading>
        <Copy>
          If you were served with an eviction notice <strong>between March 27 and June 25</strong>,
          you may qualify for releif under the CARES act.
        </Copy>
      </Section>

      {/* Search Section */}
      <SearchWrapper>
        <StyledSearchSvg />
        <SearchInput
          placeholder='Address or apartment name'
          value={searchInput}
          onChange={e => setSearchInput(e.currentTarget.value)}
          onKeyDown={handleArrowSelection}
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
            {results.map((result, i) => (
              <ResultLink
                to={`/search/${encodeURIComponent(result.name || result.address)}`}
                key={result.name + result.address}
                selected={i === selectIndex}
              >
                {result.name || result.address} <small>{!!result.name && result.address}</small>
              </ResultLink>
            ))}
            {/* No results */}
            {!results.length && <NoResultsFound>No Results Found</NoResultsFound>}
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
