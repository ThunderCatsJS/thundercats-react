/* eslint-disable react/no-multi-comp */
var doc = require('jsdom').jsdom('<!doctype html><html><body></body></html>');

global.document = doc;
global.window = doc.defaultView;
global.window.document = doc;
global.navigator = {
  userAgent: 'node.js'
};

console.debug = console.log;

var Actions = require('thundercats').Actions;
var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var assign = Object.assign;

module.exports = {
  createActions: createActions,
  createClass: createClass,
  doc: doc,
  isComponentClass: isComponentClass,
  React: React,
  ReactTestUtils: TestUtils,
  render: render,
  unmountComp: unmountComp
};

function createActions(spy = function() {}, name = 'CatActions') {
  return Actions({
    refs: {
      displayName: name
    },
    doAction(val) {
      spy(val);
      return val;
    }
  });
}

function createClass(spec) {
  return React.createClass(assign(
    {},
    {
      displayName: 'TestComp',
      render() {
        return React.createElement('h1', null, 'hello');
      }
    },
    spec
  ));
}

function isComponentClass(Comp) {
  return Comp.prototype &&
    Comp.prototype.render &&
    !!Comp.prototype.setState;
}

function render(Comp) {
  var container = document.createElement('div');
  var instance = ReactDOM.render(Comp, container);
  return {
    instance: instance,
    container: container
  };
}

function unmountComp(container) {
  return ReactDOM.unmountComponentAtNode(container);
}
