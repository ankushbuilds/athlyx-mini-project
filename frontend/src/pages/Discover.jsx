import { useState } from "react";
import {
  FiSearch,
  FiMapPin,
  FiUsers,
  FiArrowRight
} from "react-icons/fi";
import AthleteSidebar from "../components/AthleteSidebar";

const Discover = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const people = [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Football Coach",
      location: "Delhi, India",
      sport: "Football"
    },
    {
      id: 2,
      name: "Arjun Verma",
      role: "Cricket Coach",
      location: "Noida, India",
      sport: "Cricket"
    },
    {
      id: 3,
      name: "Vikas Singh",
      role: "Athletics Coach",
      location: "Lucknow, India",
      sport: "Athletics"
    }
  ];

  const filteredPeople = people.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(search.toLowerCase()) ||
      person.role.toLowerCase().includes(search.toLowerCase()) ||
      person.sport.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || person.sport === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="dashboard-layout">
      <AthleteSidebar />

      <main className="discover-page">
        <div className="discover-content">
          <div className="discover-header">
            <div>
              <span className="page-eyebrow">CONNECT • EXPLORE • GROW</span>
              <h1>Discover</h1>
              <p>
                Find coaches, athletes and academies that match your goals.
              </p>
            </div>
          </div>

          <div className="discover-toolbar">
            <div className="discover-search">
              <FiSearch />
              <input
                type="text"
                placeholder="Search people, sports or roles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="discover-filter"
            >
              <option value="All">All Sports</option>
              <option value="Cricket">Cricket</option>
              <option value="Football">Football</option>
              <option value="Athletics">Athletics</option>
            </select>
          </div>

          <div className="discover-section-heading">
            <div>
              <h2>Recommended for you</h2>
              <p>People and professionals you may want to connect with.</p>
            </div>

            <span className="discover-result-count">
              {filteredPeople.length} results
            </span>
          </div>

          <div className="discover-grid">
            {filteredPeople.map((person) => (
              <article className="discover-card" key={person.id}>
                <div className="discover-card-top">
                  <div className="discover-avatar">
                    {person.name.charAt(0)}
                  </div>

                  <span className="discover-sport">
                    {person.sport}
                  </span>
                </div>

                <div className="discover-card-body">
                  <h3>{person.name}</h3>
                  <p className="discover-role">{person.role}</p>

                  <div className="discover-location">
                    <FiMapPin />
                    <span>{person.location}</span>
                  </div>
                </div>

                <button className="discover-card-btn">
                  View Profile
                  <FiArrowRight />
                </button>
              </article>
            ))}
          </div>

          {filteredPeople.length === 0 && (
            <div className="discover-empty">
              <FiUsers />
              <h3>No results found</h3>
              <p>Try changing your search or filter.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Discover;