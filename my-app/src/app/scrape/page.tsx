// "use client";

// import Image from "next/image";
// import { useEffect, useState } from 'react';

// // Define a type for your schedule data
// interface Schedule {
//   schedule_id: number;
//   client_id: number;
//   country_code: string;
//   key_id: number;
//   schedule_date: string;
//   campaign_title: string;
//   campaign_desc: string;
//   campaing_id: number;
// }

// export default function Home() {
//   const [schedules, setSchedules] = useState<Schedule[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Form state
//   const [form, setForm] = useState({
//     campaign_title: '',
//     campaign_desc: '',
//     client_id: '',
//     country_code: '',
//     key_id: '',
//     schedule_date: '',
//     campaing_id: ''
//   });
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     fetch('/api/schedule')
//       .then(res => {
//         if (!res.ok) throw new Error('Network response was not ok');
//         return res.json();
//       })
//       .then(data => {
//         setSchedules(Array.isArray(data) ? data : []);
//         setLoading(false);
//       })
//       .catch(err => {
//         setError('Failed to fetch schedules');
//         setLoading(false);
//       });
//   }, []);



//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError(null);
//     try {
//       const res = await fetch('/api/schedule', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           campaign_title: form.campaign_title,
//           campaign_desc: form.campaign_desc,
//           client_id: Number(form.client_id),
//           country_code: form.country_code,
//           key_id: Number(form.key_id),
//           schedule_date: form.schedule_date,
//           campaing_id: Number(form.campaing_id)
//         })
//       });
//       if (!res.ok) throw new Error('Failed to submit');
//       const result = await res.json();
//       // Refetch schedules after successful submit
//       const updated = await fetch('/api/schedule');
//       setSchedules(await updated.json());
//       setForm({
//         campaign_title: '',
//         campaign_desc: '',
//         client_id: '',
//         country_code: '',
//         key_id: '',
//         schedule_date: '',
//         campaing_id: ''
//       });
//     } catch (err) {
//       setError('Failed to submit schedule');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="">
//       <main>
//         <h1>Campaign Management</h1>
//         <form onSubmit={handleSubmit} className="mb-8 flex flex-wrap gap-4 items-end">
//           <input name="campaign_title" value={form.campaign_title} onChange={handleChange} placeholder="Title" className="border px-2 py-1 rounded" required />
//           <input name="campaign_desc" value={form.campaign_desc} onChange={handleChange} placeholder="Description" className="border px-2 py-1 rounded" required />
//           <input name="client_id" value={form.client_id} onChange={handleChange} placeholder="Client ID" className="border px-2 py-1 rounded" required type="number" />
//           <input name="country_code" value={form.country_code} onChange={handleChange} placeholder="Country" className="border px-2 py-1 rounded" required />
//           <input name="key_id" value={form.key_id} onChange={handleChange} placeholder="Key ID" className="border px-2 py-1 rounded" required type="number" />
//           <input name="schedule_date" value={form.schedule_date} onChange={handleChange} placeholder="Date (YYYY-MM-DD)" className="border px-2 py-1 rounded" required type="date" />
//           <input name="campaing_id" value={form.campaing_id} onChange={handleChange} placeholder="Campaign ID" className="border px-2 py-1 rounded" required type="number" />
//           <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</button>
//         </form>
//         <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-4 py-2 border-b">Title</th>
//               <th className="px-4 py-2 border-b">Description</th>
//               <th className="px-4 py-2 border-b">Client</th>
//               <th className="px-4 py-2 border-b">Country</th>
//               <th className="px-4 py-2 border-b">Date</th>
//               <th className="px-4 py-2 border-b">Campaign ID</th>
//             </tr>
//           </thead>
//           <tbody>
//             {schedules.map((schedule) => (
//               <tr key={schedule.schedule_id} className="text-center">
//                 <td className="px-4 py-2 border-b">{schedule.campaign_title}</td>
//                 <td className="px-4 py-2 border-b">{schedule.campaign_desc}</td>
//                 <td className="px-4 py-2 border-b">{schedule.client_id}</td>
//                 <td className="px-4 py-2 border-b">{schedule.country_code}</td>
//                 <td className="px-4 py-2 border-b">{schedule.schedule_date.slice(0, 10)}</td>
//                 <td className="px-4 py-2 border-b">{schedule.campaing_id}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </main>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';

export default function Home() {
  const [form, setForm] = useState({
    campaign_title: '',
    campaign_desc: '',
    client_id: '',
    country_code: '',
    key_id: '',
    schedule_date: '',
    campaing_id: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_title: form.campaign_title,
          campaign_desc: form.campaign_desc,
          client_id: Number(form.client_id),
          country_code: form.country_code,
          key_id: Number(form.key_id),
          schedule_date: form.schedule_date,
          campaing_id: Number(form.campaing_id)
        })
      });

      if (!res.ok) throw new Error('Submission failed');
      setMessage('✅ Campaign submitted successfully!');

      setForm({
        campaign_title: '',
        campaign_desc: '',
        client_id: '',
        country_code: '',
        key_id: '',
        schedule_date: '',
        campaing_id: ''
      });
    } catch (err) {
      setMessage('❌ Failed to submit campaign.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Submit Campaign</h1>

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
        <input name="campaign_title" value={form.campaign_title} onChange={handleChange} placeholder="Title" className="border px-3 py-2 rounded w-full md:w-[48%]" required />
        <input name="campaign_desc" value={form.campaign_desc} onChange={handleChange} placeholder="Description" className="border px-3 py-2 rounded w-full md:w-[48%]" required />
        <input name="client_id" value={form.client_id} onChange={handleChange} placeholder="Client ID" type="number" className="border px-3 py-2 rounded w-full md:w-[30%]" required />
        <input name="country_code" value={form.country_code} onChange={handleChange} placeholder="Country" className="border px-3 py-2 rounded w-full md:w-[30%]" required />
        <input name="key_id" value={form.key_id} onChange={handleChange} placeholder="Key ID" type="number" className="border px-3 py-2 rounded w-full md:w-[30%]" required />
        <input name="schedule_date" value={form.schedule_date} onChange={handleChange} placeholder="Date (YYYY-MM-DD)" type="date" className="border px-3 py-2 rounded w-full md:w-[48%]" required />
        <input name="campaing_id" value={form.campaing_id} onChange={handleChange} placeholder="Campaign ID" type="number" className="border px-3 py-2 rounded w-full md:w-[48%]" required />

        <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded">
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
}
