import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import StarIcon from 'material-ui-icons/Star';
import DeleteIcon from 'material-ui-icons/Delete';
import EditIcon from 'material-ui-icons/Edit';
import AddIcon from 'material-ui-icons/AddCircleOutline';
import CopyIcon from 'material-ui-icons/ContentCopy';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import _ from 'lodash';
import {withRouter} from 'react-router';

import KeyEditorDialog from './modal';

import {actions} from '../redux';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: "white",
  },
  star:{
    fill: theme.palette.primary[500]
  }
});

class KeyEditor extends Component{
  render(){
    let 
    {
      keys = [], master="", 
      editedKey,
      classes, 
      match,
      onAddKeyClick,
      onDeleteKeyClick,
      onCopyKeyClick,
      onKeyEditorOkClick,
      onKeyEditorCancelClick,
      history
    } = this.props,
    editedToken = (editedKey && keys.find(item => item._id == editedKey)) || {read: ["-**"], write : ["-**"]};

    return (
      <div className={classes.root}>
        <List>
          <ListItem>
            <ListItemIcon>
              <StarIcon className={classes.star}/>
            </ListItemIcon>
            <ListItemText primary={`Master: ${master}`} />
          </ListItem>
        </List>
        <Divider/>
        {
          (_.size(keys) && (
            <List>
              {
                keys.map(({_id, read, write})=>(
                    <ListItem key={_id}>
                        <ListItemIcon aria-label="Copy" onClick={()=>onCopyKeyClick(_id)}>
                          <IconButton>
                            <CopyIcon />
                          </IconButton>
                        </ListItemIcon>
                      <ListItemText primary={<p><Link to={`/keys?e=${_id}`}>{_id}</Link></p>} secondary={<span>read: {JSON.stringify(read)},<br/> write: {JSON.stringify(write)}</span>} />
                      <ListItemSecondaryAction>
                        <IconButton aria-label="Delete" onClick={()=>onDeleteKeyClick(_id)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  )
                )
              }
            </List>
          )) || (
            <List>
              <ListItem>
                <ListItemText primary="No keys present." />
              </ListItem>              
            </List>
          )
        }
        <List>
          <ListItem button>
            <ListItemIcon>
              <AddIcon/>
            </ListItemIcon>
            <ListItemText primary="Add a new key" onClick={onAddKeyClick} />
          </ListItem>              
        </List>
        {
          <KeyEditorDialog 
            open={!!editedKey} 
            _id={editedKey} 
            read={editedToken.read} 
            write={editedToken.write}
            ok={
              (_id, read, write) => {
                onKeyEditorOkClick(_id, read, write, history);
              }
            }
            cancel={
              ()=>{
                onKeyEditorCancelClick(history);
              }
            }
          />
        }
      </div>
    );
  }
}

const mapStateToProps = (state)=>({
  "master" : state.currentKeyIsMaster && state.currentKey || "",
  "keys" : state.keys
}),
mapDispatchToProps = (dispatch)=>({
  "onAddKeyClick" : function(){
    dispatch(actions.createKeyAsync());
  },
  "onDeleteKeyClick" : function(KeyToDelete){
    dispatch(actions.deleteKeyAsync(KeyToDelete));
  },
  "onCopyKeyClick" : function(key){
    dispatch(actions.copyKey(key));
  },
  "onKeyEditorOkClick" : async function(key, read, write, history){
    try {
    await dispatch(actions.updateKeyAsync(key, read, write));
    }
    catch (e){
      console.error(e);
      return;
    }
    history.goBack();
  },
  "onKeyEditorCancelClick" : function(history){
    history.goBack();
  }
});

KeyEditor.propTypes = {
  "keys" : PropTypes.array.isRequired,
  "master" : PropTypes.string,
  "editedKey" : PropTypes.string,
  "onAddKeyClick" : PropTypes.func.isRequired,
  "onDeleteKeyClick" : PropTypes.func.isRequired,
  "onCopyKeyClick" : PropTypes.func.isRequired,
  "onKeyEditorOkClick" : PropTypes.func.isRequired,
  "onKeyEditorCancelClick" : PropTypes.func.isRequired,  
  "history" : PropTypes.object.isRequired
}

module.exports = withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(KeyEditor)));