import React from 'react';
// import "./lib/i18n";
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { ThemeProvider } from 'styled-components/macro';
import defaultTheme from './styles/defaultTheme';
import { PropertiesProvider } from './hooks/useProperties';

import Home from './pages/Home';
import About from './pages/About';
import Property from './pages/Property';

const App = () => (
  <PropertiesProvider>
    <ThemeProvider theme={defaultTheme}>
      <Router>
        {/* Pages */}
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/about' exact component={About} />
          <Route path='/property/:query' exact component={Property} />
          <Redirect to='/' />
        </Switch>
      </Router>
    </ThemeProvider>
  </PropertiesProvider>
);
export default App;
