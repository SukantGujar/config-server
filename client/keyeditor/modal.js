import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    direction: 'column'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 500,
  },
});

class KeyEditorDialog extends Component{
  validatePermission = _.debounce((permission, failed)=>{
    let parsed = null;
    try {
      parsed = JSON.parse(permission);
    }
    catch(e){
      return failed(permission);
    };
    if (!_.isArray(parsed) || parsed.length < 1){
      return failed(permission);
    }
  
    if (!parsed.every(item=>typeof item == 'string')){
      return failed(permission);
    }
  }, 200);
  updateState = (field, type, isPermission = true)=>{
    this.setState({[type] : field, [`${type}_error`]: false}, isPermission && this.validatePermission(field, ()=>{this.setState({[`${type}_error`]: true})}));
  };
  renderTypeField = (type, label, classes, isPermission = true)=> (
    <TextField
      id={type}
      label={label}
      className={classes.textField}
      value={this.state[type]}
      onChange={event => this.updateState(event.target.value, type, isPermission)}
      margin="normal"
      rowsMax="4"
      error = {this.state[`${type}_error`]}
    />
  );
  handleOk = ()=>{
    const {ok} = this.props;

    this.validatePermission.flush();

    const {read_error, write_error} = this.state;

    if (read_error || write_error){
      console.warn(`Invalid read or write`);
      return;
    }

    let {read, write, name = ""} = this.state,
    {_id} = this.props;
    name = _.trim(name);
    ok && ok(_id, JSON.parse(read), JSON.parse(write), name);
  };
  componentWillReceiveProps({read, write, name = ""}){
    this.setState({
      read : JSON.stringify(read), 
      write : JSON.stringify(write),
      read_error : false,
      write_error: false,
      name
    });
  }
  constructor(props){
    const {read, write, name} = props;
    super(props);
    this.state = {
      read : JSON.stringify(read), 
      write : JSON.stringify(write),
      name
    }
  }
  render(){
    const {_id, read, write, name = "", cancel = ()=>{}, ok = ()=>{}, classes, ...other} = this.props;
    return (
      <Dialog {...other}>
        <DialogTitle>Edit permissions for key "{_id}"</DialogTitle>
        <DialogContent>
          <Grid className={classes.container}>
            {this.renderTypeField("name", "Name", classes, false)}
            {this.renderTypeField("read", "Read", classes)}
            {this.renderTypeField("write", "Write", classes)}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

KeyEditorDialog.propTypes = {
  _id : PropTypes.string,
  read : PropTypes.array,
  write : PropTypes.array,
  name : PropTypes.string,
  cancel : PropTypes.func,
  ok : PropTypes.func
}

export default withStyles(styles)(KeyEditorDialog);
