# Motivation

Redux applications are easy to test since they are built from small, composable, pure functions, e.g. `actions`, `reducers` and `selectors`. Except for one part, the glue-code of `react-redux`. This glue-code requires a bit of extra setup for each test case since it calls selectors and propagates the state and custom shaped props to them.

In most applications testing the so called containers and their configuration/glue-code are handled in one of the following variants:

1. Not testing the `mapStateToProps` or `mapDispatchToProps` configurations at all.
2. Rendering the container manually wrapped in a `<Provider/>` with some example state (integration test).
4. Testing the `mapStateToProps` or `mapDispatchToProps` individually as separate units.

The first variant should be a big no-no as you might guess and the second variant needs to maintain an example state shape which needs to be kept in sync, another drawback is that you bind your test code to the functionality of the `<Provider/>` of `react-redux` which makes the test an integration test, which in fact would run in separate sessions to avoid conflicting test boundaries (Therefore the DX goes down since you need to keep two test runners / sessions open while developing your application).

We opted for the third variant since it is the cleanest, but we found that manually setting up mocks for all used selectors is tedious and if we don't mock them at all we get confusing error messages in our tests since the boundaries are not clear (e.g. if one of the selectors has an internal error it will be propagated up into our `mapStateToProps` test).

We also wanted to use the snapshot feature of Jest since it increases our DX dramatically, but building a result object for the snapshot in each test is a hassle, hence this package was born.
