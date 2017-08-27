import React, {PureComponent as Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import MonacoEditor from 'react-monaco-editor';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';

import {actions} from '../redux';

const styles = theme => ({
  "save" : {
    alignSelf : "flex-end"
  }
});

class ConfigEditor extends Component {
  editorDidMount = (editor, monaco) => {
    this.editor = editor;
  };
  handleSave = ()=>{
    if (!this.editor){
      return;
    }
    let rawConfig = this.editor.getModel().getValue(),
    {onSaveClick} = this.props;
    try {
      const config = JSON.parse(rawConfig);
      onSaveClick(config);
    }
    catch(e){
      console.error(e);
    }
  };
  render(){
    const {config = "{}", classes} = this.props;
    return (
      <Grid container direction="column">
        <Grid item>
        <MonacoEditor
          height="500"
          width="800"
          language="json"
          theme="vs-dark"
          value={JSON.stringify(config,null,2)}
          options={
            {
              minimap : {
                enabled : false
              },
              automaticLayout : true
            }
          }
          editorDidMount={this.editorDidMount}
        />
        </Grid>
        <Grid item className={classes.save}>
          <Button color="primary" raised onClick={this.handleSave}>Save</Button>
        </Grid>
      </Grid>
    );
  }
}

ConfigEditor.propTypes = {
  "config" : PropTypes.object.isRequired,
  "onSaveClick" : PropTypes.func.isRequired
};

const mapStateToProps = ({config}) => ({
  config
}),
mapDispatchToProps = dispatch => ({
  "onSaveClick" : function(config){
    dispatch(actions.saveConfigAsync(config));
  }
});

export const path = "";

export const label = "Config";

export const precondition = false;

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ConfigEditor));