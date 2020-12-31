import { Result } from "ts-results";
import { Schema } from "./schema";

export type RouteHandler = (props: {
  params: any;
  body?: any;
}) => Promise<Result<any, any>>;

export interface RouteStub {
  in_schema?: Schema;
  out_schema?: Schema;
  handler: RouteHandler;
}

export interface Route {
  path: string;
  method: "get" | "post";
  stub: RouteStub;
}

export type RouteMap = [string, Route[]][];

export const compileRouteMap = (routeMap: RouteMap) =>
  routeMap
    .map((routes) => prefixRoutes(routes[0], routes[1]))
    .reduce((prev, curr) => [...prev, ...curr], []);

export const prefixRoutes = (prefix: string, routes: Route[]): Route[] =>
  routes.map((route) => ({
    path: prefix + route.path,
    method: route.method,
    stub: route.stub,
  }));

export const exportRoutes = (routes: Route[]): {} =>
  routes.map((route) => ({
    path: route.path,
    method: route.method,
    in_schema: route.stub.in_schema,
    out_schema: route.stub.out_schema,
  }));
