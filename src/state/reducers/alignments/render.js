import _ from 'lodash';
import {numberComparator} from './index';

/**
 * Generates a index of tokens that will be rendered.
 * @param {object[]} alignments - an array of alignments
 * @param {object[]} suggestions - an array of suggestions
 * @return {{sourceNgram: Array, targetNgram: Array}}
 */
export const indexTokens = (alignments, suggestions) => {
  const sourceIndex = [];
  const targetIndex = [];

  // utility to initialize the token index
  const hydrateIndex = (index, i) => {
    if (!index[i]) {
      index[i] = {
        alignment: null,
        // TRICKY: tokens may be suggested that have already been used resulting in multiple matches.
        suggestions: []
      };
    }
    return index;
  };

  // index to alignments
  for (let a = 0; a < alignments.length; a++) {
    // index source tokens
    const sourceTokens = alignments[a].sourceNgram;
    for (let t = 0; t < sourceTokens.length; t++) {
      const position = sourceTokens[t];
      hydrateIndex(sourceIndex, position);
      sourceIndex[position].alignment = a;
    }
    // index target tokens
    const targetTokens = alignments[a].targetNgram;
    for (let t = 0; t < targetTokens.length; t++) {
      const position = targetTokens[t];
      hydrateIndex(targetIndex, position);
      targetIndex[position].alignment = a;
    }
  }
  // index to suggestions
  for (let s = 0; s < suggestions.length; s++) {
    // index source tokens
    const sourceTokens = suggestions[s].sourceNgram;
    for (let t = 0; t < sourceTokens.length; t++) {
      const position = sourceTokens[t];
      hydrateIndex(sourceIndex, position);
      sourceIndex[position].suggestions.push(s);
    }
    // index target tokens
    const targetTokens = suggestions[s].targetNgram;
    for (let t = 0; t < targetTokens.length; t++) {
      const position = targetTokens[t];
      hydrateIndex(targetIndex, position);
      targetIndex[position].suggestions.push(s);
    }
  }

  return {
    source: sourceIndex,
    target: targetIndex
  };
};

const newRender = (alignments, suggestions, numSourceTokens) => {
  const renderedAlignments = [];
  const index = indexTokens(alignments, suggestions);


  return renderedAlignments;
};

/**
 * Renders the verse alignments with the suggestions
 * @param {object[]} alignments - an array of alignments
 * @param {object[]} suggestions - an array of alignment suggestions
 * @param {number} numSourceTokens - the number of source tokens in the verse
 * @return the alignments rendered with suggestions.
 */
