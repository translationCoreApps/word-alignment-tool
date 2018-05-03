import {reducerTest} from 'redux-jest';
import * as types from '../../../actions/actionTypes';
import alignments, * as fromAlignments from '../index';
import Token from 'word-map/structures/Token';

describe('set chapter alignments when empty', () => {
  const stateBefore = {};
  const action = {
    type: types.SET_CHAPTER_ALIGNMENTS,
    chapter: 1,
    alignments: {
      '1': {
        sourceTokens: [],
        targetTokens: [],
        alignments: []
      }
    }
  };
  const stateAfter = {
    '1': {
      '1': {
        alignments: [],
        sourceTokens: [],
        targetTokens: []
      }
    }
  };
  reducerTest('Set Chapter Alignments', alignments, stateBefore, action,
    stateAfter);
});

describe('align target token to empty source token', () => {
  const stateBefore = {
    '1': {
      '1': {
        sourceTokens: [],
        targetTokens: [
          {
            word: 'hello',
            occurrence: 1,
            occurrences: 1,
            position: 0
          },
          {
            word: 'world',
            occurrence: 1,
            occurrences: 1,
            position: 1
          }],
        alignments: [
          {
            sourceNgram: [],
            targetNgram: [1]
          }]
      }
    }
  };
  const action = {
    type: types.ALIGN_TARGET_TOKEN,
    chapter: 1,
    verse: 1,
    index: 0,
    token: new Token({
      text: 'hello',
      position: 0,
      occurrence: 1,
      occurrences: 1
    })
  };
  const stateAfter = {
    '1': {
      '1': {
        sourceTokens: [],
        targetTokens: [
          {
            word: 'hello',
            occurrence: 1,
            occurrences: 1,
            position: 0
          },
          {
            word: 'world',
            occurrence: 1,
            occurrences: 1,
            position: 1
          }],
        alignments: []
      }
    }
  };
  reducerTest('Add Alignment', alignments, stateBefore, action,
    stateAfter);
});

describe('align target token', () => {
  const stateBefore = {
    '1': {
      '1': {
        sourceTokens: [
          {
            text: 'olleh',
            occurrence: 1,
            occurrences: 1,
            position: 0
          }],
        targetTokens: [
          {
            text: 'hello',
            occurrence: 1,
            occurrences: 1,
            position: 0
          },
          {
            text: 'world',
            occurrence: 1,
            occurrences: 1,
            position: 1
          }],
        alignments: [
          {
            sourceNgram: [0],
            targetNgram: [1]
          }]
      }
    }
  };
  const action = {
    type: types.ALIGN_TARGET_TOKEN,
    chapter: 1,
    verse: 1,
    index: 0,
    token: new Token({
      text: 'hello',
      position: 0,
      occurrence: 1,
      occurrences: 1
    })
  };
  const stateAfter = {
    '1': {
      '1': {
        sourceTokens: [
          {
            text: 'olleh',
            occurrence: 1,
            occurrences: 1,
            position: 0
          }],
        targetTokens: [
          {
            text: 'hello',
            occurrence: 1,
            occurrences: 1,
            position: 0
          },
          {
            text: 'world',
            occurrence: 1,
            occurrences: 1,
            position: 1
          }],
        alignments: [
          {
            sourceNgram: [0],
            targetNgram: [0, 1]
          }]
      }
    }
  };
  reducerTest('Add Alignment', alignments, stateBefore, action,
    stateAfter);
});

describe('align target token from second alignment', () => {
  const stateBefore = {
    '1': {
      '1': {
        sourceTokens: [
          {
            text: 'olleh',
            occurrence: 1,
            occurrences: 1,
            position: 0
          },
          {
            text: 'dlrow',
            occurrence: 1,
            occurrences: 1,
            position: 1
          }],
        targetTokens: [
          {
            text: 'hello',
            occurrence: 1,
            occurrences: 1,
            position: 0
          },
          {
            text: 'world',
            occurrence: 1,
            occurrences: 1,
            position: 1
          }],
        alignments: [
          {
            sourceNgram: [0],
            targetNgram: [0]
          },
          {
            sourceNgram: [1],
            targetNgram: []
          }]
      }
    }
  };
  const action = {
    type: types.ALIGN_TARGET_TOKEN,
    chapter: 1,
    verse: 1,
    index: 1,
    token: new Token({
      text: 'world',
      position: 1,
      occurrence: 1,
      occurrences: 1
    })
  };
  const stateAfter = {
    '1': {
      '1': {
        sourceTokens: [
          {
            text: 'olleh',
            occurrence: 1,
            occurrences: 1,
            position: 0
          },
          {
            text: 'dlrow',
            occurrence: 1,
            occurrences: 1,
            position: 1
          }],
        targetTokens: [
          {
            text: 'hello',
            occurrence: 1,
            occurrences: 1,
            position: 0
          },
          {
            text: 'world',
            occurrence: 1,
            occurrences: 1,
            position: 1
          }],
        alignments: [
          {
            sourceNgram: [0],
            targetNgram: [0]
          },
          {
            sourceNgram: [1],
            targetNgram: [1]
          }]
      }
    }
  };
  reducerTest('Add Alignment', alignments, stateBefore, action,
    stateAfter);
});

