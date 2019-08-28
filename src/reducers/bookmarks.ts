import { addBookmark } from '../actions/bookmarks';
import { loadConfiguration } from '../actions/shared/configuration';
import { createReducer } from 'redux-starter-kit';

export interface IBookmark {
  readonly time: number;
}

type IBookmarkState = IBookmark[];

function hasBookmarked(time: number, state: IBookmarkState): boolean {
  return state.some((b) => b.time === time);
}

export const bookmarksReducer = createReducer([] as any, {
  [addBookmark.toString()]: (state: IBookmarkState, action) => {
    const time = action.payload;

    if (!hasBookmarked(time, state)) {
      state.push({ time });
    }
  },
  [loadConfiguration.toString()]: (state: IBookmarkState, action) => {
    return ([] as IBookmarkState).concat(...state, action.payload.bookmarks);
  }
});

export default bookmarksReducer;
