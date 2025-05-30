import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import HeaderLogo from '../Header/HeaderLogo';

export default function DownloadPage() {
  const [imageUrl, setImageUrl] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [downloadAttempted, setDownloadAttempted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ts = params.get('download');
    
    if (ts) {
      const url = localStorage.getItem(`comprovante-${ts}`);
      
      if (url) {
        setImageUrl(url);
        setTimestamp(ts);
        
        // Tenta fazer o download apenas uma vez
        if (!downloadAttempted) {
          handleDownload(url, ts);
          setDownloadAttempted(true);
        }
      } else {
        console.error('Comprovante não encontrado no localStorage');
      }
      
      // Limpa a URL após processar
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [downloadAttempted]);

  const handleDownload = (url, ts) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = `comprovante-acai-${ts}.png`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Limpa após um tempo
      setTimeout(() => {
        document.body.removeChild(link);
        // Não remove do localStorage imediatamente - permite novo download
      }, 100);
    } catch (error) {
      console.error('Erro ao baixar comprovante:', error);
    }
  };
  return (
    <>
    <HeaderLogo />
    <DownloadContainer>
      <DownloadBox>
        <h2>Download do Comprovante</h2>
        {imageUrl ? (
          <>
            <p>Seu comprovante está pronto para download.</p>
            <DownloadButton 
              onClick={() => handleDownload(imageUrl, timestamp)}
            >
              Clique aqui para baixar
            </DownloadButton>
            <p style={{fontSize: '0.9rem', color: '#666'}}>
              Se o download não iniciou automaticamente, use o botão acima.
            </p>
          </>
        ) : (
          <>
            <p>Não foi possível encontrar o comprovante.</p>
            <p style={{fontSize: '0.9rem', color: '#666'}}>
              Por favor, verifique se você acessou o link correto ou tente novamente.
            </p>
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