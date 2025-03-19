import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// During development, accept any credentials
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // For development, create a mock user
    const mockUser = {
      id: '1',
      email,
      name: 'Development User',
      role: 'ADMIN',
      company: 'Development Company',
    };

    // Generate JWT token
    const token = sign(
      { userId: mockUser.id, email: mockUser.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return NextResponse.json({
      user: mockUser,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}