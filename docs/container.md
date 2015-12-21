# Container

```js
import { createContainer } from 'thundercats-react';

createContainer(options?: Object) => ReactComponent
```

## options

```js
interface options {
    actions?: String | Array[String],
    store?: String,
    map?: (state1: Object) => Object,
    stores?: Array[String],
    combineLatest?: (state1: Object, state2: Object, ...stateN: Object) => Object,

    fetchAction?: String,
    getPayload?: (props: Object, context: Object) => payload: Object,

    storeOnError?: (err: Error) => Void,
    storeOnCompleted?: () => Void,

    shouldContainerFetch?: (props: Object, nextProps: Object) => Boolean,
    subscribeOnWillMount?: () => Boolean
}
```

###  options.actions

A string or an array of strings actions displayNames. On component instantiation, the container will pull these out of cat using `cat.getActions` and pass them in as props to your component.

### options.store

Store `displayName` used with `cat.getStore`. On component instantiation and store
updates the value held by the store will be placed as props on your component.

### options.map

Used when in conjunction with options.store. The container calls `map` function with
the value held by the store. The return is applied as props to your component instead of directly applying the value held by the store to your component.
Note: Not used if no `store` is specified.

### options.stores

If your component requires the value of multiple stores, you can supply an array
of strings to `stores` prop. The requires the use of `combineLatest` option.

### options.combineLatest

Required when using `stores` option. The container will call `combineLatest`
with each argument corresponding to the value held be each store. The order of
the arguments depends on the order of store `displayName`s in `stores` array. The
return from `combineLatest` is applied as props to your component.

### options.fetchAction

A string in the form `actionsDisplayName.observableMethod`, for example
`todoActions.fetchTodos`. The container will use `cat.getActions` to find
`actionsDisplayName` and call `observableMethod` during `componentWillMount` This is where you define your data fetching for ThunderCats to automatically do during `renderToString$`.

### options.getPayload

A function, which is called with the props and context object, that should
return the object which will be passed to the fetch observable.

### options.storeOnError

A function that is called when the store observable errors.

### options.onCompleted

A function that is called when the store observable completes. In normal
operations, this should never be called until your app shuts down.

### options.shouldContainerFetch

Fetch actions can be called multiple times in the life cycle of a component. The
first time the fetch action is called is during `componentDidMount`. The next
time it can be called is during `componentWillRecieveProps`. This is useful if
your store state is dependent on props passed to the component. Say you are
using react-router. A router handler is passed the route parameters in as props.
These are passed to `shouldContainerFetch` function. The return boolean is used to
determine if the fetch action should be recalled with the value returned from
`getPayload`. If the return is true, the fetch action is recalled.

### options.subscribeOnWillMount

A function that will subscribe the container to the observable store during
`componentWillMount` React life cycle if it returns true.

Normal behavior is to subscribe to store notifications on `componentDidMount`
life cycle. This happens after initial render pass in the React life cycle. There
may be instances where you as a user might require the container to subscribe
before rendering starts. This function allows you to dictate that.

# contain

Alias for `createContianer`
