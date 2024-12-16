import Events from "./events.js";

class VanillaRouter {
    constructor(options = {}) {
        this.events = new Events(this);
        this.options = { type: 'history', ...options };
        // Vérifie que les routes sont définies correctement
        if (!this.options.routes) throw new TypeError("Routes are not defined!");
        this.routeHash = Object.keys(this.options.routes);
        if (!this.routeHash.length) throw new TypeError("No routes defined!");
    }

    listen() {
        if (!this.routeHash.includes("/")) throw TypeError("No home route found");
        if (this.isHashRouter) {
            window.addEventListener("hashchange", this._hashChanged.bind(this));
            setTimeout(() => this._tryNav(location.hash.substr(1)), 10);  // Navigation initiale
        } else {
            document.addEventListener("click", this._onNavClick.bind(this));
            window.addEventListener("popstate", this._triggerPopState.bind(this));
            setTimeout(() => this._tryNav(location.pathname), 10);  // Navigation initiale sans hash
        }
    }

    _hashChanged() {
        this._tryNav(location.hash.substr(1));
    }

    _triggerPopState(e) {
        // La gestion du changement d'état (par exemple, retour en arrière)
        this.events.trigger("route", { path: e.state.path, url: location.href });
    }

    _tryNav(href) {
        const url = new URL(href, location.origin);
        const routePath = this._findRoute(url.pathname);
        if (routePath) {
            // Si la route existe, on change l'URL et on déclenche l'événement
            history.pushState({ path: routePath }, routePath, url.pathname);
            this.events.trigger("route", { path: routePath, url: url.href });
            return true;
        }
    }

    _findRoute(url) {
        // On vérifie si l'URL correspond à une route définie
        return this.routeHash.includes(url) ? url : null;
    }

    _onNavClick(e) {
        const href = e.target.closest("[href]")?.href;
        if (href && this._tryNav(href)) e.preventDefault(); // On empêche le comportement par défaut si c'est une navigation interne
    }

    setRoute(path) {
        // Si la route n'existe pas, on lance une erreur
        if (!this._findRoute(path)) throw new TypeError("Invalid route");
        history.replaceState(null, null, path);
        this._tryNav(path);
    }

    get isHashRouter() {
        return this.options.type === 'hash'; // Retourne true si on utilise le hash pour la navigation
    }
}

export default VanillaRouter;
