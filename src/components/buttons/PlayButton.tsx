import * as React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { pauseVideo, playVideo } from '../../actions/player';
import { IAianaState } from '../../reducers/index';
import { IConnectedReduxProps } from '../../store/index';
import AssistiveText from '../a11y/AssistiveText';
import StyledButton from '../styled/StyledButton';
import StyledSvg from '../styled/StyledSvg';
import PauseIcon from '../svg/Pause';
import PlayIcon from '../svg/PlayArrow';
import { IFocusableProps, injectFocusable } from './focusable';

interface IProps {
  isPlaying: boolean;
  videoElement: HTMLVideoElement;
}

const StyledPlayIcon = StyledSvg.withComponent(PlayIcon);
const StyledPauseIcon = StyledSvg.withComponent(PauseIcon);

class PlayButton extends React.Component<
  IProps & InjectedTranslateProps & IFocusableProps & IConnectedReduxProps
> {
  public render() {
    const controlText = this.getControlText();
    const controlIcon = this.getControlIcon();

    return (
      <StyledButton
        type="button"
        aria-label={controlText}
        onClick={this.togglePlay}
      >
        {controlIcon}
        <AssistiveText>{controlText}</AssistiveText>
      </StyledButton>
    );
  }

  private togglePlay = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    const { dispatch, isPlaying, videoElement } = this.props;

    if (isPlaying && videoElement) {
      dispatch(pauseVideo(videoElement));
    } else if (!isPlaying && videoElement) {
      dispatch(playVideo(videoElement));
    }
  };

  private getControlText = (): string => {
    const { t, isPlaying } = this.props;

    if (isPlaying) {
      return t('controls.pause');
    }

    return t('controls.play');
  };

  private getControlIcon = (): JSX.Element => {
    const { isPlaying } = this.props;

    if (isPlaying) {
      return <StyledPauseIcon aria-hidden={true} />;
    }

    return <StyledPlayIcon aria-hidden={true} />;
  };
}

export default connect((state: IAianaState) => ({
  isPlaying: state.player.isPlaying,
  videoElement: state.player.videoElement
}))(translate()(injectFocusable(PlayButton)));
