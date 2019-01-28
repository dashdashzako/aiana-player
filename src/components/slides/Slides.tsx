import * as React from 'react';
import { connect } from 'react-redux';
import { IAianaState } from '../../reducers';
import { ExtendedHTMLElement } from '../../types';
import { markdownToJSX } from '../../utils/strings';
import withWindow, { IWindow } from '../hocs/withWindow';
import SlidesStyles from './Styles';

interface IProps {
  text?: string;
}

interface IStateProps {
  boundariesElement?: ExtendedHTMLElement;
}

interface ISlidesProps extends IProps, IStateProps, IWindow {}

function Slides({ text }: ISlidesProps) {
  if (!text) {
    return null;
  }

  return (
    <SlidesStyles className="aip-slides">
      <div className="aip-slides-content">{markdownToJSX(text)}</div>
    </SlidesStyles>
  );
}

function mapStateToProps(state: IAianaState) {
  return {
    boundariesElement: state.player.playerElement,
    text: state.slides.currentSlideText
  };
}

export default connect(mapStateToProps)(withWindow(Slides));
