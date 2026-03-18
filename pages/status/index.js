import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <Database />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }
  return <div>Última atualização: {updatedAtText}</div>;
}

function Database() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI);

  let versionDatabase = "Carregando...";
  let maxConnections = "Carregando...";
  let openedConnections = "Carregando";

  if (!isLoading && data) {
    versionDatabase = JSON.stringify(data.database.version);
    maxConnections = JSON.stringify(data.database.max_connections);
    openedConnections = JSON.stringify(data.database.opened_connections);
  }

  return (
    <div>
      <ul>
        <li>Versão: {versionDatabase}</li>
        <li>Maxímo de Conecções: {maxConnections}</li>
        <li>Conecções Abertas: {openedConnections}</li>
      </ul>
    </div>
  );
}
