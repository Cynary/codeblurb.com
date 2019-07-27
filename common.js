var common = {
    assert: function(expression, error)
    {
        if(!expression)
        {
            throw error;
        }
    },

    onloadFunctions: [],

    onload: function()
    {
        for(let fn of common.onloadFunctions)
        {
            fn();
        }
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
    }

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
}

window.onload = common.onload;

// Blatant ripoff from jquery, but I like this syntactic sugar.
//
$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);
