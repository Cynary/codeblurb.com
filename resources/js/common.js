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

    enableJSForCSS: function()
    {
        var elemStyle = document.documentElement.style;
        elemStyle.setProperty("--js-visible", "initial");
    },
};

common.setupOnloadObserver();
common.enableJSForCSS();

// Blatant ripoff from jquery, but I like this syntactic sugar.
//
$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);
