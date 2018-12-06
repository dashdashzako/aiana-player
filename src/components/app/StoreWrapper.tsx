import * as React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import middleware from '../../middleware';
import reducers from '../../reducers';
import ConnectedAiana from './ConnectedAiana';

const store = createStore(reducers, {}, composeWithDevTools(middleware));

const StoreWrapper: React.SFC = () => (
  <Provider store={store}>
    <ConnectedAiana />
  </Provider>
);

export default StoreWrapper;
