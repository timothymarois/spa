/*
| -------------------------------------------------------------------------
| Single Page Application (SPA)
| -------------------------------------------------------------------------
| @author Timothy Marois < timothymarois.com >
|
*/


(function (window) {
    'use strict';

    function router()
    {
        var self = this;

        self.current_path = '';

        self.routes = {};

        /**
        * setRoutes()
        *
        */
        this.setRoutes = function(routes)
        {
            self.routes = routes;
        };

        /**
        * go()
        *
        */
        this.go = function(name, fc = false)
        {
            // check if route exist, if not, throw an error and stop
            if (typeof self.routes[name] === 'undefined')
            {
                console.log('Route Error: Not Found ('+name+')');
                return false;
            }

            // check if we already have a hashtag (on page load)
            // use that hashtag first
            if (location.hash != '' && fc === false)
            {
                self.current_path = location.hash.replace('#','');
                name = self.current_path;
            }

            // check if route name is defined and hash is not
            // do not allow it to continue since hash is being monitored
            // change the hash to the new route name
            if (name != '' && location.hash == '')
            {
                location.hash = name;
                return false;
            }

            // check if path is set and hash doesnt equal, and force is true
            // change hash, but do not continue since hash is being monitored
            if (name != '' && location.hash != name && fc === true)
            {
                console.log(name);
                location.hash = name;
                return false;
            }

            let route = self.routes[name];

            // run our SPA view
            SPA.view(route.view,{
                url : route.path
            });
        };

        /**
        * listener()
        *
        */
        this.listener = function ()
        {
            $(window).off('hashchange').on('hashchange', function()
            {
                if (location.hash!='')
                {
                    self.current_path = location.hash.replace('#','');
                    self.go(self.current_path, 0);
                }
            });
        };

    }

    window.router = window.router = router;

}(window));

var Router = new router();
