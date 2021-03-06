import Rx from 'rx';
import React, { PropTypes } from 'react';
import invariant from 'invariant';
import debugFactory from 'debug';
import { getName, isObservable } from './utils';

const __DEV__ = process.env.NODE_ENV !== 'production';
const debug = debugFactory('thundercats:container');
const assign = Object.assign;

function getChildContext(childContextTypes, currentContext) {

  const compContext = assign({}, currentContext);
  // istanbul ignore else
  if (!childContextTypes || !childContextTypes.cat) {
    delete compContext.cat;
  }
  return compContext;
}

function storeOnError(err) {
  throw new Error(
    'ThunderCats Store encountered an error: ' + err
  );
}

function storeOnCompleted() {
  console.warn('Store has shutdown without error');
}

function verifyStore(displayName, storeName, store) {
  /* istanbul ignore else */
  if (__DEV__) {
    invariant(
      isObservable(store) &&
      typeof store.value === 'object',
      '%s should get at a store with a value but got %s for %s ' +
      'with value %s',
      displayName,
      store,
      storeName,
      store && store.value
    );
  }
}

export function createContainer(options = {}, Component) {
  /* istanbul ignore else */
  if (!Component) {
    return createContainer.bind(null, options);
  }

  const getPayload = typeof options.getPayload === 'function' ?
    options.getPayload :
    (() => {});

  /* istanbul ignore else */
  if (__DEV__) {
    invariant(
      typeof Component === 'function',
      'createContainer should get a constructor function but got %s',
      getName(Component) + 'Container'
    );
  }

  class Container extends React.Component {

    constructor(props, context) {
      super(props, context);

      /* istanbul ignore else */
      if (__DEV__) {
        invariant(
          typeof context.cat === 'object',
          '%s should find an instance of the Cat in the context but got %s',
          getName(this),
          context.cat
        );
      }

      const cat = context.cat;
      let val = {};

      // set up observable state. This can be a single store or a combination of
      // multiple stores
      if (options.store) {
        this.observableState = cat.getStore(options.store);
        verifyStore(getName(this), options.store, this.observableState);

        if (typeof options.map === 'function') {
          val = options.map(this.observableState.value);
          this.observableState = this.observableState.map(options.map);
        } else {
          val = this.observableState.value;
        }

      } else if (options.stores) {
        const storeNames = [].slice.call(options.stores);
        const combineLatest = options.combineLatest;

        /* istanbul ignore else */
        if (__DEV__) {
          invariant(
            typeof combineLatest === 'function',
            '%s should get a function for options.combineLatest with ' +
            ' options.stores but got %s',
            getName(this),
            combineLatest
          );
        }

        const stores = [];
        const values = [];
        storeNames.forEach(storeName => {
          let store = cat.getStore(storeName);
          verifyStore(getName(this), storeName, store);
          stores.push(store);
          values.push(store.value);
        });

        const args = stores.slice(0);
        args.push(combineLatest);
        this.observableState =
          Rx.Observable.combineLatest(...args);

        val = combineLatest(...values);
      }

      /* istanbul ignore else */
      if (__DEV__ && (options.store || options.stores)) {
        invariant(
          isObservable(this.observableState),
          '%s should get at a store but found none for %s',
          getName(this),
          options.store || options.stores
        );
      }

      this.state = assign({}, val);

      // set up actions on state. These will be passed down as props to child
      if (options.actions) {
        const actionsClassNames = Array.isArray(options.actions) ?
          options.actions :
          [options.actions];

        actionsClassNames.forEach(name => {
          this.state[name] = cat.getActions(name);
        });
      }
    }

    static contextTypes = assign(
      {},
      Component.contextTypes || {},
      { cat: PropTypes.object.isRequired }
    );
    static displayName = Component.displayName + 'Container'
    static propTypes = Component.propTypes || {}

    componentWillMount() {
      const cat = this.context.cat;

      if (options.fetchAction) {
        /* istanbul ignore else */
        if (__DEV__) {
          invariant(
            options.fetchAction.split('.').length === 2,
            '%s fetch action should be in the form of ' +
            '`actionsClass.actionMethod` but was given %s',
            getName(this),
            options.fetchAction
          );
        }

        const [fetchActionsName, fetchMethodName] =
          options.fetchAction.split('.');

        const fetchActionsInst = cat.getActions(fetchActionsName);
        let fetchStore;

        /* istanbul ignore else */
        if (options.store) {
          fetchStore = cat.getStore(options.store);
        }

        /* istanbul ignore else */
        if (__DEV__) {
          invariant(
            fetchActionsInst && fetchActionsInst[fetchMethodName],
            '%s expected to find actions class for %s, but found %s',
            getName(this),
            options.fetchAction,
            fetchActionsInst
          );
        }

        debug(
          'cat returned %s for %s for %s',
          getName(fetchActionsInst),
          fetchActionsName,
          getName(this)
        );

        const action = fetchActionsInst[fetchMethodName];

        if (cat.fetchMap) {
          debug('%s getPayload in componentWillMount', getName(this));
          const payload = getPayload(
            assign({}, this.state, this.props),
            getChildContext(Component.contextTypes, this.context)
          );

          cat.fetchMap.set(
            options.fetchAction,
            {
              name: options.fetchAction,
              store: fetchStore,
              payload,
              action
            }
          );
        } else {
          options.action = action;
        }
      }
      if (
        typeof options.subscribeOnWillMount === 'function' &&
        options.subscribeOnWillMount()
      ) {
        debug('%s subscribing on will mount', getName(this));
        this.subscribeToObservableState();
      }
    }

    componentDidMount() {
      this.subscribeToObservableState();
      if (
        typeof options.isPrimed === 'function' &&
        options.isPrimed(assign({}, this.state, this.props))
      ) {
        debug(
          '%s store is primed, will not fetch on componentDidMount',
          getName(this)
        );
        return null;
      }
      /* istanbul ignore else */
      if (options.action) {
        debug('%s fetching on componentDidMount', getName(this));
        options.action(
          getPayload(
            assign({}, this.state, this.props),
            getChildContext(Component.contextTypes, this.context)
          )
        );
      }
    }

    componentWillReceiveProps(nextProps, nextContext) {
      /* istanbul ignore else */
      if (
        options.action &&
        options.shouldContainerFetch &&
        options.shouldContainerFetch(
          assign({}, this.state, this.props),
          assign({}, this.state, nextProps),
          this.context,
          nextContext
        )
      ) {
        debug('%s fetching on componentWillReceiveProps', getName(this));
        options.action(
          getPayload(
          assign({}, this.state, nextProps),
          getChildContext(Component.contextTypes, nextContext)
        ));
      }
    }

    componentWillUnmount() {
      /* istanbul ignore else */
      if (this.stateSubscription) {
        debug('%s disposing store subscription', getName(this));
        this.stateSubscription.dispose();
        this.stateSubscription = null;
      }
    }

    subscribeToObservableState() {
      /* istanbul ignore else */
      if (
        this.observableState &&
        !this.stateSubscription
      ) {
        // Now that the component has mounted, we will use a long lived
        // subscription
        this.stateSubscription = this.observableState
          .subscribe(
            this.storeOnNext.bind(this),
            options.storeOnError || storeOnError,
            options.onCompleted || storeOnCompleted
          );
      }
    }

    storeOnNext(val) {
      debug('%s value updating', getName(this), val);
      this.setState(val);
    }

    render() {
      return React.createElement(
        Component,
        assign({}, this.state, this.props)
      );
    }
  }

  return Container;
}

export const contain = createContainer;
