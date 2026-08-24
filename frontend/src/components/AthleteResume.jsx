import {
    Document,
    Page,
    View,
    Text,
    Image,
    Link,
    StyleSheet
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        paddingTop: 38,
        paddingBottom: 45,
        paddingHorizontal: 42,
        backgroundColor: "#ffffff",
        color: "#202020",
        fontFamily: "Helvetica"
    },

    header: {
        paddingBottom: 18,
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: "#b87333",
        borderBottomStyle: "solid"
    },

    brand: {
        fontSize: 8,
        color: "#b87333",
        letterSpacing: 2,
        fontWeight: "bold",
        marginBottom: 12
    },

    profileRow: {
        flexDirection: "row",
        alignItems: "center"
    },

    profileImage: {
        width: 76,
        height: 76,
        borderRadius: 38,
        objectFit: "cover",
        marginRight: 17
    },

    profilePlaceholder: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: "#eeeeee",
        marginRight: 17
    },

    profileInfo: {
        flex: 1
    },

    name: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#171717",
        marginBottom: 5
    },

    sport: {
        fontSize: 11,
        color: "#444444",
        marginBottom: 5
    },

    location: {
        fontSize: 8.5,
        color: "#777777"
    },

    section: {
        marginBottom: 17
    },

    sectionTitle: {
        fontSize: 9,
        fontWeight: "bold",
        color: "#b87333",
        letterSpacing: 1.2,
        marginBottom: 7,
        textTransform: "uppercase"
    },

    sectionLine: {
        width: 28,
        height: 1.5,
        backgroundColor: "#b87333",
        marginBottom: 8
    },

    bio: {
        fontSize: 9,
        color: "#444444",
        lineHeight: 1.55
    },

    detailsGrid: {
        flexDirection: "row",
        flexWrap: "wrap"
    },

    detailItem: {
        width: "50%",
        marginBottom: 10,
        paddingRight: 12
    },

    detailLabel: {
        fontSize: 7,
        color: "#888888",
        textTransform: "uppercase",
        marginBottom: 3,
        letterSpacing: 0.5
    },

    detailValue: {
        fontSize: 9,
        color: "#222222"
    },

    skillsContainer: {
        flexDirection: "row",
        flexWrap: "wrap"
    },

    skill: {
        fontSize: 8,
        color: "#333333",
        backgroundColor: "#f4f4f4",
        borderWidth: 1,
        borderColor: "#e5e5e5",
        borderStyle: "solid",
        borderRadius: 4,
        paddingVertical: 5,
        paddingHorizontal: 8,
        marginRight: 6,
        marginBottom: 6
    },

    achievement: {
        marginBottom: 10,
        paddingBottom: 9,
        borderBottomWidth: 1,
        borderBottomColor: "#eeeeee",
        borderBottomStyle: "solid"
    },

    achievementLast: {
        marginBottom: 0,
        paddingBottom: 0,
        borderBottomWidth: 0
    },

    achievementHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 4
    },

    achievementTitle: {
        flex: 1,
        fontSize: 9.5,
        fontWeight: "bold",
        color: "#222222",
        paddingRight: 10
    },

    achievementYear: {
        fontSize: 8,
        color: "#b87333",
        fontWeight: "bold"
    },

    achievementDescription: {
        fontSize: 8.5,
        color: "#666666",
        lineHeight: 1.4
    },

    contactGrid: {
        flexDirection: "row",
        flexWrap: "wrap"
    },

    contactItem: {
        width: "50%",
        marginBottom: 8,
        paddingRight: 12
    },

    contactLabel: {
        fontSize: 7,
        color: "#888888",
        textTransform: "uppercase",
        marginBottom: 2,
        letterSpacing: 0.5
    },

    contactValue: {
        fontSize: 8.5,
        color: "#333333"
    },

    link: {
        fontSize: 8.5,
        color: "#333333",
        textDecoration: "none"
    },

    availability: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 7,
        paddingHorizontal: 9,
        backgroundColor: "#f7f7f7",
        borderLeftWidth: 3,
        borderLeftColor: "#b87333",
        borderLeftStyle: "solid"
    },

    availabilityText: {
        fontSize: 8.5,
        color: "#444444"
    },

    footer: {
        position: "absolute",
        left: 42,
        right: 42,
        bottom: 22,
        paddingTop: 7,
        borderTopWidth: 1,
        borderTopColor: "#eeeeee",
        borderTopStyle: "solid",
        flexDirection: "row",
        justifyContent: "space-between"
    },

    footerBrand: {
        fontSize: 7,
        color: "#b87333",
        fontWeight: "bold"
    },

    footerText: {
        fontSize: 7,
        color: "#999999"
    }
});

