import express from "express";
import { Result } from "ts-results";
import { Route } from "./route";
import { compileSchema } from "./schema";

const handleGet = async (
  route: Route,
  req: express.Request,
  res: express.Response
) => {
  handle(route, req, res, undefined);
};

const handlePost = async (
  route: Route,
  req: express.Request,
  res: express.Response
) => {
  // Compile input check schema
  const in_schema = route.stub.in_schema && compileSchema(route.stub.in_schema);

  // If there's an input schema, validate
  let body = undefined;
  if (in_schema) {
    const { value, error } = in_schema.validate(req.body);
    if (error) {
      res.status(400).send({ error: error.message });
      return;
    }
    body = value;
  }

  handle(route, req, res, body);
};

const handle = async (
  route: Route,
  req: express.Request,
  res: express.Response,
  body?: any
) => {
  // Compile output check schema
  const out_schema =
    route.stub.out_schema && compileSchema(route.stub.out_schema);

  // Execute handler
  let out: Result<any, any>;
  try {
    out = await route.stub.handler({ params: req.params, body });
  } catch (e) {
    // Rethrow server errors
    res.status(500).end();
    throw e;
  }

  // Return errors
  if (out.err) {
    res.status(400).send({ error: out.val });
    return;
  }

  // Internal server error if we attempt to return without
  //  having an output schema set
  if (out.val && !out_schema) {
    res.status(500).end();
    throw new Error(`Returned result but no out schema for ${route.path}`);
  }

  // No output schema, just end
  if (!out_schema) {
    res.end();
    return;
  }

  // Validate output result
  const { value, error } = out_schema.validate(out.val);
  if (error) {
    res.status(500).end();
    throw new Error(`Failed to validate out result for ${route.path}`);
  }

  // Send output
  res.send(value);
};

export const compileRouter = (router: express.Router, routes: Route[]) => {
  routes.forEach((route) => {
    switch (route.method) {
      case "get":
        router.get(route.path, async (req, res) => {
          handleGet(route, req, res);
        });
        return;

      case "post":
        router.post(route.path, async (req, res) => {
          handlePost(route, req, res);
        });
        return;
    }
  });
};
