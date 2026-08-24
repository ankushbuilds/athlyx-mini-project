import { useEffect, useRef, useState } from "react";
import axios from "axios";
import AthleteSidebar from "../../components/AthleteSidebar";
import {
    FiAward,
    FiEdit2,
    FiImage,
    FiMoreVertical,
    FiPlus,
    FiTrash2,
    FiUpload,
    FiVideo,
    FiX
} from "react-icons/fi";

const API = "http://localhost:5000/api";

const Showcase = () => {
    const fileInputRef = useRef(null);
    const [posts, setPosts] = useState([]);
    const [isComposerOpen, setIsComposerOpen] = useState(false);
    const [editingPostId, setEditingPostId] = useState(null);
    const [deletePostId, setDeletePostId] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [caption, setCaption] = useState("");
    const [visibility, setVisibility] = useState("public");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const authConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoadingPosts(true);
            setError("");

            const response = await axios.get(
                `${API}/showcase/my-posts`,
                authConfig
            );

            setPosts(response.data.posts || []);
        } catch (error) {
            console.error("Fetch Showcase Posts Error:", error);
            setError(
                error.response?.data?.message ||
                "Failed to load showcase posts."
            );
        } finally {
            setLoadingPosts(false);
        }
    };

    const resetComposer = () => {
        setCaption("");
        setVisibility("public");
        setSelectedFiles([]);
        setEditingPostId(null);
        setIsComposerOpen(false);
        setOpenMenuId(null);
        setError("");
    };

    const openCreatePost = () => {
        setCaption("");
        setVisibility("public");
        setSelectedFiles([]);
        setEditingPostId(null);
        setError("");
        setIsComposerOpen(true);
    };

    const openEditPost = (post) => {
        setCaption(post.caption || "");
        setVisibility(post.visibility || "public");
        setSelectedFiles(post.media || []);
        setEditingPostId(post._id || post.id);
        setError("");
        setIsComposerOpen(true);
        setOpenMenuId(null);
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files || []);

        const validFiles = files.filter(
            (file) =>
                file.type.startsWith("image/") ||
                file.type.startsWith("video/")
        );

        if (validFiles.length !== files.length) {
            setError("Only image and video files are allowed.");
        } else {
            setError("");
        }

        setSelectedFiles((currentFiles) => [
            ...currentFiles,
            ...validFiles
        ]);

        event.target.value = "";
    };

    const removeSelectedFile = (index) => {
        setSelectedFiles((currentFiles) =>
            currentFiles.filter(
                (_, fileIndex) => fileIndex !== index
            )
        );
    };

    const getMediaPreview = (media) => {
        if (typeof media === "string") {
            return {
                url: media,
                type: "image",
                name: "media"
            };
        }

        if (media instanceof File) {
            return {
                url: URL.createObjectURL(media),
                type: media.type.startsWith("video/")
                    ? "video"
                    : "image",
                name: media.name
            };
        }

        return {
            url: media.url,
            type: media.type,
            name: media.name || "Showcase media"
        };
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !caption.trim() &&
            selectedFiles.length === 0
        ) {
            setError(
                "Add a caption or at least one photo/video."
            );
            return;
        }

        try {
            setLoading(true);
            setError("");

            const formData = new FormData();

            formData.append("caption", caption.trim());
            formData.append("visibility", visibility);

            selectedFiles.forEach((file) => {
                if (file instanceof File) {
                    formData.append("media", file);
                }
            });

            let response;

            if (editingPostId) {
                response = await axios.put(
                    `${API}/showcase/update/${editingPostId}`,
                    formData,
                    authConfig
                );
            } else {
                response = await axios.post(
                    `${API}/showcase/create`,
                    formData,
                    authConfig
                );
            }

            if (response.data.success) {
                await fetchPosts();
                resetComposer();
            }
        } catch (error) {
            console.error(
                "Showcase Submit Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to save showcase post."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = (postId) => {
        setDeletePostId(postId);
        setOpenMenuId(null);
        setError("");
    };

    const confirmDeletePost = async () => {
        if (!deletePostId) {
            return;
        }

        try {
            setError("");
            setLoading(true);

            const response = await axios.delete(
                `${API}/showcase/delete/${deletePostId}`,
                authConfig
            );

            if (response.data.success) {
                setPosts((currentPosts) =>
                    currentPosts.filter(
                        (post) =>
                            (post._id || post.id) !== deletePostId
                    )
                );

                setDeletePostId(null);
            }
        } catch (error) {
            console.error(
                "Delete Showcase Post Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to delete showcase post."
            );
        } finally {
            setLoading(false);
        }
    };

    const totalPhotos = posts.reduce(
        (total, post) =>
            total +
            (post.media || []).filter(
                (media) => media.type === "image"
            ).length,
        0
    );

    const totalVideos = posts.reduce(
        (total, post) =>
            total +
            (post.media || []).filter(
                (media) => media.type === "video"
            ).length,
        0
    );

    return (
        <div className="athlete-page-layout">
            <AthleteSidebar />
            <main className="showcase-page">
                <div className="showcase-content">
                    <header className="showcase-header">
                        <div>
                            <span className="page-eyebrow">
                                ATHLETE SHOWCASE
                            </span>
                            <h1>Showcase</h1>
                            <p>
                                Share your achievements,
                                performances, photos and
                                videos with the Athlyx
                                community.
                            </p>
                        </div>
                        <button
                            type="button"
                            className="primary-btn showcase-create-btn"
                            onClick={openCreatePost}
                        >
                            <FiPlus />
                            Create Post
                        </button>
                    </header>

                    {error && !isComposerOpen && !deletePostId && (
                        <div className="showcase-error">
                            {error}
                        </div>
                    )}

                    <section className="showcase-stats">
                        <div className="showcase-stat">
                            <FiImage />
                            <div>
                                <strong>{totalPhotos}</strong>
                                <span>Photos</span>
                            </div>
                        </div>

                        <div className="showcase-stat">
                            <FiVideo />
                            <div>
                                <strong>{totalVideos}</strong>
                                <span>Videos</span>
                            </div>
                        </div>

                        <div className="showcase-stat">
                            <FiAward />
                            <div>
                                <strong>{posts.length}</strong>
                                <span>Posts</span>
                            </div>
                        </div>
                    </section>

                    <section className="showcase-posts-section">
                        <div className="showcase-section-header">
                            <div>
                                <h2>My Posts</h2>
                                <p>
                                    Manage everything you
                                    have shared on Athlyx.
                                </p>
                            </div>

                            <span className="showcase-count">
                                {posts.length}{" "}
                                {posts.length === 1
                                    ? "Post"
                                    : "Posts"}
                            </span>
                        </div>

                        {loadingPosts ? (
                            <div className="showcase-empty">
                                <div className="showcase-empty-icon">
                                    <FiAward />
                                </div>
                                <h3>
                                    Loading your showcase
                                </h3>
                                <p>
                                    Please wait while we
                                    load your posts.
                                </p>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="showcase-empty">
                                <div className="showcase-empty-icon">
                                    <FiAward />
                                </div>
                                <h3>
                                    Your showcase is empty
                                </h3>
                                <p>
                                    Create your first post
                                    and start showcasing
                                    your athletic journey.
                                </p>
                                <button
                                    type="button"
                                    className="primary-btn"
                                    onClick={openCreatePost}
                                >
                                    <FiPlus />
                                    Create Your First Post
                                </button>
                            </div>
                        ) : (
                            <div className="showcase-post-list">
                                {posts.map((post) => {
                                    const postId =
                                        post._id || post.id;

                                    return (
                                        <article
                                            className="showcase-post-card"
                                            key={postId}
                                        >
                                            <div className="showcase-post-top">
                                                <div className="showcase-post-author">
                                                    <div className="showcase-post-avatar">
                                                        <FiAward />
                                                    </div>

                                                    <div>
                                                        <h4>
                                                            {post.athlete?.user?.name ||
                                                                "Unknown Author"}
                                                        </h4>

                                                     
                                                    </div>
                                                </div>

                                                <div className="showcase-post-menu">
                                                    <button
                                                        type="button"
                                                        className="showcase-menu-btn"
                                                        aria-label="Post options"
                                                        onClick={() =>
                                                            setOpenMenuId(
                                                                openMenuId ===
                                                                    postId
                                                                    ? null
                                                                    : postId
                                                            )
                                                        }
                                                    >
                                                        <FiMoreVertical />
                                                    </button>

                                                    {openMenuId ===
                                                        postId && (
                                                        <div className="showcase-menu">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openEditPost(
                                                                        post
                                                                    )
                                                                }
                                                            >
                                                                <FiEdit2 />
                                                                Edit
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="showcase-menu-delete"
                                                                onClick={() =>
                                                                    handleDeletePost(
                                                                        postId
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading
                                                                }
                                                            >
                                                                <FiTrash2 />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {post.caption && (
                                                <p className="showcase-post-caption">
                                                    {post.caption}
                                                </p>
                                            )}

                                            {post.media?.length > 0 && (
                                                <div
                                                    className={`showcase-media-grid showcase-media-count-${Math.min(
                                                        post.media.length,
                                                        4
                                                    )}`}
                                                >
                                                    {post.media.map(
                                                        (
                                                            media,
                                                            index
                                                        ) => (
                                                            <div
                                                                className="showcase-media-item"
                                                                key={`${postId}-${index}`}
                                                            >
                                                                {media.type ===
                                                                    "video" ? (
                                                                    <video
                                                                        src={
                                                                            media.url
                                                                        }
                                                                        controls
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        src={
                                                                            media.url
                                                                        }
                                                                        alt={
                                                                            media.name ||
                                                                            "Showcase media"
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}

                       <div className="showcase-post-footer">
    <span className="showcase-visibility">
        {post.visibility === "public"
            ? "🌍 Public"
            : "🔒 Private"}
    </span>

    <span>
        {new Date(
            post.updatedAt || post.createdAt
        ).toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric"
        })}
    </span>

    <span>
        {post.media?.length || 0}{" "}
        {post.media?.length === 1
            ? "media"
            : "media items"}
    </span>
</div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>

                {isComposerOpen && (
                    <div
                        className="showcase-modal-backdrop"
                        onClick={resetComposer}
                    >
                        <div
                            className="showcase-modal"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >
                            <div className="showcase-modal-header">
                                <div>
                                    <span className="page-eyebrow">
                                        {editingPostId
                                            ? "UPDATE SHOWCASE"
                                            : "NEW SHOWCASE"}
                                    </span>

                                    <h2>
                                        {editingPostId
                                            ? "Update Post"
                                            : "Create Post"}
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    className="showcase-close-btn"
                                    onClick={resetComposer}
                                    aria-label="Close"
                                >
                                    <FiX />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <label className="showcase-form-label">
                                    Caption
                                </label>

                                <textarea
                                    className="showcase-caption-input"
                                    value={caption}
                                    onChange={(event) =>
                                        setCaption(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Share your achievement, training, performance or latest update..."
                                    rows="5"
                                />

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,video/*"
                                    multiple
                                    hidden
                                    onChange={
                                        handleFileChange
                                    }
                                />

                                <div className="showcase-upload-row">
                                    <button
                                        type="button"
                                        className="secondary-btn"
                                        onClick={() =>
                                            fileInputRef.current?.click()
                                        }
                                    >
                                        <FiUpload />
                                        Add Photos / Videos
                                    </button>

                                    <span>
                                        {
                                            selectedFiles.length
                                        }{" "}
                                        {selectedFiles.length ===
                                            1
                                            ? "item"
                                            : "items"}{" "}
                                        selected
                                    </span>
                                </div>

                                {selectedFiles.length > 0 && (
                                    <div className="showcase-selected-media">
                                        {selectedFiles.map(
                                            (
                                                file,
                                                index
                                            ) => {
                                                const media =
                                                    getMediaPreview(
                                                        file
                                                    );

                                                return (
                                                    <div
                                                        className="showcase-selected-item"
                                                        key={`${media.name}-${index}`}
                                                    >
                                                        {media.type ===
                                                            "video" ? (
                                                            <video
                                                                src={
                                                                    media.url
                                                                }
                                                                muted
                                                            />
                                                        ) : (
                                                            <img
                                                                src={
                                                                    media.url
                                                                }
                                                                alt={
                                                                    media.name
                                                                }
                                                            />
                                                        )}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeSelectedFile(
                                                                    index
                                                                )
                                                            }
                                                            aria-label="Remove media"
                                                        >
                                                            <FiX />
                                                        </button>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                )}

                                <div className="showcase-visibility">
                                    <label className="showcase-form-label">
                                        Visibility
                                    </label>

                                    <div className="showcase-visibility-options">
                                        <label
                                            className={
                                                visibility ===
                                                    "public"
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            <input
                                                type="radio"
                                                name="visibility"
                                                value="public"
                                                checked={
                                                    visibility ===
                                                    "public"
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setVisibility(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                            />

                                            <span>🌍</span>

                                            <div>
                                                <strong>
                                                    Public
                                                </strong>

                                                <small>
                                                    Coaches,
                                                    athletes
                                                    and
                                                    academies
                                                    can view
                                                    it.
                                                </small>
                                            </div>
                                        </label>

                                        <label
                                            className={
                                                visibility ===
                                                    "private"
                                                    ? "selected"
                                                    : ""
                                            }
                                        >
                                            <input
                                                type="radio"
                                                name="visibility"
                                                value="private"
                                                checked={
                                                    visibility ===
                                                    "private"
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setVisibility(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                            />

                                            <span>🔒</span>

                                            <div>
                                                <strong>
                                                    Private
                                                </strong>

                                                <small>
                                                    Only you
                                                    can view
                                                    it.
                                                </small>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {error && (
                                    <div className="showcase-error">
                                        {error}
                                    </div>
                                )}

                                <div className="showcase-modal-actions">
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={resetComposer}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="primary-btn"
                                        disabled={loading}
                                    >
                                        {editingPostId ? (
                                            <FiEdit2 />
                                        ) : (
                                            <FiPlus />
                                        )}

                                        {loading
                                            ? editingPostId
                                                ? "Updating..."
                                                : "Publishing..."
                                            : editingPostId
                                                ? "Update Post"
                                                : "Publish Post"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {deletePostId && (
                    <div
                        className="showcase-modal-backdrop"
                        onClick={() => {
                            if (!loading) {
                                setDeletePostId(null);
                            }
                        }}
                    >
                        <div
                            className="showcase-modal showcase-delete-modal"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >
                            <div className="showcase-modal-header">
                                <div>
                                    <span className="page-eyebrow">
                                        DELETE SHOWCASE
                                    </span>

                                    <h2>
                                        Delete Post?
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    className="showcase-close-btn"
                                    onClick={() =>
                                        setDeletePostId(null)
                                    }
                                    disabled={loading}
                                    aria-label="Close"
                                >
                                    <FiX />
                                </button>
                            </div>

                            <div className="showcase-delete-content">
                                <div className="showcase-delete-icon">
                                    <FiTrash2 />
                                </div>

                                <p>
                                    Are you sure you want
                                    to delete this showcase
                                    post?
                                </p>

                                <span>
                                    This action cannot be
                                    undone.
                                </span>
                            </div>

                            {error && (
                                <div className="showcase-error">
                                    {error}
                                </div>
                            )}

                            <div className="showcase-modal-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() =>
                                        setDeletePostId(null)
                                    }
                                    disabled={loading}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="showcase-delete-confirm-btn"
                                    onClick={
                                        confirmDeletePost
                                    }
                                    disabled={loading}
                                >
                                    <FiTrash2 />
                                    {loading
                                        ? "Deleting..."
                                        : "Delete Post"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Showcase;