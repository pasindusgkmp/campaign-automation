'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';

// Define a type for your schedule data
interface Schedule {
  schedule_id: number;
  client_id: number;
  country_code: string;
  key_id: number;
  schedule_date: string;
  campaign_title: string;
  campaign_desc: string;
  campaing_id: number;
}

// Add client type
interface Client {
  client_id: number;
  client_name: string;
}

export default function ScrapePage() {
  const [form, setForm] = useState({
    campaign_title: '',
    campaign_desc: '',
    client_id: '',
    country_code: '',
    key_id: '',
    schedule_date: '',
    status: '', // for filtering only
  });

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filtered, setFiltered] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const recordsPerPage = 10;
  const [clients, setClients] = useState<Client[]>([]);
  const [countries, setCountries] = useState<{ country_code: string, country_name: string }[]>([]);
  const [countryFilter, setCountryFilter] = useState('');
  const [keywords, setKeywords] = useState<{ key_id: number, key_name: string }[]>([]);
  const [keywordFilter, setKeywordFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch schedules from the API
  const fetchSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/schedule");
      if (!res.ok) throw new Error("Failed to fetch schedules");
      const data = await res.json();
      // Reverse ONCE and use for both
      const reversed = Array.isArray(data) ? [...data].reverse() : [];
      setSchedules(reversed);
      setFiltered(reversed);
    } catch (err) {
      setError("Failed to fetch schedules");
    } finally {
      setLoading(false);
    }
  };

  // Fetch clients for dropdown
  useEffect(() => {
    fetch('/api/client')
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(() => setClients([]));
  }, []);

  useEffect(() => {
    fetch('/api/country')
      .then(res => res.json())
      .then(data => setCountries(data))
      .catch(() => setCountries([]));
  }, []);

  useEffect(() => {
    fetch('/api/keyword')
      .then(res => res.json())
      .then(data => setKeywords(data))
      .catch(() => setKeywords([]));
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Statistics
  const totalCampaigns = schedules.length;
  const activeCampaigns = schedules.filter((c) => getStatus(c.schedule_date) === "Active").length;
  const successRate =
    totalCampaigns === 0
      ? 0
      : Math.round(
          (schedules.filter((c) => getStatus(c.schedule_date) === "Complete").length /
            totalCampaigns) *
            100
        );

  // Status logic
  function getStatus(dateStr: string) {
    const today = new Date();
    const date = new Date(dateStr);
    today.setHours(0,0,0,0);
    date.setHours(0,0,0,0);
    if (date.getTime() === today.getTime()) return "Active";
    if (date.getTime() > today.getTime()) return "Scheduled";
    return "Complete";
  }

  // Handle form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      if (editId) {
        // Update
        const res = await fetch("/api/schedule", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            schedule_id: editId,
            ...form,
            client_id: Number(form.client_id),
            key_id: Number(form.key_id),
          }),
        });
        if (!res.ok) throw new Error("Update failed");
        setMessage("✅ Campaign updated successfully!");
      } else {
        // Create
        const res = await fetch("/api/schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            client_id: Number(form.client_id),
            key_id: Number(form.key_id),
          }),
        });
        if (!res.ok) throw new Error("Submission failed");
        setMessage("✅ Campaign submitted successfully!");
        // Insert the new record at the top of the table immediately
        const result = await res.json();
        if (result && result.data) {
          setSchedules(prev => [result.data, ...prev]);
          setFiltered(prev => [result.data, ...prev]);
        }
      }

      setForm({
        campaign_title: '',
        campaign_desc: '',
        client_id: '',
        country_code: '',
        key_id: '',
        schedule_date: '',
        status: '',
      });
      setEditId(null);
      setShowModal(false);
      await fetchSchedules();
    } catch (err) {
      setMessage("❌ Failed to submit campaign.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setForm({
      campaign_title: schedule.campaign_title,
      campaign_desc: schedule.campaign_desc,
      client_id: String(schedule.client_id),
      country_code: schedule.country_code,
      key_id: String(schedule.key_id),
      schedule_date: schedule.schedule_date.slice(0, 10),
      status: getStatus(schedule.schedule_date),
    });
    setEditId(schedule.schedule_id);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/schedule", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedule_id: id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      await fetchSchedules();
    } catch (err) {
      setMessage("❌ Failed to delete campaign.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered data based on filters
  const filteredData = schedules.filter((c) => {
    const matchesTitle = c.campaign_title.toLowerCase().includes(search.toLowerCase());
    const matchesClient = !form.client_id || String(c.client_id) === form.client_id;
    const matchesCountry = !form.country_code || c.country_code === form.country_code;
    const matchesKeyword = !form.key_id || String(c.key_id) === form.key_id;
    const status = getStatus(c.schedule_date);
    const matchesStatus = !form.status || status === form.status;
    return matchesTitle && matchesClient && matchesCountry && matchesKeyword && matchesStatus;
  });
  const paginated = filteredData.slice((page - 1) * recordsPerPage, page * recordsPerPage);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-[#f7fafd] min-h-screen p-6">
      <div className="max-w-12xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Campaign Statistics</h1>
          <button
            onClick={() => {
              setForm({
                campaign_title: '',
                campaign_desc: '',
                client_id: '',
                country_code: '',
                key_id: '',
                schedule_date: '',
                status: '',
              });
              setEditId(null);
              setShowModal(true);
            }}
            className="bg-gray-900 text-white px-5 py-2 rounded font-semibold shadow hover:bg-gray-700 transition"
          >
            + Add Campaign
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 flex-1 min-w-[250px]">
            <div className="font-semibold mb-2">Campaign Statistics</div>
            <div>
              <b>Total Campaigns:</b> {totalCampaigns}
              <div className="text-xs text-gray-500">Total campaigns created</div>
            </div>
            <div className="mt-2">
              <b>Active Campaigns:</b> {activeCampaigns}
              <div className="text-xs text-gray-500">
                Currently running campaigns
              </div>
            </div>
            <div className="mt-2">
              <b>Success Rate:</b> {successRate}%
              <div className="text-xs text-gray-500">
                % of campaigns completed
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex-1 min-w-[200px]">
            <div className="font-semibold text-lg">Total Campaigns</div>
            <div className="text-3xl font-bold">{totalCampaigns}</div>
            <div className="text-xs text-gray-500">Total campaigns created</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex-1 min-w-[200px]">
            <div className="font-semibold text-lg">Active Campaigns</div>
            <div className="text-3xl font-bold">{activeCampaigns}</div>
            <div className="text-xs text-gray-500">
              Currently running campaigns
            </div>
          </div>
        </div>

        {/* Campaign Management Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Campaign Management Table</h2>
            <div>
              Show{" "}
              <select className="border rounded px-2 py-1">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
            </div>
          </div>
          {/* Add filter row below the table title */}
          <div className="flex flex-wrap gap-2 mb-4">
            <input
              type="text"
              placeholder="Filter by Title"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border px-2 py-1 rounded w-40"
            />
            <select
              value={form.client_id}
              onChange={e => setForm(f => ({ ...f, client_id: e.target.value }))}
              className="border px-2 py-1 rounded w-40"
            >
              <option value="">All Clients</option>
              {clients.map(client => (
                <option key={client.client_id} value={client.client_id}>{client.client_name}</option>
              ))}
            </select>
            <select
              value={form.country_code}
              onChange={e => setForm(f => ({ ...f, country_code: e.target.value }))}
              className="border px-2 py-1 rounded w-40"
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country.country_code} value={country.country_code}>{country.country_name}</option>
              ))}
            </select>
            <Select
              name="key_id_filter"
              value={keywords.find(k => String(k.key_id) === form.key_id) || null}
              onChange={option => setForm(f => ({ ...f, key_id: option ? String(option.key_id) : '' }))}
              options={keywords}
              getOptionLabel={option => option.key_name}
              getOptionValue={option => String(option.key_id)}
              placeholder="All Keywords"
              isClearable
              classNamePrefix="react-select"
              styles={{ container: base => ({ ...base, width: 180 }) }}
            />
            <select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="border px-2 py-1 rounded w-40"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Complete">Complete</option>
            </select>
          </div>
          <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden table-fixed">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border-b">Title</th>
                  <th className="px-4 py-2 border-b">Description</th>
                  <th className="px-4 py-2 border-b">Client</th>
                  <th className="px-4 py-2 border-b">Country</th>
                  <th className="px-4 py-2 border-b">Keyword</th>
                  <th className="px-4 py-2 border-b">Date</th>
                  <th className="px-4 py-2 border-b">Status</th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((schedule) => (
                  <tr key={schedule.schedule_id} className="text-center">
                    <td className="px-4 py-2 border-b">{schedule.campaign_title}</td>
                    <td className="px-4 py-2 border-b">{schedule.campaign_desc}</td>
                    <td className="px-4 py-2 border-b">{clients.find(c => c.client_id === schedule.client_id)?.client_name || schedule.client_id}</td>
                    <td className="px-4 py-2 border-b">{countries.find(c => c.country_code === schedule.country_code)?.country_name || schedule.country_code}</td>
                    <td className="px-4 py-2 border-b">{keywords.find(k => k.key_id === schedule.key_id)?.key_name || schedule.key_id}</td>
                    <td className="px-4 py-2 border-b">{schedule.schedule_date.slice(0, 10)}</td>
                    <td className="px-4 py-2 border-b">{getStatus(schedule.schedule_date)}</td>
                    <td className="px-4 py-2 border-b flex gap-2 justify-center">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => handleEdit(schedule)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(schedule.schedule_id)}
                        disabled={submitting}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {Array.from({ length: recordsPerPage - paginated.length }).map((_, i) => (
                  <tr key={`empty-${i}`} className="text-center">
                    <td colSpan={8} className="px-4 py-2 border-b">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Modal for Add/Edit Campaign */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">
                {editId ? "Edit Campaign" : "Add Campaign"}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="campaign_title"
                  value={form.campaign_title}
                  onChange={handleChange}
                  autoComplete="off"
                  placeholder="Title"
                  className="border px-3 py-2 rounded w-full"
                  required
                />
                <input
                  name="campaign_desc"
                  value={form.campaign_desc}
                  onChange={handleChange}
                  autoComplete="off"
                  placeholder="Description"
                  className="border px-3 py-2 rounded w-full"
                  required
                />
                <select
                  name="client_id"
                  value={form.client_id}
                  onChange={handleChange}
                  className="border px-3 py-2 rounded w-full"
                  required
                  disabled={clients.length === 0}
                >
                  <option value="">{clients.length === 0 ? 'Loading clients...' : 'Select Client'}</option>
                  {clients.map(client => (
                    <option key={client.client_id} value={client.client_id}>
                      {client.client_name}
                    </option>
                  ))}
                </select>
                <select
                  name="country_code"
                  value={form.country_code}
                  onChange={handleChange}
                  className="border px-3 py-2 rounded w-full"
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country.country_code} value={country.country_code}>
                      {country.country_name}
                    </option>
                  ))}
                </select>
                <input
                  name="schedule_date"
                  value={form.schedule_date}
                  onChange={handleChange}
                  autoComplete="off"
                  type="date"
                  className="border px-3 py-2 rounded w-full"
                  required
                />
                <div className="md:col-span-2">
                  <Select
                    name="key_id"
                    value={keywords.find(k => String(k.key_id) === form.key_id) || null}
                    onChange={option => setForm({ ...form, key_id: option ? String(option.key_id) : '' })}
                    options={keywords}
                    getOptionLabel={option => option.key_name}
                    getOptionValue={option => String(option.key_id)}
                    placeholder="Select or search keyword..."
                    isClearable
                    classNamePrefix="react-select"
                  />
                </div>
                <div className="col-span-1 md:col-span-2 flex gap-2 mt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                  >
                    {submitting
                      ? editId
                        ? "Updating..."
                        : "Submitting..."
                      : editId
                      ? "Update"
                      : "Submit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditId(null);
                    }}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded w-full"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              {message && <p className="mt-4 text-lg">{message}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
