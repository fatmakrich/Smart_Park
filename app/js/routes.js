import VanillaRouter from "./router.js";

const router = new VanillaRouter({
    type: "history",
    routes: {
        "/": "home",
        "/home2": "home2",
        "/signin": "signin"
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

// // Assurer que le router commence à écouter dès que le DOM est prêt
// router.listen();
// console.log("hi")
// // Utilisation d'un événement natif ou d'une méthode personnalisée pour gérer le changement de route
// window.addEventListener('route', async (e) => {
//     const route = e.detail.route;  // Le route est dans e.detail
//     const url = e.detail.url;      // L'URL complète du changement

//     console.log(route, url);

//     // Essayer de charger le contenu de la page correspondante
//     try {
//         let Element = document.getElementById("main")
//         let response = await fetch("/pages/" + route + ".html");
//         console.log(response.text())
//         if (response.ok) {
//             // Si la page est trouvée, mettez-la dans le DOM
//             Element.innerHTML = response.text()
//         } else {
//             // Si la page n'existe pas, afficher un message d'erreur
//             document.querySelector("main").innerHTML = "<h1>Page non trouvée</h1>";
//         }
//     } catch (err) {
//         console.error("Erreur lors du chargement de la page:", err);
//         // Gestion d'erreur
//         document.querySelector("main").innerHTML = "<h1>Erreur lors du chargement de la page</h1>";
//     }
// });
