import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: "Token inválido (formato incorreto)" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: "Token malformatado" });
  }

  try {
    const secret = process.env.JWT_SECRET || 'sua_chave_secreta_aqui';
    
    const decoded = jwt.verify(token, secret);
    
    req.userId = decoded.id;
    
    return next();
  } catch (err) {
    console.error("[AUTH ERROR]:", err.message);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};