const render = (alignments, suggestions, numSourceTokens) => {
  // index things
  const alignmentSourceIndex = [];
  const suggestionSourceIndex = [];
  const targetIndex = {};
  for (let aIndex = 0; aIndex < alignments.length; aIndex++) {
    for (const pos of alignments[aIndex].targetNgram) {
      targetIndex[pos] = aIndex;
    }
    for (let i = 0; i < alignments[aIndex].sourceNgram.length; i++) {
      const sourceLength = alignments[aIndex].sourceNgram.length;
      // TRICKY: the source tokens will be in order spread over the alignments
      alignmentSourceIndex.push({
        index: aIndex,
        aligned: alignments[aIndex].targetNgram.length > 0,
        sourceLength,
        targetLength: alignments[aIndex].targetNgram.length,
        isEmpty: alignments[aIndex].targetNgram.length === 0,
        sourceId: alignments[aIndex].sourceNgram.join(),
        targetId: alignments[aIndex].targetNgram.join(),
        targetNgram: alignments[aIndex].targetNgram,
        lastSourceToken: alignments[aIndex].sourceNgram[sourceLength - 1]
      });
    }
  }
  for (let sIndex = 0; sIndex < suggestions.length; sIndex++) {
    for (let i = 0; i < suggestions[sIndex].sourceNgram.length; i++) {
      const sourceLength = suggestions[sIndex].sourceNgram.length;
      // TRICKY: the source tokens will be in order spread over the suggestions
      suggestionSourceIndex.push({
        index: sIndex,
        sourceLength,
        targetLength: suggestions[sIndex].targetNgram.length,
        isEmpty: suggestions[sIndex].targetNgram.length === 0,
        sourceId: suggestions[sIndex].sourceNgram.join(),
        targetId: suggestions[sIndex].targetNgram.join(),
        targetNgram: suggestions[sIndex].targetNgram,
        lastSourceToken: suggestions[sIndex].sourceNgram[sourceLength - 1]
      });
    }
  }
  // TODO: index suggestions by alignment. To do this we will need to match up
  // suggestions to their affected alignments (like we do below).
  // So basically we'll need to re-write most of the renderer.

  // TRICKY: we don't support partial suggestion coverage at the moment
  if (suggestionSourceIndex.length > 0 && suggestionSourceIndex.length !==
    numSourceTokens) {
    console.error(
      'Index out of bounds. We currently do not support partial suggestions.');
    return [...convertToRendered(alignments)];
  }

  // TRICKY: short circuit invalid alignments
  if (alignmentSourceIndex.length !== numSourceTokens) {
    console.error('Alignments are corrupt');
    return [...convertToRendered(alignments)];
  }

  // build output
  const suggestedAlignments = [];
  let tokenQueue = [];
  let alignmentQueue = []; // track how many alignments span a suggestion
  let suggestionStateIsValid = true;
  for (let tIndex = 0; tIndex < numSourceTokens; tIndex++) {
    tokenQueue.push(tIndex);
    if (alignmentQueue.indexOf(alignmentSourceIndex[tIndex].index) === -1) {
      alignmentQueue.push(alignmentSourceIndex[tIndex].index);
    }

    const alignmentIsAligned = alignmentSourceIndex[tIndex].aligned;
    const finishedReadingAlignment = alignmentSourceIndex[tIndex].lastSourceToken ===
      tIndex;
    const suggestionSpansMultiple = alignmentQueue.length > 1;

    let targetUsedElsewhere = false;

    // determine suggestion validity
    let suggestionIsValid = false;
    let finishedReadingSuggestion = false;
    let sourceNgramsMatch = false;
    // TRICKY: we may not have suggestions for everything
    if (tIndex < suggestionSourceIndex.length) {
      // check if suggested target tokens are already used
      for (const targetPos of suggestionSourceIndex[tIndex].targetNgram) {
        if (targetPos in targetIndex) {
          const index = targetIndex[targetPos];
          targetUsedElsewhere = alignmentQueue.indexOf(index) === -1;
          if (targetUsedElsewhere) {
            break;
          }
        }
      }

      finishedReadingSuggestion = suggestionSourceIndex[tIndex].lastSourceToken ===
        tIndex;
      const suggestionTargetIsSuperset = isSubArray(
        suggestionSourceIndex[tIndex].targetNgram,
        alignmentSourceIndex[tIndex].targetNgram);

      sourceNgramsMatch = alignmentSourceIndex[tIndex].sourceId ===
        suggestionSourceIndex[tIndex].sourceId;
      const targetNgramsMatch = alignmentSourceIndex[tIndex].targetId ===
        suggestionSourceIndex[tIndex].targetId;
      const isPerfectMatch = sourceNgramsMatch && targetNgramsMatch;
      const suggestionIsEmpty = suggestionSourceIndex[tIndex].isEmpty;

      // TODO: We must check that the suggestion and all of it's siblings are empty.
      // If this is true then all of the siblings are invalid.
      // I do something like this in the compiler.
      // I'll also need to index the suggestion siblings.
      if (suggestionIsEmpty) {
        // empty suggestions are always in-valid
        suggestionIsValid = false;
      } else if (!alignmentIsAligned) {
        // un-aligned alignments are valid
        suggestionIsValid = true;
      } else if (!isPerfectMatch && finishedReadingAlignment &&
        finishedReadingSuggestion && !suggestionSpansMultiple &&
        suggestionTargetIsSuperset && sourceNgramsMatch) {
        // identical source n-grams are valid
        suggestionIsValid = true;
      } else if (!isPerfectMatch && !finishedReadingAlignment &&
        !finishedReadingSuggestion && !suggestionSpansMultiple &&
        suggestionTargetIsSuperset) {
        // incomplete readings are valid until proven otherwise
        suggestionIsValid = true;
      }
    }

    // TRICKY: persist invalid state through the entire suggestion.
    if (!suggestionIsValid) {
      suggestionStateIsValid = suggestionIsValid;
    }

    // renders a finished alignment
    const renderAlignment = () => {
      // use the alignment
      const index = alignmentQueue.pop();
      const rawAlignment = _.cloneDeep(alignments[index]);
      rawAlignment.alignments = [index];
      return rawAlignment;
    };

    // renders a finished suggestion
    const renderSuggestion = () => {
      const index = suggestionSourceIndex[tIndex].index;
      // merge target n-grams
      const rawSuggestion = _.cloneDeep(suggestions[index]);
      rawSuggestion.suggestedTargetTokens = [...rawSuggestion.targetNgram];
      for (const aIndex of alignmentQueue) {
        const rawAlignment = alignments[aIndex];
        for (const t of rawAlignment.targetNgram) {
          if (rawSuggestion.targetNgram.indexOf(t) === -1) {
            rawSuggestion.targetNgram.push(t);
          } else {
            _.pull(rawSuggestion.suggestedTargetTokens, t);
          }
        }
        rawSuggestion.targetNgram = _.union(rawSuggestion.targetNgram,
          rawAlignment.targetNgram);
      }
      rawSuggestion.alignments = [...alignmentQueue];
      rawSuggestion.suggestion = index;
      rawSuggestion.targetNgram.sort(numberComparator);
      if (suggestionSourceIndex[tIndex].isEmpty && sourceNgramsMatch) {
        // TRICKY: render empty matches as an alignment
        return {
          alignments: rawSuggestion.alignments,
          sourceNgram: rawSuggestion.sourceNgram,
          targetNgram: rawSuggestion.targetNgram
        };
      } else {
        return rawSuggestion;
      }
    };

    // TRICKY: if the suggested target tokens are used elsewhere we render the alignment
    const shouldRenderSuggestion = suggestionStateIsValid &&
      finishedReadingSuggestion && !targetUsedElsewhere;
    const shouldRenderAlignment = (!suggestionStateIsValid ||
      targetUsedElsewhere) && finishedReadingAlignment;

    // append finished readings
    if (shouldRenderSuggestion) {
      suggestedAlignments.push(renderSuggestion());
    } else if (shouldRenderAlignment) {
      suggestedAlignments.push(renderAlignment());
    }

    // clean up
    if (!suggestionStateIsValid && finishedReadingAlignment ||
      suggestionStateIsValid && finishedReadingSuggestion) {
      tokenQueue = [];
      alignmentQueue = [];
    }
    if (finishedReadingSuggestion) {
      suggestionStateIsValid = true;
    }
  }

  return suggestedAlignments;
};

export default render;

/**
 * Converts some alignments to rendered alignments.
 * @param alignments
 * @return {*}
 */
export const convertToRendered = (alignments) => {
  return alignments.map((a, index) => {
    const newA = _.cloneDeep(a);
    newA.alignments = [index];
    return newA;
  });
};

/**
 * Checks if an array if a subset of another
 * @param superset
 * @param subset
 * @return {boolean}
 */
const isSubArray = (superset, subset) => {
  for (const val of subset) {
    if (!_.includes(superset, val)) {
      return false;
    }
  }
  return true;
};
