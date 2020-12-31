import express from "express";
import request from "supertest";
import { Err, Ok } from "ts-results";
import { Route } from "./route";
import { compileRouter } from "./router";
import { Schema } from "./schema";

const schema: Schema = {
  type: "object",
  values: {
    str: { type: "string" },
  },
};

const buildServerWithRoutes = (routes: Route[]) => {
  const server = express();
  server.use(express.json());
  const router = express.Router();
  compileRouter(router, routes);
  server.use(router);
  return server;
};

it("works", async () => {
  const routes: Route[] = [
    {
      path: "/a",
      method: "post",
      stub: {
        in_schema: schema,
        out_schema: schema,
        handler: async ({ body }) => Ok(body),
      },
    },
  ];

  const server = buildServerWithRoutes(routes);

  const res = await request(server).post("/a").send({ str: "test" });
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ str: "test" });
});

it("input error", async () => {
  const routes: Route[] = [
    {
      path: "/a",
      method: "post",
      stub: {
        in_schema: schema,
        out_schema: schema,
        handler: async ({ body }) => Ok(body),
      },
    },
  ];

  const server = buildServerWithRoutes(routes);

  const res = await request(server).post("/a").send({ str: 30 });
  expect(res.status).toBe(400);
  expect(res.body).toEqual({ error: '"str" must be a string' });
});

it("no output", async () => {
  const routes: Route[] = [
    {
      path: "/a",
      method: "get",
      stub: {
        handler: async () => Ok(null),
      },
    },
  ];

  const server = buildServerWithRoutes(routes);

  const res = await request(server).get("/a");
  expect(res.status).toBe(200);
  expect(res.body);
});

it("request error", async () => {
  const routes: Route[] = [
    {
      path: "/a",
      method: "get",
      stub: {
        handler: async () => Err("error"),
      },
    },
  ];

  const server = buildServerWithRoutes(routes);

  const res = await request(server).get("/a");
  expect(res.status).toBe(400);
  expect(res.body).toEqual({ error: "error" });
});