describe('insert source token', () => {
  const stateBefore = {
    '1': {
      '1': {
        sourceTokens: [
          {
            text: 'olleh',
            occurrence: 1,
            occurrences: 1,
            position: 0
          },
          {
            text: 'dlrow',
            occurrence: 1,
            occurrences: 1,
            position: 1
          }],
        targetTokens: [],
        alignments: [
          {
            sourceNgram: [0],
            targetNgram: []
          }]
      }
    }
  };
  const action = {
    type: types.INSERT_ALIGNMENT,
    chapter: 1,
    verse: 1,
    token: new Token({
      text: 'dlrow',
      occurrence: 1,
      occurrences: 1,
      position: 1,
      strong: 'strong',
      morph: 'morph',
      lemma: 'lemma'
    })
  };
  const stateAfter = {
    '1': {
      '1': {
        sourceTokens: [
          {
            text: 'olleh',
            occurrence: 1,
            occurrences: 1,
            position: 0
          },
          {
            text: 'dlrow',
            occurrence: 1,
            occurrences: 1,
            position: 1
          }],
        targetTokens: [],
        alignments: [
          {
            sourceNgram: [0],
            targetNgram: []
          },
          {
            sourceNgram: [1],
            targetNgram: []
          }]
      }
    }
  };
  reducerTest('Insert Alignment', alignments, stateBefore, action,
    stateAfter);
});

describe('align source token', () => {
  const stateBefore = {
    '1': {
      '1': {
        sourceTokens: [
          {
            text: 'olleh',
            occurrence: 1,
            occurrences: 1,
            position: 0
          },
          {
            text: 'dlrow',
            occurrence: 1,
            occurrences: 1,
            position: 1
          },
          {
            text: 'ih',
            occurrence: 1,
            occurrences: 1,
            position: 2
          }],
        targetTokens: [],
        alignments: [
          {
            sourceNgram: [2, 1],
            targetNgram: []
          }]
      }
    }
  };
  const action = {
    type: types.ALIGN_SOURCE_TOKEN,
    chapter: 1,
    verse: 1,
    index: 0,
    token: new Token({
      text: 'olleh',
      occurrence: 1,
      occurrences: 1,
      position: 0,
      strong: 'strong',
      morph: 'morph',
      lemma: 'lemma'
    })
  };
  const stateAfter = {
    '1': {
      '1': {
        sourceTokens: [
          {
            text: 'olleh',
            occurrence: 1,
            occurrences: 1,
            position: 0
          },
          {
            text: 'dlrow',
            occurrence: 1,
            occurrences: 1,
            position: 1
          },
          {
            text: 'ih',
            occurrence: 1,
            occurrences: 1,
            position: 2
          }],
        targetTokens: [],
        alignments: [
          {
            sourceNgram: [0, 1, 2],
            targetNgram: []
          }]
      }
    }
  };
  reducerTest('Add Alignment', alignments, stateBefore, action,
    stateAfter);
});

describe('remove target token alignment', () => {
  const stateBefore = {
    '1': {
      '1': {
        sourceTokens: [
          {
            text: 'hello',
            occurrence: 1,
            occurrences: 1,
            position: 0
          }],
        targetTokens: [
          {
            text: 'olleh',
            occurrence: 1,
            occurrences: 1,
            position: 0
          },
          {
            text: 'dlrow',
            occurrence: 1,
            occurrences: 1,
            position: 1
          }],
        alignments: [
          {
            sourceNgram: [0],
            targetNgram: [1]
          }]
      }
    }
  };
  const action = {
    type: types.UNALIGN_TARGET_TOKEN,
    chapter: 1,
    verse: 1,
    index: 0,
    token: new Token({
      text: 'dlrow',
      occurrence: 1,
      occurrences: 1,
      position: 1
    })
  };
  const stateAfter = {
    '1': {
      '1': {
        sourceTokens: [
          {
            text: 'hello',
            occurrence: 1,
            occurrences: 1,
            position: 0
          }],
        targetTokens: [
          {
            text: 'olleh',
            occurrence: 1,
            occurrences: 1,
            position: 0
          },
          {
            text: 'dlrow',
            occurrence: 1,
            occurrences: 1,
            position: 1
          }],
        alignments: [
          {
            sourceNgram: [0],
            targetNgram: []
          }]
      }
    }
  };
  reducerTest('Remove Alignment', alignments, stateBefore, action, stateAfter);
});

