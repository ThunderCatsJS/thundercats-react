[![Coverage Status](https://coveralls.io/repos/ThunderCatsJS/thundercats-react/badge.svg?branch=master&service=github)](https://coveralls.io/github/ThunderCatsJS/thundercats-react?branch=master)
[![Stories in Ready](https://badge.waffle.io/thundercatsjs/thundercats-react.png?label=ready&title=Ready)](https://waffle.io/thundercatsjs/thundercats-react)
[![Join the chat at https://gitter.im/r3dm/thundercats](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/r3dm/thundercats?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![JS.ORG](https://img.shields.io/badge/js.org-thundercats-ffb400.svg?style=flat-square)](http://js.org)

# ThunderCats-React

Render and pre-fetch data for your react app using ThunderCats.js

## Guide

### Contain

`contain` is a function that wraps your component in a Higher Order React Component called a container. The container is responsible for:

* Setting requested actions on your components props.
* Listening to a registered store(s) and setting their values on as your
  components props.
* Setting fetch action to pre-fetch data when using renderToString method.
* fetch lifecycles hooks


```js
import { createContainer } from 'thundercats';

const Comp = React.createClass({
  render() {
    console.log('props', this.props);
    // => { chatActions, messageActions, message }
    return <h1>Hello World</h1>;
  }
});

const options = {
  actions: [
    'chatActions',
    'messageActions'
  ],
  store: 'messageStore',
  map: (messages) => ({ message: messages[0] })
};
const ContainedComponent = createContainer(options, Comp);
```

or use as a decorator

```js

// note: using es7 Decorators
// note: contain is an alias of createContainer
 @contain({
    // actions to be made avaible on this components props
    actions: 'chatActions', // can be an array of strings

    // stores this component should subscribe too.
    stores: [
      'messageStore',
      'threadStore'
    ],
    // a function that takes the values of the stores
    // and returns an Object{ messages, thread }
    combineLatest: function(messages, threadStoreState) {
      return { messageStoreState, threadStoreState.threadId };
    }

    // The actions class and method to call to prefetch data
    // when using cat.renderToString method
    fetchAction: 'chatActions.fetchMessages',

    // Which store to listen for fetch completion
    // note: if the component subscribes to only one store this can be ommited.
    fetchWaitFor: 'messagesStore',

    // the payload to use when calling the fetchAction
    // e.i chatActions.fetchMessages(getPayload(props, context));
    getPayload(props, context) {
      return { path: props.path };
    },

    // The fetch action is called on componentDidMount but can be called
    // continuesly as the props change depending on the return of
    // this function
    shouldContainerFetch: ((props, nextProps) => props.threadID !== nextProps.threadID)
})
export default class MessageSection extends React.Component {
  constructor(props) {
    super(props);
  }

  static displayName = 'MessageSection'
  static propTypes = {
    chatActions: PropTypes.object.isRequired,
    messages: PropTypes.array,
    thread: PropTypes.string
  }

  // using React-Router
  static contextTypes = {
    router: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    const ul = this.refs.messageList.getDOMNode();
    ul.scrollTop = ul.scrollHeight;
  }

  renderMessages(messages) {
    return messages.map(message => (
      <MessageListItem
        key={ message.id }
        message={ message }/>
    ));
  }

  render() {
    const { messages, thread } = this.props;

    return (
      <div className='message-section'>
        <h3 className='message-thread-heading'>
          { thread.name }
        </h3>
        <ul
          className='message-list'
          ref='messageList'>
          { this.renderMessages(messages) }
        </ul>
        <MessageComposer
          chatActions={ this.props.chatActions }
          thread={ thread }/>
      </div>
    );
  }
}

```

### Render(cat, reactElement, DOMelement)

Render function. Under the hood it uses Reacts render function but wraps your component so that the cat will be available in your components context and returns an observable. The observable produces the instance returned by React.render.

```js
class TodoApp = Cat()
  .init(({ instance }) => {
    instance.register(TodoActions);
    instance.register(TodoStore, null, instance);
  });

const todoApp = TodoApp();

Render(todoApp, appElement, document.getElementById('todoapp')).subscribe(
  () => {
    console.log('app rendered!');
  },
  err => {
    console.log('rendering has encountered an err: ', err);
  }
);
```

### RenderToString(cat, reactElement, DOMelement)

This is where things get sweet. RenderToString acts as above except the observable returns an object composed of the markup and prefetched data.

```js
// expressServer.js
RenderToString(todoApp, appElement)
  .subscribe(
    ({ markup, data }) => {
    console.log('markup generated');

    // expose data on window object
    res.expose(data, 'data');
    console.log('rendering jade');
    res.render('layout', { html: markup }, function(err, markup) {
        if (err) { return next(err); }
        console.log('jade template rendered');

        debug('sending %s to user', decodedURI);
        return res.send(markup);
    });
    },
    next,
    () => debug('rendering concluded')
  );
}
```
on the client

```js

// data to hydrate app state
const data = window && window.__app__ ? window.__app__.data : {};
// hydrate adds the data to the proper stores
cat.hydrate(data)
    // stores are primed
    // app renders with correct state
    return Render(React.createElement(App), mountNode);
  })
  .subscribe(
    () => console.log('React rendered!'),
    (err) => console.log('an error occured', err)
  });

```

## API

### createContainer(options : object) : ReactComponent

#### options : object

####  options.actions : string|Array\<string\>

A string or an array of strings actions displayNames. On component instantiation, the container will pull these out of cat using `cat.getActions` and pass them in as props to your component.

#### options.store : string

Store displayName used with `cat.getStore`. On component instantiation and store
updates the value held by the store will be placed as props on your component.

#### options.map : function

Used when in conjunction with options.store. container calls `map` function with
the value held by the store. The return is applied as props to your component instead of directly applying the value held by the store to your component.
Note: Not used if no `store` is specified.

#### options.stores : Array\<string\>

If your component requires the value of multiple stores, you can supply an array
of strings to `stores` prop. The requires the use of `combineLatest` option.

#### options.combineLatest : function

Required when using `stores` option. The container will call `combineLatest`
with each argument corresponding to the value held be each store. The order of
the arguments depends on the order of store displayNames in `stores` array. The
return from combineLatest is applied as props to your component.

#### options.fetchAction : string

A string in the form 'actionsDisplayName.observableMethod', for example
`todoActions.fetchTodos`. The container will use `cat.getActions` to find
`actionsDisplayName` and call `observableMethod` during `componentWillMount` This is where you define your data fetching for ThunderCats to automatically do during RenderToString.

Note: Must be used with `options.fetchWaitFor` when not declared with a store.

#### options.fetchWaitFor : string

A string declaring which store should be used to wait for

#### options.getPayload : function(props: object, context: object) => object

A function, which is called with the props and context object, that should
return the object which will be passed to the fetch observable.

#### options.storeOnError : function(err : Error)

A function that is called when the store observable errors.

#### options.onCompleted : function

A function that is called when the store observable completes. In normal
operations, this should never be called until your app shuts down.

#### options.shouldContainerFetch : function(props : object, nextProps : object) => bool

Fetch actions can be called multiple times in the lifecycle of a component. The
first time the fetch action is called is during `componentDidMount`. The next
time it can be called is during `componentWillRecieveProps`. This is useful if
your store state is dependent on props passed to the component. Say you are
using react-router. A router handler is passed the route parameters in as props.
These are passed to `shouldContainerFetch` function. The return boolean is used to
determine if the fetch action should be recalled with the value returned from
`getPayload`. If the return is true, the fetch action is recalled.

### contain(options : object) : ReactComponent

Alias for createContianer

### Render(catInstance, reactElement, DOMElement) : observable\<rootElement\>

An observable wrapper around reacts render method. This function also wraps your
react element in another component that adds the `catInstance` to reacts context.
This is required for `createContainer` to work. The observable returns the root
react element.

### RenderToString(catInstance, reactElement) : observable\<{ markup : string, data : object }\>

Same as above, but this will actually return an object with `markup` as the html
string rendered by react's `renderToString` method and a data prop that is the
state of all the stores that had a fetch action attached to it. This can then be
used with something like [express-state](https://github.com/yahoo/express-state)
to add the data object to the clients page and then be used to hydrate the
stores on the client.

<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<small>Don't Forget To Be Awesome</small>
