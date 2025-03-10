import {
  InternalServerError,
  MethodNotAllowedError,
  ValidationError,
} from "infra/errors";

const onNoMatchHandler = (req, res) => {
  const publicErrorObject = new MethodNotAllowedError();
  res.status(publicErrorObject.statusCode).json(publicErrorObject);
};

const onErrorHandler = (err, req, res) => {
  if (err instanceof ValidationError) {
    // console.log(err);
    return res.status(err.statusCode).json(err);
  }

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
