import * as React from 'react';
import { connect } from 'react-redux';
import { requestSeek } from 'src/actions/player';
import { IAianaState } from 'src/reducers';
import { IBookmark } from 'src/reducers/bookmarks';
import { unitToPercent } from 'src/utils/math';
import styled from 'src/utils/styled-components';
import BookmarkButton from './BookmarkButton';

interface IProps {
  bookmarks: IBookmark[];
  duration: number;
  media: HTMLMediaElement | null;
}

interface IDispatchProps {
  requestSeek: (media: HTMLMediaElement, seekingTime: number) => any;
}

interface IBookmarksBar extends IProps, IDispatchProps {}

const StyledList = styled.ol`
  li {
    display: block;
    width: 1em;
    height: 1em;

    position: absolute;
    transform: translateX(-50%);
    list-style: none;

    button {
      width: 100%;
      height: 100%;
    }
  }
`;

const BookmarksBar: React.SFC<IBookmarksBar> = ({
  bookmarks,
  duration,
  media,
  requestSeek: requestSeekAction
}) => (
  <StyledList>
    {bookmarks.map(({ time }, idx) => (
      <li
        key={idx}
        style={{
          left: `${unitToPercent(time, duration)}%`
        }}
      >
        <BookmarkButton onClick={requestSeekAction} media={media} time={time} />
      </li>
    ))}
  </StyledList>
);

const mapStateToProps = (state: IAianaState) => ({
  bookmarks: state.bookmarks,
  duration: state.player.duration,
  media: state.player.mediaElement
});

const mapDispatchToProps = {
  requestSeek
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookmarksBar);
