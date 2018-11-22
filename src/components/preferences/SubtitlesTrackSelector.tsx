import * as React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { updateActiveSubtitlesTrack } from 'src/actions/subtitles';
import { IAianaState } from 'src/reducers/index';
import { CDispatch } from 'src/store';
import {
  IRawSubtitlesTrack,
  isActiveTrack,
  isDisplayableTrack
} from 'src/utils/media';
import { uuid } from 'src/utils/ui';

interface IStateProps {
  subtitlesTracks: IRawSubtitlesTrack[];
  mediaElement?: HTMLMediaElement;
}

interface IDispatchProps {
  selectedTrackChangedHandler(evt: React.ChangeEvent<HTMLSelectElement>): void;
}

interface ISubtitlesTrackSelector
  extends IStateProps,
    IDispatchProps,
    InjectedTranslateProps {}

const SubtitlesTrackSelector: React.SFC<ISubtitlesTrackSelector> = ({
  mediaElement,
  selectedTrackChangedHandler,
  t,
  subtitlesTracks
}) => {
  if (!mediaElement) {
    return null;
  }

  const selectedTrack = subtitlesTracks.find(isActiveTrack);
  const selectedValue = selectedTrack ? selectedTrack.language : '';
  const id = uuid();

  return (
    <React.Fragment>
      <span id={id}>{t('preferences.subtitlestrack.label')}</span>
      <select
        aria-labelledby={id}
        onChange={selectedTrackChangedHandler}
        value={selectedValue}
      >
        <option value="">{t('preferences.subtitlestrack.no_subtitle')}</option>
        {subtitlesTracks.filter(isDisplayableTrack).map((track) => (
          <option key={track.language} value={track.language}>
            {track.label}
          </option>
        ))}
      </select>
    </React.Fragment>
  );
};

const mapStateToProps = (state: IAianaState) => ({
  mediaElement: state.player.mediaElement,
  subtitlesTracks: state.subtitles.subtitlesTracks
});

const mapDispatchToProps = (dispatch: CDispatch) => ({
  selectedTrackChangedHandler: (evt: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(updateActiveSubtitlesTrack(evt.currentTarget.value));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(SubtitlesTrackSelector));
