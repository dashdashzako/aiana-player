import React, { Fragment } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { changePlaybackRate } from '../../actions/player';
import withUniqueId, { IInjectedUniqueIdProps } from '../../hocs/withUniqueId';
import { IAianaState } from '../../reducers';

interface IStateProps {
  currentPlaybackRate?: number;
  mediaSelector: string;
  playbackRates?: number[];
}

interface IDispatchProps {
  changePlaybackRate(playbackRate: number): void;
}

interface IPlaybackRateSelector
  extends IInjectedUniqueIdProps,
    IStateProps,
    IDispatchProps,
    WithTranslation {}

function PlaybackRateSelector(props: IPlaybackRateSelector) {
  const { playbackRates, currentPlaybackRate, t, uid } = props;

  return (
    <Fragment>
      <span id={uid}>{t('preferences.playbackrate.label')}</span>
      <select
        aria-labelledby={uid}
        onChange={(evt: React.ChangeEvent<HTMLSelectElement>) => {
          const playbackRate = Number(evt.currentTarget.value);
          const media = document.querySelector(
            props.mediaSelector
          ) as HTMLMediaElement;

          if (media) {
            media.playbackRate = playbackRate;
          }

          props.changePlaybackRate(playbackRate);
        }}
        value={currentPlaybackRate}
      >
        {playbackRates &&
          playbackRates.map((playbackRate) => (
            <option key={playbackRate} value={playbackRate}>
              ×{playbackRate}
            </option>
          ))}
      </select>
    </Fragment>
  );
}

function mapState(state: IAianaState) {
  return {
    currentPlaybackRate: state.player.playbackRate,
    mediaSelector: state.player.mediaSelector,
    playbackRates: state.preferences.playbackRates
  };
}

const mapDispatch = {
  changePlaybackRate
};

export default connect(
  mapState,
  mapDispatch
)(withTranslation()(withUniqueId(PlaybackRateSelector)));
