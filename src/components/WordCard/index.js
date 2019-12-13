import React from 'react';
import PropTypes from 'prop-types';
import WordOccurrence from './WordOccurrence';
import Controls from './Controls';

/**
 * Generates the component styles
 * @param props
 * @return {object}
 */
const makeStyles = (props) => {
  const {onClick, disabled, style, isSuggestion, selected, direction} = props;

  // TRICKY: place border on correct side to match text direction
  const borderKey = direction === 'ltr' ? 'borderLeft' : 'borderRight';

  const styles = {
    root: {
      [borderKey]: '5px solid #44C6FF',
      padding: '9px',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      ...style
    },
    word: {
      width: 'max-content',
      flexGrow: 2,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
  };

  if (isSuggestion) {
    styles.root[borderKey] = '5px solid #1b7729';
  }

  if (disabled) {
    styles.root = {
      ...styles.root,
      [borderKey]: '5px solid #868686',
      opacity: 0.3,
      cursor: 'not-allowed',
      userSelect: 'none'
    };
  }

  if (selected) {
    styles.root = {
      ...styles.root,
      backgroundColor: '#44C6FF'
    };
  }

  if (!disabled && typeof onClick === 'function') {
    styles.word = {
      ...styles.word,
      cursor: 'pointer'
    };
  }

  return styles;
};

/**
 * Renders a standard word.
 *
 * @param {string} word - the represented word
 * @param {int} occurrence
 * @param {int} occurrences
 * @param {object} [style] - styles passed  through to the component
 * @param {func} [onClick] - callback when the word is clicked
 * @param {bool} [disabled] - indicates the word is disabled
 * @constructor
 */
class WordCard extends React.Component {

  constructor(props) {
    super(props);
    this._handleClick = this._handleClick.bind(this);
    this._handleCancelClick = this._handleCancelClick.bind(this);
  }

  /**
   * Handles click events on the word title.
   * If the word is disabled the click event will be blocked.
   * @param e
   * @private
   */
  _handleClick(e) {
    const {disabled, onClick} = this.props;
    if (!disabled && typeof onClick === 'function') {
      e.stopPropagation();
      onClick(e);
    }
  }

  /**
   * Handles clicking the cancel button on suggestions
   * @param e
   * @private
   */
  _handleCancelClick(e) {
    const {onCancel} = this.props;
    if (typeof onCancel === 'function') {
      e.stopPropagation();
      onCancel(e);
    }
  }

  render() {
    const {word, occurrence, occurrences, isSuggestion} = this.props;
    const styles = makeStyles(this.props);
    return (
      <div style={{flex: 1}}>
        <div style={styles.root}>
        <span style={{flex: 1, display: 'flex', overflow: 'hidden'}}>
          <span onClick={this._handleClick} style={styles.word}>
            {word}
          </span>
          {isSuggestion ? (
            <Controls onCancel={this._handleCancelClick}/>
          ) : null}

        </span>
          <WordOccurrence occurrence={occurrence}
                          occurrences={occurrences}/>
        </div>
      </div>
    );
  }
}

WordCard.propTypes = {
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  onCancel: PropTypes.func,
  style: PropTypes.object,
  occurrence: PropTypes.number,
  occurrences: PropTypes.number,
  word: PropTypes.string.isRequired,
  isSuggestion: PropTypes.bool,
  direction: PropTypes.oneOf(['ltr', 'rtl'])
};

WordCard.defaultProps = {
  style: {},
  occurrence: 1,
  occurrences: 1,
  disabled: false,
  isSuggestion: false,
  selected: false,
  direction: 'ltr'
};

export default WordCard;
