/*
| -------------------------------------------------------------------------
| Single Page Application (SPA)
| -------------------------------------------------------------------------
| @author Timothy Marois < timothymarois.com >
|
*/


/**
* objectMerge()
* Merge two objects together
*
* @param object obj1
* @param object obj2
* @return object
*/
function objectMerge(obj1, obj2)
{
    var obj3 = {};
    for (var attrname in obj1)
    {
        obj3[attrname] = obj1[attrname];
    }
    for (var attrname in obj2)
    {
        obj3[attrname] = obj2[attrname];
    }

    return obj3;
}


(function (window) {
    'use strict';

    function spa()
    {
        var self = this;

        self.active = { };
        self.xhr = { };

        self.containers = {};
        self.views = {};


        /**
        * setRoute()
        *
        */
        this.setView = function(name, options)
        {
            self.views[name] = options;
        };


        /**
        * setContainer()
        *
        */
        this.setContainer = function(name, options)
        {
            self.containers[name] = options;
        };


        /**
        * view()
        *
        */
        this.view = function(name, options)
        {
            if (typeof self.views[name] !== 'undefined')
            {
                let containerName = self.views[name].container;
                let container = self.containers[containerName];

                // merge the new details info the container state
                self.views[name] = objectMerge(self.views[name], options);

                if (typeof self.active[containerName] !== 'undefined')
                {
                    if (typeof self.views[self.active[containerName]].clear === 'function')
                    {
                        self.views[self.active[containerName]].clear();
                    }
                }

                // set the active container on this element
                self.active[containerName] = name;

                // abort any previous attempts if they are still trying to run
                if (typeof self.xhr[containerName] !== 'undefined') {
                    self.abort(self.xhr[containerName]);
                }

                // run the server request
                self.xhr[containerName] = self.request({
                    type : 'GET',
                    dataType : 'html',
                    data : self.views[name].data,
                    url : self.views[name].url,
                    after : function(data)
                    {
                        if (typeof container.after === 'function')
                        {
                            container.after(container.el, data);
                        }

                        if (typeof self.views[name].after === 'function')
                        {
                            self.views[name].after(container.el, data);
                        }
                    },
                    error : container.error,
                    before : container.before
                });
            }
        };


        /**
        * request()
        *
        */
        this.request = function(options)
        {
            return $.ajax({
                type     : options.type,
                headers  : {
                    'X-CSRF-TOKEN' : 'test'
                },
                url      : options.url,
                data     : options.data,
                dataType : options.dataType,
                timeout  : 30000,
                cache    : false,
                error: function(xhr, textStatus, errorThrown)
                {
                    if (typeof options.error === 'function')
                    {
                        return options.error(xhr, textStatus, errorThrown);
                    }
                },
                beforeSend: function()
                {
                    if (typeof options.before === 'function')
                    {
                        return options.before();
                    }
                },
                success : function(data)
                {
                    if (typeof options.after === 'function')
                    {
                        return options.after(data);
                    }
                }
            });
        };


        /**
        * abort()
        *
        */
        this.abort = function(xhr)
        {
            if(xhr && xhr.readyState != 4) {
                xhr.abort();
            }
        };
    }

    window.spa = window.spa = spa;

}(window));

var SPA = new spa();
