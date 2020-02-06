import * as fromGrouspIndex from './reducers/groupsIndexReducer';
import * as fromGroupsData from './reducers/groupsDataReducer';
import * as fromContextId from './reducers/contextIdReducer';
import * as fromGroupMenu from './reducers/GroupMenu';

export const getGroupsIndex = (state) =>
  fromGrouspIndex.getGroupsIndex(state.tool.groupsIndexReducer);

export const getGroupsData = (state) =>
  fromGroupsData.getGroupsData(state.tool.groupsDataReducer);

export const getGroupMenuFilters = (state) =>
  fromGroupMenu.getFilters(state.tool.groupMenuReducer);

export const getContextId = (state) =>
  fromContextId.getContext(state.tool.contextIdReducer);

export const getCommentsReducer = (state) =>
  state.tool.commentsReducer;

export const getSelectionsReducer = (state) =>
  state.tool.selectionsReducer;

export const getBookmarksReducer = (state) =>
  state.tool.bookmarksReducer;

export const getProjectManifest = (ownProps) => ownProps.tc.projectDetailsReducer.manifest;
export const getGatewayLanguageCode = (ownProps) => ownProps.tc.gatewayLanguageCode;
export const getCurrentToolName = (ownProps) => ownProps.tc.currentToolName;
export const getProjectPath = (ownProps) => ownProps.tc.projectSaveLocation;
export const getUserData = (ownProps) => ownProps.tc.loginReducer.userdata;
export const getGatewayLanguageBibles = (ownProps) => ownProps.tc.resourcesReducer.bibles[getGatewayLanguageCode(ownProps)];
export const getBookName = (ownProps) => ownProps.tc.project.getBookName();
export const getResourcesReducer = (ownProps) => ownProps.tc.resourcesReducer;
export const getBibles = (ownProps) => ownProps.tc.resourcesReducer.bibles;
export const getCurrentPaneSettings = (ownProps) => {
  const { ScripturePane } = ownProps.tc.settingsReducer.toolsSettings;
  return ScripturePane ? ScripturePane.currentPaneSettings : [];
};
export const getUsername = (ownProps) => ownProps.tc.username;
