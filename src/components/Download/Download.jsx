import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import HeaderLogo from '../Header/HeaderLogo';
import { useRouter } from 'next/router';

export default function DownloadPage() {
  const [imageUrl, setImageUrl] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [downloadAttempted, setDownloadAttempted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { download } = router.query;

  useEffect(() => {
    if (download) {
      handleDownload(download);
    }
  }, [download]);


  const handleDownload = async (timestamp) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/download?timestamp=${timestamp}`);
      
      if (!response.ok) {
        throw new Error('Comprovante não encontrado');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comprovante-acai-${timestamp}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setLoading(false);
    } catch (err) {
      console.error('Erro ao baixar:', err);
      setError(err.message);
      setLoading(false);
    }
  };
  return (
    <>
    <HeaderLogo />
    <DownloadContainer>
       <DownloadBox>
          <h2>Download do Comprovante</h2>
          {loading ? (
            <p>Preparando download...</p>
          ) : error ? (
            <>
              <p>Não foi possível baixar o comprovante.</p>
              <p style={{fontSize: '0.9rem', color: '#666'}}>
                {error}
              </p>
            </>
          ) : (
            <>
              <p>Seu comprovante foi baixado com sucesso!</p>
              <DownloadButton 
                onClick={() => handleDownload(download)}
              >
                Baixar novamente
              </DownloadButton>
            </>
          )}
        </DownloadBox>
    </DownloadContainer>
  </>
);
}

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

const CodeBox = styled.div`
  background: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  font-family: monospace;
  word-break: break-all;
`;