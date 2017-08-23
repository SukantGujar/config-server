import React, { PureComponent as Component } from 'react';
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
import StarIcon from 'material-ui-icons/Star';
import SettingsIcon from 'material-ui-icons/Settings';

import {
  Route,
  Link,
  Switch
} from 'react-router-dom';

import {withRouter} from 'react-router';

import ConfigEditor from '../configeditor';
import KeyEditor from '../keyeditor';

import searchParser from '../utility/searchparser';

import {actions} from '../redux';

const defaultTabs = [
  {
    "label" : "config",
    "path" : ""
  },
  {
    "label" : "keys",
    "path" : "/keys"
  }
];

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
    margin: 0,
    backgroundColor: theme.palette.background.paper,
    overflow: "hidden"
  },
  toolbar : {
    alignItems : "center",
    justifyContent : "center"
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
    color: "white",
    display: "flex",
    alignItems: "center"
  },
  star: {
    height:30,
    width:30,
    marginRight:10
  },
  keyLabel : {
    color:  "white"
  },
  settingsIcon :{
    fill : "#eee",
    height : 600,
    width : 600
  }
});

const renderTabs = _.curry((tabs, classes, {location, match}) => {
  return(
  <Tabs value={`${location.pathname}`} onChange={(event, value)=>value}>
  {
    tabs.map(
      ({label, path})=><Tab key={label} label={label} value={`${match.url}${path}`} className={classes.tabLink} component={Link} to={`${match.url}${path}`} />
    )
  }
  </Tabs>
  )});

class Chrome extends Component {
  render(){
    let {location, classes, isMaster, onApplyKeyClick, match, history} = this.props,
    tabs = defaultTabs;
  
    const {e} = searchParser(location.search);
    if (!isMaster){
      const [first, second] = tabs;
      tabs = [first];
    }
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar className={classes.toolbar}>
            <Route path={`${match.url}:key`} render={renderTabs(tabs, classes)} />
            <Grid item>
              <Grid container align="center" justify="space-between" className={classes.apiKey}>
                <Grid item style={{cursor:"default"}}>
                  <InputLabel htmlFor="apiKey" classes={{root: classes.keyLabel}}>API Key</InputLabel>
                </Grid>
                <Grid item>
                  <Switch>
                    <Route exact path={`${match.url}`} render={()=>(
                      <Input 
                        inputRef={(input)=>{
                          if (!input){
                            return;
                          }
                          this.keyInput = input;
                          input.setAttribute("autocorrect", false);
                          input.setAttribute("spellcheck", false);
                          input.focus();
                        }}
                        onKeyPress={e=>{
                          if (e.key == 'Enter'){
                            e.preventDefault();
                            onApplyKeyClick(this.keyInput.value, history);
                            return;
                          }
                        }}
                        id="apiKey"
                        classes={{input : classes.input}} 
                        disableUnderline={true}
                        placeholder="Type your API Key here and click Apply." 
                      />
                    )} />
                    <Route path={`${match.url}:key`} render={({match})=>(
                      <InputLabel classes={{root : classes.input}}>{isMaster && <StarIcon titleAccess="Master Key" className={classes.star} />}{match.params.key}</InputLabel>
                    )} />
                  </Switch>
                </Grid>
                <Grid item>
                <Switch>
                    <Route exact path={`${match.url}`} render={({history})=>(
                      <Button 
                      color="contrast" 
                      onClick={
                        (e)=>{
                          onApplyKeyClick(this.keyInput.value, history);
                        }
                      }>
                      Apply
                    </Button>
                    )} />
                    <Route path={`${match.url}:key`} render={({match, history})=>(
                      <Button 
                        color="contrast" 
                        onClick={
                          (e)=>{
                            history.push("/");
                          }
                        }>
                        Change
                      </Button>
                    )} />
                  </Switch>
                </Grid>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Route path={`${match.url}:key`} render = {({match})=>(
          <Grid container align="center" justify="center" >
          <Grid item>
            <Route exact path={`${match.url}`} render={
              ()=><TabContainer>
                <ConfigEditor />
              </TabContainer>} 
            />
            <Route path={`${match.url}/keys`} render={
              ({match})=><TabContainer>
                <KeyEditor editedKey={match.params.key} />
              </TabContainer>} 
            />
          </Grid>
        </Grid>
        )} />
        <Route exact path={`${match.url}`} render = {({match})=>(
          <Grid container align="center" justify="center" >
          <Grid item>
            <SettingsIcon className={classes.settingsIcon} />
          </Grid>
        </Grid>
        )} />
      </div>
    );
  }
}

Chrome.propTypes = {
  classes: PropTypes.object.isRequired,
  isMaster : PropTypes.bool.isRequired,
  onApplyKeyClick : PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  "isMaster" : state.currentKeyIsMaster
}),
mapDispatchToProps = dispatch => ({
  onApplyKeyClick: (key, history)=>{
    dispatch(actions.setupSessionAsync(_.trim(key)))
    history.push(`/${key}`);
  }
});

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Chrome)));