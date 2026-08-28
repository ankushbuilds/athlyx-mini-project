import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

import {
    FiSearch,
    FiMapPin,
    FiAward,
    FiUser,
    FiX
} from "react-icons/fi";

const API = "http://localhost:5000/api";

const Discover = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] =
        useSearchParams();

    const [athletes, setAthletes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState(
        searchParams.get("search") || ""
    );

    const [sport, setSport] = useState(
        searchParams.get("sport") || ""
    );

    const [location, setLocation] = useState(
        searchParams.get("location") || ""
    );

    const [debouncedSearch, setDebouncedSearch] =
        useState(search);

    const [debouncedLocation, setDebouncedLocation] =
        useState(location);


    /* =====================================================
       DEBOUNCE SEARCH
    ===================================================== */

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 350);

        return () => {
            clearTimeout(timer);
        };
    }, [search]);


    /* =====================================================
       DEBOUNCE LOCATION
    ===================================================== */

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedLocation(location);
        }, 350);

        return () => {
            clearTimeout(timer);
        };
    }, [location]);


    /* =====================================================
       FETCH ATHLETES
    ===================================================== */

    const fetchAthletes = async (
        searchValue = search,
        sportValue = sport,
        locationValue = location
    ) => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API}/athletes/get-all`,
                {
                    params: {
                        search:
                            searchValue.trim(),
                        sport:
                            sportValue.trim()
                    }
                }
            );

            const allAthletes =
                response.data?.athletes || [];


            /* =================================================
               ONLY AVAILABLE ATHLETES
            ================================================= */

            const availableAthletes =
                allAthletes.filter(
                    (athlete) =>
                        athlete.isAvailable === true
                );


            /* =================================================
               LOCATION FILTER
            ================================================= */

            const filteredAthletes =
                locationValue.trim()
                    ? availableAthletes.filter(
                        (athlete) => {
                            const city =
                                athlete.address?.city ||
                                "";

                            const state =
                                athlete.address?.state ||
                                "";

                            const searchLocation =
                                locationValue
                                    .trim()
                                    .toLowerCase();

                            return (
                                city
                                    .toLowerCase()
                                    .includes(
                                        searchLocation
                                    ) ||
                                state
                                    .toLowerCase()
                                    .includes(
                                        searchLocation
                                    )
                            );
                        }
                    )
                    : availableAthletes;


            setAthletes(filteredAthletes);

        } catch (error) {
            console.error(
                "Discover Athletes Error:",
                error
            );

            setAthletes([]);

            setError(
                error.response?.data?.message ||
                "Unable to load athletes."
            );
        } finally {
            setLoading(false);
        }
    };


    /* =====================================================
       LIVE SEARCH
    ===================================================== */

    useEffect(() => {
        fetchAthletes(
            debouncedSearch,
            sport,
            debouncedLocation
        );
    }, [
        debouncedSearch,
        debouncedLocation,
        sport
    ]);


    /* =====================================================
       SEARCH BUTTON
    ===================================================== */

    const handleSearch = (event) => {
        event.preventDefault();

        fetchAthletes(
            search,
            sport,
            location
        );

        updateUrl(
            search,
            sport,
            location
        );
    };


    /* =====================================================
       UPDATE URL
    ===================================================== */

    const updateUrl = (
        searchValue,
        sportValue,
        locationValue
    ) => {
        const params = {};

        if (searchValue.trim()) {
            params.search =
                searchValue.trim();
        }

        if (sportValue.trim()) {
            params.sport =
                sportValue.trim();
        }

        if (locationValue.trim()) {
            params.location =
                locationValue.trim();
        }

        setSearchParams(params);
    };


    /* =====================================================
       SPORT CHANGE
    ===================================================== */

    const handleSportChange = (event) => {
        const selectedSport =
            event.target.value;

        setSport(selectedSport);

        updateUrl(
            search,
            selectedSport,
            location
        );
    };


    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    const handleClear = () => {
        setSearch("");
        setSport("");
        setLocation("");

        setDebouncedSearch("");
        setDebouncedLocation("");

        setSearchParams({});

        fetchAthletes(
            "",
            "",
            ""
        );
    };


    /* =====================================================
       ATHLETE NAME
    ===================================================== */

    const getAthleteName = (athlete) => {
        return (
            athlete.user?.name ||
            "Unknown Athlete"
        );
    };


    /* =====================================================
       PROFILE IMAGE
    ===================================================== */

    const getProfilePic = (athlete) => {
        return (
            athlete.user?.profilePic ||
            "/default-avatar.png"
        );
    };


    /* =====================================================
       LOCATION
    ===================================================== */

    const getAthleteLocation = (athlete) => {
        const city =
            athlete.address?.city || "";

        const state =
            athlete.address?.state || "";

        if (city && state) {
            return `${city}, ${state}`;
        }

        return (
            city ||
            state ||
            "Location not added"
        );
    };


    /* =====================================================
       EXPERIENCE
    ===================================================== */

    const getExperience = (athlete) => {
        const experience =
            athlete.experience ?? 0;

        return `${experience} ${Number(experience) === 1
                ? "year"
                : "years"
            }`;
    };





    return (
        <div className="discover-page">

            {/* =================================================
                NAVBAR
            ================================================= */}

            <Navbar />


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="discover-main">


                {/* =================================================
                    HEADER
                ================================================= */}

                <section className="discover-header">

                    <div className="discover-header-content">

                        <span className="page-eyebrow">
                            DISCOVER ATHLETES
                        </span>

                        <h1>
                            Find Available
                            <span> Players.</span>
                        </h1>

                        <p>
                            Search and explore athletes
                            who are currently available
                            for new opportunities.
                        </p>

                    </div>

                </section>


                {/* =================================================
                    SEARCH
                ================================================= */}

                <section className="discover-search-section">

                    <form
                        className="discover-search-form"
                        onSubmit={handleSearch}
                    >

                        {/* ATHLETE / SPORT / POSITION */}

                        <div className="discover-search-field">

                            <FiSearch />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search athlete, sport or position..."
                            />

                        </div>


                        {/* SPORT */}

                        <div className="discover-filter-field">

                            <FiAward />

                            <select
                                value={sport}
                                onChange={
                                    handleSportChange
                                }
                            >

                                <option value="">
                                    All Sports
                                </option>

                                <option value="Cricket">
                                    Cricket
                                </option>

                                <option value="Football">
                                    Football
                                </option>

                                <option value="Athletics">
                                    Athletics
                                </option>

                                <option value="Hockey">
                                    Hockey
                                </option>

                                <option value="Basketball">
                                    Basketball
                                </option>

                            </select>

                        </div>


                        {/* LOCATION */}

                        <div className="discover-search-field">

                            <FiMapPin />

                            <input
                                type="text"
                                value={location}
                                onChange={(event) =>
                                    setLocation(
                                        event.target.value
                                    )
                                }
                                placeholder="Search city or state..."
                            />

                        </div>


                        {/* SEARCH BUTTON */}

                        <button
                            type="submit"
                            className="primary-btn discover-search-btn"
                        >
                            <FiSearch />
                            Search
                        </button>


                        {/* CLEAR */}

                        {(search ||
                            sport ||
                            location) && (

                                <button
                                    type="button"
                                    className="discover-clear-btn"
                                    onClick={
                                        handleClear
                                    }
                                    aria-label="Clear filters"
                                >
                                    <FiX />
                                </button>

                            )}

                    </form>

                </section>


                {/* =================================================
                    RESULTS
                ================================================= */}

                <section className="discover-results">

                    <div className="discover-results-header">

                        <div>

                            <span className="page-eyebrow">
                                AVAILABLE PLAYERS
                            </span>

                            <h2>
                                Athletes
                            </h2>

                        </div>


                        {!loading && (

                            <span className="discover-count">

                                {athletes.length}{" "}

                                {athletes.length === 1
                                    ? "Player"
                                    : "Players"}

                            </span>

                        )}

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="discover-error">
                            {error}
                        </div>

                    )}


                    {/* LOADING */}

                    {loading ? (

                        <div className="discover-empty">

                            <div className="discover-empty-icon">
                                <FiSearch />
                            </div>

                            <h3>
                                Finding available players
                            </h3>

                            <p>
                                Please wait while we
                                load athletes from Athlyx.
                            </p>

                        </div>

                    ) : athletes.length === 0 ? (

                        /* EMPTY */

                        <div className="discover-empty">

                            <div className="discover-empty-icon">
                                <FiUser />
                            </div>

                            <h3>
                                No available players found
                            </h3>

                            <p>
                                Try another athlete name,
                                sport or location.
                            </p>

                            {(search ||
                                sport ||
                                location) && (

                                    <button
                                        type="button"
                                        className="primary-btn"
                                        onClick={
                                            handleClear
                                        }
                                    >
                                        Clear Filters
                                    </button>

                                )}

                        </div>

                    ) : (

                        /* ATHLETE GRID */

                        <div className="discover-athlete-grid">

                            {athletes.map(
                                (athlete) => (

                                    <article
                                        className="discover-athlete-card"
                                        key={athlete._id}
                                    >

                                        {/* CARD TOP */}

                                        <div className="discover-card-top">

                                            <div className="discover-athlete-avatar">

                                                <img
                                                    src={getProfilePic(
                                                        athlete
                                                    )}
                                                    alt={getAthleteName(
                                                        athlete
                                                    )}
                                                    onError={(
                                                        event
                                                    ) => {
                                                        event.currentTarget.src =
                                                            "/default-avatar.png";
                                                    }}
                                                />

                                            </div>


                                            <span className="discover-available-badge">
                                                Available
                                            </span>

                                        </div>


                                        {/* INFO */}

                                        <div className="discover-athlete-info">

                                            <h3>
                                                {getAthleteName(
                                                    athlete
                                                )}
                                            </h3>

                                            <span className="discover-athlete-sport">
                                                {athlete.sport}
                                            </span>


                                            <div className="discover-athlete-details">

                                                {/* POSITION */}

                                                {athlete.position && (

                                                    <div>

                                                        <FiUser />

                                                        <span>
                                                            {
                                                                athlete.position
                                                            }
                                                        </span>

                                                    </div>

                                                )}


                                                {/* LOCATION */}

                                                <div>

                                                    <FiMapPin />

                                                    <span>
                                                        {getAthleteLocation(
                                                            athlete
                                                        )}
                                                    </span>

                                                </div>


                                                {/* EXPERIENCE */}

                                                <div>

                                                    <FiAward />

                                                    <span>
                                                        {getExperience(
                                                            athlete
                                                        )}
                                                    </span>

                                                </div>

                                            </div>

                                        </div>


                                    </article>

                                )
                            )}

                        </div>

                    )}

                </section>

            </main>


            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="home-footer">

                <div className="footer-brand">

                    <img
                        src="/logo.png"
                        alt="Athlyx"
                    />

                    <span>
                        Athlyx
                    </span>

                </div>

                <p>
                    Discover Local Talent.
                    Create Opportunities.
                </p>

                <p>
                    © 2026 Athlyx. All rights reserved.
                </p>

            </footer>

        </div>
    );
};

export default Discover;