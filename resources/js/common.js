var common = {
    assert: function(expression, error)
    {
        if(!expression)
        {
            throw error;
        }
    },

    // Map from selector to list of functions that should run when a node matching that selector is
    // added to the DOM.
    //
    onloadFunctions: {},

    addOnloadHandler(selector, fn)
    {
        if(selector in common.onloadFunctions)
        {
            common.onloadFunctions[selector].push(fn);
        }
        else
        {
            common.onloadFunctions[selector] = [fn];
        }
    },

    onload: function(mutations)
    {
        for(let mutation of mutations)
        {
            for(let node of mutation.addedNodes)
            {
                for(selector in common.onloadFunctions)
                {
                    if(node instanceof Element && node.matches(selector))
                    {
                        for(let fn of common.onloadFunctions[selector])
                        {
                            fn(node);
                        }
                    }
                }
            }
        }
    },

    setupOnloadObserver: function()
    {
        var observer = new MutationObserver(common.onload);
        observer.observe(document.documentElement, { childList: true, subtree: true });
    },

    getLocalState: function(key)
    {
        try
        {
            var localState = window.localStorage.getItem(key);
            return localState;
        }
        catch(err)
        {
            console.log("Unable to read from localStorage: '" + err + "'. Continuing without stored state.");
            return null;
        }
    },

    setLocalState: function(key, value)
    {
        try
        {
            window.localStorage.setItem(key, value);
            return true;
        }
        catch(err)
        {
            console.log("Unable to write to localStorage: '" + err + "'. Continuing without stored state.");
            return false;
        }
    },

    enableJSForCSS: function()
    {
        var elemStyle = document.documentElement.style;
        elemStyle.setProperty("--js-visible", "initial");
    },

    // getCookies: function()
    // {
    //     var decodedCookie = decodeURIComponent(document.cookie);
    //     var cookieObj = {};
    //     for(let pair of decodedCookie.split(';'))
    //     {
    //         [key, value] = pair.split("=", 2);
    //         console.log(key, value, pair, pair.split("/=(.+)/"))
    //         common.assert(!(key in cookieObj), "Duplicate key '" + key + "' in cookie string.");
    //         cookieObj[key] = value;
    //     }
    //     return cookieObj;
    // },

    // setCookie: function(key, value, path, expiration_days)
    // {
    //     console.assert(!key.includes("=") &&
    //                    !key.includes(" ") &&
    //                    !key.includes(";") &&
    //                    !key.includes(","),
    //                    "Invalid character in key '" + key + "'.");

    //     var expiresString = ""
    //     if(expiration_days != undefined)
    //     {
    //         var d = new Date();
    //         d.setTime(d.getTime() + (expiration_days * 24 * 60 * 60 * 1000));
    //         expiresString = "expires=" + d.toUTCString() + ";";
    //     }

    //     var pathString = "";
    //     if(path != undefined)
    //     {
    //         pathString = "path=" + path;
    //     }

    //     document.cookie = key + "=" + value + ";" + expiresString + pathString;
    // },


};

common.setupOnloadObserver();
common.enableJSForCSS();

// Blatant ripoff from jquery, but I like this syntactic sugar.
//
$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);
