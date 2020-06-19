import React, { createContext, useContext, useState, useEffect } from 'react';
import { GSHEETS_SHEET_ID, GSHEETS_SHEET_NAME, FIREBASE_CONFIG } from '../lib/config';
import { perf } from '../lib/firebase';
import camelCase from 'lodash/camelCase';

class Property {
  name = '';
  address = '';
  phone = '';
  city = '';
  zip = '';
  covered: boolean | 'maybe' = 'maybe';
}

// Form State Context ( with hook shortcut )
const fetchingProperties: [Property[], boolean] = [[], true];
const propertyContext = createContext(fetchingProperties);
const useProperties = () => useContext(propertyContext);
export default useProperties;

// Context definition w/ provider
export const PropertiesProvider: React.FC = ({ children }) => {
  const [propertiesState, setPropertiesState] = useState(fetchingProperties);

  // Fetch properties info from Google Spreadsheet
  useEffect(() => {
    (async () => {
      const jsonUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GSHEETS_SHEET_ID}/values/${GSHEETS_SHEET_NAME}/?key=${FIREBASE_CONFIG.apiKey}`;
      try {
        // Begin benchmark for fetch time
        const fetchTrace = perf.trace('gsheets-fetch');
        fetchTrace.start();

        // Fetch data rows
        const response = await fetch(jsonUrl);
        const data = await response.json();

        const rows: string[][] = data.values;

        // Headers are the first row in the document
        const headers = rows[0].map(header => camelCase(header)) as [keyof Property];

        // Initialize array to store formatted data
        const properties: Property[] = [];

        // Loop through each row and convert into keyed EvictionLocation
        rows.forEach((rowData, rowIndex) => {
          // Don't need headers here, so return early first row
          if (rowIndex === 0) return;

          // Object to store the row's formatted data
          const propertyRow = { ...new Property() };

          // Loop through the headers and assign as a keys to each row cell's value
          headers.forEach((header, headerIndex) => {
            const value = rowData[headerIndex];
            // Special handling for 'covered' field
            if (header === 'covered') {
              switch (value?.trim()) {
                case 'Yes':
                  propertyRow[header] = true;
                  break;
                case 'No':
                  propertyRow[header] = false;
                  break;
                default:
                  propertyRow[header] = 'maybe';
              }
            } else {
              propertyRow[header] = value?.trim() ?? '';
            }
          });

          // If row doesn't include name or address, toss it out
          if (!propertyRow.name && !propertyRow.address) return;

          // Push `propertyRow` object into `properties` array
          properties.push(propertyRow);
        });

        // Finish benchmark for fetch time
        fetchTrace.putMetric('total-properties', properties.length);
        fetchTrace.stop();

        setPropertiesState([properties, false]);
      } catch (error) {
        console.error('Error fetching spreadsheet', error);
      }
    })();
  }, []);

  return <propertyContext.Provider value={propertiesState}>{children}</propertyContext.Provider>;
};
