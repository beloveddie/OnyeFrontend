"use client";

import { useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FHIRPatient {
  id: string;
  name: string;
  gender: string;
  birthDate: string;
  age: number;
  address?: string;
  phone?: string;
}

interface FHIRObservation {
  id: string;
  patientId: string;
  type: string;
  value: string;
  unit?: string;
  date: string;
  status: string;
}

interface FHIRCondition {
  id: string;
  patientId: string;
  code: string;
  description: string;
  severity: string;
  onsetDate: string;
}

type FHIRResult = FHIRPatient | FHIRObservation | FHIRCondition;

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FHIRResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [resultType, setResultType] = useState<string>("");
  const [filteredResults, setFilteredResults] = useState<FHIRResult[]>([]);
  
  // Filter states
  const [ageFilter, setAgeFilter] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<string>("");
  const [severityFilter, setSeverityFilter] = useState<string>("");
  const [codeFilter, setCodeFilter] = useState<string>("");

  // Simulated FHIR data
  const simulateFHIRQuery = (searchQuery: string): { type: string; data: FHIRResult[] } => {
    const lowerQuery = searchQuery.toLowerCase();

    // Patient queries
    if (lowerQuery.includes("patient") || lowerQuery.includes("find") || lowerQuery.includes("who")) {
      return {
        type: "patients",
        data: [
          {
            id: "PT001",
            name: "John Smith",
            gender: "Male",
            birthDate: "1985-03-15",
            age: 39,
            address: "123 Main St, Boston, MA",
            phone: "(555) 123-4567",
          },
          {
            id: "PT002",
            name: "Emily Johnson",
            gender: "Female",
            birthDate: "1990-07-22",
            age: 34,
            address: "456 Oak Ave, Cambridge, MA",
            phone: "(555) 234-5678",
          },
          {
            id: "PT003",
            name: "Michael Davis",
            gender: "Male",
            birthDate: "1978-11-08",
            age: 46,
            address: "789 Pine Rd, Somerville, MA",
            phone: "(555) 345-6789",
          },
        ] as FHIRPatient[],
      };
    }

    // Observation/vital queries
    if (lowerQuery.includes("blood pressure") || lowerQuery.includes("observation") || lowerQuery.includes("vital")) {
      return {
        type: "observations",
        data: [
          {
            id: "OBS001",
            patientId: "PT001",
            type: "Blood Pressure",
            value: "120/80",
            unit: "mmHg",
            date: "2024-10-10",
            status: "final",
          },
          {
            id: "OBS002",
            patientId: "PT002",
            type: "Heart Rate",
            value: "72",
            unit: "bpm",
            date: "2024-10-09",
            status: "final",
          },
          {
            id: "OBS003",
            patientId: "PT001",
            type: "Temperature",
            value: "98.6",
            unit: "°F",
            date: "2024-10-10",
            status: "final",
          },
        ] as FHIRObservation[],
      };
    }

    // Condition/diagnosis queries
    if (lowerQuery.includes("condition") || lowerQuery.includes("diagnosis") || lowerQuery.includes("disease")) {
      return {
        type: "conditions",
        data: [
          {
            id: "COND001",
            patientId: "PT001",
            code: "E11",
            description: "Type 2 Diabetes Mellitus",
            severity: "Moderate",
            onsetDate: "2020-05-12",
          },
          {
            id: "COND002",
            patientId: "PT002",
            code: "I10",
            description: "Essential Hypertension",
            severity: "Mild",
            onsetDate: "2022-03-08",
          },
          {
            id: "COND003",
            patientId: "PT003",
            code: "J45.0",
            description: "Asthma",
            severity: "Severe",
            onsetDate: "2015-09-20",
          },
        ] as FHIRCondition[],
      };
    }

    // Default: return patients
    return {
      type: "patients",
      data: [
        {
          id: "PT001",
          name: "John Smith",
          gender: "Male",
          birthDate: "1985-03-15",
          age: 39,
          address: "123 Main St, Boston, MA",
          phone: "(555) 123-4567",
        },
      ] as FHIRPatient[],
    };
  };

  const handleSearch = () => {
    if (!query.trim()) return;

    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const { type, data } = simulateFHIRQuery(query);
      setResults(data);
      setFilteredResults(data);
      setResultType(type);
      setLoading(false);
      // Reset filters
      setAgeFilter("");
      setGenderFilter("");
      setSeverityFilter("");
      setCodeFilter("");
    }, 800);
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...results];

    if (resultType === "patients") {
      const patients = filtered as FHIRPatient[];
      let filteredPatients = patients;

      if (ageFilter) {
        const [min, max] = ageFilter.split("-").map(Number);
        filteredPatients = filteredPatients.filter(p => 
          max ? (p.age >= min && p.age <= max) : p.age >= min
        );
      }

      if (genderFilter) {
        filteredPatients = filteredPatients.filter(p => p.gender === genderFilter);
      }

      setFilteredResults(filteredPatients);
    } else if (resultType === "conditions") {
      const conditions = filtered as FHIRCondition[];
      let filteredConditions = conditions;

      if (codeFilter) {
        filteredConditions = filteredConditions.filter(c => 
          c.code.toLowerCase().includes(codeFilter.toLowerCase())
        );
      }

      if (severityFilter) {
        filteredConditions = filteredConditions.filter(c => c.severity === severityFilter);
      }

      setFilteredResults(filteredConditions);
    } else {
      setFilteredResults(filtered);
    }
  };

  // Apply filters whenever filter values change
  const handleFilterChange = () => {
    applyFilters();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const renderPatient = (patient: FHIRPatient) => (
    <div key={patient.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{patient.name}</h3>
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-teal-100 text-teal-700">
          Patient
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500 text-xs">Patient ID</p>
          <p className="font-medium text-gray-900 mt-1">{patient.id}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Gender</p>
          <p className="font-medium text-gray-900 mt-1">{patient.gender}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Age</p>
          <p className="font-medium text-gray-900 mt-1">{patient.age} years</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Birth Date</p>
          <p className="font-medium text-gray-900 mt-1">{patient.birthDate}</p>
        </div>
        {patient.address && (
          <div className="col-span-2">
            <p className="text-gray-500 text-xs">Address</p>
            <p className="font-medium text-gray-900 mt-1">{patient.address}</p>
          </div>
        )}
        {patient.phone && (
          <div>
            <p className="text-gray-500 text-xs">Phone</p>
            <p className="font-medium text-gray-900 mt-1">{patient.phone}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderObservation = (obs: FHIRObservation) => (
    <div key={obs.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{obs.type}</h3>
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
          Observation
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500 text-xs">Observation ID</p>
          <p className="font-medium text-gray-900 mt-1">{obs.id}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Patient ID</p>
          <p className="font-medium text-gray-900 mt-1">{obs.patientId}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Value</p>
          <p className="font-medium text-gray-900 mt-1 text-lg">
            {obs.value} {obs.unit}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Date</p>
          <p className="font-medium text-gray-900 mt-1">{obs.date}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Status</p>
          <p className="font-medium text-gray-900 mt-1 capitalize">{obs.status}</p>
        </div>
      </div>
    </div>
  );

  const renderCondition = (cond: FHIRCondition) => (
    <div key={cond.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{cond.description}</h3>
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-rose-100 text-rose-700">
          Condition
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500 text-xs">Condition ID</p>
          <p className="font-medium text-gray-900 mt-1">{cond.id}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Patient ID</p>
          <p className="font-medium text-gray-900 mt-1">{cond.patientId}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Code</p>
          <p className="font-medium text-gray-900 mt-1">{cond.code}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Severity</p>
          <p className="font-medium text-gray-900 mt-1">{cond.severity}</p>
        </div>
        <div className="col-span-2">
          <p className="text-gray-500 text-xs">Onset Date</p>
          <p className="font-medium text-gray-900 mt-1">{cond.onsetDate}</p>
        </div>
      </div>
    </div>
  );

  const renderResult = (result: FHIRResult) => {
    if ("birthDate" in result) {
      return renderPatient(result as FHIRPatient);
    } else if ("value" in result) {
      return renderObservation(result as FHIRObservation);
    } else {
      return renderCondition(result as FHIRCondition);
    }
  };

  // Prepare data for charts
  const prepareChartData = () => {
    const dataToUse = filteredResults.length > 0 ? filteredResults : results;
    
    if (resultType === "patients") {
      const patients = dataToUse as FHIRPatient[];
      // Age distribution
      const ageGroups = patients.reduce((acc: any, p) => {
        const group = p.age < 30 ? "20-29" : p.age < 40 ? "30-39" : p.age < 50 ? "40-49" : "50+";
        acc[group] = (acc[group] || 0) + 1;
        return acc;
      }, {});
      return Object.entries(ageGroups).map(([name, value]) => ({ name, value }));
    } else if (resultType === "observations") {
      const obs = dataToUse as FHIRObservation[];
      return obs.map(o => ({ name: o.type, value: parseFloat(o.value.split('/')[0] || o.value) }));
    } else if (resultType === "conditions") {
      const conds = dataToUse as FHIRCondition[];
      const severityCount = conds.reduce((acc: any, c) => {
        acc[c.severity] = (acc[c.severity] || 0) + 1;
        return acc;
      }, {});
      return Object.entries(severityCount).map(([name, value]) => ({ name, value }));
    }
    return [];
  };

  const COLORS = ['#14B8A6', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899'];

  const renderTable = () => {
    const dataToUse = filteredResults.length > 0 ? filteredResults : results;
    
    if (resultType === "patients") {
      const patients = dataToUse as FHIRPatient[];
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Patient ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Birth Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {patients.map((patient, idx) => (
                <tr key={patient.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.age}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.birthDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (resultType === "observations") {
      const obs = dataToUse as FHIRObservation[];
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Observation ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {obs.map((observation, idx) => (
                <tr key={observation.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{observation.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{observation.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{observation.value} {observation.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{observation.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{observation.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (resultType === "conditions") {
      const conds = dataToUse as FHIRCondition[];
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-rose-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Condition ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Onset Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {conds.map((condition, idx) => (
                <tr key={condition.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{condition.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{condition.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{condition.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{condition.severity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{condition.onsetDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    return null;
  };

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
                  onClick={() => {
                    setQuery("Find all patients");
                    setTimeout(() => {
                      const { type, data } = simulateFHIRQuery("Find all patients");
                      setResults(data);
                      setResultType(type);
                    }, 100);
                  }}
                  className="text-sm px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-full transition-colors font-medium cursor-pointer"
                >
                  Find all patients
                </button>
                <button
                  onClick={() => {
                    setQuery("Show blood pressure observations");
                    setTimeout(() => {
                      const { type, data } = simulateFHIRQuery("Show blood pressure observations");
                      setResults(data);
                      setResultType(type);
                    }, 100);
                  }}
                  className="text-sm px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-full transition-colors font-medium cursor-pointer"
                >
                  Blood pressure
                </button>
                <button
                  onClick={() => {
                    setQuery("List all conditions");
                    setTimeout(() => {
                      const { type, data } = simulateFHIRQuery("List all conditions");
                      setResults(data);
                      setResultType(type);
                    }, 100);
                  }}
                  className="text-sm px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-full transition-colors font-medium cursor-pointer"
                >
                  Conditions
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="max-w-6xl mx-auto mt-12">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Results ({filteredResults.length > 0 ? filteredResults.length : results.length})
                </h2>
                <span className="text-sm text-gray-600 capitalize px-4 py-2 bg-white rounded-full">
                  {resultType}
                </span>
              </div>

              {/* Filters Section */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                </h3>
                
                {resultType === "patients" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Age Range</label>
                      <select
                        value={ageFilter}
                        onChange={(e) => {
                          setAgeFilter(e.target.value);
                          setTimeout(() => applyFilters(), 100);
                        }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer text-gray-900 font-medium bg-white"
                      >
                        <option value="">All Ages</option>
                        <option value="0-29">0-29 years</option>
                        <option value="30-39">30-39 years</option>
                        <option value="40-49">40-49 years</option>
                        <option value="50-100">50+ years</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Gender</label>
                      <select
                        value={genderFilter}
                        onChange={(e) => {
                          setGenderFilter(e.target.value);
                          setTimeout(() => applyFilters(), 100);
                        }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer text-gray-900 font-medium bg-white"
                      >
                        <option value="">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setAgeFilter("");
                          setGenderFilter("");
                          setFilteredResults(results);
                        }}
                        className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                )}

                {resultType === "conditions" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Diagnosis Code</label>
                      <input
                        type="text"
                        value={codeFilter}
                        onChange={(e) => {
                          setCodeFilter(e.target.value);
                          setTimeout(() => applyFilters(), 100);
                        }}
                        placeholder="e.g., E11, I10"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Severity</label>
                      <select
                        value={severityFilter}
                        onChange={(e) => {
                          setSeverityFilter(e.target.value);
                          setTimeout(() => applyFilters(), 100);
                        }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent cursor-pointer text-gray-900 font-medium bg-white"
                      >
                        <option value="">All Severities</option>
                        <option value="Mild">Mild</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Severe">Severe</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setCodeFilter("");
                          setSeverityFilter("");
                          setFilteredResults(results);
                        }}
                        className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors cursor-pointer"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                )}

                {resultType === "observations" && (
                  <p className="text-gray-700 text-base font-medium">No filters available for observations.</p>
                )}
              </div>

              {/* Visualizations */}
              <div className="grid gap-6 md:grid-cols-2 mb-8">
                {/* Bar Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {resultType === "patients" ? "Age Distribution" : resultType === "observations" ? "Observation Values" : "Severity Distribution"}
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={prepareChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#14B8A6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {resultType === "patients" ? "Age Groups" : resultType === "observations" ? "Observation Types" : "Severity Levels"}
                  </h3>
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

              {/* Data Table */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Table</h3>
                {renderTable()}
              </div>

              {/* Card Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                {(filteredResults.length > 0 ? filteredResults : results).map((result) => renderResult(result))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && results.length === 0 && query && (
            <div className="max-w-4xl mx-auto mt-12 text-center py-12 bg-white/60 backdrop-blur-sm rounded-3xl">
              <p className="text-gray-600 text-lg">
                No results found. Try a different query.
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
