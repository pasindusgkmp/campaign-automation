import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  const keywords = await prisma.keyword.findMany({
    select: { key_id: true, key_name: true }
  });
  return NextResponse.json(keywords, { status: 200 });
}