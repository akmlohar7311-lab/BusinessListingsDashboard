import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./App.css";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4560",
];

function App() {
  const [businesses, setBusinesses] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [sourceData, setSourceData] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 20;

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/businesses")
      .then((res) => setBusinesses(res.data));

    axios
      .get("http://127.0.0.1:8000/city-count")
      .then((res) => setCityData(res.data));

    axios
      .get("http://127.0.0.1:8000/category-count")
      .then((res) => setCategoryData(res.data));

    axios
      .get("http://127.0.0.1:8000/source-count")
      .then((res) => setSourceData(res.data));
  }, []);

  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch = b.business_name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      b.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(
    filteredBusinesses.length / rowsPerPage
  );

  const displayedBusinesses = filteredBusinesses.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="container">

      <h1>Business Listings Dashboard</h1>

      <div className="cards">

        <div className="card">
          <h2>{businesses.length}</h2>
          <p>Total Businesses</p>
        </div>

        <div className="card">
          <h2>{cityData.length}</h2>
          <p>Cities</p>
        </div>

        <div className="card">
          <h2>{categoryData.length}</h2>
          <p>Categories</p>
        </div>

        <div className="card">
          <h2>{sourceData.length}</h2>
          <p>Sources</p>
        </div>

      </div>

      <div className="charts">

        <div className="chart">

          <h2>Businesses by City</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cityData}>
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>

        </div>

        <div className="chart">

          <h2>Businesses by Category</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>

              <Pie
                data={categoryData}
                dataKey="count"
                nameKey="category"
                outerRadius={100}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />

            </PieChart>
          </ResponsiveContainer>

        </div>

      </div>

      <div className="chart">

        <h2>Businesses by Source</h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>

            <Pie
              data={sourceData}
              dataKey="count"
              nameKey="source"
              outerRadius={100}
              label
            >
              {sourceData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />

          </PieChart>
        </ResponsiveContainer>

      </div>

      <div className="controls">

        <input
          type="text"
          placeholder="🔍 Search business..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="All">All Categories</option>

          {categoryData.map((c) => (
            <option
              key={c.category}
              value={c.category}
            >
              {c.category}
            </option>
          ))}

        </select>

      </div>

      <table>

        <thead>

          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>City</th>
            <th>Phone</th>
            <th>Source</th>
          </tr>

        </thead>

        <tbody>

          {displayedBusinesses.map((b) => (

            <tr key={b.id}>
              <td>{b.business_name}</td>
              <td>{b.category}</td>
              <td>{b.city}</td>
              <td>{b.phone || "-"}</td>
              <td>{b.source}</td>
            </tr>

          ))}

        </tbody>

      </table>

      <div className="pagination">

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default App;