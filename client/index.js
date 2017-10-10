//import "preact/devtools";

import React from 'react';
import { render } from 'react-dom';
import {Provider} from 'react-redux';
import Chrome from './chrome';
import createPalette from 'material-ui/styles/createPalette';
import {MuiThemeProvider, createMuiTheme} from 'material-ui/styles';
import blue from 'material-ui/colors/blue';
import pink from 'material-ui/colors/pink';
import {BrowserRouter as Router, Route} from "react-router-dom";

import {store} from './redux';

const theme = createMuiTheme({
  palette: createPalette({
    primary: blue,
    accent: pink,
    type : 'light',
    input : {
      bottomLine : "white"
    }
  })
});

function App() {
  return (
    <Router basename="/ui/">
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Chrome />
        </Provider>
      </MuiThemeProvider>
    </Router>
  );
};

render(<App />, document.querySelector('#app'));