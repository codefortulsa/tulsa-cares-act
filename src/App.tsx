import React from 'react';
// import "./lib/i18n";
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { ThemeProvider } from 'styled-components/macro';
import defaultTheme from './styles/defaultTheme';

import Home from './pages/Home';
import About from './pages/About';
import Search from './pages/Search';

const App = () => (
  <ThemeProvider theme={defaultTheme}>
    <Router>
      {/* Pages */}
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/about' exact component={About} />
        <Route path='/search/:query' exact component={Search} />
        <Redirect to='/' />
      </Switch>
    </Router>
  </ThemeProvider>
);
export default App;
