Meteor.startup(function() {
    let isTesting = Meteor.isPackageTest;
    if (isTesting) {
        return;  // If testing, don't check for jack squat.
    }

    let bothRouterExist = !!Package['iron:router'] && !!Package['kadira:flow-router'];
    let validRouterExist = !!Package['iron:router'] || !!Package['kadira:flow-router'];
    if (!validRouterExist) {
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