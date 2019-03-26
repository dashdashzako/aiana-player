import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { hexToHsla } from '../../utils/colors';
import styled from '../../utils/styled-components';
import { uid } from '../../utils/ui';
import AssistiveText from '../a11y/AssistiveText';
import StyledSvg from '../shared/styled-svg';
import SvgSettings from '../svg/Settings';
import ChaptersMenuToggle from './ChaptersMenuToggle';
import ChaptersTrackSelector from './ChaptersTrackSelector';
import FontFaceSelector from './FontFaceSelector';
import LanguageSelector from './LanguageSelector';
import { PanelToggle } from './panel-toggle';
import PlaybackRateSelector from './PlaybackRateSelector';
import SlidesTrackSelector from './SlidesTrackSelector';
import SubtitlesTrackSelector from './SubtitlesTrackSelector';
import ThemeSelector from './ThemeSelector';
import WindowsVisibility from './windows/visibility/WindowsVisibility';
import WindowsLockToggle from './windows/WindowsLockToggle';

interface IState {
  isOpen: boolean;
}

const StyledPreferences = styled.div`
  display: inline-block;

  h2 {
    margin: 0;
    font-size: 1em;

    button {
      &,
      & svg {
        display: block;
      }
    }
  }

  .aip-preferences-panel {
    width: 50%;
    height: calc(100% - 0.5em - 2.25em - 0.3125em - 25%);
    max-width: 25em;
    max-height: 23em;

    padding: 1em;

    position: absolute;
    bottom: calc(0.5em + 2.25em + 0.3125em);
    right: 0;

    overflow: auto;
    background-color: ${(props) => hexToHsla(props.theme.bg, 0.93)};

    select {
      font-size: inherit;
    }
  }

  ul {
    margin: 0;
    padding: 0;

    list-style: none;

    li {
      padding: 0.5em 0;
      line-height: 1.5;

      display: flex;
      justify-content: space-between;
      align-items: center;

      & + li {
        border-top: 1px solid ${(props) => props.theme.bg};
      }

      > *:nth-child(2) {
        flex-shrink: 0;
      }
    }
  }
`;

const defaultState: IState = {
  isOpen: false
};

class PreferencesPanel extends Component<WithTranslation, IState> {
  readonly state = defaultState;

  render() {
    const t = this.props.t;
    const ariaLabelId = uid();

    return (
      <StyledPreferences
        aria-labelledby={ariaLabelId}
        className="aip-preferences"
      >
        <h2 id={ariaLabelId}>
          <PanelToggle
            isExpanded={this.state.isOpen}
            clickHandler={this.togglePanel}
          >
            <AssistiveText>{t('preferences.title')}</AssistiveText>
            <StyledSvg as={SvgSettings} aria-hidden="true" />
          </PanelToggle>
        </h2>

        <div className="aip-preferences-panel" hidden={!this.state.isOpen}>
          <ul>
            <li>
              <FontFaceSelector />
            </li>
            <li className="aip-language">
              <LanguageSelector />
            </li>
            <li className="aip-playback-rate">
              <PlaybackRateSelector />
            </li>
            <li className="aip-theme">
              <ThemeSelector />
            </li>
            <li className="aip-subtitles-track">
              <SubtitlesTrackSelector />
            </li>
            <li className="aip-chapters-track">
              <ChaptersTrackSelector />
            </li>
            <li className="aip-slides-track">
              <SlidesTrackSelector />
            </li>
            <li className="aip-chapters-menu">
              <ChaptersMenuToggle />
            </li>
            <li className="aip-windows-lock">
              <WindowsLockToggle />
            </li>
            <li className="aip-windows-visibility">
              <WindowsVisibility />
            </li>
          </ul>
        </div>
      </StyledPreferences>
    );
  }

  togglePanel = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };
}

export default withTranslation()(PreferencesPanel);
