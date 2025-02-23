import { InternalServerError, MethodNotAllowedError } from "infra/errors";

const onNoMatchHandler = (req, res) => {
  const publicErrorObject = new MethodNotAllowedError();
  res.status(publicErrorObject.statusCode).json(publicErrorObject);
};

const onErrorHandler = (err, req, res) => {
  const publicErrorObject = new InternalServerError({
    statusCode: err.statusCode,
    cause: err,
  });
  console.log(publicErrorObject);
  res.status(publicErrorObject.statusCode).json(publicErrorObject);
};

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
