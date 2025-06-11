// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// export async function GET() {
//   const clients = await prisma.client.findMany({
//     select: { client_id: true, client_name: true }
//   });
//   return NextResponse.json(clients, { status: 200 });
// }

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      select: { client_id: true, client_name: true }
    });
    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}