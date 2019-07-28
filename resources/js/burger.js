// This file defines the functions to toggle the burger menu.
//
// Most of the complexity is actually in CSS, these functions just change CSS properties.
//
var BurgerNS = {
    burgerToggleProp: "--burger-toggle",
    burgerVisibleProp: "--burger-visible",

    SetBurger: function(active)
    {
        var elemStyle = document.documentElement.style;
        elemStyle.setProperty(BurgerNS.burgerVisibleProp, active == 1 ? "initial" : "hidden");
        elemStyle.setProperty(BurgerNS.burgerToggleProp, active);
    },

    ToggleBurger: function()
    {
        var active = getComputedStyle(document.documentElement).getPropertyValue(BurgerNS.burgerToggleProp);
        var newActive = (active == 1) ? 0 : 1;
        BurgerNS.SetBurger(newActive);
    },

    // This function turns on the javascript burger, and resets it to its previous value.
    //
    ResetBurger: function()
    {
        var elemStyle = document.documentElement.style;
        elemStyle.setProperty("--burger-js-visible", "initial");
        elemStyle.setProperty("--burger-js-toggle", 1);
        elemStyle.setProperty("--burger-js-sticky", "sticky");
        elemStyle.setProperty("--burger-js-header-position", "fixed");
        elemStyle.setProperty("--burger-js-content-position", "fixed");
        elemStyle.setProperty("--burger-js-content-height", "calc(100vh - var(--top-bar-height))")
        elemStyle.setProperty("--burger-visible", "hidden");
    },

    LinkResetBurger: function(link)
    {
        console.log(link);
        link.onclick = () => { BurgerNS.SetBurger(false); return true; };
    }
};

BurgerNS.ResetBurger();
common.addOnloadHandler(
    ".top-bar a[target=_self], .top-bar a:not([target]):not([href='javascript:void(0);'])",
    BurgerNS.LinkResetBurger);
