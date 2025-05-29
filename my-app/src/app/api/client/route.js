import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  const clients = await prisma.client.findMany({
    select: { client_id: true, client_name: true }
  });
  return NextResponse.json(clients, { status: 200 });
}