[![Coverage Status](https://coveralls.io/repos/thundercatsjs/thundercats-react/badge.svg)](https://coveralls.io/r/thundercatsjs/thundercats-react)
[![Stories in Ready](https://badge.waffle.io/thundercatsjs/thundercats-react.png?label=ready&title=Ready)](https://waffle.io/thundercatsjs/thundercats-react)
[![Join the chat at https://gitter.im/r3dm/thundercats](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/r3dm/thundercats?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![JS.ORG](https://img.shields.io/badge/js.org-thundercats-ffb400.svg?style=flat-square)](http://js.org)

# ThunderCats-React

Render and prefetch data for your react app using ThunderCats.js


## Guide


### The Container

createContainer is a function that wraps your component in a React Component use to wrap your components. The Container is responible for many things. For instance, 

* Setting requested actions on your Components props.
* Listening to a registered store(s).
* Setting fetch action to pre-fetch data when using renderToString method.
* fetch lifecycles

This is how you use it.

```js
import { createContainer } from 'thundercats';

const options = {
};

const Div = React.createClass({
  render() {
    <div />
  }
});

const WrappedDiv = createContainer(options, Div);

```
By itself it doesn't do much.  Check out the example below. 

```js

// note: using es7 Decorators
 @createContainer({
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
      getPayload: function(props, context) {
        return { path: props.path };
      },
      
      // The fetch action is called on componentDidMount but can be called
      // continuesly as the props change depending on the return of 
      // this function
      shouldContainerFetch: function(props, nextProps) {
        return props.threadID !== nextProps.threadID;
      }
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

---


### Render(cat, reactElement, DOMelement)

Render function. Under the hood it uses Reacts render function but wraps your component so that the cat will be available in your components context and returns an observable. The observable produces the instance returned by React.render.

### RenderToString(cat, reactElement, DOMelement)

This is where things get sweet. cat.renderToString acts as above except the observable returns an object composed of the markup and prefetched data.


```js
class TodoApp extends Cat {
  constructor() {
    super();
    this.register(TodoActions);
    this.register(TodoStore, this);
  }
}

const todoApp = new TodoApp();

Render(todoApp, ppElement, document.getElementById('todoapp')).subscribe(
  () => {
    console.log('app rendered!');
  },
  err => {
    console.log('rendering has encountered an err: ', err);
  }
);
```


### API

more to come...





<small>Don't Forget To Be Awesome</small>
