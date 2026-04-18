import rateLimit from 'express-rate-limit';

export const slotsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 15,
  skip: (req) => !!req.headers.authorization,
  message: { error: 'Warning!!! We have received many requests.' },
  standardHeaders: true,
  legacyHeaders: false,
});