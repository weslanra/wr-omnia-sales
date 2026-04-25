import { SignJWT, decodeJwt, jwtVerify } from 'jose';
type JWTConfig = {
    expirationTime: number | string | Date
}

export default class JWT {
  // Chave secreta usada para assinar o token (HS256)
  secret = new TextEncoder().encode('');
  config: JWTConfig = {
    expirationTime: '2h'
  }

  constructor(secret: Uint8Array, config?: JWTConfig) {
    this.secret = secret;

    if(config) this.config = config;
  }

  async generate(payload: any) {
  
    // Cria e assina o JWT
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt() // Hora em que o token foi emitido
      .setExpirationTime(this.config.expirationTime)
      .setAudience('omnia-erp')
      .setIssuer('localhost:5173')
      .sign(this.secret);
  
    return jwt;
  }
  
  async verify(token: string) {
    try {
      const { payload, protectedHeader } = await jwtVerify(token, this.secret);
      
      return { payload, protectedHeader };
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  }
  
  async decode(token: string): Promise<unknown | null> {
    try {
      const payload: unknown | null = decodeJwt(token);
      return payload;
    } catch (error) {
      console.error('JWT decoding failed:', error);
      return null;
    }
  }
}

