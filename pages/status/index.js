import useSWR from "swr";

const fetchAPI = async (key) => {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
};

function DatabaseStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 3000,
  });
  // console.log(data);

  if (!isLoading && data) {
    const updatedAtText = new Date(data.updated_at).toLocaleString();
    const { version, max_connections, used_connections } =
      data.dependencies.database;

    return (
      <>
        <h4>Última atualização: {updatedAtText}</h4>
        <h2>Database</h2>
        <div>
          Versão: {version}
          <br />
          <br />
          Conexões (usadas / máximo): {used_connections} / {max_connections}
        </div>
      </>
    );
  }
  return "Carregando...";
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <DatabaseStatus />
    </>
  );
}
