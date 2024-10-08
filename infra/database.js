import { Client } from "pg";

const query = async (queryObject) => {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  });
  console.log("Credenciais do postgres", {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  });
  try {
    await client.connect();
    const result = await client.query(queryObject);
    // console.log(result);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
};

export default {
  query,
};
