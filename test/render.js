/* eslint-disable no-unused-expressions, react/display-name */
/* eslint-disable react/no-multi-comp */
import Rx, { Observable } from 'rx';
import { Actions, dehydrate, Cat, Store } from 'thundercats';
import chai, { expect, assert } from 'chai';
import {
  React,
  createActions,
  createClass,
  ReactTestUtils,
  unmountComp
} from './utils';

import { createContainer, render$, renderToString$ } from '../src';
import { renderToObs$ } from '../src/Render';

Rx.config.longStackSupport = true;
chai.should();

describe('renderToObs$', function() {
  it('should report errors', () => {
    renderToObs$().subscribe(
      () => {},
      err => {
        console.log(err.message);
        assert(err, 'did not report error');
        assert(
          (/invalid component element/i).test(err.message),
          'did not throw expected error'
        );
      }
    );
  });
});

describe('renderToString$', function() {
  let cat;
  this.timeout(6000);
  beforeEach(() => {
    cat = Cat()();
  });

  it('should return an observable', () => {
    let TestComp = createClass({});
    let TestElement = React.createElement(TestComp);
    let renderObs = renderToString$(cat, TestElement);
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
      renderToString$(cat, React.createElement(TestComp))
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
      renderToString$(cat, React.createElement(TestComp))
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

    it('should return markup', done => {
      renderToString$(cat, element)
        .subscribe(({ markup })=> {
          assert.equal(
            typeof markup,
            'string',
            'markup returned is not a string'
          );
          done();
        });
    });

    it('should pre-fetch data', done => {

      const felineElement = React.createElement(createContainer(
        {
          store: 'felineStore',
          fetchAction: 'felineActions.doAction',
          getPayload: () => ({})
        },
        createClass({
          displayName: 'Feline',

          render() {
            return element;
          }
        })
      ));


      const FelineActions = Actions({
        refs: { displayName: 'FelineActions' },
        doAction() {
          return Observable.just({ replace: { fur: 'sneeze' } }).delay(900);
        }
      });

      const CatActions = Actions({
        refs: { displayName: 'catActions' },
        doAction() {
          return Observable.just({ set: { foo: 'baz' } }).delay(500);
        }
      });

      const FelineStore = Store({
        refs: {
          value: { pet: 'pur' },
          displayName: 'FelineStore'
        },
        init({ instance: store, args: [cat] }) {
          const actions = cat.getActions('FelineActions');
          store.register(actions.doAction);
        }
      });

      const CatStore = Store({
        refs: {
          value: { foo: 'bar' },
          displayName: 'CatStore'
        },
        init({ instance: store, args: [cat] }) {
          const actions = cat.getActions('catActions');
          store.register(actions.doAction);
        }
      });


      const cat = Cat()();

      cat.register(CatActions);
      cat.register(FelineActions);
      cat.register(CatStore, null, cat);
      cat.register(FelineStore, null, cat);

      renderToString$(cat, felineElement)
        .flatMap(
          dehydrate(cat),
        )
        .doOnNext(({ CatStore, FelineStore })=> {
          assert(
            !FelineStore.pur,
            'felineStore did not update'
          );

          assert.equal(
            FelineStore.fur,
            'sneeze',
            'feline store did not fetch'
          );

          assert.equal(
            CatStore.foo,
            'baz',
            'foo did not equal baz'
          );
        })
        .subscribe(
          () => {},
          done,
          done
        );
    });

    it('should error on fetch errors', (done) => {
      renderToString$(cat, 'not the momma')
        .subscribe(
          () => {},
          err => {
            assert(err instanceof Error, 'err is not instance of Error');
            done();
          }
        );
    });

    it('should complete', (done) => {
      renderToString$(cat, element)
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
    let renderObserable = render$(cat, element, divContainer);
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
      let renderObserable = render$(cat, element, divContainer);
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
      let renderObserable = render$(cat, 'foo', divContainer);
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
