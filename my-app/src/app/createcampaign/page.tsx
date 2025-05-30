'use client';
import React, { useState } from 'react';

const SCRAPE_CAMPAIGN_TITLES = [
  'Spring Sale',
  'Summer Blast',
  'Holiday Promo',
  'Product Launch',
];

const TIMEZONES = [
  'UTC', 'America/New_York', 'Europe/London', 'Asia/Colombo', 'Asia/Kolkata',
];
const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
];

export default function CreateCampaignPage() {
  const [showForm, setShowForm] = useState(false);
  const [section, setSection] = useState(1);
  const [form, setForm] = useState({
    campaignName: '',
    scrapeCampaignTitle: '',
    scheduleDate: '',
  });
  // Sequences state
  const [sequences, setSequences] = useState([
    { delay: '', subject: '', body: '' },
  ]);
  // Setup state
  const [setup, setSetup] = useState<{
    timezone: string;
    minTimeBetweenEmails: string;
    maxLeadsPerDay: string;
    scheduleStartTime: string;
    daysOfWeek: string[];
    startHour: string;
    endHour: string;
  }>({
    timezone: '',
    minTimeBetweenEmails: '',
    maxLeadsPerDay: '',
    scheduleStartTime: '',
    daysOfWeek: [],
    startHour: '',
    endHour: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Sequence handlers
  const handleSequenceChange = (idx: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updated = [...sequences];
    updated[idx][e.target.name as 'delay' | 'subject' | 'body'] = e.target.value;
    setSequences(updated);
  };
  const addSequence = () => setSequences([...sequences, { delay: '', subject: '', body: '' }]);
  const removeSequence = (idx: number) => setSequences(sequences.length > 1 ? sequences.filter((_, i) => i !== idx) : sequences);

  // Setup handlers
  const handleSetupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === 'daysOfWeek' && type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSetup((prev) => ({
        ...prev,
        daysOfWeek: checked
          ? [...prev.daysOfWeek, value]
          : prev.daysOfWeek.filter((d) => d !== value),
      }));
    } else {
      setSetup((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: handle submit logic
    setShowForm(false);
  };

  return (
    <div className="spx-8">
      {/* Header with button */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800"></h1>
        <button
          className="bg-gray-900 text-white px-4 py-2 rounded font-semibold shadow hover:bg-gray-700"
          onClick={() => setShowForm(true)}
        >
          + Add Campaign
        </button>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-gray-200/70 flex items-center justify-center z-50">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-10 relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-2xl font-bold"
              onClick={() => setShowForm(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex justify-center mb-8 gap-4">
              <button
                className={`px-4 py-2 rounded font-semibold transition-all duration-200 ${section === 1 ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setSection(1)}
              >
                1. Campaign Info
              </button>
              <button
                className={`px-4 py-2 rounded font-semibold transition-all duration-200 ${section === 2 ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setSection(2)}
              >
                2. Sequences
              </button>
              <button
                className={`px-4 py-2 rounded font-semibold transition-all duration-200 ${section === 3 ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setSection(3)}
              >
                3. Setup
              </button>
            </div>
            {/* Section Content */}
            {section === 1 && (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <label className="block text-gray-700 font-semibold mb-2">Campaign Name</label>
                    <input
                      type="text"
                      name="campaignName"
                      value={form.campaignName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter campaign name"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-700 font-semibold mb-2">Scrape Campaign Title</label>
                    <select
                      name="scrapeCampaignTitle"
                      value={form.scrapeCampaignTitle}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    >
                      <option value="">Select a title</option>
                      {SCRAPE_CAMPAIGN_TITLES.map((title) => (
                        <option key={title} value={title}>{title}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-6 items-end">
                  <div className="flex-1">
                    <label className="block text-gray-700 font-semibold mb-2">Schedule Date</label>
                    <input
                      type="date"
                      name="scheduleDate"
                      value={form.scheduleDate}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div className="flex-1 flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded text-lg shadow mt-6"
                    >
                      Campaign Create
                    </button>
                  </div>
                </div>
              </form>
            )}
            {section === 2 && (
              <div className="space-y-6">
                {sequences.map((seq, idx) => (
                  <div key={idx} className="border rounded-lg p-4 mb-2 bg-gray-50 relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-700">Sequence {idx + 1}</span>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 text-lg font-bold"
                        onClick={() => removeSequence(idx)}
                        disabled={sequences.length === 1}
                        title="Remove sequence"
                      >
                        &times;
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                      <div>
                        <label className="block text-gray-700 text-sm mb-1">Delay (days)</label>
                        <input
                          type="number"
                          name="delay"
                          value={seq.delay}
                          onChange={e => handleSequenceChange(idx, e)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          min="0"
                          placeholder="0"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm mb-1">Subject</label>
                        <input
                          type="text"
                          name="subject"
                          value={seq.subject}
                          onChange={e => handleSequenceChange(idx, e)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Email subject"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">Email Body</label>
                      <textarea
                        name="body"
                        value={seq.body}
                        onChange={e => handleSequenceChange(idx, e)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        rows={3}
                        placeholder="Email body..."
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded shadow"
                  onClick={addSequence}
                >
                  + Add Sequence
                </button>
              </div>
            )}
            {section === 3 && (
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Setup Timezone</label>
                    <select
                      name="timezone"
                      value={setup.timezone}
                      onChange={handleSetupChange}
                      className="w-full border border-gray-300 rounded px-4 py-2"
                      required
                    >
                      <option value="">Select timezone</option>
                      {TIMEZONES.map(tz => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Min Time Between Emails (minutes)</label>
                    <input
                      type="number"
                      name="minTimeBetweenEmails"
                      value={setup.minTimeBetweenEmails}
                      onChange={handleSetupChange}
                      className="w-full border border-gray-300 rounded px-4 py-2"
                      min="0"
                      placeholder="e.g. 10"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Max Leads Per Day</label>
                    <input
                      type="number"
                      name="maxLeadsPerDay"
                      value={setup.maxLeadsPerDay}
                      onChange={handleSetupChange}
                      className="w-full border border-gray-300 rounded px-4 py-2"
                      min="1"
                      placeholder="e.g. 100"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Schedule Start Time</label>
                    <input
                      type="time"
                      name="scheduleStartTime"
                      value={setup.scheduleStartTime}
                      onChange={handleSetupChange}
                      className="w-full border border-gray-300 rounded px-4 py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2">Setup Days of Week</label>
                    <div className="flex flex-wrap gap-3">
                      {DAYS_OF_WEEK.map(day => (
                        <label key={day} className="flex items-center gap-1 text-gray-700">
                          <input
                            type="checkbox"
                            name="daysOfWeek"
                            value={day}
                            checked={setup.daysOfWeek.includes(day)}
                            onChange={handleSetupChange}
                          />
                          {day}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Setup Start Hour</label>
                    <input
                      type="time"
                      name="startHour"
                      value={setup.startHour}
                      onChange={handleSetupChange}
                      className="w-full border border-gray-300 rounded px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Setup End Hour</label>
                    <input
                      type="time"
                      name="endHour"
                      value={setup.endHour}
                      onChange={handleSetupChange}
                      className="w-full border border-gray-300 rounded px-4 py-2"
                    />
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
