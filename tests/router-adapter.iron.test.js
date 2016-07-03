import { Tracker } from 'meteor/tracker';
import { IronRouterAdapter } from '../src/router-adapter';

let RouterInstance = new IronRouterAdapter(Package['iron:router'].Router);

describe('router-adapter - iron-router', function () {
    beforeAll(function() {
        Router.configure({autoStart: false, autoRender: false});
        Router.route('Home', { path: '/' });
        Router.route('route01');
        Router.route('route02');
        Router.route('/justapath');

        Router.route('route03', {
            path: '/test/:param_01'
        });
    });

    describe('go', function () {
        beforeEach(function() {
            RouterInstance.go('Home');
            Tracker.flush();
        });

        it('Router.go to route.', function () {
            expect(RouterInstance.path()).toBe('/');

            RouterInstance.go('route01');
            Tracker.flush();

            expect(RouterInstance.path()).toBe('/route01');
        });
    });

    describe('routeName', function() {
        beforeEach(function() {
            RouterInstance.go('Home');
            Tracker.flush();
        });

        it('Router.routeName prints the routeName of a route with a routeName.', function () {
            expect(RouterInstance.routeName()).toBe('Home');
        });

        // Note: this fails, for some reason, routeName = 'route' when no name is given for iron:router.
        it('Router.routeName prints the routeName of a route with out a routeName.', function () {
            RouterInstance.go('/justapath');
            Tracker.flush();

            expect(RouterInstance.routeName()).toBe('/justapath');
        });
    });

    describe('params', function() {
        beforeEach(function() {
            RouterInstance.go('Home');
            Tracker.flush();
        });

        it ('Router.params print empty object if no params.', function() {
            expect(Object.keys(RouterInstance.params()).length).toBe(0);
        });

        it ('Router.params print the params if params are given to Router.go', function() {
            let param = 'heyimbored';
            RouterInstance.go('route03', { param_01: param });
            Tracker.flush();

            expect(RouterInstance.params()).toEqual(jasmine.objectContaining({
                param_01: param
            }));
        });
    });
    
    describe('routes', function() {
        beforeEach(function() {
            RouterInstance.go('Home');
            Tracker.flush();
        });

        it ('Router.routes get the route object given a routeName.', function() {
            expect(RouterInstance.routes('Home').route).toBe(Router.routes['Home']);
        });
    });

    describe('protocol', function() {
        beforeEach(function() {
            RouterInstance.go('Home');
            Tracker.flush();
        });

        it ('Router.protocol should return protocol', function() {
            expect(RouterInstance.protocol()).toBe(Iron.Location.get().protocol);
        });
    });
});