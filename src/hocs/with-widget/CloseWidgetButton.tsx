import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { setWidgetVisibility } from '../../actions/preferences';
import StyledButton from '../../components/shared/styled-button';
import StyledSvg from '../../components/shared/styled-svg';
import SvgCross from '../../components/svg/Cross';
import { CDispatch } from '../../store';
import styled from '../../utils/styled-components';

interface IOwnProps {
  activable: boolean;
  widgetName: string;
}

interface IDispatchProps {
  clickHandler(): void;
}

interface IProps extends IOwnProps, IDispatchProps {}

const StyledCloseWidgetButton = styled(StyledButton)`
  display: block;

  width: 1.5em;
  height: 1.5em;

  position: absolute;
  right: 1em;

  z-index: 1;

  border-radius: 50%;
  background-color: #d3352c;

  svg {
    fill: ${(props) => props.theme.fg};
  }
`;

function CloseWidgetButton(props: IProps) {
  const [t] = useTranslation();

  const classes = classNames('aip-widget-close', {
    activable: props.activable
  });

  return (
    <StyledCloseWidgetButton
      aria-label={t('widget.close', {
        widgetName: props.widgetName
      })}
      className={classes}
      onClick={props.clickHandler}
      type="button"
    >
      <StyledSvg as={SvgCross} />
    </StyledCloseWidgetButton>
  );
}

function mapDispatch(dispatch: CDispatch, ownProps: IOwnProps) {
  return {
    clickHandler() {
      dispatch(setWidgetVisibility(ownProps.widgetName, false));
    }
  };
}

export default connect(
  null,
  mapDispatch
)(CloseWidgetButton);