// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by router-adapter.js.
import { name as packageName } from "meteor/router-adapter";

// Write your tests here!
// Here is an example.
Tinytest.add('router-adapter - example', function (test) {
  test.equal(packageName, "router-adapter");
});