describe('remove source token alignment', () => {
  const stateBefore = {
    '1': {
      '1': {
        sourceTokens: [
          {
            text: 'olleh',
            occurrence: 1,
            occurrences: 1,
            position: 0
          },
          {
            text: 'dlrow',
            occurrence: 1,
            occurrences: 1,
            position: 1
          }],
        targetTokens: [],
        alignments: [
          {
            sourceNgram: [0],
            targetNgram: []
          }]
      }
    }
  };
  const action = {
    type: types.UNALIGN_SOURCE_TOKEN,
    chapter: 1,
    verse: 1,
    index: 0,
    token: new Token({
      text: 'olleh',
      occurrence: 1,
      occurrences: 1,
      position: 0
    })
  };
  const stateAfter = {
    '1': {
      '1': {
        sourceTokens: [
          {
            text: 'olleh',
            occurrence: 1,
            occurrences: 1,
            position: 0
          },
          {
            text: 'dlrow',
            occurrence: 1,
            occurrences: 1,
            position: 1
          }],
        targetTokens: [],
        alignments: []
      }
    }
  };
  reducerTest('Remove Alignment', alignments, stateBefore, action,
    stateAfter);
});

describe('set chapter alignments', () => {
  const stateBefore = {
    '1': {
      '1': {
        sourceTokens: [],
        targeTokens: [
          {
            text: 'world',
            position: 0,
            occurrence: 1,
            occurrences: 1
          }],
        alignments: [
          {
            primaryNgram: [],
            secondaryNgram: [0]
          }
        ]
      }
    }
  };
  const action = {
    type: types.SET_CHAPTER_ALIGNMENTS,
    chapter: 1,
    alignments: {
      '1': {
        sourceTokens: [],
        targetTokens: [],
        alignments: []
      },
      '2': {
        sourceTokens: [],
        targetTokens: [
          {
            text: 'hello',
            position: 0,
            occurrence: 1,
            occurrences: 1
          }, {
            text: 'world',
            position: 1,
            occurrence: 1,
            occurrences: 1
          }],
        alignments: [
          {
            sourceNgram: [],
            targetNgram: [1]
          }
        ]
      }
    }
  };
  const stateAfter = {
    '1': {
      '1': {
        sourceTokens: [],
        targetTokens: [],
        alignments: []
      },
      '2': {
        sourceTokens: [],
        targetTokens: [
          {
            text: 'hello',
            position: 0,
            occurrence: 1,
            occurrences: 1
          }, {
            text: 'world',
            position: 1,
            occurrence: 1,
            occurrences: 1
          }
        ],
        alignments: [
          {
            sourceNgram: [],
            targetNgram: [1]
          }
        ]
      }
    }
  };
  reducerTest('Set Chapter Alignments', alignments, stateBefore, action,
    stateAfter);
});

describe('reset alignments', () => {
  const stateBefore = {
    '1': {
      '1': {
        sourceTokens: [
          {
            text: 'hello',
            position: 0,
            occurrence: 1,
            occurrences: 1
          }
        ],
        targetTokens: [
          {
            text: 'world',
            position: 0,
            occurrence: 1,
            occurrences: 1
          }],
        alignments: [
          {
            primaryNgram: [0],
            secondaryNgram: [0]
          }
        ]
      }
    }
  };
  const action = {
    type: types.CLEAR_VERSE_ALIGNMENTS,
    chapter: 1,
    verse: 1
  };
  const stateAfter = {
    '1': {
      '1': {
        sourceTokens: [
          {
            text: 'hello',
            position: 0,
            occurrence: 1,
            occurrences: 1
          }
        ],
        targetTokens: [
          {
            text: 'world',
            position: 0,
            occurrence: 1,
            occurrences: 1
          }],
        alignments: []
      }
    }
  };
  reducerTest('Clear verse alignments', alignments, stateBefore, action,
    stateAfter);
});

describe('reset state', () => {
  const stateBefore = {
    '1': {
      '1': {
        sourceTokens: [
          {
            text: 'hello',
            position: 0,
            occurrence: 1,
            occurrences: 1
          }
        ],
        targetTokens: [
          {
            text: 'world',
            position: 0,
            occurrence: 1,
            occurrences: 1
          }],
        alignments: [
          {
            primaryNgram: [0],
            secondaryNgram: [0]
          }
        ]
      }
    }
  };
  const action = {
    type: types.CLEAR_STATE
  };
  const stateAfter = {};
  reducerTest('Clear tool state', alignments, stateBefore, action,
    stateAfter);
});

