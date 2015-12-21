## GUIDE

## The Container

`createContainer`, or its alias `contain`, are functions that wraps your component in a
Higher Order React Component. The container is responsible for:

* Setting requested actions on your components props.
* Listening to a registered store(s) and setting their values on as your
  components props.
* Setting fetch action to pre-fetch data when using `renderToString$` method.
* Fetch life cycles hooks


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
    // when using renderToString$ method
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

## Render$

```js
render$(cat: Cat, element: ReactElement, domContainer: DOMNode) => Observable<ReactRootInstance>
```
The `render$` function. Under the hood it uses `ReactDOM.render` function. It also
wraps your component so that the cat will be available in your components context
and returns an observable. The observable produces the instance returned by `ReactDOM.render`.

```js
import { Cat } from 'thundercats';
import { renderToString$ } from 'thundercats-react';

class TodoApp = Cat()
  .init(({ instance }) => {
    instance.register(TodoActions);
    instance.register(TodoStore, null, instance);
  });

const todoApp = TodoApp();

render$(todoApp, appElement, document.getElementById('todoapp')).subscribe(
  () => {
    console.log('app rendered!');
  },
  err => {
    console.log('rendering has encountered an err: ', err);
  }
);
```

## RenderToString$

```js
renderToString$(cat: Cat, element: ReactElement) => Observable<{ markup: String }>
```

This is where things get sweet. renderToString$ acts as above except the
observable returns an object composed of the markup and will call the fetch
actions to prime the stores with data.

```js
// expressServer.js
renderToString$(todoApp, appElement)
  .flatMap(
    dehydrate(todoApp),
    ({ markup }, data) => ({ markup, data })
  )
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
// set by express-state
const data = window && window.__app__ ? window.__app__.data : {};

// hydrate adds the data to the proper stores
hydrate(data)
  .flatMap(() => {
    // stores are primed
    // app renders with correct state
    return render$(todoApp, React.createElement(App), mountNode);
  })
  .subscribe(
    () => console.log('React rendered!'),
    (err) => console.log('an error occured', err)
  });

```
