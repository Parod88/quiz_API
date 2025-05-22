import { Response } from "express";

const validationFailed = (res: Response, error: any) => {
  console.error(error.message ? error.message : error);
  const errorPayload = {
    message: "Validation Error",
    payload:
      typeof error[Symbol.iterator] === "function" ? [...error] : error.message,
  };
  return res.status(400).json(errorPayload);
};

const unauthorized = (res: Response, error: any) => {
  console.error(error.message ? error.message : error);
  const errorPayload = {
    message: "Unauthorized error",
    payload: error.message ? error.message : error,
  };
  return res.status(401).json(errorPayload);
};

const notFound = (res: Response, error: any) => {
  console.error(error.message ? error.message : error);
  const errorPayload = {
    message: "Not Found",
    payload: error.message ? error.message : error,
  };
  return res.status(404).json(errorPayload);
};

const forbidden = (res: Response, error: any) => {
  console.error(error.message ? error.message : error);
  const errorPayload = {
    message: "Forbidden",
    payload: error.message ? error.message : error,
  };
  return res.status(403).json(errorPayload);
};

const created = (res: Response, dto: any) => {
  if (dto) {
    return res.status(201).json(dto);
  }
  return res.sendStatus(201);
};

const ok = (res: Response, dto: any) => {
  if (dto) {
    return res.status(200).json(dto);
  }
  return res.sendStatus(200);
};

const fail = (res: Response, error: any) => {
  console.error(error.message ? error.message : error);
  const errorPayload = {
    message: "Internal Error",
    payload: error.message ? error.message : error,
  };
  return res.status(500).json(errorPayload);
};

export {
  validationFailed,
  unauthorized,
  notFound,
  forbidden,
  fail,
  created,
  ok,
};
