import j from "joi";

export interface SchemaObject {
  type: "object";
  values: { [k: string]: Schema & { optional?: boolean } };
}

export interface SchemaArray {
  type: "array";
  elementType: Schema;
}

export interface SchemaString {
  type: "string";
  subType?: "email";
  min?: number;
  max?: number;
}

export type Schema = SchemaObject | SchemaArray | SchemaString;

export const compileSchema = (schema: Schema): j.Schema => {
  switch (schema.type) {
    case "object":
      const fields: any = {};
      Object.entries(schema.values).forEach(([k, v]) => {
        let s = compileSchema(v);
        if (!v.optional) s = s.required();
        fields[k] = s;
      });
      return j.object(fields);

    case "array":
      return j.array().items(compileSchema(schema.elementType));

    case "string":
      let s = j.string();
      if (schema.subType === "email") s = s.email();
      if (schema.min) s = s.min(schema.min);
      if (schema.max) s = s.max(schema.max);
      return s;
  }
};
