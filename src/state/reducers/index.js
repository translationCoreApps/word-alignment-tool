import {combineReducers} from 'redux';
import alignments, * as fromAlignments from './alignments';
export default combineReducers({
  alignments
});

/**
 * Returns alignments for a chapter
 * @param {object} state - the redux state
 * @param {number} chapter - the chapter for which alignments will be returned
 * @return {*}
 */
export const getChapterAlignments = (state, chapter) => {
  console.log('get alignments', state);
  return fromAlignments.getChapterAlignments(state.tool.alignments, chapter);
};

/**
 * Returns alignments for a verse
 * @param state
 * @param chapter
 * @param verse
 * @return {*}
 */
export const getVerseAlignments = (state, chapter, verse) => 
  fromAlignments.getVerseAlignments(state.tool.alignments, chapter, verse);