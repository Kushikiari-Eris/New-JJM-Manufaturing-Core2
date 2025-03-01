import jwt from 'jsonwebtoken'

export const gatewayTokenGenerator = () => {
  const payload = { service: "Core 2" };
  return jwt.sign(payload, process.env.GATEWAY_JWT_SECRET, {
    expiresIn: "1hr",
  });
};


