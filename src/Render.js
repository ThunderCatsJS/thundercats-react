import Rx, { Observable } from 'rx';
import { render } from 'react-dom';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import debugFactory from 'debug';

import ContextWrapper from './ContextWrapper';

const debug = debugFactory('thundercats:render');

export function fetch$(fetchMap) {
  if (!fetchMap || fetchMap.size === 0) {
    debug('cat found empty fetch map');
    return Rx.Observable.just(fetchMap);
  }

  const fetchCtx$ = Rx.Observable.from(fetchMap.values()).shareReplay();
  const stores$ = fetchCtx$
    .map(({ store }) => store)
    .filter(store => !!store)
    .toArray()
    .flatMap(stores => Rx.Observable.combineLatest(stores));

  const actionDurations$ = fetchCtx$
    .map(({ action }) => action.__duration())
    .toArray()
    .flatMap(actionDurations => Rx.Observable.combineLatest(actionDurations))
    .tapOnCompleted(() => debug('fetch actions have all completed'));


  const fetch$ = fetchCtx$
    .tapOnNext(({ action, payload }) => {
      action(payload);
    })
    .tapOnCompleted(() => debug('fetchers activated'))
    .toArray();

  return Rx.Observable.combineLatest(
      stores$,
      actionDurations$,
      fetch$.delaySubscription(50)
    )
    .first()
    .tapOnNext(() => debug('fetch completed'))
    .map(() => fetchMap);
}

export function renderToObs$(Comp, DOMContainer) {
  return new Rx.AnonymousObservable(observer => {
    try {
      render(Comp, DOMContainer, function() {
        observer.onNext(this);
      });
    } catch (e) {
      observer.onError(e);
      observer.onCompleted();
    }
  });
}

export function render$(cat, Component, DOMContainer) {
  let Burrito;
  try {
    Burrito = ContextWrapper.wrap(Component, cat);
  } catch (e) {
    return Observable.throw(e);
  }
  return renderToObs$(Burrito, DOMContainer);
}

export function renderToString$(cat, Component) {
  let fetchMap;
  let Burrito;
  try {
    fetchMap = new Map();
    cat.fetchMap = fetchMap;
    Burrito = ContextWrapper.wrap(Component, cat);
    debug('initiation fetcher registration');
    renderToStaticMarkup(Burrito);
    debug('fetcher registration complete');
  } catch (e) {
    return Observable.throw(e);
  }

  return fetch$(fetchMap)
    // move fetch to next event loop to prevent
    // synchronous actions from causing infiniti loop
    .delay(50)
    .map((fetchMap) => {
      const markup = renderToString(Burrito);
      return {
        markup,
        fetchMap
      };
    })
    .tapOnNext(() => cat.fetchMap = null);
}

