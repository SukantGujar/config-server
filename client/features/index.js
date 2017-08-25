import ConfigEditor, {path as ConfigEditorPath, label as ConfigEditorLabel, precondition as ConfigEditorPrecondition} from '../configeditor';
import KeyEditor, {path as KeyEditorPath, label as KeyEditorLabel, precondition as KeyEditorPrecondition} from '../keyeditor';
import DataEditor, {path as DataEditorPath, label as DataEditorLabel, precondition as DataEditorPrecondition} from '../dataeditor';

const 
defaultPreCondition = ()=>true;

class Features {
  features = [];
  addFeature(path, label, FeatureComponent, precondition) {
      precondition = precondition || defaultPreCondition;
      this.features.push({path, label, precondition, FeatureComponent});
      return this;
  }
};

let features =  new Features()
                    .addFeature(ConfigEditorPath, ConfigEditorLabel, ConfigEditor, ConfigEditorPrecondition)
                    .addFeature(KeyEditorPath, KeyEditorLabel, KeyEditor, KeyEditorPrecondition)
                    .addFeature(DataEditorPath, DataEditorLabel, DataEditor, DataEditorPrecondition)
                    .features;

export default features;