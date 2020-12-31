import { Ok } from "ts-results";
import {
  compileRouteMap,
  exportRoutes,
  prefixRoutes,
  Route,
  RouteMap,
  RouteStub,
} from "./route";

const stub: RouteStub = {
  in_schema: { type: "string" },
  out_schema: { type: "string" },
  handler: async () => Ok(null),
};

const routes: Route[] = [
  { path: "/a", method: "get", stub },
  { path: "/b", method: "post", stub },
];

const routeMap: RouteMap = [
  ["/api/v1", routes],
  ["/api/v2", routes],
];

it("compile route map", () => {
  const routes = compileRouteMap(routeMap);
  expect(routes).toEqual([
    { path: "/api/v1/a", method: "get", stub },
    { path: "/api/v1/b", method: "post", stub },
    { path: "/api/v2/a", method: "get", stub },
    { path: "/api/v2/b", method: "post", stub },
  ]);
});

it("prefix routes", () => {
  const prefixedRoutes = prefixRoutes("/api/v1", routes);
  expect(prefixedRoutes).toEqual([
    { path: "/api/v1/a", method: "get", stub },
    { path: "/api/v1/b", method: "post", stub },
  ]);
});

it("export routes", () => {
  const exportedRoutes = exportRoutes(routes);
  expect(exportedRoutes).toEqual([
    {
      path: "/a",
      method: "get",
      in_schema: { type: "string" },
      out_schema: { type: "string" },
    },
    {
      path: "/b",
      method: "post",
      in_schema: { type: "string" },
      out_schema: { type: "string" },
    },
  ]);
});
