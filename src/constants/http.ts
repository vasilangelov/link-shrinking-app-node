export enum HTTPStatusCode {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}

export enum HTTPHeader {
  ContentType = "Content-Type",
}

export enum HTTPMimeType {
  TextPlain = "text/plain",
}
