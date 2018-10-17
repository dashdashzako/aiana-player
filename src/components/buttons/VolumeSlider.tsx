import * as React from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { requestChangeVolume } from '../../actions/player';
import {
  END_KEY_CODE,
  HOME_KEY_CODE,
  LEFT_ARROW_KEY_CODE,
  RIGHT_ARROW_KEY_CODE,
  VOLUME_MAXIMUM,
  VOLUME_MINIMUM
} from '../../constants';
import { IAianaState } from '../../reducers/index';
import { hexToHsla } from '../../utils/colors';
import { unitToPercent } from '../../utils/math';
import styled from '../../utils/styled-components';
import { ITransnected } from '../../utils/types';
import { bounded } from '../../utils/ui';

const StyledDiv = styled.div`
  display: inline-block;
  width: 0em;
  height: 100%;
  cursor: pointer;
  transition: width 0.2s ease-in;

  &[data-focus-visible-added] {
    box-shadow: inset 0 0 0 2px ${(props) => props.theme.focus};
    outline: none;
  }

  &.focus-visible,
  &:focus,
  &:hover {
    width: 4em;
    transition: width 0.2s cubic-bezier(0, 0, 0.2, 1);
  }

  .aip-volume-slider {
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
    touch-action: none;
  }

  .aip-volume-slider-handle {
    position: absolute;
    top: calc(50% - 0.5em);
    height: 1em;
    width: 1em;
    background-color: ${(props) => props.theme.fg};
    border-radius: 0.5em;

    &:before,
    &:after {
      content: ' ';
      position: absolute;
      display: block;
      top: calc(50% - 2px);
      height: 4px;
      width: 5em;
    }

    &:before {
      background-color: ${(props) => props.theme.fg};
      right: 0.5em;
    }

    &:after {
      background-color: ${(props) => hexToHsla(props.theme.fg, 0.3)};
      left: 0.5em;
    }
  }
`;

export interface IVolumeSliderProps extends ITransnected {
  mediaElement: HTMLMediaElement | null;
  volume: number;
}

class VolumeSlider extends React.Component<IVolumeSliderProps> {
  public elementRef = React.createRef<HTMLDivElement>();
  public sliderPosition = 0;
  public sliderWidth = 0;
  public sliderRef = React.createRef<HTMLDivElement>();

  public render() {
    const { t } = this.props;
    const volumePercents = 100 * this.props.volume;

    // element width is 4em, and we must ensure the handle will not go to far
    // on the edges. The button width being 1em, it should be able to move on
    // 75% of the element width;
    const position = 0.75 * volumePercents;

    return (
      <StyledDiv
        className="aip-volume"
        innerRef={this.elementRef}
        role="slider"
        tabIndex={0}
        aria-label={t('controls.volume.label')}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={volumePercents}
        aria-valuetext={t('controls.volume.valuetext', {
          volumePct: volumePercents
        })}
        onKeyDown={this.keyDownHandler}
      >
        <div
          ref={this.sliderRef}
          className="aip-volume-slider"
          onMouseDownCapture={this.mouseDownHandler}
        >
          <div
            className="aip-volume-slider-handle"
            style={{
              left: `${position}%`
            }}
          />
        </div>
      </StyledDiv>
    );
  }

  private keyDownHandler = (evt: React.KeyboardEvent<HTMLDivElement>) => {
    const { dispatch, mediaElement, volume } = this.props;

    if (!mediaElement) {
      return;
    }

    switch (evt.keyCode) {
      case RIGHT_ARROW_KEY_CODE:
        dispatch(
          requestChangeVolume(mediaElement, this.safeVolume(volume + 0.1))
        );
        break;
      case LEFT_ARROW_KEY_CODE:
        dispatch(
          requestChangeVolume(mediaElement, this.safeVolume(volume - 0.1))
        );
        break;
      case HOME_KEY_CODE:
        dispatch(requestChangeVolume(mediaElement, 0));
        break;
      case END_KEY_CODE:
        dispatch(requestChangeVolume(mediaElement, 1));
        break;
    }
  };

  private mouseDownHandler = (evt: React.MouseEvent<HTMLDivElement>) => {
    evt.preventDefault();

    // Force focus when element in being interacted with a pointer device.
    // This triggers `:focus` state and prevents from hiding it from the user.
    this.elementRef.current!.focus();

    // recalculate slider element position to ensure no external
    // event (such as fullscreen or window redimension) changed it.
    const { left, width } = this.sliderRef.current!.getBoundingClientRect();

    this.sliderPosition = left;
    this.sliderWidth = width;

    // trigger first recomputation to simulate simple click.
    this.updateVolume(evt.pageX, this.sliderPosition, this.sliderWidth);

    document.addEventListener('mousemove', this.mouseMoveHandler, true);
    document.addEventListener('mouseup', this.mouseUpHandler, true);
  };

  private mouseUpHandler = () => {
    this.elementRef.current!.blur();
    document.removeEventListener('mousemove', this.mouseMoveHandler, true);
    document.removeEventListener('mouseup', this.mouseUpHandler, true);
  };

  private mouseMoveHandler = (evt: MouseEvent) => {
    this.updateVolume(evt.pageX, this.sliderPosition, this.sliderWidth);
  };

  private updateVolume = (
    mouseX: number,
    sliderX: number,
    sliderWidth: number
  ) => {
    const { dispatch, mediaElement, volume } = this.props;

    if (!mediaElement) {
      return;
    }

    const positionDifference = bounded(mouseX, sliderX, sliderWidth);
    const newVolume = unitToPercent(positionDifference, sliderWidth) / 100;

    if (newVolume !== volume) {
      dispatch(requestChangeVolume(mediaElement, newVolume));
    }
  };

  /**
   * Ensures volume always has a valid value (between 0 and 1).
   *
   * @param inputVolume The unsafe wanted value for the volume
   */
  private safeVolume(inputVolume: number): number {
    return bounded(inputVolume, VOLUME_MINIMUM, VOLUME_MAXIMUM);
  }
}

export default connect((state: IAianaState) => ({
  mediaElement: state.player.mediaElement,
  volume: state.player.volume
}))(translate()(VolumeSlider));
