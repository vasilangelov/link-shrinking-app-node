import z, { isAsync } from "zod";

type ValidateSchemaReturn<Schema extends z.ZodSchema> =
  | { isValid: true; payload: z.infer<Schema> }
  | { isValid: false; errors: { field: string; issue: string }[] };

export function validateSchemaSync<Schema extends z.ZodSchema>(
  value: unknown,
  schema: Schema
): ValidateSchemaReturn<Schema> {
  try {
    const payload = schema.parse(value);

    return { isValid: true, payload };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map((issue) => ({
          field: issue.path.toString(),
          issue: issue.message,
        })),
      };
    }

    throw error;
  }
}

export async function validateSchemaAsync<Schema extends z.ZodSchema>(
  value: unknown,
  schema: Schema
): Promise<ValidateSchemaReturn<Schema>> {
  try {
    const payload = await schema.parseAsync(value);

    return { isValid: true, payload };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        errors: error.errors.map((issue) => ({
          field: issue.path.toString(),
          issue: issue.message,
        })),
      };
    }

    throw error;
  }
}
