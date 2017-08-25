import React, {PureComponent as Component} from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';
import MonacoEditor from 'react-monaco-editor';
import {connect} from 'react-redux';

import Dropzone from 'react-dropzone';
import {readAsText} from 'promise-file-reader';

import {actions} from '../redux';

const styles = theme => ({
  "restore" : {
    alignSelf : "flex-end"
  }
});

class DataEditor extends Component {
  state = {data : {}};
  editorDidMount = (editor, monaco) => {
    this.editor = editor;
  };
  onDrop = async ([file]) => {
    let data = "";
    try {
      data = await readAsText(file);
      data = JSON.parse(data);
    }
    catch (e){
      console.error(e);
      return;
    }
    
    this.setState({data});
  };
  render(){
    let {data} = this.state,
    {classes, onSnapshotClick, onRestoreClick} = this.props;
    return (
      <Grid container direction="column">
        <Grid item>
          <Typography type="headline">Snapshot</Typography>
        </Grid>
        <Grid item>
          <Typography type="subheading"><Button color="primary" onClick={onSnapshotClick}>Download</Button> snapshot of the config store data on your device.</Typography>
        </Grid>
        <Divider />
        <Grid item>
          <Typography type="headline">Restore</Typography>
        </Grid>
        <Grid item>
          <Typography type="subheading">Drag and drop a snapshot file in the below editor to upload it.</Typography>
        </Grid>
        <Grid item>
        <Dropzone 
          style={{}}
          accept=""
          disableClick={true}
          disablePreview={true}
          multiple={false}
          onDrop={this.onDrop}
          >
            <MonacoEditor
              height="500"
              width="800"
              language="json"
              theme="vs-dark"
              value={JSON.stringify(data,null,2)}
              options={
                {
                  minimap : {
                    enabled : false
                  },
                  automaticLayout : true,
                  readOnly : true
                }
              }
              editorDidMount={this.editorDidMount}
            />
          </Dropzone>
        </Grid>
        <Grid item className={classes.restore}>
          <Button color="primary" raised onClick={()=>onRestoreClick(this.state.data)}>Restore</Button>
        </Grid>
      </Grid>
    );
  }
};

DataEditor.propTypes = {
  "onSnapshotClick" : PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => ({
  "onSnapshotClick" : () => {
    dispatch(actions.snapshotAsync());
  },
  "onRestoreClick" : (snapshot) => {
    dispatch(actions.restoreAsync(snapshot));
  }
});

export const path = "/data";
export const label = "Data";
export const precondition = ({isMaster})=>isMaster;

export default withStyles(styles)(connect(null, mapDispatchToProps)(DataEditor));