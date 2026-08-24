import { useState } from "react";
import {
  FiSearch,
  FiMapPin,
  FiCalendar,
  FiBriefcase,
  FiArrowRight
} from "react-icons/fi";
import AthleteSidebar from "../components/AthleteSidebar";

const Opportunities = () => {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const opportunities = [
    {
      id: 1,
      title: "Football Trial Camp",
      organization: "Delhi Sports Academy",
      location: "Delhi, India",
      type: "Trials",
      date: "15 Sep 2026",
      sport: "Football",
      description:
        "Open trials for talented football players looking to join a competitive academy."
    },
    {
      id: 2,
      title: "Cricket Talent Hunt",
      organization: "National Cricket Academy",
      location: "Noida, India",
      type: "Trials",
      date: "22 Sep 2026",
      sport: "Cricket",
      description:
        "Talent identification program for emerging cricket players."
    },
    {
      id: 3,
      title: "Athletics Development Program",
      organization: "Elite Athletics Club",
      location: "Lucknow, India",
      type: "Program",
      date: "01 Oct 2026",
      sport: "Athletics",
      description:
        "Development opportunity for athletes looking to improve performance."
    }
  ];

  const filteredOpportunities = opportunities.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.organization.toLowerCase().includes(search.toLowerCase()) ||
      item.sport.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      type === "All" || item.type === type;

    return matchesSearch && matchesType;
  });

  return (
    <div className="dashboard-layout">
      <AthleteSidebar />

      <main className="opportunities-page">
        <div className="opportunities-content">
          <div className="opportunities-header">
            <div>
              <span className="page-eyebrow">
                FIND • APPLY • ADVANCE
              </span>
              <h1>Opportunities</h1>
              <p>
                Discover trials, programs and opportunities built for athletes.
              </p>
            </div>
          </div>

          <div className="opportunities-toolbar">
            <div className="opportunities-search">
              <FiSearch />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="opportunities-filter"
            >
              <option value="All">All Types</option>
              <option value="Trials">Trials</option>
              <option value="Program">Programs</option>
            </select>
          </div>

          <div className="opportunities-section-heading">
            <div>
              <h2>Latest opportunities</h2>
              <p>Explore opportunities relevant to your sporting journey.</p>
            </div>

            <span className="opportunities-result-count">
              {filteredOpportunities.length} available
            </span>
          </div>

          <div className="opportunities-list">
            {filteredOpportunities.map((item) => (
              <article
                className="opportunity-card"
                key={item.id}
              >
                <div className="opportunity-card-main">
                  <div className="opportunity-icon">
                    <FiBriefcase />
                  </div>

                  <div className="opportunity-info">
                    <div className="opportunity-title-row">
                      <h3>{item.title}</h3>
                      <span className="opportunity-type">
                        {item.type}
                      </span>
                    </div>

                    <p className="opportunity-organization">
                      {item.organization}
                    </p>

                    <p className="opportunity-description">
                      {item.description}
                    </p>

                    <div className="opportunity-meta">
                      <span>
                        <FiMapPin />
                        {item.location}
                      </span>

                      <span>
                        <FiCalendar />
                        {item.date}
                      </span>

                      <span>
                        {item.sport}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="opportunity-card-btn">
                  View Opportunity
                  <FiArrowRight />
                </button>
              </article>
            ))}
          </div>

          {filteredOpportunities.length === 0 && (
            <div className="opportunities-empty">
              <FiBriefcase />
              <h3>No opportunities found</h3>
              <p>Try changing your search or filter.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Opportunities;