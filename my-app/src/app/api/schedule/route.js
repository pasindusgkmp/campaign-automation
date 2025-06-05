import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request) {
    const body = await request.json();
    // Check for any campaign on the same date
    const existing = await prisma.schedule.findFirst({
        where: {
            schedule_date: new Date(body.schedule_date),
        },
    });
    if (existing) {
        return NextResponse.json(
            { message: '❌ A campaign is already scheduled on this date.' },
            { status: 400 }
        );
    }
    const newSchedule = await prisma.schedule.create({
        data: {
            client_id: Number(body.client_id),
            country_code: body.country_code,
            key_id: Number(body.key_id),
            schedule_date: new Date(body.schedule_date),
            campaign_title: body.campaign_title,
            campaign_desc: body.campaign_desc,
            download_link: body.download_link || null,
        }
    });

    return NextResponse.json(
        { message: 'Schedule created successfully', data: newSchedule },
        { status: 200 }
    );
}

export async function GET() {
    const schedules = await prisma.schedule.findMany();
    return NextResponse.json(schedules, { status: 200 });
}

export async function PUT(request) {
  const body = await request.json();
  const { schedule_id, ...data } = body;
  // Check for any campaign on the same date (excluding current record)
  const existing = await prisma.schedule.findFirst({
    where: {
      schedule_date: new Date(data.schedule_date),
      NOT: { schedule_id: Number(schedule_id) },
    },
  });
  if (existing) {
    return NextResponse.json(
      { message: '❌ A campaign is already scheduled on this date.' },
      { status: 400 }
    );
  }
  // Ensure schedule_date is a Date object and remove status field
  const { status, ...rest } = data;
  const updateData = {
    ...rest,
    schedule_date: new Date(data.schedule_date),
    download_link: data.download_link || null,
  };
  const updated = await prisma.schedule.update({
    where: { schedule_id: Number(schedule_id) },
    data: updateData,
  });
  return NextResponse.json({ message: "Updated", data: updated }, { status: 200 });
}

export async function DELETE(request) {
  const body = await request.json();
  const { schedule_id } = body;
  await prisma.schedule.delete({
    where: { schedule_id: Number(schedule_id) },
  });
  return NextResponse.json({ message: "Deleted" }, { status: 200 });
}



///////////////Check postman endpoint (database update) //////////////////////


// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// export async function POST(request) {
//   try {
//     // If you want to accept data from the client, uncomment below:
//     // const body = await request.json();

//     const newSchedule = await prisma.schedule.create({
//       data: {
//         client_id: 1,
//         country_code: 'Au',
//         key_id: 1,
//         schedule_date: new Date('2025-09-08T00:00:00Z'), // <-- Use Date object or ISO string
//         campaign_title: '0527',
//         campaign_desc: 'ss',
//         campaing_id: 1 // typo matches your schema
//       }
//     });

//     return NextResponse.json(
//       { message: 'Schedule created successfully', data: newSchedule },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { message: 'Error creating schedule', error: error.message },
//       { status: 500 }
//     );
//   }
// }
