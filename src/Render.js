import Rx from 'rx';
import { render } from 'react-dom';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import debugFactory from 'debug';

import ContextWrapper from './ContextWrapper';
import waitFor from 'thundercats/lib/waitFor';
import { getName, getNameOrNull } from './utils';

const debug = debugFactory('thundercats:render');
const assign = Object.assign;

export function fetch(fetchMap) {
  if (!fetchMap || fetchMap.size === 0) {
    debug('cat found empty fetch map');
    return Rx.Observable.return({
      data: {},
      fetchMap
    });
  }

  const fetchCtx = Rx.Observable.from(fetchMap.values()).shareReplay();

  const waitForStores = fetchCtx
    .pluck('store')
    // store should have names
    .filter(store => !!getNameOrNull(store))
    .toArray()
    .tap(arrayOfStores => debug('waiting for %s stores', arrayOfStores.length))
    .flatMap(arrayOfStores => {
      return waitFor(...arrayOfStores).first();
    });

  const storeNames = fetchCtx
    .pluck('store')
    .map(store => getName(store));

  const fetchObs = fetchCtx
    .map(({ action, payload }) => ({ action, payload }))
    .tapOnNext(() => debug('init individual fetchers'))
    .tapOnNext(({ action, payload }) => {
      action(payload);
    })
    .tapOnCompleted(() => debug('fetchers activated'))
    .toArray();

  return Rx.Observable.combineLatest(
    waitForStores,
    fetchObs.delaySubscription(50),
    data => data
  )
    .flatMap(data => Rx.Observable.from(data))
    .zip(
      storeNames,
      (data, name) => ({ [name]: data })
    )
    .reduce((accu, item) => {
      return assign({}, accu, item);
    }, {})
    .map(data => ({ data, fetchMap }));
}

export function RenderToObs(Comp, DOMContainer) {
  return new Rx.AnonymousObservable(observer => {
    let instance = null;
    instance = render(Comp, DOMContainer, (err) => {
      /* istanbul ignore else */
      if (err) { return observer.onError(err); }
      /* istanbul ignore else */
      if (instance) { observer.onNext(instance); }
    });
    observer.onNext(instance);
  });
}

export function Render(cat, Component, DOMContainer) {
  return Rx.Observable.just(Component)
    .map(Comp => ContextWrapper.wrap(Comp, cat))
    .flatMap(
      Burrito => RenderToObs(Burrito, DOMContainer),
      (Burrito, inst) => {
        return inst;
      }
    );
}

export function RenderToString(cat, Component) {
  const fetchMap = new Map();
  cat.fetchMap = fetchMap;
  return Rx.Observable.just(Component)
    .map(Comp => ContextWrapper.wrap(Comp, cat))
    .doOnNext(Burrito => {
      debug('initiation fetcher registration');
      renderToStaticMarkup(Burrito);
      debug('fetcher registration complete');
    })
    .flatMap(
      () => {
        return fetch(fetchMap);
      },
      (Burrito, { data, fetchMap }) => {
        return {
          Burrito,
          data,
          fetchMap
        };
      }
    )
    .map(({ Burrito, data, fetchMap }) => {
      let markup = renderToString(Burrito);
      return {
        markup,
        data,
        fetchMap
      };
    })
    .first()
    .tapOnNext(() => cat.fetchMap = null);
}

