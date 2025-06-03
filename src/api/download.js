export default function handler(req, res) {
  const { timestamp } = req.query;

  if (!timestamp) {
    return res.status(400).json({ error: 'Timestamp parameter is required' });
  }

  try {
    const imageUrl = localStorage.getItem(`comprovante-${timestamp}`);
    
    if (!imageUrl) {
      return res.status(404).json({ error: 'Comprovante não encontrado' });
    }

    // Extrai o base64 da URL
    const base64Data = imageUrl.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Configura os headers para download
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename=comprovante-acai-${timestamp}.png`);
    
    return res.send(buffer);
  } catch (error) {
    console.error('Erro no endpoint de download:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}