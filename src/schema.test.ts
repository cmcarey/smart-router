import { compileSchema } from "./schema";

describe("string", () => {
  it("base behavior", () => {
    const schema = compileSchema({ type: "string" });
    const res = schema.validate("test");
    expect(res.error).toBeUndefined();
  });

  it("fails on non string", () => {
    const schema = compileSchema({ type: "string" });
    const res = schema.validate(3);
    expect(res.error).toBeTruthy();
  });

  it("email subtype good", () => {
    const schema = compileSchema({ type: "string", subType: "email" });
    const res = schema.validate("chance@carey.sh");
    expect(res.error).toBeUndefined();
  });

  it("email subtype bad", () => {
    const schema = compileSchema({ type: "string", subType: "email" });
    const res = schema.validate("chance@careysh");
    expect(res.error).toBeTruthy();
  });

  it("min good", () => {
    const schema = compileSchema({ type: "string", min: 5 });
    const res = schema.validate("12345");
    expect(res.error).toBeUndefined();
  });

  it("min bad", () => {
    const schema = compileSchema({ type: "string", min: 5 });
    const res = schema.validate("1234");
    expect(res.error).toBeTruthy();
  });

  it("max good", () => {
    const schema = compileSchema({ type: "string", max: 5 });
    const res = schema.validate("12345");
    expect(res.error).toBeUndefined();
  });

  it("max bad", () => {
    const schema = compileSchema({ type: "string", max: 5 });
    const res = schema.validate("123456");
    expect(res.error).toBeTruthy();
  });
});

describe("array", () => {
  it("works", () => {
    const schema = compileSchema({
      type: "array",
      elementType: { type: "string" },
    });
    const res = schema.validate(["test"]);
    expect(res.error).toBeUndefined();
  });

  it("works on wrong type", () => {
    const schema = compileSchema({
      type: "array",
      elementType: { type: "string" },
    });
    const res = schema.validate([123]);
    expect(res.error).toBeTruthy();
  });
});

describe("object", () => {
  it("works", () => {
    const schema = compileSchema({
      type: "object",
      values: {
        a: {
          type: "string",
        },
        b: {
          type: "string",
        },
      },
    });
    const res = schema.validate({
      a: "test",
      b: "test",
    });
    expect(res.error).toBeUndefined();
  });

  it("non existent field", () => {
    const schema = compileSchema({
      type: "object",
      values: {},
    });
    const res = schema.validate({
      a: "test",
    });
    expect(res.error).toBeTruthy();
  });

  it("optional type", () => {
    const schema = compileSchema({
      type: "object",
      values: {
        a: { type: "string", optional: true },
        b: { type: "string", optional: false },
      },
    });
    const res = schema.validate({ b: "test" });
    expect(res.error).toBeUndefined();
  });
});
