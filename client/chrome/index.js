import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Input from 'material-ui/Input/Input';
import InputLabel from 'material-ui/Input/InputLabel';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

import {
  Route,
  Link
} from 'react-router-dom';

import {withRouter} from 'react-router';

function TabContainer(props) {
  return (
    <div style={{ padding: 20 }}>
      {props.children}
    </div>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.background.paper,
  },
  tabLink : {
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
  },
  apiKey: {
    marginLeft:20,
    paddingLeft:20,
    borderRadius:3,
    backgroundColor: "rgba(1, 1, 1, 0.1)"
  },
  input: {
    width: 300,
    color: "white"
  },
  keyLabel : {
    color:  "white"
  }
});

function Chrome({location, classes, tabs}) {
  console.log(location)
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Tabs value={location.pathname} onChange={(event, value)=>value}>
              {
                tabs.map(
                  ({label, path})=><Tab key={label} label={label} value={path} className={classes.tabLink} component={Link} to={path} />
                )
              }
            </Tabs>
            <Grid item>
              <Grid container align="center" justify="space-between" className={classes.apiKey}>
                <Grid item style={{cursor:"default"}}>
                  <InputLabel htmlFor="apiKey" classes={{root: classes.keyLabel}}>API Key</InputLabel>
                </Grid>
                <Grid item>
                  <Input id="apiKey" classes={{input : classes.input}} disableUnderline={true} />
                </Grid>
                <Grid item>
                  <Button color="contrast">Apply</Button>
                </Grid>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Route exact path='/' component={()=><TabContainer>
            {'Item One'}
          </TabContainer>} />
        <Route path='/keys' component={()=><TabContainer>
            {'Item Two'}
          </TabContainer>} />
      </div>
    );
}

Chrome.propTypes = {
  classes: PropTypes.object.isRequired,
  tabs: PropTypes.array.isRequired
};

export default withRouter(withStyles(styles)(Chrome));