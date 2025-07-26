import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import HeaderLogo from '../Header/HeaderLogo';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Importa getDoc

export default function DownloadPage({ db, appId }) { // Recebe db e appId como props
  const [imageUrl, setImageUrl] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComprovante = async () => {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams(window.location.search);
      const ts = params.get('download') || params.get('ts');

      if (ts && db) {
        try {
          const comprovanteRef = doc(db, `artifacts/${appId}/public/data/comprovantes/${ts}`);
          const docSnap = await getDoc(comprovanteRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setImageUrl(data.imageUrl);
            setTimestamp(data.timestamp);
            handleDownload(data.imageUrl, data.timestamp); // Faz o download automático
          } else {
            setError("Comprovante não encontrado.");
            console.log("Nenhum comprovante encontrado para o timestamp:", ts);
          }
        } catch (err) {
          setError("Erro ao buscar comprovante: " + err.message);
          console.error("Erro ao buscar comprovante:", err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setError("Timestamp ou conexão com o banco de dados ausente.");
        setIsLoading(false);
      }
    };

    if (db) { // Garante que o db está inicializado antes de tentar buscar
      fetchComprovante();
    }
  }, [db, appId]); // Dependências: db e appId

  const handleDownload = (url, ts) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `comprovante-acai-${ts}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Remove o parâmetro da URL sem recarregar a página
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  return (
    <>
      <HeaderLogo />
      <DownloadContainer>
        <DownloadBox>
          <h2>Download do Comprovante</h2>
          {isLoading ? (
            <p>Carregando comprovante...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : (
            <>
              <p>Se o download não iniciou automaticamente ou deseja baixar novamente:</p>
              <DownloadButton
                onClick={() => {
                  if (imageUrl && timestamp) {
                    handleDownload(imageUrl, timestamp);
                  }
                }}
                disabled={!imageUrl}
              >
                Clique aqui para baixar
              </DownloadButton>
            </>
          )}
        </DownloadBox>
      </DownloadContainer>
    </>
  );
}

// Estilos dos componentes
const DownloadContainer = styled.div`
  padding-top: 120px;
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
`;

const DownloadBox = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  width: 90%;
  max-width: 500px;
  text-align: center;
`;

const DownloadButton = styled.button`
  background: linear-gradient(to right, #6A3093, #8E44AD);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin: 20px 0;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(106, 48, 147, 0.4);
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;
