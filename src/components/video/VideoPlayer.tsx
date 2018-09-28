import * as React from 'react';
import { connect } from 'react-redux';
import {
  changeVolume,
  pauseVideo,
  playVideo,
  startSeeking,
  stopSeeking,
  toggleMute,
  updateCurrentTime,
  updateVideoDuration,
  videoElementMounted,
  videoElementUnounted
} from '../../actions/player';
import { IAianaState } from '../../reducers/index';
import { IConnectedReduxProps } from '../../store/index';
import styled from '../../utils/styled-components';
import VideoTrack, { ITrack } from './VideoTrack';

export interface ISource {
  type?: string;
  src: string;
}

const StyledVideo = styled.video`
  width: 100%;
  max-height: 100%;
  max-width: 100%;
`;

export interface IVideoProps extends IConnectedReduxProps {
  autoPlay: boolean;
  currentTime: number;
  isMuted: boolean;
  isSeeking: boolean;
  nativeControls: boolean;
  preload: string;
  sources: ISource[];
  tracks?: ITrack[];
  volume: number;
}

class VideoPlayer extends React.PureComponent<IVideoProps> {
  private get video() {
    return this.videoRef.current!;
  }

  private videoRef = React.createRef<HTMLVideoElement>();

  public componentDidMount() {
    const { dispatch, volume, isMuted } = this.props;
    const { video } = this;

    video.volume = volume;
    video.muted = isMuted;

    dispatch(videoElementMounted(video));
  }

  public componentWillUnmount() {
    this.props.dispatch(videoElementUnounted());
  }

  public render() {
    const { autoPlay, nativeControls, preload, sources, tracks } = this.props;

    return (
      <StyledVideo
        innerRef={this.videoRef}
        className="aip-video"
        autoPlay={autoPlay}
        controls={nativeControls}
        tabIndex={nativeControls ? 0 : -1}
        preload={preload}
        onClick={this.onClickHandler}
        onLoadedMetadata={this.loadedMetadataHandler}
        onPause={this.pauseHandler}
        onPlay={this.playHandler}
        onTimeUpdate={this.timeUpdateHandler}
        onVolumeChange={this.volumeChangeHandler}
        onSeeked={this.seekedHandler}
        onSeeking={this.seekingHandler}
      >
        {sources &&
          sources.map((source: ISource, index) => (
            <source key={index} {...source} />
          ))}

        {tracks &&
          tracks.map((track: ITrack, index) => (
            <VideoTrack key={index} {...track} />
          ))}
      </StyledVideo>
    );
  }

  private onClickHandler = () => {
    const { video } = this;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  private seekedHandler = () => {
    const { dispatch, isSeeking } = this.props;
    if (isSeeking) {
      dispatch(stopSeeking());
    }
  };

  private seekingHandler = () => {
    const { dispatch, isSeeking } = this.props;
    if (!isSeeking) {
      dispatch(startSeeking());
    }
  };

  private timeUpdateHandler = () => {
    this.props.dispatch(updateCurrentTime(this.video.currentTime));
  };

  private loadedMetadataHandler = () => {
    this.props.dispatch(updateVideoDuration(this.video.duration));
  };

  /**
   * `volumechange` covers both volume level and mute toggle. A couple of checks
   * need to be performed to catch changes and dispatch them to update the
   * application state.
   */
  private volumeChangeHandler = () => {
    const { video } = this;
    const { dispatch, isMuted, volume } = this.props;

    // only dispatch `toggleMute` when state is behind video object property
    if ((!isMuted && video.muted) || (isMuted && !video.muted)) {
      dispatch(toggleMute(video.muted));
    }

    if (video.volume !== volume) {
      dispatch(changeVolume(video.volume));
    }
  };

  private playHandler = () => {
    this.props.dispatch(playVideo());
  };

  private pauseHandler = () => {
    this.props.dispatch(pauseVideo());
  };
}

export default connect((state: IAianaState) => ({
  autoPlay: state.player.autoPlay,
  currentTime: state.player.currentTime,
  isMuted: state.player.isMuted,
  isSeeking: state.player.isSeeking,
  nativeControls: state.player.nativeControls,
  preload: state.player.preload,
  sources: state.player.sources,
  tracks: state.player.tracks,
  volume: state.player.volume
}))(VideoPlayer);
