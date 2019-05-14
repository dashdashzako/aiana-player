import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { changeCurrentTheme } from '../../actions/preferences';
import withUniqueId, { IInjectedUniqueIdProps } from '../../hocs/withUniqueId';
import { IAianaState } from '../../reducers';
import { CDispatch } from '../../store';

interface IStateProps {
  currentTheme: string;
  themes: string[];
}

interface IDispatchProps {
  selectChangeHandler(evt: React.ChangeEvent<HTMLSelectElement>): void;
}

interface IThemeSelector
  extends IInjectedUniqueIdProps,
    IStateProps,
    IDispatchProps {}

function ThemeSelector({
  currentTheme,
  selectChangeHandler,
  themes,
  uid
}: IThemeSelector) {
  const [t] = useTranslation();

  return (
    <React.Fragment>
      <span id={uid}>{t('preferences.theme_selector.label')}</span>
      <select
        aria-labelledby={uid}
        onChange={selectChangeHandler}
        value={currentTheme}
      >
        {themes.map((themeName) => (
          <option key={themeName}>{themeName}</option>
        ))}
      </select>
    </React.Fragment>
  );
}

function mapState(state: IAianaState) {
  return {
    currentTheme: state.preferences.currentTheme,
    themes: state.preferences.themes
  };
}

function mapDispatch(dispatch: CDispatch) {
  return {
    selectChangeHandler: (evt: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(changeCurrentTheme(evt.currentTarget.value));
    }
  };
}

export default connect(
  mapState,
  mapDispatch
)(withUniqueId(ThemeSelector));
