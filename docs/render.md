# Render$

```js
render$(cat: Cat, element: ReactElement, domContainer: DOMNode) => Observable<instance: ReactRootElement>
```

An observable wrapper around the `ReactDOM.render` method. This function also wraps your
react element in higher order component that adds the `cat` to Reacts context.
This is required for the `container` to work. The Observable returns the root
react element.

# RenderToString$

```js
renderToString$(cat: Cat, element: ReactElement) => Observable<{ markup: String }>
```

Same as above, but this will actually return an object with `markup` as the html
string rendered by the `ReactDOM.renderToString` method, instead. This also calls
all the fetch actions and primes the stores. Call the dehydrate method after this
to get the state of the stores and pass it into something like [express-state](https://github.com/yahoo/express-state)
to add the data object to the clients page. Once the page is loaded, that data
can be used with hydrate function to prime the stores on the client.
