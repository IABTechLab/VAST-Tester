# IAB Tech Lab VAST Tester

[![CircleCI](https://circleci.com/gh/InteractiveAdvertisingBureau/VAST-Tester.svg?style=shield)](https://circleci.com/gh/InteractiveAdvertisingBureau/VAST-Tester) [![JavaScript Standard Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://standardjs.com/)

Tests IAB VAST ads. Contributed by the [DoubleVerify](https://www.doubleverify.com/) team.

## Getting Started

Install dependencies:

```bash
yarn
```

Get developing:

```bash
yarn start
```

Create a production build:

```bash
yarn run build
```

## Architecture

This is a [React](https://reactjs.org/) app bootstrapped with
[Create React App](https://github.com/facebookincubator/create-react-app).
All state is maintained using [Redux](https://redux.js.org/). Side effects of
state mutation are modeled using
[redux-observable](https://redux-observable.js.org/).

The app can be broken down into two sub-apps, which each live in a subdirectory
of [`src/`](src/). The largest of the two is called [_main_](src/main/) and
contains just about the whole tester. The second sub-app,
[_verification_](src/verification/), houses a host for OMID scripts, which gets
loaded into an iframe for every verification script.

The apps talk to one another using the [`rpc` subpackage](src/common/rpc/) that
is also part of this repository. This is a friendly interface to the browser's
[`postMessage()` API](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).

The top-level app has a [single entry point](src/index.js) that routes between
the two sub-apps based on the URL. This started out as a limitation of Create
React App, which only allows us to produce a single bundle, but we actually
prefer it now.

The _verification_ sub-app is a single React component that implements the
OMID interface. It does not use Redux at all.

In the _main_ app, there are subdirectories for the standard React-Redux model:

-   [`components/`](src/main/components/): React components (without Redux);
-   [`containers/`](src/main/containers/): React components connected to Redux's
    store;
-   [`actions/`](src/main/actions/): Redux action definitions;
-   [`reducers/`](src/main/reducers/): Redux reducers;
-   [`epics/`](src/main/epics/): epics for redux-observable;
-   [`middleware/`](src/main/middleware/): Redux middleware.

In addition to those, there are also:

-   [`util/`](src/main/util/): various utility modules;
-   [`style/`](src/main/style): [Sass](https://sass-lang.com/) style sheets for
    the app.

More detailed documentation will be added at a later stage. For now, we suggest
exploring the source code.

## Debugging

During development, you can use:

-   [React DevTools](https://github.com/facebook/react-devtools)
    for React's DOM;
-   [Redux DevTools](https://github.com/zalmoxisus/redux-devtools-extension)
    for Redux actions and redux-observable effects;
-   [Logger for Redux](https://github.com/evgenyrodionov/redux-logger)
    by setting `localStorage.reduxLogger` to `true`;
-   [debug](https://www.npmjs.com/package/debug)
    by setting `localStorage.debug` to `'rpc:*'`.

## To Do

-   OM SDK in-app support
-   Resize support
-   Canned test scenarios
-   Reporting and recommendations
-   VAST validation

## Contributing

We welcome pull requests for bug fixes and new features.

## License

Copyright 2018 IAB Technology Laboratory, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
<http://www.apache.org/licenses/LICENSE-2.0>.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
