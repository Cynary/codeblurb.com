var ThemeNS = {
    themes: {
        light: {
            icon: "&#9728;",
            next: "dark",
        },

        dark: {
            icon: "&#9790;",
            next: "light",
        },
    },

    themeNameProp: "--theme",
    themeProperties: ["--text-color", "--back-color", "--back-color-transparent"],

    GetCurrentTheme: function()
    {
        var computedThemeStyle = getComputedStyle(document.documentElement);
        var currentTheme = computedThemeStyle.getPropertyValue(ThemeNS.themeNameProp).trim();

        common.assert(
            currentTheme in ThemeNS.themes,
            "Current theme '" + currentTheme + "' is not defined in scripts.");
        return currentTheme;
    },

    SetupThemeSymbol: function(theme)
    {
        common.assert(theme in ThemeNS.themes || theme == undefined, "Theme '" + theme + "' is not defined");
        if(theme == undefined)
        {
            theme = ThemeNS.GetCurrentTheme();
        }

        var nextTheme = ThemeNS.themes[theme].next;
        var themeDesc = ThemeNS.themes[nextTheme];

        var elm = document.getElementById("theme-symbol");
        elm.innerHTML = themeDesc.icon;
        elm.onclick = function() { ThemeNS.SetThemeAndSymbol(nextTheme); };
    },

    SetTheme: function(theme)
    {
        var theme = theme.trim();
        common.assert(theme in ThemeNS.themes, "Theme '" + theme + "' not found.");
        var themeStyle = document.documentElement.style;
        var currentTheme = ThemeNS.GetCurrentTheme();

        if(currentTheme != theme)
        {
            for(let prop of ThemeNS.themeProperties)
            {
                themeStyle.setProperty(prop, "var(" + prop + "-" + theme + ")");
            }

            themeStyle.setProperty(ThemeNS.themeNameProp, theme);
            common.setLocalState("ThemeNS::theme", theme);
        }
        return true;
    },

    SetThemeAndSymbol: function(theme)
    {
        ThemeNS.SetTheme(theme);
        ThemeNS.SetupThemeSymbol(theme);
    },

    ResetTheme: function()
    {
        var storedTheme = common.getLocalState("ThemeNS::theme");
        if(storedTheme != null)
        {
            ThemeNS.SetTheme(storedTheme);
        }
    },
};

common.onloadFunctions.push(ThemeNS.SetupThemeSymbol);

// Assumes the stylesheets are loaded prior to scripts.
//
ThemeNS.ResetTheme();
