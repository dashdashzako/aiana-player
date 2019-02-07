import styled from '../../utils/styled-components';

const StyledAiana = styled.div`
  display: block;
  width: 800px;
  height: 450px;
  box-sizing: border-box;
  background-color: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.fg};
  font-size: 1em;
  font-family: system, sans-serif;

  &.inactive {
    &,
    & * {
      cursor: none;
    }
  }

  -webkit-font-smoothing: antialiased;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  [data-focus-visible-added] {
    box-shadow: inset 0 0 2px 2px ${(props) => props.theme.focus};
    outline: none;
  }

  *:focus:not([data-focus-visible-added]) {
    outline: none;
  }

  /* TODO: remove debug styles */
  input[type='checkbox'],
  select {
    &[data-focus-visible-added] {
      box-shadow: 0 0 0 2px ${(props) => props.theme.focus};
      outline: none;
    }
  }
`;

export default StyledAiana;
