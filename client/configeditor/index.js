import React from 'react';
import MonacoEditor from 'react-monaco-editor';

module.exports = (code  = "{}")=>(
  <MonacoEditor
    height="500"
    language="json"
    theme="vs-dark"
    value={code}
    options={
      {
        minimap : {
          enabled : false
        },
        automaticLayout : true
      }
    }
  />
)