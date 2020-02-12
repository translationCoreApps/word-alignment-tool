import React from 'react';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import toJson from 'enzyme-to-json';
import {shallow} from 'enzyme';
import {Container} from '../Container';
import * as reducers from '../../state/reducers';
import Api from '../../Api';

jest.mock('../../state/reducers');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const basicProps = require('./__fixtures__/basicProps.json');
const props = {
  ...basicProps,
  tc: {
    ...basicProps.tc,
    project: { getBookName: () => () => 'gen' },
  },
};
props.tc.contextId.tool = 'wordAlignment';

describe('Container', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render', () => {
    // given
    const verseState = {
      finished: true,
      invalid: true,
      edited: true,
      unaligned: true
    };
    const myProps = setupReducersAndProps(props, verseState);
    myProps.currentBookmarks = true;
    myProps.currentComments = 'My Comment';

    // when
    const wrapper = shallow(
        <Container {...myProps} />
    );
    // const instance = wrapper.instance();

    // then
    const instance = wrapper.instance();
    const newState = instance.state;
    expect(newState.showComments).toEqual(false);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  describe('actions', () => {
    it('comment click should open comments', () => {
      // given
      const instance = getContainerInstance(props);

      // when
      instance.handleCommentClick();

      // then
      const newState = instance.state;
      expect(newState.showComments).toEqual(true);
    });

    it('comment close should close comments', () => {
      // given
      const instance = getContainerInstance(props);
      instance.setState({showComments: true}); // make sure on before closing

      // when
      instance.handleCommentClose();

      // then
      const newState = instance.state;
      expect(newState.showComments).toEqual(false);
    });

    it('comment submit should save and close comments', () => {
      // given
      const myProps = {
        ...props,
        addComment: jest.fn(() => true)
      };
      const instance = getContainerInstance(myProps);
      instance.setState({showComments: true}); // make sure on before closing
      const newComment = 'New Comment!';

      // when
      instance.handleCommentSubmit(newComment);

      // then
      const newState = instance.state;
      expect(newState.showComments).toEqual(false);
      expect(myProps.addComment).toBeCalledWith(instance.props.tool.api, newComment, myProps.username, myProps.tc.contextId);
    });

    it('bookmark click should toggle from off to on', () => {
      // given
      const initialBookmark = false;
      const myProps = {
        ...props,
        addBookmark: jest.fn(() => true),
        currentBookmarks: initialBookmark,
      };
      const instance = getContainerInstance(myProps);

      // when
      instance.handleBookmarkClick();

      // then
      expect(myProps.addBookmark).toBeCalledWith(instance.props.tool.api, !initialBookmark, myProps.username, myProps.tc.contextId);
    });

    it('bookmark click should toggle from on to off', () => {
      // given
      const initialBookmark = true;
      const myProps = {
        ...props,
        addBookmark: jest.fn(() => true),
        currentBookmarks: initialBookmark,
      };
      const instance = getContainerInstance(myProps);

      // when
      instance.handleBookmarkClick();

      // then
      expect(myProps.addBookmark).toBeCalledWith(instance.props.tool.api, !initialBookmark, myProps.username, myProps.tc.contextId);
    });
  });
});

//
// Helpers
//

function setupReducersAndProps(props, verseState) {
  reducers.getRenderedVerseAlignedTargetTokens.mockReturnValue([]);
  reducers.getRenderedVerseAlignments.mockReturnValue([]);
  reducers.getIsVerseAlignmentsValid.mockReturnValue(true);
  reducers.getIsVerseAligned.mockReturnValue(true);
  reducers.getVerseHasRenderedSuggestions.mockReturnValue(false);
  reducers.getCurrentComments.mockReturnValue('');
  reducers.getCurrentBookmarks.mockReturnValue(false);
  const state = {
    tool: {
      groupMenu: {
        '1': {
          '2': {
            finished: true,
            invalid: true,
            edited: true,
            unaligned: true
          },
          '3': {
            finished: true
          }
        }
      }
    },
  };
  const store = mockStore(state);
  const api = new Api();
  api.context.store = store;
  api.getVerseData = jest.fn(() => (verseState));
  const myProps = {
    ...props,
    translate: k => k,
    tool: {
      api,
      translate: k => k,
    }
  };
  return myProps;
}

function getContainerInstance(props) {
  const verseState = {
    finished: true,
    invalid: true,
    edited: true,
    unaligned: true
  };
  const myProps = setupReducersAndProps(props, verseState);
  const wrapper = shallow(
    <Container {...myProps} />
  );
  const instance = wrapper.instance();
  return instance;
}