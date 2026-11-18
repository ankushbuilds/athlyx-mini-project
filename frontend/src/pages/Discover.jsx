import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";

import {
    FiSearch,
    FiMapPin,
    FiAward,
    FiUser,
    FiX
} from "react-icons/fi";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Discover = () => {
    const navigate = useNavigate();
    const { t } = useTranslation("public");
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
                "discover.loadError"
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
            t("discover.unknownAthlete")
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
            t("discover.locationNotAdded")
        );
    };


    /* =====================================================
       EXPERIENCE
    ===================================================== */

    const getExperience = (athlete) => {
        const experience =
            athlete.experience ?? 0;

        return t(
            Number(experience) === 1
                ? "discover.experienceOne"
                : "discover.experience",
            { count: experience }
        );
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
                            {t("discover.eyebrow")}
                        </span>

                        <h1>
                            {t("discover.title")}
                            <span>{t("discover.titleSecondLine")}</span>
                        </h1>

                        <p>
                            {t("discover.intro")}
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
                                placeholder={t("discover.searchAthlete")}
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
                                    {t("discover.allSports")}
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
                                placeholder={t("discover.searchLocation")}
                            />

                        </div>


                        {/* SEARCH BUTTON */}

                        <button
                            type="submit"
                            className="primary-btn discover-search-btn"
                        >
                            <FiSearch />
                            {t("discover.search")}
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
                                    aria-label={t("discover.clearFilters")}
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
                                {t("discover.availablePlayers")}
                            </span>

                            <h2>
                                {t("discover.athletes")}
                            </h2>

                        </div>


                        {!loading && (

                            <span className="discover-count">

                                {athletes.length}{" "}

                                {athletes.length === 1
                                    ? t("discover.player")
                                    : t("discover.players")}

                            </span>

                        )}

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="discover-error">
                            {t(error, { defaultValue: error })}
                        </div>

                    )}


                    {/* LOADING */}

                    {loading ? (

                        <div className="discover-empty">

                            <div className="discover-empty-icon">
                                <FiSearch />
                            </div>

                            <h3>
                                {t("discover.loadingTitle")}
                            </h3>

                            <p>
                                {t("discover.loadingDescription")}
                            </p>

                        </div>

                    ) : athletes.length === 0 ? (

                        /* EMPTY */

                        <div className="discover-empty">

                            <div className="discover-empty-icon">
                                <FiUser />
                            </div>

                            <h3>
                                {t("discover.emptyTitle")}
                            </h3>

                            <p>
                                {t("discover.emptyDescription")}
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
                                        {t("discover.clearFiltersButton")}
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
                                                {t("discover.available")}
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
                    {t("discover.footerTagline")}
                </p>

                <p>
                    {t("discover.copyright")}
                </p>

            </footer>

        </div>
    );
};

export default Discover;