class Routers{
  constructor(){
    this.routes = {};
    this._bindPopState();
  }
  init(path){
    history.replaceState(null, null, path);
    this.routes[path] && this.routes[path]();
  }
  pushRoute(path, callback){
    this.routes[path] = callback || function(){}
  }
  go(path){
    history.pushState(null, null, path);
    this.routes[path] && this.routes[path]();
  }
  _bindPopState() {
    window.addEventListener('popstate', e => {
      const path = e.state && e.state.path;
      this.routes[path] && this.routes[path]();
    });
  }
}