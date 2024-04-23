import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
    APP_INIT_ERROR, APP_READY,
    initialize,
    subscribe,
} from '@edx/frontend-platform';
import { ErrorPage } from '@edx/frontend-platform/react';
import ReactDOM from 'react-dom';

import { messages as footerMessages } from '@edx/frontend-component-footer';
import { messages as headerMessages } from '@edx/frontend-component-header';

import appMessages from './i18n';

import App from './App';
import './index.scss';

subscribe(APP_READY, () => {
  ReactDOM.render(
        <App />,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  messages: [
    appMessages,
    headerMessages,
    footerMessages,
  ],
});
