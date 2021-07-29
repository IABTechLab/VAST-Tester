Please review the IAB Tech Lab Open Source Initiative Governance guidelines [here](http://iabtechlab.com/opensource) for contributing to this project.

# IAB Tech Lab VAST Tester

[![CircleCI](https://circleci.com/gh/InteractiveAdvertisingBureau/VAST-Tester.svg?style=shield)](https://circleci.com/gh/InteractiveAdvertisingBureau/VAST-Tester) [![JavaScript Standard Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://standardjs.com/)

Tests IAB VAST ads. Contributed by the [DoubleVerify](https://www.doubleverify.com/) team.

This tool is also hosted by IAB Tech Lab at [vasttester.iabtechlab.com](https://vasttester.iabtechlab.com/).

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

There are subdirectories for the standard React-Redux model:

-   [`components/`](src/components/): React components (without Redux);
-   [`containers/`](src/containers/): React components connected to Redux's
    store;
-   [`actions/`](src/actions/): Redux action definitions;
-   [`reducers/`](src/reducers/): Redux reducers;
-   [`epics/`](src/epics/): epics for redux-observable;
-   [`middleware/`](src/middleware/): Redux middleware.

In addition to those, there are also:

-   [`util/`](src/util/): various utility modules;
-   [`style/`](src/style): [Sass](https://sass-lang.com/) style sheets for
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

## To Do

-   OM SDK in-app support
-   Resize support
-   Canned test scenarios
-   Reporting and recommendations
-   VAST validation

## Contributing

We welcome pull requests for bug fixes and new features.

## License

Copyright 2021 IAB Technology Laboratory, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
<http://www.apache.org/licenses/LICENSE-2.0>.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
