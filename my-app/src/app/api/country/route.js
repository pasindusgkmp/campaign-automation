import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  const countries = await prisma.country.findMany({
    select: { country_code: true, country_name: true }
  });
  return NextResponse.json(countries, { status: 200 });
}