import { NextRequest } from 'next/server';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import { cache } from 'react';
import { UserService } from '@/services/user.service';

const JWKS_URL = process.env.AUTH_JWKS_URL;

// Cache JWKS for performance
export const getJWKS = cache(async () => {
  if (!JWKS_URL) throw new Error('JWKS URL not configured');
  return createRemoteJWKSet(new URL(JWKS_URL));
});

export async function verifyAuth(req: NextRequest): Promise<string | null> {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return null;

    const JWKS = await getJWKS();
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: process.env.AUTH_ISSUER,
      audience: process.env.AUTH_AUDIENCE,
    });

    const userId = payload.sub as string;
    
    // Verify user exists and is active
    const userService = new UserService();
    const user = await userService.findById(userId);
    if (!user || !user.isActive) {
      return null;
    }

    return userId;
  } catch (error) {
    console.error('Auth verification failed:', error);
    return null;
  }
}