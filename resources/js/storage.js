var StorageNS = {

    // Map from namespace string to default value. Only non-optional namespaces should be true here.
    //
    namespaces: {
        "StorageNS": true,
    },

    AddOptionalNamespace: function(namespace)
    {
        StorageNS.namespaces[namespace] = false;
    },

    InitNSCheckbox: function(cbElm)
    {
        cbElm.checked = StorageNS.IsNamespaceAllowed(cbElm.name);
        cbElm.disabled = StorageNS.namespaces[cbElm.name];

        if(!cbElm.disabled)
        {
            cbElm.addEventListener(
                "click",
                (evt) =>
                {
                    if(!StorageNS.UpdateNamespacePreference(
                        evt.target.name,
                        evt.target.checked))
                    {
                        evt.preventDefault();
                    }
                });
        }
    },

    InitAllNSCheckboxes: function()
    {
        for(let cb of $$("fieldset#storage-preferences input[name]"))
        {
            StorageNS.InitNSCheckbox(cb);
        }
    },

    IsNamespacePreferenceStored: function(namespace)
    {
        common.assert(
            namespace in StorageNS.namespaces,
            "Namespace '" + namespace + "' is not registered in namespaces list.");

        return window.localStorage.getItem("StorageNS::Allowed::" + namespace) != null;
    },

    UpdateNamespacePreference: function(namespace, newPref)
    {
        return StorageNS.SetLocalState("StorageNS", "Allowed::" + namespace, newPref);
    },

    Enable: function(event, enableAll)
    {
        for(var ns in StorageNS.namespaces)
        {
            if(!StorageNS.IsNamespacePreferenceStored(ns))
            {
                if(!StorageNS.UpdateNamespacePreference(ns, enableAll || StorageNS.namespaces[ns]))
                {
                    event.preventDefault();
                    return false;
                }
            }
        }

        if(!StorageNS.SetLocalState("StorageNS", "previouslyEnabled", new Date().getTime()))
        {
            event.preventDefault();
            return false;
        }

        StorageNS.InitAllNSCheckboxes();
        $(".cookie-banner").style.display = "none";
    },

    // Displays the cookie banner when any of the following conditions are met:
    //
    //  - More than a year has passed since the cookie banner was last displayed.
    //
    //  - There are any namespace preferences not set yet.  This can happen when new namespaces are
    //    introduced, namespaces are renamed, or on the first visit.
    //
    DisplayBannerIfNecessary: function(elt)
    {
        if(Object.keys(StorageNS.namespaces).every(StorageNS.IsNamespacePreferenceStored))
        {
            previousVisit = new Date(JSON.parse(
                StorageNS.GetLocalState("StorageNS", "previouslyEnabled")));
            current = new Date().getTime();
            nextBanner = previousVisit.setDate(previousVisit.getFullYear()+1);

            // Don't display if it hasn't been a year, and all namespaces have their preferences
            // registered.
            //
            if(current < nextBanner)
            {
                return;
            }
        }
        elt.style.display = "block";
    },

    IsNamespaceAllowed: function(namespace)
    {
        common.assert(
            namespace in StorageNS.namespaces,
            "Namespace '" + namespace + "' is not registered in namespaces list.");

        if(StorageNS.namespaces[namespace])
        {
            return true;
        }

        return !!JSON.parse(window.localStorage.getItem("StorageNS::Allowed::" + namespace));
    },

    GetLocalState: function(namespace, key)
    {
        if(!StorageNS.IsNamespaceAllowed(namespace))
        {
            return null;
        }

        try
        {
            fullKey = namespace + "::" + key;
            var localState = window.localStorage.getItem(fullKey);
            return localState;
        }
        catch(err)
        {
            console.log("Unable to read from localStorage: '" + err + "'. Continuing without stored state.");
            return null;
        }
    },

    SetLocalState: function(namespace, key, value)
    {
        if(!StorageNS.IsNamespaceAllowed(namespace))
        {
            return false;
        }

        try
        {
            fullKey = namespace + "::" + key;
            window.localStorage.setItem(fullKey, value);
            return true;
        }
        catch(err)
        {
            console.log("Unable to write to localStorage: '" + err + "'. Continuing without stored state.");
            return false;
        }
    },

    // GetCookies: function()
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

    // SetCookie: function(key, value, path, expiration_days)
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

common.addOnloadHandler("fieldset#storage-preferences", (elm) => { elm.disabled = false; });
common.addOnloadHandler("fieldset#storage-preferences input[name]", StorageNS.InitNSCheckbox);
common.addOnloadHandler(".cookie-banner", StorageNS.DisplayBannerIfNecessary);
