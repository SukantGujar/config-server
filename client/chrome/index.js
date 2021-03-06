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

import Notifications from '../notifications';

import features from '../features';

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
    //marginLeft:20,
    paddingLeft:20,
    borderRadius:3,
    backgroundColor: "rgba(1, 1, 1, 0.1)"
  },
  input: {
    //width: 300,
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
  },
  tabs : {
    marginRight : 20
  }
});

const renderTabs = _.curry((features, classes, {location, match}) => {
  return(
  <Tabs value={`${location.pathname}`} onChange={(event, value)=>value} className={classes.tabs}>
  {
    features.map(
      ({label, path})=><Tab key={label} label={label} value={`${match.url}${path}`} className={classes.tabLink} component={Link} to={`${match.url}${path}`} />
    )
  }
  </Tabs>
  )});

class Chrome extends Component {
  render(){
    let {location, classes, isMaster, onApplyKeyClick, match, history} = this.props,
    applicableFeatures = features.filter(({precondition})=>precondition(this.props));
  
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar className={classes.toolbar}>
            <Route path={`${match.path}:key`} render={renderTabs(applicableFeatures, classes)} />
            <Grid item>
              <Grid container align="center" justify="space-between" className={classes.apiKey}>
                <Grid item style={{cursor:"default"}}>
                  <InputLabel htmlFor="apiKey" classes={{root: classes.keyLabel}}>API Key</InputLabel>
                </Grid>
                <Grid item>
                  <Switch>
                    <Route exact path={`${match.path}`} render={()=>(
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
                        style={{
                          width:300
                        }}
                        disableUnderline={true}
                        placeholder="Type your API Key here and click Apply." 
                      />
                    )} />
                    <Route path={`${match.path}:key`} render={({match})=>(
                      <InputLabel classes={{root : classes.input}}>{isMaster && <StarIcon titleAccess="Master Key" className={classes.star} />}{match.params.key}</InputLabel>
                    )} />
                  </Switch>
                </Grid>
                <Grid item>
                <Switch>
                    <Route exact path={`${match.path}`} render={({history})=>(
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
                    <Route path={`${match.path}:key`} render={({match, history})=>(
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
        <Route path={`${match.path}:key`} render = {({match})=>(
          <Grid container align="center" justify="center" >
          <Grid item>
            {
              applicableFeatures.map(
                ({FeatureComponent, path})=>(
                  <Route 
                    key={path} 
                    exact 
                    path={`${match.path}${path}`} 
                    render={
                      ()=>{
                        return ( 
                          <TabContainer>
                            <FeatureComponent />
                          </TabContainer>
                        );
                      }
                    } 
                  />
                )
              )
            }
          </Grid>
        </Grid>
        )} />
        <Route exact path={`${match.path}`} render = {({match})=>(
          <Grid container align="center" justify="center" >
          <Grid item>
            <SettingsIcon className={classes.settingsIcon} />
          </Grid>
        </Grid>
        )} />
        <Notifications />
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
  onApplyKeyClick: async (key, history)=>{
    let result = await dispatch(actions.setupSessionAsync(_.trim(key)));
    if (result){
      history.push(`/${key}`);
    }
  }
});

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Chrome)));