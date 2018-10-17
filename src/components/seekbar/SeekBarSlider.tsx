import * as classNames from 'classnames';
import * as React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { requestSeek } from '../../actions/player';
import {
  DEFAULT_SEEK_STEP_MULTIPLIER,
  END_KEY_CODE,
  HOME_KEY_CODE,
  LEFT_ARROW_KEY_CODE,
  RIGHT_ARROW_KEY_CODE
} from '../../constants';
import { IAianaState } from '../../reducers/index';
import { unitToPercent } from '../../utils/math';
import { durationTranslationKey, secondsToHMSObject } from '../../utils/time';
import { bounded } from '../../utils/ui';
import StyledDiv from './Styles';

const { round } = Math;

interface IProps {
  currentTime: number;
  duration: number;
  isSeeking: boolean;
  seekStep: number;
  seekingTime: number;
  mediaElement: HTMLMediaElement | null;
}

interface IDispatchProps {
  requestSeek(media: HTMLMediaElement, time: number): AnyAction;
}

interface ISeekBarSlider
  extends IProps,
    IDispatchProps,
    InjectedTranslateProps {}

class SeekBarSlider extends React.Component<ISeekBarSlider> {
  public sliderRef = React.createRef<HTMLDivElement>();
  public sliderPosition: number = 0;
  public sliderWidth: number = 0;

  public render() {
    const {
      currentTime,
      duration,
      isSeeking,
      seekingTime,
      t,
      mediaElement
    } = this.props;

    if (!mediaElement) {
      return null;
    }

    // If the slider is being used, its registered position should override
    // the `currentTime`. However, once media has seeked (which does not mean
    // enough data was loaded yet) and if the slider is not being used, its
    // position should be the `currentTime`.
    const sliderTime = isSeeking ? seekingTime : currentTime;

    const progressPct = unitToPercent(sliderTime, duration);
    const roundedDuration = round(duration);
    const roundedCurrentTime = round(sliderTime);

    const wrapperClassNames = classNames({
      'aip-progress': true,
      'no-transition': isSeeking
    });

    return (
      <StyledDiv className={wrapperClassNames}>
        <div
          ref={this.sliderRef}
          className="aip-progress-slider"
          role="slider"
          aria-label={t('controls.seekbar.label')}
          aria-valuemin={0}
          aria-valuemax={roundedDuration}
          aria-valuenow={roundedCurrentTime}
          aria-valuetext={this.getAriaValueText(
            roundedCurrentTime,
            roundedDuration
          )}
          tabIndex={0}
          onKeyDown={this.keyDownHandler}
          onMouseDownCapture={this.mouseDownHandler}
        >
          <div className="aip-seekbar">
            <div className="aip-seekbar-expander" />
          </div>

          <div
            className={`aip-play-progress ${isSeeking ? 'no-transition' : ''}`}
            style={{
              transform: `scaleX(${progressPct / 100})`
            }}
          />

          <div
            className="aip-progress-slider-handle"
            style={{
              left: `calc(${progressPct}% - 0.5em)`
            }}
          />
        </div>
      </StyledDiv>
    );
  }

  public getAriaValueText = (currentTime: number, duration: number): string => {
    const { t } = this.props;

    return t('controls.seekbar.valuetext', {
      currentTime: t(
        durationTranslationKey(currentTime),
        secondsToHMSObject(currentTime)
      ),
      duration: t(
        durationTranslationKey(duration),
        secondsToHMSObject(duration)
      )
    });
  };

  /**
   * Unloads events bound to `document` to prevent memory leaks.
   */
  public componentWillUnmount() {
    document.removeEventListener('mousemove', this.mouseMoveHandler, true);
    document.removeEventListener('mouseup', this.mouseUpHandler, true);
  }

  private mouseDownHandler = (evt: React.MouseEvent<HTMLDivElement>) => {
    evt.preventDefault();

    // Force focus when element in being interacted with a pointer device.
    // This triggers `:focus` state and prevents from hiding it from the user.
    this.sliderRef.current!.focus();

    // recalculate slider element position to ensure no external
    // event (such as fullscreen or window redimension) changed it.
    const { left, width } = this.sliderRef.current!.getBoundingClientRect();

    this.sliderPosition = left;
    this.sliderWidth = width;

    // trigger first recomputation to simulate simple click.
    this.updateCurrentTime(evt.pageX, this.sliderPosition, this.sliderWidth);

    document.addEventListener('mousemove', this.mouseMoveHandler, true);
    document.addEventListener('mouseup', this.mouseUpHandler, true);
  };

  private mouseUpHandler = (evt: MouseEvent) => {
    this.sliderRef.current!.blur();
    this.updateCurrentTime(evt.pageX, this.sliderPosition, this.sliderWidth);

    document.removeEventListener('mousemove', this.mouseMoveHandler, true);
    document.removeEventListener('mouseup', this.mouseUpHandler, true);
  };

  private mouseMoveHandler = (evt: MouseEvent) => {
    this.updateCurrentTime(evt.pageX, this.sliderPosition, this.sliderWidth);
  };

  private updateCurrentTime = (
    mouseX: number,
    sliderX: number,
    sliderWidth: number
  ) => {
    const {
      currentTime,
      duration,
      mediaElement,
      requestSeek: requestSeekAction
    } = this.props;

    if (!mediaElement) {
      return;
    }

    const positionDifference = bounded(mouseX, sliderX, sliderWidth);
    const newCurrentTime = round(
      (duration * unitToPercent(positionDifference, sliderWidth)) / 100
    );

    if (newCurrentTime !== currentTime) {
      requestSeekAction(mediaElement, newCurrentTime);
    }
  };

  private keyDownHandler = (evt: React.KeyboardEvent<HTMLDivElement>) => {
    const {
      currentTime,
      duration,
      isSeeking,
      mediaElement,
      requestSeek: requestSeekAction,
      seekStep,
      seekingTime
    } = this.props;

    if (!mediaElement) {
      return;
    }

    // User should be able to trigger this event multiple times before
    // the media `seeked` event is fired.
    // To do so, `seekingTime` should be used when the media is still seeking,
    // or the media `currentTime` when it is not seeking.
    let nextTime: number;

    const sliderTime = isSeeking ? seekingTime : currentTime;
    const weightedSeekStep = this.weightedSeekStep(seekStep, evt.shiftKey);

    switch (evt.keyCode) {
      case RIGHT_ARROW_KEY_CODE:
        nextTime = this.safeTime(sliderTime + weightedSeekStep);
        requestSeekAction(mediaElement, nextTime);
        break;
      case LEFT_ARROW_KEY_CODE:
        nextTime = this.safeTime(sliderTime - weightedSeekStep);
        requestSeekAction(mediaElement, nextTime);
        break;
      case HOME_KEY_CODE:
        requestSeekAction(mediaElement, 0);
        break;
      case END_KEY_CODE:
        requestSeekAction(mediaElement, duration);
        break;
    }
  };

  private weightedSeekStep(seekStep: number, multiply: boolean): number {
    if (multiply) {
      return DEFAULT_SEEK_STEP_MULTIPLIER * seekStep;
    }

    return seekStep;
  }

  private safeTime(seekTime: number): number {
    return bounded(seekTime, 0, this.props.duration);
  }
}

const mapStateToProps = (state: IAianaState) => ({
  currentTime: state.player.currentTime,
  duration: state.player.duration,
  isSeeking: state.player.isSeeking,
  mediaElement: state.player.mediaElement,
  seekStep: state.preferences.seekStep,
  seekingTime: state.player.seekingTime
});

const mapDispatchToProps = {
  requestSeek
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(SeekBarSlider));
