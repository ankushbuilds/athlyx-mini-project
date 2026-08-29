import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    FiMessageCircle,
    FiSearch,
    FiSend,
    FiArrowLeft
} from "react-icons/fi";

import AthleteSidebar from "./AthleteSidebar";
import CoachSidebar from "./CoachSidebar";
import "./Messages.css";

const API = "http://localhost:5000/api";

const Messages = () => {
    // ======================================================
    // STATE
    // ======================================================

    const [user, setUser] = useState(null);

    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] =
        useState(null);

    const [messages, setMessages] = useState([]);

    const [search, setSearch] = useState("");
    const [messageText, setMessageText] = useState("");

    const [loadingConversations, setLoadingConversations] =
        useState(true);

    const [loadingMessages, setLoadingMessages] =
        useState(false);

    const [sending, setSending] = useState(false);

    const [error, setError] = useState("");


    // ======================================================
    // GET ID SAFELY
    // ======================================================

    const getId = value => {
        if (!value) {
            return "";
        }

        if (typeof value === "object") {
            if (value._id) {
                return String(value._id);
            }

            if (value.id) {
                return String(value.id);
            }
        }

        return String(value);
    };


    // ======================================================
    // AUTH CONFIG
    // ======================================================

    const getAuthConfig = () => {
        const token = localStorage.getItem("token");

        return {
            headers: {
                Authorization: `Bearer ${token}`
            },
            timeout: 10000
        };
    };


    // ======================================================
    // LOAD LOGGED-IN USER
    // ======================================================

    useEffect(() => {
        try {
            const storedUser =
                localStorage.getItem("user");

            if (!storedUser) {
                setError(
                    "User session not found. Please login again."
                );

                setLoadingConversations(false);
                return;
            }

            const parsedUser =
                JSON.parse(storedUser);

            setUser(parsedUser);

        } catch (error) {
            console.error(
                "Failed to parse logged-in user:",
                error
            );

            setError(
                "Invalid user session. Please login again."
            );

            setLoadingConversations(false);
        }
    }, []);


    // ======================================================
    // FETCH CONVERSATIONS
    // ======================================================

    const fetchConversations = async () => {
        try {
            setLoadingConversations(true);
            setError("");

            const token =
                localStorage.getItem("token");

            if (!token) {
                setError(
                    "Authentication token not found. Please login again."
                );

                return;
            }

            const response =
                await axios.get(
                    `${API}/chat/conversations`,
                    getAuthConfig()
                );

            let conversationData = [];

            if (
                Array.isArray(
                    response.data?.conversations
                )
            ) {
                conversationData =
                    response.data.conversations;
            } else if (
                response.data?.conversation
            ) {
                conversationData = [
                    response.data.conversation
                ];
            }

            setConversations(
                conversationData
            );

        } catch (error) {
            console.error(
                "Fetch conversations error:",
                error
            );

            if (
                error.code ===
                "ECONNABORTED"
            ) {
                setError(
                    "Chat server is taking too long to respond."
                );
            } else if (
                error.response?.status === 401
            ) {
                setError(
                    "Session expired. Please login again."
                );
            } else if (
                error.response?.status === 404
            ) {
                setError(
                    "Chat conversations API route not found."
                );
            } else {
                setError(
                    error.response?.data?.message ||
                    "Failed to load conversations."
                );
            }

        } finally {
            setLoadingConversations(false);
        }
    };


    // ======================================================
    // FETCH AFTER USER LOADS
    // ======================================================

    useEffect(() => {
        if (!user) {
            return;
        }

        const currentUserId =
            getId(user._id || user.id);

        if (!currentUserId) {
            setError(
                "Logged-in user ID is missing."
            );

            setLoadingConversations(false);

            return;
        }

        fetchConversations();

    }, [user]);


    // ======================================================
    // GET OTHER PARTICIPANT
    // ======================================================

    const getOtherParticipant = conversation => {
        if (
            !conversation ||
            !Array.isArray(
                conversation.participants
            ) ||
            !user
        ) {
            return null;
        }

        const currentUserId =
            getId(user._id || user.id);

        const otherParticipant =
            conversation.participants.find(
                participant => {
                    const participantId =
                        getId(participant);

                    return (
                        participantId &&
                        participantId !==
                            currentUserId
                    );
                }
            );

        return (
            otherParticipant || null
        );
    };


    // ======================================================
    // GET UNREAD COUNT
    //
    // Backend should ideally return:
    //
    // unreadCount: 3
    //
    // Fallback:
    // lastMessage.read === false
    // AND lastMessage.receiver === current user
    // ======================================================

    const getUnreadCount = conversation => {
        if (!conversation || !user) {
            return 0;
        }

        const currentUserId =
            getId(user._id || user.id);

        // Preferred backend value
        if (
            typeof conversation.unreadCount ===
            "number"
        ) {
            return conversation.unreadCount;
        }

        const lastMessage =
            conversation.lastMessage;

        if (!lastMessage) {
            return 0;
        }

        const receiverId =
            getId(lastMessage.receiver);

        const isReceivedMessage =
            receiverId === currentUserId;

        const isUnread =
            lastMessage.read === false;

        if (
            isReceivedMessage &&
            isUnread
        ) {
            return 1;
        }

        return 0;
    };


    // ======================================================
    // CHECK UNREAD
    // ======================================================

    const isConversationUnread =
        conversation => {
            return (
                getUnreadCount(
                    conversation
                ) > 0
            );
        };


    // ======================================================
    // FILTER CONVERSATIONS
    // ======================================================

    const filteredConversations =
        useMemo(() => {
            const searchValue =
                search
                    .trim()
                    .toLowerCase();

            return conversations.filter(
                conversation => {
                    const otherUser =
                        getOtherParticipant(
                            conversation
                        );

                    if (!otherUser) {
                        return false;
                    }

                    if (!searchValue) {
                        return true;
                    }

                    return (
                        otherUser.name
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            )
                    );
                }
            );
        }, [
            conversations,
            search,
            user
        ]);


    // ======================================================
    // SELECT CONVERSATION
    // ======================================================

    const handleSelectConversation =
        async conversation => {
            if (!conversation?._id) {
                return;
            }

            // Open selected conversation
            setSelectedConversation(
                conversation
            );

            setMessages([]);
            setError("");

            /*
             * Immediately remove unread UI
             * for this conversation.
             *
             * This makes the UI feel instant,
             * while backend marks actual messages
             * as read.
             */
            setConversations(prev =>
                prev.map(item =>
                    item._id ===
                    conversation._id
                        ? {
                              ...item,
                              unreadCount: 0,
                              lastMessage:
                                  item.lastMessage
                                      ? {
                                            ...item.lastMessage,
                                            read: true
                                        }
                                      : null
                          }
                        : item
                )
            );

            await fetchMessages(
                conversation._id
            );
        };


    // ======================================================
    // FETCH MESSAGES
    // ======================================================

    const fetchMessages =
        async conversationId => {
            try {
                setLoadingMessages(true);
                setError("");

                const response =
                    await axios.get(
                        `${API}/chat/${conversationId}/messages`,
                        getAuthConfig()
                    );

                const fetchedMessages =
                    response.data?.messages ||
                    [];

                setMessages(
                    fetchedMessages
                );

                /*
                 * IMPORTANT:
                 *
                 * Messages are marked read ONLY
                 * after this conversation has
                 * actually been opened.
                 */
                try {
                    await axios.put(
                        `${API}/chat/${conversationId}/read`,
                        {},
                        getAuthConfig()
                    );

                    /*
                     * Update local unread state
                     */
                    setConversations(prev =>
                        prev.map(
                            conversation =>
                                conversation._id ===
                                conversationId
                                    ? {
                                          ...conversation,
                                          unreadCount: 0,
                                          lastMessage:
                                              conversation.lastMessage
                                                  ? {
                                                        ...conversation.lastMessage,
                                                        read: true
                                                    }
                                                  : null
                                      }
                                    : conversation
                        )
                    );

                    /*
                     * Also update currently
                     * selected conversation
                     */
                    setSelectedConversation(
                        prev =>
                            prev
                                ? {
                                      ...prev,
                                      unreadCount: 0,
                                      lastMessage:
                                          prev.lastMessage
                                              ? {
                                                    ...prev.lastMessage,
                                                    read: true
                                                }
                                              : null
                                  }
                                : null
                    );

                } catch (readError) {
                    console.warn(
                        "Mark messages as read failed:",
                        readError
                    );
                }

            } catch (error) {
                console.error(
                    "Fetch messages error:",
                    error
                );

                if (
                    error.code ===
                    "ECONNABORTED"
                ) {
                    setError(
                        "Messages request timed out."
                    );
                } else {
                    setError(
                        error.response?.data
                            ?.message ||
                        "Failed to load messages."
                    );
                }

            } finally {
                setLoadingMessages(false);
            }
        };


    // ======================================================
    // SEND MESSAGE
    // ======================================================

    const handleSendMessage =
        async () => {
            const text =
                messageText.trim();

            if (
                !text ||
                !selectedConversation ||
                sending
            ) {
                return;
            }

            try {
                setSending(true);
                setError("");

                const response =
                    await axios.post(
                        `${API}/chat/${selectedConversation._id}/message`,
                        {
                            text
                        },
                        getAuthConfig()
                    );

                const newMessage =
                    response.data?.message;

                if (newMessage) {
                    /*
                     * Add message to chat
                     */
                    setMessages(prev => [
                        ...prev,
                        newMessage
                    ]);

                    /*
                     * Sender's own message is
                     * obviously not unread.
                     */
                    setConversations(prev =>
                        prev.map(
                            conversation =>
                                conversation._id ===
                                selectedConversation._id
                                    ? {
                                          ...conversation,
                                          lastMessage:
                                              newMessage,
                                          lastMessageAt:
                                              newMessage.createdAt,
                                          unreadCount: 0
                                      }
                                    : conversation
                        )
                    );

                    setSelectedConversation(
                        prev =>
                            prev
                                ? {
                                      ...prev,
                                      lastMessage:
                                          newMessage,
                                      lastMessageAt:
                                          newMessage.createdAt,
                                      unreadCount: 0
                                  }
                                : null
                    );
                }

                setMessageText("");

            } catch (error) {
                console.error(
                    "Send message error:",
                    error
                );

                setError(
                    error.response?.data
                        ?.message ||
                    "Failed to send message."
                );

            } finally {
                setSending(false);
            }
        };


    // ======================================================
    // ENTER TO SEND
    // ======================================================

    const handleKeyDown = event => {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();

            handleSendMessage();
        }
    };


    // ======================================================
    // FORMAT TIME
    // ======================================================

    const formatMessageTime =
        date => {
            if (!date) {
                return "";
            }

            return new Date(
                date
            ).toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );
        };


    // ======================================================
    // LAST MESSAGE
    // ======================================================

    const getLastMessageText =
        conversation => {
            if (
                !conversation?.lastMessage
            ) {
                return "No messages yet";
            }

            return (
                conversation.lastMessage
                    ?.text ||
                ""
            );
        };


    // ======================================================
    // SIDEBAR
    // ======================================================

    const renderSidebar = () => {
        if (
            user?.role ===
            "athlete"
        ) {
            return (
                <AthleteSidebar />
            );
        }

        if (
            user?.role ===
            "coach"
        ) {
            return (
                <CoachSidebar />
            );
        }

        return null;
    };


    // ======================================================
    // USER LOADING
    // ======================================================

    if (!user) {
        return (
            <div className="messages-layout">

                <div className="messages-loading">
                    Loading...
                </div>

            </div>
        );
    }


    // ======================================================
    // SELECTED OTHER USER
    // ======================================================

    const selectedUser =
        getOtherParticipant(
            selectedConversation
        );


    // ======================================================
    // RENDER
    // ======================================================

    return (
        <div className="messages-layout">

            {/* ==================================================
                SIDEBAR
            ================================================== */}

            {renderSidebar()}


            {/* ==================================================
                MAIN CONTENT
            ================================================== */}

            <main className="messages-main">

                <div className="messages-container">

                    {/* ==================================================
                        HEADER
                    ================================================== */}

                    <div className="messages-header">

                        <div>

                            <h1>
                                Messages
                            </h1>

                            <p>
                                Chat with your connected{" "}
                                {user.role ===
                                "athlete"
                                    ? "coaches"
                                    : "athletes"}
                            </p>

                        </div>

                    </div>


                    {/* ==================================================
                        ERROR
                    ================================================== */}

                    {error && (
                        <div className="messages-error">
                            {error}
                        </div>
                    )}


                    {/* ==================================================
                        CHAT CARD
                    ================================================== */}

                    <div
                        className={`messages-card ${
                            selectedConversation
                                ? "chat-selected"
                                : ""
                        }`}
                    >

                        {/* ==================================================
                            CONVERSATION PANEL
                        ================================================== */}

                        <aside className="conversation-panel">

                            {/* SEARCH */}

                            <div className="conversation-search">

                                <FiSearch />

                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    value={search}
                                    onChange={event =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>


                            {/* CONVERSATION LIST */}

                            <div className="conversation-list">

                                {loadingConversations ? (

                                    <div className="conversation-empty">

                                        <FiMessageCircle />

                                        <p>
                                            Loading conversations...
                                        </p>

                                    </div>

                                ) : filteredConversations.length ===
                                  0 ? (

                                    <div className="conversation-empty">

                                        <FiMessageCircle />

                                        <p>
                                            No conversations yet
                                        </p>

                                        <span>
                                            Connect with a{" "}
                                            {user.role ===
                                            "athlete"
                                                ? "coach"
                                                : "athlete"}{" "}
                                            to start chatting.
                                        </span>

                                    </div>

                                ) : (

                                    filteredConversations.map(
                                        conversation => {

                                            const otherUser =
                                                getOtherParticipant(
                                                    conversation
                                                );

                                            if (!otherUser) {
                                                return null;
                                            }

                                            const isSelected =
                                                selectedConversation?._id ===
                                                conversation._id;

                                            const unreadCount =
                                                getUnreadCount(
                                                    conversation
                                                );

                                            const isUnread =
                                                unreadCount >
                                                0;

                                            return (

                                                <button
                                                    type="button"
                                                    key={
                                                        conversation._id
                                                    }
                                                    className={`conversation-item ${
                                                        isSelected
                                                            ? "active"
                                                            : ""
                                                    } ${
                                                        isUnread
                                                            ? "unread"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleSelectConversation(
                                                            conversation
                                                        )
                                                    }
                                                >

                                                    {/* ======================================
                                                        PROFILE IMAGE
                                                    ====================================== */}

                                                    <div className="conversation-avatar">

                                                        {otherUser.profilePic ? (

                                                            <img
                                                                src={
                                                                    otherUser.profilePic
                                                                }
                                                                alt={
                                                                    otherUser.name ||
                                                                    "User"
                                                                }
                                                            />

                                                        ) : (

                                                            <span>
                                                                {otherUser.name
                                                                    ?.charAt(
                                                                        0
                                                                    )
                                                                    ?.toUpperCase() ||
                                                                    "U"}
                                                            </span>

                                                        )}

                                                    </div>


                                                    {/* ======================================
                                                        USER INFO
                                                    ====================================== */}

                                                    <div className="conversation-info">

                                                        <div
                                                            className={`conversation-name ${
                                                                isUnread
                                                                    ? "unread-name"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {otherUser.name ||
                                                                "Unknown User"}
                                                        </div>

                                                        <div
                                                            className={`conversation-preview ${
                                                                isUnread
                                                                    ? "unread-preview"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {getLastMessageText(
                                                                conversation
                                                            )}
                                                        </div>

                                                    </div>


                                                    {/* ======================================
                                                        RIGHT SIDE
                                                    ====================================== */}

                                                    <div className="conversation-meta">

                                                        {conversation.lastMessageAt && (
                                                            <div
                                                                className={`conversation-time ${
                                                                    isUnread
                                                                        ? "unread-time"
                                                                        : ""
                                                                }`}
                                                            >
                                                                {formatMessageTime(
                                                                    conversation.lastMessageAt
                                                                )}
                                                            </div>
                                                        )}


                                                        {/* ==================================
                                                            WHATSAPP STYLE UNREAD BADGE
                                                        ================================== */}

                                                        {isUnread && (
                                                            <span className="unread-badge">
                                                                {unreadCount >
                                                                99
                                                                    ? "99+"
                                                                    : unreadCount}
                                                            </span>
                                                        )}

                                                    </div>

                                                </button>
                                            );
                                        }
                                    )

                                )}

                            </div>

                        </aside>


                        {/* ==================================================
                            CHAT PANEL
                        ================================================== */}

                        <section className="chat-panel">

                            {!selectedConversation ? (

                                <div className="chat-empty">

                                    <div className="chat-empty-icon">
                                        <FiMessageCircle />
                                    </div>

                                    <h2>
                                        Select a conversation
                                    </h2>

                                    <p>
                                        Choose a conversation
                                        from the left to start
                                        chatting.
                                    </p>

                                </div>

                            ) : (

                                <>

                                    {/* ==========================================
                                        CHAT HEADER
                                    ========================================== */}

                                    <div className="chat-header">

                                        <button
                                            type="button"
                                            className="mobile-back-btn"
                                            onClick={() => {
                                                setSelectedConversation(
                                                    null
                                                );

                                                setMessages(
                                                    []
                                                );
                                            }}
                                        >
                                            <FiArrowLeft />
                                        </button>


                                        {/* PROFILE IMAGE */}

                                        <div className="chat-user-avatar">

                                            {selectedUser?.profilePic ? (

                                                <img
                                                    src={
                                                        selectedUser.profilePic
                                                    }
                                                    alt={
                                                        selectedUser.name ||
                                                        "User"
                                                    }
                                                />

                                            ) : (

                                                <span>
                                                    {selectedUser?.name
                                                        ?.charAt(
                                                            0
                                                        )
                                                        ?.toUpperCase() ||
                                                        "U"}
                                                </span>

                                            )}

                                        </div>


                                        {/* USER INFO */}

                                        <div className="chat-user-info">

                                            <h2>
                                                {selectedUser?.name ||
                                                    "Unknown User"}
                                            </h2>

                                            <span>
                                                {selectedUser?.role ===
                                                "coach"
                                                    ? "Coach"
                                                    : "Athlete"}
                                            </span>

                                        </div>

                                    </div>


                                    {/* ==========================================
                                        MESSAGES
                                    ========================================== */}

                                    <div className="chat-messages">

                                        {loadingMessages ? (

                                            <div className="chat-loading">

                                                Loading messages...

                                            </div>

                                        ) : messages.length ===
                                          0 ? (

                                            <div className="chat-no-messages">

                                                <FiMessageCircle />

                                                <p>
                                                    No messages yet.
                                                </p>

                                                <span>
                                                    Start the conversation.
                                                </span>

                                            </div>

                                        ) : (

                                            messages.map(
                                                message => {

                                                    const senderId =
                                                        getId(
                                                            message.sender
                                                        );

                                                    const currentUserId =
                                                        getId(
                                                            user._id ||
                                                            user.id
                                                        );

                                                    const isMine =
                                                        senderId ===
                                                        currentUserId;

                                                    return (

                                                        <div
                                                            key={
                                                                message._id
                                                            }
                                                            className={`message-row ${
                                                                isMine
                                                                    ? "mine"
                                                                    : "received"
                                                            }`}
                                                        >

                                                            <div className="message-bubble">

                                                                <p>
                                                                    {
                                                                        message.text
                                                                    }
                                                                </p>

                                                                <span>
                                                                    {formatMessageTime(
                                                                        message.createdAt
                                                                    )}
                                                                </span>

                                                            </div>

                                                        </div>

                                                    );
                                                }
                                            )

                                        )}

                                    </div>


                                    {/* ==========================================
                                        MESSAGE INPUT
                                    ========================================== */}

                                    <div className="message-input-area">

                                        <textarea
                                            value={
                                                messageText
                                            }
                                            onChange={event =>
                                                setMessageText(
                                                    event.target
                                                        .value
                                                )
                                            }
                                            onKeyDown={
                                                handleKeyDown
                                            }
                                            placeholder="Type a message..."
                                            rows="1"
                                            maxLength="2000"
                                            disabled={
                                                sending
                                            }
                                        />

                                        <button
                                            type="button"
                                            className="send-message-btn"
                                            onClick={
                                                handleSendMessage
                                            }
                                            disabled={
                                                !messageText.trim() ||
                                                sending
                                            }
                                        >

                                            <FiSend />

                                            <span>
                                                {sending
                                                    ? "Sending..."
                                                    : "Send"}
                                            </span>

                                        </button>

                                    </div>

                                </>

                            )}

                        </section>

                    </div>

                </div>

            </main>

        </div>
    );
};

export default Messages;