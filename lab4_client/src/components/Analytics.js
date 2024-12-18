import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19B3', '#19FFAF'];

function Analytics({ user }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await axios.get("http://localhost:8080/analytics", {
          headers: { "User-ID": user.id },
        });
        setAnalytics(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Не вдалося завантажити аналітику:", error);
        setLoading(false);
      }
    };

    if (user?.id) {
      loadAnalytics();
    }
  }, [user.id]);

  if (loading) {
    return <div>Завантаження...</div>;
  }

  if (!analytics) {
    return <div>Дані аналітики недоступні.</div>;
  }

  return (
    <div>
      <h2>Аналітика</h2>
      <p><strong>День з найбільшою кількістю покупок:</strong> {analytics.max_day}</p>
      <p><strong>День з найменшою кількістю покупок:</strong> {analytics.min_day}</p>
      <p><strong>Середній чек:</strong> {analytics.average_check?.toFixed(2)} грн</p>
      <p><strong>Медіанний чек:</strong> {analytics.median_check?.toFixed(2)} грн</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {/* Покупки за днями */}
        <div style={{ flex: "1 1 30%", minWidth: "300px" }}>
          <h3>Покупки за днями</h3>
          <BarChart width={300} height={300} data={Object.entries(analytics.day_counts).map(([day, count]) => ({ day, count }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Top 5 Most Popular Items */}
        <div style={{ flex: "1 1 30%", minWidth: "500px" }}>
          <h3>Топ-5 найбільш популярних товарів</h3>
          <PieChart width={700} height={300}>
            <Pie
              data={analytics.most_popular_items}
              dataKey="Count"
              nameKey="Name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={(entry) => `${entry.Name} (${entry.Percentage.toFixed(2)}%)`}
            >
              {analytics.most_popular_items.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>

        {/* Most Commonly Bought Together */}
        <div style={{ flex: "1 1 30%", minWidth: "300px" }}>
          <h3>Топ-5 товарів, які купують разом із {analytics.most_co_occurring}</h3>
          <BarChart width={300} height={300} data={analytics.most_common_combos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Count" fill="#82ca9d" />
          </BarChart>
        </div>

        {/* Top 5 Most Common Combinations */}
        <div style={{ flex: "1 1 30%", minWidth: "300px" }}>
          <h3>Топ-5 найбільш популярних комбінацій товарів</h3>
          <BarChart width={300} height={300} data={analytics.most_common_combos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Count" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Top 5 Least Common Combinations */}
        <div style={{ flex: "1 1 30%", minWidth: "300px" }}>
          <h3>Топ-5 найрідше зустрічаються комбінацій товарів</h3>
          <BarChart width={300} height={300} data={analytics.least_common_combos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Count" fill="#ffc658" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
