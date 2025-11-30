export const jwtConfig = () => ({
  secret: process.env.JWT_SECRET || 'mi_secreto_super_seguro',
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
});
