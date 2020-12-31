<h1 align="center">smart-router</h1>

Routing, schema verification, and handling utilities on top of [Express](http://expressjs.com/).

- 🗺 Extend existing applications using an `express.Router`
- 🚪 Automatic path prefixing using a route map
- ✅ Schema validation primitives built using [Joi](https://joi.dev)
- 📚 Generate API documentation from routes
- 📑 Fully typed

Schema validation occurs on both input _and_ output, preventing unexpected outputs and allowing for full automatic documentation of both inputs and outputs.

## Example

```js
const stub: RouteStub = {
  in_schema: { type: "object", values: { str: { type: "string" } } },
  out_schema: { type: "object", values: { str: { type: "string" } } },
  handler: async ({ body }) => {
    if (body.str === "good") return Ok({ str: "okay" });
    else return Err("not okay");
  },
};

const apiRoutes: Route[] = [{ path: "/get", method: "post", stub }];

const routeMap: RouteMap = [["/api", apiRoutes]];
const routes = compileRouteMap(routeMap);
```

## Applying the router

```js
const server = express();
const router = express.Router();
compileRouter(router, routes);
server.use(router);
```

## Generating API documentation

```js
exportRoutes(routes);
```

```js
[
  {
    path: "/api/get",
    method: "post",
    in_schema: { type: "object", values: { str: { type: "string" } } },
    out_schema: { type: "object", values: { str: { type: "string" } } },
  },
];
```

## Schema validation

```js
{
  type: "object",
  values: {
    email: { type: "string", subType: "email" },
    minMax: { type: "string", min: 5, max: 50, optional: true },
    els: { type: "array", elementType: { type: "string" } },
  },
}
```
