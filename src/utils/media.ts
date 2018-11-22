import { ITrack } from 'src/components/video/MediaSubtitlesTrack';
import {
  TRACK_KIND_CAPTIONS,
  TRACK_KIND_CHAPTERS,
  TRACK_KIND_SUBTITLES,
  TRACK_MODE_ACTIVE
} from 'src/constants';

export interface IRawSubtitlesTrack {
  active: boolean;
  readonly activeCues: TextTrackCueList;
  readonly cues: TextTrackCueList;
  readonly kind: string;
  readonly label: string;
  readonly language: string;
  mode: TextTrackMode | number;
}

export interface IRawChaptersTrack {
  readonly cues: IMediaCue[];
  readonly label: string;
  readonly language: string;
}

export type IRawMetadataTrack = IRawSubtitlesTrack;

export type IRawSlidesTrack = IRawChaptersTrack;

export interface IMediaCue {
  endTime: number;
  startTime: number;
  text: string;
}

export interface IBufferedRange {
  end: number;
  start: number;
}

export type BufferedRanges = IBufferedRange[];

export function rawSubtitlesTrack(textTrack: TextTrack): IRawSubtitlesTrack {
  const { activeCues, cues, kind, label, language, mode } = textTrack;

  return {
    active: mode === TRACK_MODE_ACTIVE,
    activeCues,
    cues,
    kind,
    label,
    language,
    mode
  };
}

export const rawTextTrack = rawSubtitlesTrack;

/**
 * Strips unwanted properties from a TextTrack.
 * @param track {TextTrack}
 */
export function rawChaptersTrack(track: TextTrack): IRawChaptersTrack {
  const { cues: trackCues, label, language } = track;

  const cues: IMediaCue[] = [...trackCues[Symbol.iterator]()].map(
    (cue: TextTrackCue) => ({
      endTime: cue.endTime,
      startTime: cue.startTime,
      text: cue.text
    })
  );

  return {
    cues,
    label,
    language
  };
}

export function rawSlidesTrack(track: TextTrack): IRawSlidesTrack {
  const rawTrack: IRawSlidesTrack = rawChaptersTrack(track);
  return rawTrack;
}

/**
 * Tests if a track should be displayed as a subtitles.
 *
 * @param track
 */
export function isDisplayableTrack(
  track: TextTrack | IRawSubtitlesTrack | ITrack
): boolean {
  return (
    track.kind === undefined ||
    track.kind === TRACK_KIND_SUBTITLES ||
    track.kind === TRACK_KIND_CAPTIONS
  );
}

/**
 * Tests if a track should be used as a collection of chapters.
 * @param track
 */
export function isChapterTrack(track: TextTrack | ITrack) {
  return track.kind === TRACK_KIND_CHAPTERS;
}

/**
 * Tests if a subtitles track is active
 * @param track {IRawSubtitlesTrack}
 */
export function isActiveTrack(track: IRawSubtitlesTrack): boolean {
  return track.active === true;
}

export function isDefaultTrack(track: ITrack): boolean {
  return track.isDefault === true;
}

export function convertTimeRanges(timeRanges: TimeRanges): BufferedRanges {
  const { length } = timeRanges;
  const ranges = [];

  for (let i = 0; i < length; i++) {
    ranges.push({
      end: timeRanges.end(i),
      start: timeRanges.start(i)
    });
  }

  return ranges;
}