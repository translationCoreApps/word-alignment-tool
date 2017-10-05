import React from 'react';
import PropTypes from 'prop-types';
// constants
import ItemTypes from '../ItemTypes';
// components
import DropBoxItem from '../DropBoxItem';

const DropBoxArea = ({
  actions,
  resourcesReducer,
  wordAlignmentReducer,
  contextIdReducer: {
    contextId
  }
}) => {
  if (!contextId) {
    return (
      <div />
    );
  }
  const { chapter, verse } = contextId.reference;
  const alignments = wordAlignmentReducer.alignmentData[chapter][verse].alignments;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', height: '100%', backgroundColor: '#ffffff', padding: '0px 10px 50px', overflowY: 'auto' }}>
      {
        alignments.map((alignment, index) => {
          return (
            <DropBoxItem
              key={index}
              alignmentIndex={index}
              bottomWords={alignment.bottomWords}
              topWords={alignment.topWords}
              onDrop={item => this.handleDrop(index, item)}
              actions={actions}
              resourcesReducer={resourcesReducer}
            />
          );
        })
      }
    </div>
  );
};

DropBoxArea.handleDrop = (index, wordBankItem) => {
  if (wordBankItem.type === ItemTypes.BOTTOM_WORD) {
    this.props.actions.moveWordBankItemToAlignment(index, wordBankItem);
  }
  if (wordBankItem.type === ItemTypes.TOP_WORD) {
    this.props.actions.mergeAlignments(wordBankItem.alignmentIndex, index);
  }
};

DropBoxArea.propTypes = {
  wordAlignmentReducer: PropTypes.object.isRequired,
  contextIdReducer: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  resourcesReducer: PropTypes.shape({
    lexicons: PropTypes.object.isRequired
  })
};

export default DropBoxArea;
