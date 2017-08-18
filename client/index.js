import React from 'react';
import { render } from 'react-dom';
import Chrome from './chrome';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createMuiTheme from 'material-ui/styles/theme';
import createPalette from 'material-ui/styles/palette';
import blue from 'material-ui/colors/blue';
import pink from 'material-ui/colors/pink';
import {BrowserRouter as Router, Route} from "react-router-dom";

const theme = createMuiTheme({
  palette: createPalette({
    primary: blue,
    accent: pink,
    type : 'light',
    input : {
      bottomLine : "white"
    }
  })
}),
tabs = [
  {
    "label" : "config",
    "path" : "/"
  },
  {
    "label" : "keys",
    "path" : "/keys"
  }
];

function App() {
  return (
    <Router basename="/ui/">
      <MuiThemeProvider theme={theme}>
        <Chrome tabs={tabs} />
      </MuiThemeProvider>
    </Router>
  );
};

render(<App />, document.querySelector('#app'));