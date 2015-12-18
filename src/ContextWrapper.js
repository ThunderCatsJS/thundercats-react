import React, { Children } from 'react';
import invariant from 'invariant';

const ContextWrapper = React.createClass({
  displayName: 'ThunderCatsContextWrapper',
  propTypes: {
    cat: React.PropTypes.object.isRequired,
    children: React.PropTypes.element.isRequired
  },

  childContextTypes: {
    cat: React.PropTypes.object.isRequired
  },

  getChildContext() {
    return {
      cat: this.props.cat
    };
  },

  render() {
    return Children.only(this.props.children);
  }
});

// wrap a component in this context wrapper
/* eslint-disable react/no-multi-comp, react/display-name */
ContextWrapper.wrap = function wrap(element, cat) {
  invariant(
    React.isValidElement(element),
    'ContextWrapper wrap expects a valid React element'
  );

  invariant(
    typeof cat === 'object',
    'ContextWrapper expects an instance of Cat'
  );

  return React.createElement(
    ContextWrapper,
    { cat: cat },
    element
  );
};

export default ContextWrapper;
