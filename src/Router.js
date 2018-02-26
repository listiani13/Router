// @flow
type RouteHandler = {
  baseUrl: string,
  variable?: string,
  handler: Function,
};
type Context = {
  request: readStream,
  response: writeStream,
};
type RouteList = Array<RouteHandler>;
export default class Route {
  routeList: RouteList = [];
  addRoute(pattern: string, handler: Function) {
    let url = pattern.split('/');
    let placeholder = pattern.search(':');
    if (placeholder !== -1) {
      this.routeList.push({
        baseUrl: '/' + url[1],
        variable: '',
        handler: handler,
      });
    } else {
      this.routeList.push({baseUrl: '/' + url[1], handler: handler});
    }
    // this.routeList.push({pattern: pattern, handler: handler});
  }

  handleRequest(path: string, context: Context) {
    // let destructURL = this._parseLink(path);
    let {request, response} = context;
    console.log('PATH REQUESTED>>', path);
    let found = false;
    for (let item of this.routeList) {
      let pathUrl = path.split('/');
      if ('/' + pathUrl[1] === item.baseUrl) {
        console.log('Pattern matched>>>', item.baseUrl);

        if (item.variable != null) {
          item.variable = pathUrl[2];
          item.handler(context, item.variable);
        } else {
          item.handler(context);
        }
        found = true;
        break;
      }
    }
    if (!found) {
      console.log('404! Not found');
      this.serveNotFoundPage(request, response);
    }
  }

  _parseLink(path: string) {
    // parseLink -> getPath -> destructuring jadi baseUrl, dataVariable
    let url = path.split('/');
    let dataVar;
    if (url.length === 3) {
      dataVar = url[2];
    }
    let destructURL = {
      baseUrl: '/' + url[1],
      dataVar: dataVar,
    };
    return destructURL;
  }
  serveNotFoundPage(request, response) {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/html');
    response.end(`<h1>Bad Request !</h1>`);
  }
}
