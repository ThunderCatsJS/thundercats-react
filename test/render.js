/* eslint-disable no-unused-expressions, react/display-name */
import Rx from 'rx';
import { Cat, Store } from 'thundercats';
import chai, { expect } from 'chai';
import {
  React,
  createActions,
  createClass,
  ReactTestUtils,
  unmountComp
} from './utils';

import { createContainer, Render, RenderToString } from '../src';

Rx.config.longStackSupport = true;
chai.should();

describe('RenderToString', function() {
  let cat;
  this.timeout(6000);
  beforeEach(() => {
    cat = Cat()();
  });

  it('should return an observable', () => {
    let TestComp = createClass({});
    let TestElement = React.createElement(TestComp);
    let renderObs = RenderToString(cat, TestElement);
    renderObs.subscribe.should.be.a('function');
  });

  describe('fetching', () => {
    let payload, wrappedPayload, TestComp;
    beforeEach(() => {
      let CatActions = createActions();
      let CatStore = createStore();
      payload = { name: 'foo' };
      wrappedPayload = { value: payload };
      cat.register(CatActions);
      cat.register(CatStore, null, cat);
    });

    it('should initiate fetcher registration', (done) => {
      TestComp = createContainer(
        {
          store: 'catStore',
          fetchAction: 'catActions.doAction',
          getPayload: () => wrappedPayload
        },
        createClass()
      );
      RenderToString(cat, React.createElement(TestComp))
        .subscribe(({ fetchMap }) => {
          expect(fetchMap).to.exist;
          fetchMap.size.should.equal(1);
          const fetchContext = fetchMap.get('catActions.doAction');
          expect(fetchContext).to.exist;
          fetchContext.should.be.an('object');
          fetchContext.should.include.keys(
            'name',
            'payload',
            'action',
            'store'
          );
          done();
        });
    });

    it('should be ok with empty payload', (done) => {
      TestComp = createContainer(
        {
          store: 'CatStore',
          fetchAction: 'catActions.doAction',
          getPayload: () => ({})
        },
        createClass()
      );
      RenderToString(cat, React.createElement(TestComp))
        .subscribe(({ fetchMap }) => {
          const fetchContext = fetchMap.get('catActions.doAction');
          expect(fetchContext).to.exist;
          fetchContext.should.include.keys(
            'name',
            'payload',
            'action',
            'store'
          );
          fetchContext.payload.should.deep.equal({});
          done();
        });
    });
  });

  describe('observable', () => {
    let element;
    beforeEach(() => {
      let CatActions = createActions();
      let CatStore = createStore();
      let Comp = createContainer(
        {
          store: 'CatStore',
          fetchAction: 'catActions.doAction',
          getPayload: () => ({})
        },
        createClass()
      );
      element = React.createElement(Comp);
      cat.register(CatActions);
      cat.register(CatStore, null, cat);
    });

    it('should return markup, data', (done) => {
      RenderToString(cat, element)
        .subscribe(data => {
          expect(data.markup).to.exist;
          expect(data.data).to.exist;
          data.markup.should.be.a.string;
          data.data.should.be.an('object');
          done();
        });
    });

    it('should error on fetch errors', (done) => {
      RenderToString(cat, 'not the momma')
        .subscribe(
          () => {},
          err => {
            expect(err).to.exist;
            err.should.be.an.instanceOf(Error);
            done();
          }
        );
    });

    it('should complete', (done) => {
      RenderToString(cat, element)
        .subscribe(
          () => {},
          () => {},
          () => done()
        );
    });
  });
});

describe('render', function() {
  let cat, Comp, element;
  beforeEach(() => {
    let CatActions = createActions();
    let CatStore = createStore();
    Comp = createContainer(
      {
        store: 'CatStore',
        fetchAction: 'catActions.doAction',
        getPayload: () => ({})
      },
      createClass()
    );
    element = React.createElement(Comp);
    cat = Cat()();
    cat.register(CatActions);
    cat.register(CatStore, null, cat);
  });

  it('should return an observable', () => {
    let divContainer = document.createElement('div');
    let renderObserable = Render(cat, element, divContainer);
    expect(renderObserable).to.exist;
    renderObserable.subscribe.should.be.a('function');
  });

  describe('observable', () => {
    let divContainer;
    beforeEach(() => {
      divContainer = document.createElement('div');
    });

    afterEach(() => {
      unmountComp(divContainer);
    });

    it('should return react instance', (done) => {
      let renderObserable = Render(cat, element, divContainer);
      expect(renderObserable).to.exist;
      renderObserable
        .first()
        .subscribe(function(inst) {
          expect(inst).to.exist;
          ReactTestUtils.isCompositeComponent(inst).should.be.true;
          done();
        });
    });

    it('should return error', (done) => {
      let renderObserable = Render(cat, 'foo', divContainer);
      expect(renderObserable).to.exist;
      renderObserable
        .subscribeOnError(err => {
          expect(err).to.exist;
          err.should.be.an.instanceOf(Error);
          done();
        });
    });
  });
});

function createStore(initValue = null) {
  return Store({ refs: { value: initValue }})
    .refs({ displayName: 'CatStore' })
    .init(({ instance, args }) => {
      const [ cat ] = args;
      let catActions = cat.getActions('CatActions');
      instance.register(
        catActions.doAction.delay(500).map(() => ({ replace: {}}))
      );
    });
}
