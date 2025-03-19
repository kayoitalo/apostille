// middleware.ts feita pelo claude mas zuada ainda

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize rate limiter if Redis is configured
let rateLimiter: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  
  rateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
    analytics: true,
    prefix: "@upstash/ratelimit",
  });
}

export async function middleware(request: NextRequest) {
  // Health check endpoint
  if (request.nextUrl.pathname === '/api/health') {
    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
  }

  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/') && rateLimiter) {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';
    
    const result = await rateLimiter.limit(`ratelimit_${ip}`);

    if (!result.success) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.reset.toString(),
          'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
        },
      });
    }
  }

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      headers: {
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 