Meteor.startup(function() {
    let bothRouterExist = !!Package['iron:router'] && !!Package['kadira:flow-router'];
    let validRouterExist = !bothRouterExist && (!!Package['iron:router'] || !!Package['kadira:flow-router']);
    if (!validRouterExist && !Meteor.isTesting) {
        console.error("Error: No valid router exist. Please install 'iron:router' or 'kadira:flow-router'");

        if (Meteor.isServer) {
            process.exit(8193);
        }
    } else if (bothRouterExist) {
        console.error("Both iron:router and kadira:flow-router exist. Pick one.");

        if (Meteor.isServer) {
            process.exit(8194);
        }
    }
});