# December 22, 2015 v0.5.1

This release fixes the following situation.

If an action were to take place during a `componentWillMount`, this
will cause an infinite loop as the action triggers `combineLatest`
to emit an event, which then triggers another `renderToString`
which starts the whole thing over again.

There is a `first` filter in the stream, but internally the `onNext` of
the observer is called before the `onCompleted` of the observer can be
called, meaning the `first` filter never has a chance to call `onCompleted`

Moral of the story? Beware of Zalgo!

* [08411fe](../../commit/08411fe) [fix] Prevent infinite loops

# December 20, 2015 v0.5.0

This release is a breaking change. It depends on internal API changes introduced
in ThunderCats 3.1.0. The major change is now the fetching action
will detect when an action returns an observable and report when that action
has completed. This changes the previous behavior which would wait for a store
reported by the user to emit a value, inferring that the action has completed.
Consider when an async action that emits multiple actions before completing,
this would break the fetching action.

* [5e8e3c4](../../commit/5e8e3c4) [update] fetching uses fetch duration

# November 3, 2015 v0.4.0

This release has breaking changes:

* [ec35d4d](../../commit/ec35d4d) Update to React 0.14

# October 9, 2015 v0.3.0

This release has breaking changes:

* [401de8e](../../commit/401de8e) Bump to ThunderCats 3.0.0 and Rx 4.0.0

# October 8, 2015 v0.2.0

This release has breaking changes:

* [e6e718a](../../commit/e6e718a) Removes the Object.assign polyfil

And adds the following features:

* [b221c8c](../../commit/b221c8c) Adds isPrimed feature to the containers options object

# July 31, 2015 v0.1.0

* [beaea56](../../commit/beaea56) add subscribeOnWillMount option to container

# July 21, 2015 v0.0.6

* [5cb7b4b](../../commit/5cb7b4b) fix for thundercats 2.0: grab waitFor from lib

# July 18, 2015 v0.0.5

* [8aa3773](../../commit/8aa3773) fix Object.assign should be given empty object as first argument causing issues with shouldContainerFetch

# July 14, 2015 v0.0.4

* [4c403b4](../../commit/4c403b4) fix getPayload and shouldContainerFetch now get updates from stores

# Jul 12, 2015 v0.0.3

* [1683f1a](../../commit/1683f1a) fix make getPayload optional with fetchAction

# Jul 12, 2015 v0.0.2

* [7a426af](../../commit/7a426af) fix container should just check for function instead of ducktyping component.
* [a2ed838](../../commit/a2ed838) update to new stamp api