describe('selectors', () => {
  let state = {};

  beforeEach(() => {
    state = {
      '1': {
        '1': {
          sourceTokens: [
            {
              text: 'hello',
              occurrence: 1,
              occurrences: 1,
              position: 0
            }],
          targetTokens: [
            {
              text: 'world',
              occurrence: 1,
              occurrences: 1,
              position: 0
            }],
          alignments: [
            {
              sourceNgram: [0],
              targetNgram: [0]
            }
          ]
        }
      }
    };
  });

  it('returns alignments of the entire chapter', () => {
    const result = fromAlignments.getChapterAlignments(state, 1);
    expect(JSON.parse(JSON.stringify(result))).toEqual({
      '1': [
        {
          sourceNgram: [
            {
              text: 'hello',
              occurrence: 1,
              occurrences: 1,
              index: 0
            }],
          targetNgram: [
            {
              text: 'world',
              occurrence: 1,
              occurrences: 1,
              index: 0
            }]
        }]
    });
  });

  it('returns the verse alignments', () => {
    const result = fromAlignments.getVerseAlignments(state, 1, 1);
    expect(JSON.parse(JSON.stringify(result))).toEqual([
      {
        sourceNgram: [
          {
            text: 'hello',
            occurrence: 1,
            occurrences: 1,
            index: 0
          }],
        targetNgram: [
          {
            text: 'world',
            occurrence: 1,
            occurrences: 1,
            index: 0
          }]
      }]);
  });

  it('returns the aligned target tokens for the verse', () => {
    const result = fromAlignments.getVerseAlignedTargetTokens(state, 1, 1);
    expect(JSON.parse(JSON.stringify(result))).toEqual([
      {
        text: 'world',
        occurrence: 1,
        occurrences: 1,
        index: 0
      }]);
  });

  it('checks if the verse is valid (valid)', () => {
    const result = fromAlignments.getIsVerseValid(state, 1, 1, 'hello',
      'world');
    expect(result).toEqual(true);
  });

  it('checks if the verse is valid (invalid)', () => {
    const result = fromAlignments.getIsVerseValid(state, 1, 1, 'foo', 'bar');
    expect(result).toEqual(false);
  });
});

describe('target tokens', () => {
  const stateBefore = {
    '1': {
      '1': {
        sourceTokens: [],
        targetTokens: [
          {
            text: 'woot',
            occurrence: 1,
            occurrences: 1,
            position: 0
          }],
        alignments: []
      }
    }
  };
  const action = {
    type: types.SET_TARGET_TOKENS,
    chapter: 1,
    verse: 1,
    tokens: [
      {
        text: 'hello',
        occurrence: 1,
        occurrences: 1,
        position: 0
      },
      {
        text: 'world',
        occurrence: 1,
        occurrences: 1,
        position: 0
      }
    ]
  };
  const stateAfter = {
    '1': {
      '1': {
        sourceTokens: [],
        targetTokens: [
          {
            text: 'hello',
            occurrence: 1,
            occurrences: 1,
            position: 0
          },
          {
            text: 'world',
            occurrence: 1,
            occurrences: 1,
            position: 0
          }
        ],
        alignments: []
      }
    }
  };
  reducerTest('Sets the target tokens', alignments, stateBefore, action,
    stateAfter);
});

describe('source tokens', () => {
  const stateBefore = {
    '1': {
      '1': {
        targetTokens: [],
        sourceTokens: [
          {
            text: 'woot',
            occurrence: 1,
            occurrences: 1,
            position: 0
          }],
        alignments: []
      }
    }
  };
  const action = {
    type: types.SET_SOURCE_TOKENS,
    chapter: 1,
    verse: 1,
    tokens: [
      {
        text: 'hello',
        occurrence: 1,
        occurrences: 1,
        position: 0
      },
      {
        text: 'world',
        occurrence: 1,
        occurrences: 1,
        position: 0
      }
    ]
  };
  const stateAfter = {
    '1': {
      '1': {
        targetTokens: [],
        sourceTokens: [
          {
            text: 'hello',
            occurrence: 1,
            occurrences: 1,
            position: 0
          },
          {
            text: 'world',
            occurrence: 1,
            occurrences: 1,
            position: 0
          }
        ],
        alignments: []
      }
    }
  };
  reducerTest('Sets the source tokens', alignments, stateBefore, action,
    stateAfter);
});
