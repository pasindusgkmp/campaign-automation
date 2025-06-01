import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const client_id = searchParams.get('client_id');
  const country_code = searchParams.get('country_code');
  const key_id = searchParams.get('key_id');

  // If no params, return all daycount rows
  if (!client_id && !country_code && !key_id) {
    const all = await prisma.daycount.findMany();
    return NextResponse.json(all, { status: 200 });
  }

  // If all three are provided, return the matching row
  if (client_id && country_code && key_id) {
    const daycount = await prisma.daycount.findFirst({
      where: {
        client_id: Number(client_id),
        country_code,
        key_id: Number(key_id),
      },
    });
    return NextResponse.json(daycount, { status: 200 });
  }

  // If only some are provided, return error
  return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
}


