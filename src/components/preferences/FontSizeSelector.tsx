import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { updateFontSizeMultiplier } from '../../actions/preferences';
import { IAianaState } from '../../reducers';
import { CDispatch } from '../../store';
import useId from '../../hooks/useId';

interface IStateProps {
  activeMultiplier?: number;
  availableMultipliers?: number[];
}

interface IDispatchProps {
  changeHandler(evt: React.ChangeEvent<HTMLSelectElement>): void;
}

interface IProps extends IStateProps, IDispatchProps {}

function FontSizeSelector(props: IProps) {
  const [t] = useTranslation();
  const [id] = useId();

  return (
    <Fragment>
      <span id={id}>{t('preferences.font_size_multiplier.label')}</span>
      <select
        aria-labelledby={id}
        onBlur={props.changeHandler}
        onChange={props.changeHandler}
        value={props.activeMultiplier}
      >
        {props.availableMultipliers &&
          props.availableMultipliers.map((multiplier) => (
            <option key={multiplier} value={multiplier}>
              ×{multiplier}
            </option>
          ))}
      </select>
    </Fragment>
  );
}

function mapState(state: IAianaState) {
  return {
    activeMultiplier: state.preferences.fontSizeMultiplier,
    availableMultipliers: state.preferences.fontSizeMultipliers
  };
}

function mapDispatch(dispatch: CDispatch) {
  return {
    changeHandler: (evt: React.ChangeEvent<HTMLSelectElement>) => {
      const multiplier = Number.parseFloat(evt.currentTarget.value);
      dispatch(updateFontSizeMultiplier(multiplier));
    }
  };
}

export default connect(
  mapState,
  mapDispatch
)(FontSizeSelector);
