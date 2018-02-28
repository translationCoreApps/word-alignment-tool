import React from 'react';
import PropTypes from 'prop-types';
import WordOccurrence from './WordOccurrence';

const defaultStyles = {
  borderLeft: '5px solid #44C6FF',
  padding: '10px',
  backgroundColor: '#FFFFFF',
  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset",
  cursor: 'move',
  display: 'flex',
  // width: '100%',
  flexDirection: 'row'
};

/**
 * Renders a single word
 * @property {string} word - the represented word
 * @property {int} occurrence
 * @property {int} occurrences
 * @property {object} [style]
 */
const Word = ({word, occurrence, occurrences, style}) => {
  const wordStyle = {...defaultStyles, ...style};
  return (
    <div style={wordStyle}>
      <span style={{flex: 1}}>
        {word}
      </span>
      <WordOccurrence occurrence={occurrence}
                      occurrences={occurrences}/>
    </div>
  );
};

Word.propTypes = {
  style: PropTypes.object,
  word: PropTypes.string.isRequired,
  occurrence: PropTypes.number.isRequired,
  occurrences: PropTypes.number.isRequired
};

Word.defaultProps = {
  style: {}
};

export default Word;
