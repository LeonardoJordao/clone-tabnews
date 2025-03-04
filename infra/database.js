import { Client } from "pg";
import { ServiceError } from "./errors.js";

const getNewClient = async () => {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });
  await client.connect();
  return client;
};

const query = async (queryObject) => {
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    // console.log(result);
    return result;
  } catch (err) {
    const ServiceErrorObject = new ServiceError({
      message: "Erro na conexão com o Banco ou na Query.",
      cause: err,
    });
    throw ServiceErrorObject;
  } finally {
    await client?.end();
  }
};

const database = {
  getNewClient,
  query,
};

export default database;

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }
  // return process.env.NODE_ENV == "development" ? false : true;
  return process.env.NODE_ENV === "production";
}
