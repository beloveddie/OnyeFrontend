"use client";

import { useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// API Response Types
interface APIResponse {
  query: string;
  generated_code: string;
  result: any[];
  data: {
    type: string | null;
    value: any;
    count: number | null;
    table: {
      columns: string[];
      rows: any[];
      total: number;
    } | null;
    chart: {
      labels: string[];
      datasets: {
        label: string;
        data: number[];
      }[];
    } | null;
    cards: {
      label: string;
      value?: any;
      data?: any;
    }[] | null;
  };
  natural_language_response: string;
  execution_time: number;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [apiResponse, setApiResponse] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  
  // API endpoint - change this to your backend URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch data');
      }

      const data: APIResponse = await response.json();
      setApiResponse(data);
      setError("");
    } catch (err) {
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Cannot connect to the backend API. Please ensure:\n1. The backend is running at ' + API_URL + '\n2. CORS is properly configured on the backend');
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
      setApiResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Render data cards from API response
  const renderDataCards = () => {
    if (!apiResponse?.data?.cards || apiResponse.data.cards.length === 0) return null;

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {apiResponse.data.cards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{card.label}</h3>
              {card.value !== undefined && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-teal-100 text-teal-700">
                  {typeof card.value === 'number' ? card.value : 'Data'}
                </span>
              )}
            </div>
            {card.data && (
              <div className="space-y-2">
                {Object.entries(card.data).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-500 capitalize">{key}:</span>
                    <span className="font-medium text-gray-900">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
            {!card.data && card.value !== undefined && typeof card.value !== 'number' && (
              <p className="text-gray-700 text-sm">{String(card.value)}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render table from API response
  const renderTable = () => {
    if (!apiResponse?.data?.table) return null;

    const { columns, rows } = apiResponse.data.table;

    if (rows.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No data available
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-teal-600 text-white">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                {columns.map((col) => (
                  <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {String(row[col] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Prepare chart data from API response
  const prepareChartData = () => {
    if (!apiResponse?.data?.chart) return [];

    const { labels, datasets } = apiResponse.data.chart;
    
    // For bar chart - use first dataset
    if (datasets.length > 0) {
      return labels.map((label, idx) => ({
        name: label,
        value: datasets[0].data[idx] || 0
      }));
    }

    return [];
  };

  const COLORS = ['#14B8A6', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Header Navigation */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-1">
              <img src="/onye_logo.svg" alt="Onye Logo" className="w-6 h-6 mt-[0.65em]" />
              <span className="text-4xl font-light text-teal-600 tracking-wide leading-none" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 300 }}>onye</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-teal-600 hover:text-teal-700 transition-colors font-medium border-b-2 border-teal-600 pb-1 cursor-pointer">
                Home
              </a>
              <a href="#" className="text-teal-600 hover:text-teal-700 transition-colors font-medium cursor-pointer">
                Products
              </a>
              <a href="#" className="text-teal-600 hover:text-teal-700 transition-colors font-medium cursor-pointer">
                Company
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button className="hidden sm:block px-6 py-2.5 text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-full font-medium transition-colors border border-teal-200 cursor-pointer">
                Visit Directory →
              </button>
              <button className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-medium transition-colors shadow-sm cursor-pointer">
                Login →
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">FHIR Data Query</h2>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask anything about patient records, observations, or conditions..."
                  className="flex-1 px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium rounded-2xl transition-all shadow-md hover:shadow-lg cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500">Quick queries:</span>
                <button
                  onClick={() => setQuery("How many patients do we have?")}
                  className="text-sm px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-full transition-colors font-medium cursor-pointer"
                >
                  All patients
                </button>
                <button
                  onClick={() => setQuery("Show me all female patients")}
                  className="text-sm px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-full transition-colors font-medium cursor-pointer"
                >
                  Female patients
                </button>
                <button
                  onClick={() => setQuery("What are the most common conditions?")}
                  className="text-sm px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-full transition-colors font-medium cursor-pointer"
                >
                  Common conditions
                </button>
                <button
                  onClick={() => setQuery("Show patients with diabetes")}
                  className="text-sm px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-full transition-colors font-medium cursor-pointer"
                >
                  Diabetes patients
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="max-w-4xl mx-auto mt-8">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 mb-1">Error</h3>
                    <p className="text-red-700 whitespace-pre-line">{error}</p>
                    {!error.includes('CORS') && (
                      <p className="text-sm text-red-600 mt-2">
                        Make sure your backend API is running at {API_URL}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {apiResponse && (
            <div className="max-w-6xl mx-auto mt-12">
              {/* Natural Language Response */}
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 shadow-sm border border-teal-100 mb-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-teal-600 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Answer</h3>
                    <p className="text-gray-700 text-base leading-relaxed">{apiResponse.natural_language_response}</p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {apiResponse.execution_time.toFixed(2)}s
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        {apiResponse.data.count || 0} records
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generated Code (Collapsible) */}
              <details className="bg-gray-50 rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
                <summary className="cursor-pointer font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  View Generated Code
                </summary>
                <pre className="mt-4 p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-sm">
                  <code>{apiResponse.generated_code}</code>
                </pre>
              </details>

              {/* Visualizations */}
              {apiResponse.data.chart && prepareChartData().length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 mb-8">
                  {/* Bar Chart */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Bar Chart</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={prepareChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} fontSize={12} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#14B8A6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Pie Chart */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={prepareChartData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent as number * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {prepareChartData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Data Table */}
              {apiResponse.data.table && apiResponse.data.table.rows.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Data Table ({apiResponse.data.table.total} records)
                  </h3>
                  {renderTable()}
                </div>
              )}

              {/* Data Cards */}
              {apiResponse.data.cards && apiResponse.data.cards.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
                  {renderDataCards()}
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!loading && !apiResponse && !error && (
            <div className="max-w-4xl mx-auto mt-12 text-center py-12 bg-white/60 backdrop-blur-sm rounded-3xl">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-600 text-lg">
                Enter a query to get started
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Ask questions about patients, conditions, medications, and observations
              </p>
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>
    </div>
  );
}
