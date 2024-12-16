import VanillaRouter from "./router.js";

const router = new VanillaRouter({
    type: "history",
    routes: {
        "/": "home",
        "/home2": "home2",
        "/signin": "signin",
        "/signup": "signup"
    }
}).listen().on("route", async (e) => {
    const route = e.detail.route;  // Le route est dans e.detail
    const url = e.detail.url;      // L'URL complète du changement
    console.log(route, url);
    let Element = document.getElementById("mainElem");
    let response = await fetch("/pages/" + route + ".html").then((response) => {
        if (response.ok) {
            return response.text();
        }
    });
    console.log(response);
    Element.innerHTML = response;

})

