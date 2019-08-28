import { DeepPartial } from 'redux';
import {
  updateRating,
  updateBufferedRanges,
  setAdditionalInformationText,
  addAdditionalInformationTrack,
  startSeeking,
  stopSeeking,
  seek,
  setCurrentTime,
  toggleFullscreenChangeAction,
  playMedia,
  pauseMedia,
  updateMediaDuration,
  changeVolume,
  toggleMute,
  changePlaybackRate
} from '../actions/player';
import { loadConfiguration } from '../actions/shared/configuration';
import { ITrack } from '../components/media/MediaSubtitlesTrack';
import {
  DEFAULT_MUTED,
  DEFAULT_PLAYBACK_RATE,
  DEFAULT_PRELOAD,
  DEFAULT_VOLUME,
  DEFAULT_AUTOPLAY,
  MEDIA_SELECTOR
} from '../constants/player';
import { IRawTrackExt, ITimeRange } from '../utils/media';
import { changeMediaSource } from '../actions/preferences';
import { safeDump, safeLoad } from 'js-yaml';
import { cloneDeep } from 'lodash';
import { APP_ROOT_SELECTOR } from '../constants';
import { createReducer } from 'redux-starter-kit';

export interface IPlayerState {
  additionalInformationText?: string;
  additionalInformationTracks: ITrack[];
  autoPlay: boolean;
  bufferedRanges: ITimeRange[];

  /** The current position of the player, expressed in seconds */
  currentTime: number;

  /** Duration of the video expressed in seconds. */
  duration: number;
  isFullscreen: boolean;
  isMuted: boolean;
  isPlaying: boolean;

  isSeeking: boolean;

  mediaSelector: string;
  mediaId: string;

  metadataTracks: IRawTrackExt[];

  /**
   * The current rate of speed for the media resource to play. This speed is
   * expressed as a multiple of the normal speed of the media resource.
   */
  playbackRate: number;
  playerSelector: string;
  poster?: string;
  preload: string;
  rating?: number;
  seekingTime: number;
  sources: ISource[];

  /**
   * Volume level for audio portions of the media element.
   * It varies from 0 to 1.
   */
  volume: number;
}

export interface ISource {
  label: string;
  type?: string;
  selected?: boolean;
  src: string;
}

export const initialPlayerState: IPlayerState = {
  additionalInformationTracks: [],
  autoPlay: DEFAULT_AUTOPLAY,
  bufferedRanges: [],
  currentTime: 0,
  duration: 0,
  isFullscreen: false,
  isMuted: DEFAULT_MUTED,
  isPlaying: false,
  isSeeking: false,
  mediaId: '__unset__',
  mediaSelector: MEDIA_SELECTOR,
  metadataTracks: [],
  playbackRate: DEFAULT_PLAYBACK_RATE,
  playerSelector: APP_ROOT_SELECTOR,
  preload: DEFAULT_PRELOAD,
  rating: 0,
  seekingTime: 0,
  sources: [],
  volume: DEFAULT_VOLUME
};

export const playerReducer = createReducer(initialPlayerState, {
  [updateRating.toString()]: (state: IPlayerState, action) => {
    state.rating = action.payload;
  },
  [updateBufferedRanges.toString()]: (state: IPlayerState, action) => {
    state.bufferedRanges = action.payload;
  },
  [toggleFullscreenChangeAction.toString()]: (state: IPlayerState, action) => {
    state.isFullscreen = action.payload;
  },
  [playMedia.toString()]: (state: IPlayerState) => {
    state.isPlaying = true;
  },
  [pauseMedia.toString()]: (state: IPlayerState) => {
    state.isPlaying = false;
  },
  [changePlaybackRate.toString()]: (state: IPlayerState, action) => {
    state.playbackRate = action.payload;
  },
  [toggleMute.toString()]: (state: IPlayerState) => {
    state.isMuted = !state.isMuted;
  },
  [changeVolume.toString()]: (state: IPlayerState, action) => {
    state.volume = action.payload;
  },
  [updateMediaDuration.toString()]: (state: IPlayerState, action) => {
    state.duration = action.payload;
  },
  [setCurrentTime.toString()]: (state: IPlayerState, action) => {
    state.currentTime = action.payload;
  },
  [seek.toString()]: (state: IPlayerState, action) => {
    state.seekingTime = action.payload;
  },
  [startSeeking.toString()]: (state: IPlayerState) => {
    state.isSeeking = true;
  },
  [stopSeeking.toString()]: (state: IPlayerState) => {
    state.isSeeking = false;
    state.seekingTime = 0;
  },
  [setAdditionalInformationText.toString()]: (state: IPlayerState, action) => {
    state.additionalInformationText = action.payload;
  },
  [addAdditionalInformationTrack.toString()]: (state: IPlayerState, action) => {
    state.metadataTracks.push(action.payload);
  },
  [loadConfiguration.toString()]: (state: IPlayerState, action) => {
    return Object.assign(
      cloneDeep(initialPlayerState),
      cloneDeep(action.payload.player)
    );
  },
  [changeMediaSource.toString()]: (state: IPlayerState, action) => {
    state.sources = state.sources.map((source: ISource) => ({
      ...source,
      selected: source.src === action.payload
    }));
  }
});

export function getLocalPlayerState(mid: string) {
  try {
    const localStorageState = localStorage.getItem(`aiana-media-${mid}`);

    if (localStorageState === null) {
      return undefined;
    }

    return safeLoad(localStorageState);
  } catch (err) {
    return undefined;
  }
}

export function stateToYAML(state: DeepPartial<IPlayerState>) {
  const exportedKeys = [
    'currentTime',
    'isMuted',
    'mediaId',
    'playbackRate',
    'rating',
    'volume'
  ];

  try {
    const exportedState = exportedKeys.reduce((acc, cur) => {
      return Object.assign(acc, { [cur]: state[cur] });
    }, {});

    return safeDump(exportedState);
  } catch (err) {
    return '';
  }
}

export function isSelectedSource(source: ISource): boolean {
  return source.selected === true;
}

export function getSelectedMediaSource(sources: ISource[]) {
  return sources.find(isSelectedSource);
}

export default playerReducer;
