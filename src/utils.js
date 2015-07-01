export function getName(comp) {
  return '' + (getNameOrNull(comp) || 'Anonymous');
}

export function getNameOrNull(comp) {
  return (
    (comp && comp.displayName) ||
    (comp.constructor &&
    comp.constructor.displayName) ||
    null
  );
}

export function isObservable(observable) {
  return observable && typeof observable.subscribe === 'function';
}
