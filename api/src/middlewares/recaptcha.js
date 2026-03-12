export const verifyRecaptcha = async (req, res, next) => {
  const { captchaToken } = req.body;

  if (!captchaToken) {
    return res.status(400).json({ error: 'Token do reCAPTCHA não fornecido.' });
  }

  try {
    const secretKey = "6LfC8YAsAAAAAJOA8gZXbSG1Gx6HgEm9QrtKJ_Q3";
    
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: captchaToken,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      return res.status(403).json({ error: 'Falha na validação do reCAPTCHA. Tente novamente.' });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno ao validar o reCAPTCHA.' });
  }
};