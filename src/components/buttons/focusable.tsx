import * as React from 'react';

export interface FocusableProps {
  isFocused: boolean;
  onFocus(): void;
  onBlur(): void;
}

export function injectFocusable(WrappedComponent: React.ComponentType) {
  return class extends React.Component {
    public isFocused = false;

    constructor(props: any) {
      super(props);
    }

    public onFocus = () => {
      this.setState({ isFocused: true });
    };

    public onBlur = () => {
      this.setState({ isFocused: false });
    };

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
