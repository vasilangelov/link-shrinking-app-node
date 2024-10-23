import { isValidEnumValue } from "@/utils";

export enum Environment {
  Development = "development",
  Production = "production",
}

export const PORT = Number(process.env.PORT) || 5000;

export const ENVIRONMENT = isValidEnumValue(Environment, process.env.ENV)
  ? process.env.ENV
  : Environment.Development;

export const VERSION = process.env.VERSION || "";
