import * as React from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { updateActiveTextTrack } from '../../actions/player';
import { IAianaState } from '../../reducers/index';
import { IRawTextTrack } from '../../utils/text-tracks';
import { ITransnected } from '../../utils/types';

interface ISubtitlesTrackSelector extends ITransnected {
  nativeControls: boolean;
  textTracks: IRawTextTrack[];
  videoElement: HTMLVideoElement | null;
}

class SubtitlesTrackSelector extends React.Component<ISubtitlesTrackSelector> {
  public render() {
    const { t, textTracks, videoElement } = this.props;

    if (!videoElement) {
      return null;
    }

    const selectedTrack = textTracks.find((track) => track.active);
    const selectedValue = selectedTrack ? selectedTrack.label : '';

    return (
      <div className="aip-subtitles-track-selector">
        <label>
          <span>{t('preferences.subtitlestrack.label')}</span>
          <select
            onChange={this.selectedTrackChangedHandler}
            value={selectedValue}
          >
            <option value="">None</option>
            {textTracks
              .filter((track) => {
                return track.kind === 'subtitles' || track.kind === 'captions';
              })
              .map((track) => (
                <option key={track.label} value={track.label}>
                  {track.label}
                </option>
              ))}
          </select>
        </label>
      </div>
    );
  }

  private selectedTrackChangedHandler = (
    evt: React.ChangeEvent<HTMLSelectElement>
  ) => {
    this.props.dispatch(updateActiveTextTrack(evt.currentTarget.value));
  };
}

export default connect((state: IAianaState) => ({
  nativeControls: state.player.nativeControls,
  textTracks: state.player.textTracks,
  videoElement: state.player.videoElement
}))(translate()(SubtitlesTrackSelector));