const getSkills = (skills) => {
    if (Array.isArray(skills)) {
        return skills.filter(Boolean);
    }

    if (typeof skills === "string") {
        return skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean);
    }

    return [];
};

const getLocation = (data) => {
    const address = data?.address || {};

    return [
        data?.city || address.city,
        data?.state || address.state,
        data?.country || address.country
    ]
        .filter(Boolean)
        .join(", ");
};

const getSocialLinks = (data) => {
    return {
        instagram:
            data?.socialLinks?.instagram ||
            data?.instagram ||
            "",

        facebook:
            data?.socialLinks?.facebook ||
            data?.facebook ||
            "",

        youtube:
            data?.socialLinks?.youtube ||
            data?.youtube ||
            ""
    };
};

const formatDate = (date) => {
    if (!date) {
        return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

const formatGender = (gender) => {
    if (!gender) {
        return "";
    }

    return (
        gender.charAt(0).toUpperCase() +
        gender.slice(1)
    );
};

const AthleteResume = ({ data = {} }) => {
    const skills = getSkills(data.skills);
    const location = getLocation(data);
    const socialLinks = getSocialLinks(data);

    const achievements = Array.isArray(data.achievements)
        ? data.achievements
        : [];

    const dateOfBirth = formatDate(data.dateOfBirth);
    const gender = formatGender(data.gender);

    const hasPerformanceData =
        data.experience !== undefined &&
        data.experience !== null &&
        data.experience !== "" ||
        data.height ||
        data.weight ||
        gender ||
        dateOfBirth;

    const hasContactData =
        data.email ||
        data.phone ||
        socialLinks.instagram ||
        socialLinks.facebook ||
        socialLinks.youtube;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.brand}>
                        ATHLYX • ATHLETE RESUME
                    </Text>

                    <View style={styles.profileRow}>
                        {data.profilePic ? (
                            <Image
                                src={data.profilePic}
                                style={styles.profileImage}
                            />
                        ) : (
                            <View
                                style={
                                    styles.profilePlaceholder
                                }
                            />
                        )}

                        <View style={styles.profileInfo}>
                            <Text style={styles.name}>
                                {data.name || "Athlete"}
                            </Text>

                            {(data.sport ||
                                data.position) && (
                                <Text style={styles.sport}>
                                    {[
                                        data.sport,
                                        data.position
                                    ]
                                        .filter(Boolean)
                                        .join(" • ")}
                                </Text>
                            )}

                            {location && (
                                <Text
                                    style={
                                        styles.location
                                    }
                                >
                                    {location}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>

                {data.bio && (
                    <View style={styles.section}>
                        <Text
                            style={styles.sectionTitle}
                        >
                            Profile
                        </Text>

                        <View
                            style={styles.sectionLine}
                        />

                        <Text style={styles.bio}>
                            {data.bio}
                        </Text>
                    </View>
                )}

                {hasPerformanceData && (
                    <View style={styles.section}>
                        <Text
                            style={styles.sectionTitle}
                        >
                            Personal & Performance
                        </Text>

                        <View
                            style={styles.sectionLine}
                        />

                        <View
                            style={styles.detailsGrid}
                        >
                            {dateOfBirth && (
                                <View
                                    style={
                                        styles.detailItem
                                    }
                                >
                                    <Text
                                        style={
                                            styles.detailLabel
                                        }
                                    >
                                        Date of Birth
                                    </Text>

                                    <Text
                                        style={
                                            styles.detailValue
                                        }
                                    >
                                        {dateOfBirth}
                                    </Text>
                                </View>
                            )}

                            {gender && (
                                <View
                                    style={
                                        styles.detailItem
                                    }
                                >
                                    <Text
                                        style={
                                            styles.detailLabel
                                        }
                                    >
                                        Gender
                                    </Text>

                                    <Text
                                        style={
                                            styles.detailValue
                                        }
                                    >
                                        {gender}
                                    </Text>
                                </View>
                            )}

                            {data.experience !==
                                undefined &&
                                data.experience !==
                                    null &&
                                data.experience !==
                                    "" && (
                                    <View
                                        style={
                                            styles.detailItem
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.detailLabel
                                            }
                                        >
                                            Experience
                                        </Text>

                                        <Text
                                            style={
                                                styles.detailValue
                                            }
                                        >
                                            {
                                                data.experience
                                            }{" "}
                                            {Number(
                                                data.experience
                                            ) === 1
                                                ? "Year"
                                                : "Years"}
                                        </Text>
                                    </View>
                                )}

                            {data.height && (
                                <View
                                    style={
                                        styles.detailItem
                                    }
                                >
                                    <Text
                                        style={
                                            styles.detailLabel
                                        }
                                    >
                                        Height
                                    </Text>

                                    <Text
                                        style={
                                            styles.detailValue
                                        }
                                    >
                                        {data.height} cm
                                    </Text>
                                </View>
                            )}

                            {data.weight && (
                                <View
                                    style={
                                        styles.detailItem
                                    }
                                >
                                    <Text
                                        style={
                                            styles.detailLabel
                                        }
                                    >
                                        Weight
                                    </Text>

                                    <Text
                                        style={
                                            styles.detailValue
                                        }
                                    >
                                        {data.weight} kg
                                    </Text>
                                </View>
                            )}

                            {data.sport && (
                                <View
                                    style={
                                        styles.detailItem
                                    }
                                >
                                    <Text
                                        style={
                                            styles.detailLabel
                                        }
                                    >
                                        Primary Sport
                                    </Text>

                                    <Text
                                        style={
                                            styles.detailValue
                                        }
                                    >
                                        {data.sport}
                                    </Text>
                                </View>
                            )}

                            {data.position && (
                                <View
                                    style={
                                        styles.detailItem
                                    }
                                >
                                    <Text
                                        style={
                                            styles.detailLabel
                                        }
                                    >
                                        Position
                                    </Text>

                                    <Text
                                        style={
                                            styles.detailValue
                                        }
                                    >
                                        {data.position}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {skills.length > 0 && (
                    <View style={styles.section}>
                        <Text
                            style={styles.sectionTitle}
                        >
                            Skills
                        </Text>

                        <View
                            style={styles.sectionLine}
                        />

                        <View
                            style={
                                styles.skillsContainer
                            }
                        >
                            {skills.map(
                                (skill, index) => (
                                    <Text
                                        key={`${skill}-${index}`}
                                        style={
                                            styles.skill
                                        }
                                    >
                                        {skill}
                                    </Text>
                                )
                            )}
                        </View>
                    </View>
                )}

                {achievements.length > 0 && (
                    <View
                        style={styles.section}
                        wrap={false}
                    >
                        <Text
                            style={styles.sectionTitle}
                        >
                            Achievements
                        </Text>

                        <View
                            style={styles.sectionLine}
                        />

                        {achievements.map(
                            (
                                achievement,
                                index
                            ) => (
                                <View
                                    key={
                                        achievement._id ||
                                        index
                                    }
                                    style={
                                        index ===
                                        achievements.length -
                                            1
                                            ? [
                                                styles.achievement,
                                                styles.achievementLast
                                            ]
                                            : styles.achievement
                                    }
                                >
                                    <View
                                        style={
                                            styles.achievementHeader
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.achievementTitle
                                            }
                                        >
                                            {achievement.title ||
                                                "Achievement"}
                                        </Text>

                                        {achievement.year && (
                                            <Text
                                                style={
                                                    styles.achievementYear
                                                }
                                            >
                                                {
                                                    achievement.year
                                                }
                                            </Text>
                                        )}
                                    </View>

                                    {achievement.description && (
                                        <Text
                                            style={
                                                styles.achievementDescription
                                            }
                                        >
                                            {
                                                achievement.description
                                            }
                                        </Text>
                                    )}
                                </View>
                            )
                        )}
                    </View>
                )}

                {data.isAvailable !== undefined && (
                    <View style={styles.section}>
                        <Text
                            style={styles.sectionTitle}
                        >
                            Availability
                        </Text>

                        <View
                            style={styles.sectionLine}
                        />

                        <View
                            style={
                                styles.availability
                            }
                        >
                            <Text
                                style={
                                    styles.availabilityText
                                }
                            >
                                {data.isAvailable
                                    ? "Available for opportunities"
                                    : "Currently unavailable for opportunities"}
                            </Text>
                        </View>
                    </View>
                )}

                {hasContactData && (
                    <View style={styles.section}>
                        <Text
                            style={styles.sectionTitle}
                        >
                            Contact
                        </Text>

                        <View
                            style={styles.sectionLine}
                        />

                        <View
                            style={styles.contactGrid}
                        >
                            {data.email && (
                                <View
                                    style={
                                        styles.contactItem
                                    }
                                >
                                    <Text
                                        style={
                                            styles.contactLabel
                                        }
                                    >
                                        Email
                                    </Text>

                                    <Text
                                        style={
                                            styles.contactValue
                                        }
                                    >
                                        {data.email}
                                    </Text>
                                </View>
                            )}

                            {data.phone && (
                                <View
                                    style={
                                        styles.contactItem
                                    }
                                >
                                    <Text
                                        style={
                                            styles.contactLabel
                                        }
                                    >
                                        Phone
                                    </Text>

                                    <Text
                                        style={
                                            styles.contactValue
                                        }
                                    >
                                        {data.phone}
                                    </Text>
                                </View>
                            )}

                            {socialLinks.instagram && (
                                <View
                                    style={
                                        styles.contactItem
                                    }
                                >
                                    <Text
                                        style={
                                            styles.contactLabel
                                        }
                                    >
                                        Instagram
                                    </Text>

                                    <Link
                                        src={
                                            socialLinks.instagram
                                        }
                                        style={
                                            styles.link
                                        }
                                    >
                                        {
                                            socialLinks.instagram
                                        }
                                    </Link>
                                </View>
                            )}

                            {socialLinks.facebook && (
                                <View
                                    style={
                                        styles.contactItem
                                    }
                                >
                                    <Text
                                        style={
                                            styles.contactLabel
                                        }
                                    >
                                        Facebook
                                    </Text>

                                    <Link
                                        src={
                                            socialLinks.facebook
                                        }
                                        style={
                                            styles.link
                                        }
                                    >
                                        {
                                            socialLinks.facebook
                                        }
                                    </Link>
                                </View>
                            )}

                            {socialLinks.youtube && (
                                <View
                                    style={
                                        styles.contactItem
                                    }
                                >
                                    <Text
                                        style={
                                            styles.contactLabel
                                        }
                                    >
                                        YouTube
                                    </Text>

                                    <Link
                                        src={
                                            socialLinks.youtube
                                        }
                                        style={
                                            styles.link
                                        }
                                    >
                                        {
                                            socialLinks.youtube
                                        }
                                    </Link>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                <View style={styles.footer} fixed>
                    <Text style={styles.footerBrand}>
                        ATHLYX
                    </Text>

                    <Text style={styles.footerText}>
                        Athlete Profile Resume
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default AthleteResume;