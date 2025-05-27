// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// //const prisma = new PrismaClient();

// export async function POST(request) {
//     const body = await request.json();
//     const newSchedule = await prisma.schedule.create({
//     //     data: {
//     //         client_id: Number(body.client_id),
//     //         country_code: body.country_code,
//     //         key_id: Number(body.key_id),
//     //         schedule_date: new Date(body.schedule_date),
//     //         campaign_title: body.campaign_title,
//     //         campaign_desc: body.campaign_desc,
//     //         campaing_id: Number(body.campaing_id)
//     //     }
//     // });

//     data: {
//         client_id: 1,
//         country_code: 'Au',
//         key_id: 1,
//         schedule_date: '2025-09-08',
//         campaign_title: '0527',
//         campaign_desc: 'ss',
//         campaing_id: 1
//     }
// });

//     return NextResponse.json(
//         { message: 'Schedule created successfully', data: newSchedule },
//         { status: 200 }
//     );
// }

// export async function GET() {
//     const schedules = await prisma.schedule.findMany();
//     return NextResponse.json(schedules, { status: 200 });
// }


// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// export async function POST() {
//     const newSchedule = await prisma.schedule.create({
//         data: {
//                     client_id: 1,
//                     country_code: 'Au',
//                     key_id: 1,
//                     schedule_date: '2025-09-08',
//                     campaign_title: '0527',
//                     campaign_desc: 'ss',
//                     campaing_id: 1
//                 }
//     });

//     return NextResponse.json(
//         { message: 'Schedule created successfully', data: newSchedule },
//         { status: 200 }
//         );
// }


import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    // If you want to accept data from the client, uncomment below:
    // const body = await request.json();

    const newSchedule = await prisma.schedule.create({
      data: {
        client_id: 1,
        country_code: 'Au',
        key_id: 1,
        schedule_date: new Date('2025-09-08T00:00:00Z'), // <-- Use Date object or ISO string
        campaign_title: '0527',
        campaign_desc: 'ss',
        campaing_id: 1 // typo matches your schema
      }
    });

    return NextResponse.json(
      { message: 'Schedule created successfully', data: newSchedule },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error creating schedule', error: error.message },
      { status: 500 }
    );
  }
}
