// This is a helper for the burger menu to hide it as a page is unloaded, to make transitions less
// jarring.
//
var BurgerNS = {
    SetBurger: function(active)
    {
        $("#burger-button").checked = active;
    },
};

window.addEventListener("beforeunload", () => { BurgerNS.SetBurger(false); });
