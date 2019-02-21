import { Reducer } from 'redux';
import { LOAD_CONFIGURATION } from '../actions/shared';
import {
  ADD_SUBTITLES_TRACK,
  SET_SUBTITLE_TEXT,
  UPDATE_ACTIVE_SUBTITLES_TRACK,
  UPDATE_SUBTITLES_TRACKS_LIST
} from '../actions/subtitles';
import { IRawSubtitlesTrack } from '../utils/media';

export interface ISubtitlesTrack {
  label?: string;
  src: string;
  srcLang: string;
}

export interface ISubtitlesState {
  language?: string;
  subtitlesText?: string;

  /**
   * HTMLMediaElement already parses vtt files and manage its own tracks state
   * living inside a TextTrackList. However, the list elements have some
   * properties that are unnecessary to us. The elements will also lose some of
   * the HTML attributes such as `default`.
   * `textTracks` is a collection of lightweight objects with properties from
   * `sources` and `sourceTracks`.
   */
  subtitlesTracks: IRawSubtitlesTrack[];

  sources: ISubtitlesTrack[];
}

const initialState = {
  sources: [],
  subtitlesTracks: []
};

function toggleSubtitlesTracks(
  tracks: IRawSubtitlesTrack[],
  language: string
): IRawSubtitlesTrack[] {
  return tracks.map((track) => {
    if (track.language === language) {
      return { ...track, active: true };
    }

    if (track.active === true) {
      return { ...track, active: false };
    }

    return { ...track };
  });
}

const subtitles: Reducer = (state: ISubtitlesState = initialState, action) => {
  switch (action.type) {
    case ADD_SUBTITLES_TRACK: {
      const subtitlesTracks = [].concat(
        state.subtitlesTracks as any,
        action.subtitlesTrack
      );

      return {
        ...state,
        subtitlesTracks
      };
    }
    case UPDATE_SUBTITLES_TRACKS_LIST:
      return {
        ...state,
        subtitlesTracks: action.subtitlesTracks
      };
    case UPDATE_ACTIVE_SUBTITLES_TRACK: {
      return {
        ...state,
        subtitlesTracks: toggleSubtitlesTracks(
          state.subtitlesTracks,
          action.subtitlesTrackLanguage
        )
      };
    }
    case SET_SUBTITLE_TEXT:
      return {
        ...state,
        subtitlesText: action.subtitlesText
      };
    case LOAD_CONFIGURATION:
      return {
        ...state,
        ...action.subtitles
      };
    default:
      return state;
  }
};

export default subtitles;
