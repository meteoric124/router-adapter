import { _ } from 'meteor/underscore';

let isDefined = x => !_.isUndefined(x);

export class RouteAdapter {
    constructor(route) {
        this.route = route;
    }

    path(data) { }
}

// todo: document. Basically copy it from iron router /flow router. Whoever have doc already.
export class RouterAdapter {
    constructor(router) {
        this.router = router;
    }

    go() {}
    current() {}
    routeName() {}
    params() {}
    routes(path) {}  // todo: make this getPath instead.

    protocol() {}
    host() { return `${this.hostname()}:${this.port()}`; }
    hostname() {}
    port() {}
    path() {}
    search() {}
    hash() {}
    href(path) {}
}

export class IronRouterAdapter extends RouterAdapter {
    go() {
        if (arguments.length === 1) {
            let routeName = arguments[0];
            this.router.go(routeName);
        } else if (arguments.length > 1) {
            let routeName = arguments[0];
            let routeParams = arguments[1] || {};
            this.router.go(routeName, routeParams);
        }
    }
    current() { return this.router.current(); }
    routeName() {
        let routeName = this.router.current().route.getName();
        if (isDefined(routeName)) {
            return routeName;
        } else {
            return this.path();
        }
    }
    params() {
        let params_copy = {};
        for (var key in this.current().params) {
            if (this.current().params.hasOwnProperty(key) && this.current().params[key]) {
                params_copy[key] = this.current().params[key];
            }
        }
        delete params_copy.query;

        return params_copy;
    }
    routes(path) {
        return new IronRouterRouteAdapter(this.router.routes[path]);
    }
    protocol() {
        return Iron.Location.get().protocol;
    }
    hostname() {
        return Iron.Location.get().hostname;
    }
    port() {
        return Iron.Location.get().port;
    }
    path(path) {
        if (isDefined(path)) {
            this.router.go(path);
            return;
        }
        return Iron.Location.get().pathname;
    }
    search() {
        return Iron.Location.get().search;
    }
    hash() {
        return Iron.Location.get().hash;
    }
    href(path) {
        if (isDefined(path)) {
            this.router.go(path);
            return;
        }
        return Iron.Location.get().href;
    }
};

export class IronRouterRouteAdapter extends RouteAdapter {
    path(data) {
        return this.route.path(data);
    }
}

export class FlowRouterAdapter extends RouterAdapter {
    go() {
        if (arguments.length === 1) {
            let routeName = arguments[0];
            this.router.go(routeName);
        } else if (arguments.length > 1) {
            let routeName = arguments[0];
            let routeParams = arguments[1] || {};
            this.router.go(routeName, routeParams);
        }
    }
    current() {
        this.router.watchPathChange();
        return this.router.current();
    }
    routeName() {
        let routeName = this.router.current().route.name;
        if (isDefined(routeName)) {
            return routeName;
        } else {
            return this.path();
        }
    }
    params() {
        let params_copy = {};
        for (var key in this.current().params) {
            if (this.current().params.hasOwnProperty(key) && this.current().params[key]) {
                params_copy[key] = this.current().params[key];
            }
        }
        delete params_copy.query;

        return params_copy;
    }
    routes(pathOrName) {
        pathOrName = pathOrName.trim();
        let route = this.router._routes.find(function(route) {
            if (route.path == pathOrName || route.name == pathOrName) {
                return true;
            }
            return false;
        });

        if (!route) {
            throw new Meteor.Error(`Given ${pathOrName} is not a path or route name.`);
        }

        return new FlowRouterRouteAdapter(route);
    }
    protocol() {
        this.router.watchPathChange();
        return window.location.protocol;
    }
    hostname() {
        this.router.watchPathChange();
        return window.location.hostname;
    }
    port() {
        this.router.watchPathChange();
        return window.location.port;
    }
    path(path) {
        if (isDefined(path)) {
            this.router.go(path);
            return;
        }

        this.router.watchPathChange();
        return this.current().path;
    }
    search() {
        this.router.watchPathChange();
        return window.location.search;
    }
    hash() {
        this.router.watchPathChange();
        return window.location.hash;
    }
    href(path) {
        if (isDefined(path)) {
            this.router.go(path);
            return;
        }

        this.router.watchPathChange();
        return window.location.href;
    }
}

export class FlowRouterRouteAdapter extends RouteAdapter {
    path(data = {}) {
        return Package['kadira:flow-router'].FlowRouter.path(this.route.path, data, data);
    }
}

export let RouterInstance = null;
if (Package['iron:router']) {
    RouterInstance = new IronRouterAdapter(Package['iron:router'].Router);
} else if (Package['kadira:flow-router']) {
    RouterInstance = new FlowRouterAdapter(Package['kadira:flow-router'].FlowRouter);
}