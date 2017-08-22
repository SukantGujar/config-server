import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {connect} from 'react-redux';
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

import ConfigEditor from '../configeditor';
import KeyEditor from '../keyeditor';

import searchParser from '../utility/searchparser';

import {actions} from '../redux';

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
    margin: theme.spacing.unit*4,
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

class Chrome extends Component {
  render(){
    let {location, classes, tabs, isMaster, onApplyKeyClick} = this.props;
  
    const {e} = searchParser(location.search);
    if (!isMaster){
      const [first, second] = tabs;
      tabs = [first];
    }
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
                  <Input inputRef={(input)=>this.keyInput = input} id="apiKey" classes={{input : classes.input}} disableUnderline={true} />
                </Grid>
                <Grid item>
                  <Button 
                    color="contrast" 
                    onClick={
                      (e)=>{
                        onApplyKeyClick(this.keyInput.value)
                      }
                    }>
                    Apply
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Route exact path='/' component={()=><TabContainer>
            {ConfigEditor()}
          </TabContainer>} />
        <Route path='/keys' component={()=><TabContainer>
            <KeyEditor editedKey={e} />
          </TabContainer>} />
      </div>
    );
  }
}

Chrome.propTypes = {
  classes: PropTypes.object.isRequired,
  tabs: PropTypes.array.isRequired,
  isMaster : PropTypes.bool.isRequired,
  onApplyKeyClick : PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  "isMaster" : state.currentKeyIsMaster
}),
mapDispatchToProps = dispatch => ({
  onApplyKeyClick: (key)=>dispatch(actions.setupSessionAsync(_.trim(key)))
});

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Chrome)));