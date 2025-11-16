import { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { createServer } from "../../store/servers";
import { addSingleImage } from "../../store/aws_images";
import { useHistory } from "react-router-dom";
import discordIcon from "../../../assets/images/discordIcon.svg";
import { validateImageFile, ALLOWED_IMAGE_MIME_TYPES } from "../../utils/fileValidation";

const steps = ["Details", "Icon", "Review"];

const AddServerForm = ({ setShowNewServerModal }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [serverName, setServerName] = useState("");
  const [serverNameErrors, setServerNameErrors] = useState([]);
  const [serverImage, setServerImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [page, setPage] = useState(0);

  const isNameValid = useMemo(() => {
    const trimmed = serverName.trim();
    return trimmed.length >= 3 && trimmed.length <= 20;
  }, [serverName]);

  const progress = useMemo(() => ((page + 1) / steps.length) * 100, [page]);

  useEffect(() => {
    setServerNameErrors([]);
  }, [serverName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newImage;
    if (serverImage) {
      newImage = await dispatch(addSingleImage({ image: serverImage, type: "server" }));
    }
    try {
      await dispatch(
        createServer({ serverName, imageId: newImage ? newImage.id : null })
      );
      history.push("/app");
      setShowNewServerModal(false);
    } catch (err) {
      const newErrors = await err.json();
      newErrors.errors.forEach(() => {});
    }
  };

  const updateFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Clear previous errors
    setFileError(null);

    // Validate file (2MB max for server icons)
    const validation = validateImageFile(file, 2 * 1024 * 1024);
    if (!validation.isValid) {
      setFileError(validation.error);
      // Clear the file input
      e.target.value = "";
      return;
    }

    setServerImage(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      setPreviewImage(reader.result);
    };
  };

  const handleNextButton = () => {
    if (page === 0) {
      const nextErrors = [];
      if (serverName.trim().length < 3)
        nextErrors.push("Server name must be at least 3 characters.");
      if (serverName.trim().length > 20)
        nextErrors.push("Server name must be less than 20 characters.");
      if (nextErrors.length > 0) {
        setServerNameErrors(nextErrors);
        return;
      }
    }
    setPage(page + 1);
  };

  const handleBackButton = () => {
    setPage(page - 1);
  };

  return (
    <div className="w-[min(92vw,30rem)] sm:w-[min(86vw,34rem)]">
      <div className="relative overflow-hidden rounded-[2.2rem] bg-slate-800/95 text-slate-100 shadow-[0_22px_60px_rgba(0,0,0,0.5)] ring-1 ring-slate-700/70 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-6 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute right-4 top-0 h-52 w-52 rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute -bottom-24 left-16 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />
        </div>

        <div className="relative flex flex-col gap-6 p-6 sm:p-8">
          <header className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                  Create server
                </p>
                <h1 className="text-[1.9rem] font-semibold tracking-tight text-slate-100 sm:text-[2.1rem]">
                  Design your community hub
                </h1>
              </div>
              <span className="hidden rounded-full bg-gradient-to-r from-slate-700/90 to-slate-600/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-white/90 shadow-lg sm:inline-flex">
                {page + 1}/{steps.length}
              </span>
            </div>
            <p className="max-w-[24rem] text-sm text-slate-400">
              Give it a distinctive name, upload a custom icon, and review everything before inviting your crew.
            </p>
            <div className="space-y-3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700/80">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 transition-[width] duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium uppercase tracking-[0.3em] text-slate-400/90">
                {steps.map((label, index) => (
                  <div key={label} className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full border text-[0.65rem] ${
                        index === page
                          ? "border-slate-100 bg-slate-100 text-slate-800 shadow-md shadow-slate-900/20"
                          : index < page
                          ? "border-emerald-400/80 bg-emerald-400/15 text-emerald-400"
                          : "border-slate-600 bg-slate-700/70 text-slate-400"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={`hidden text-[0.6rem] tracking-[0.35em] sm:inline ${
                        index === page ? "text-slate-200" : "text-slate-400/80"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </header>

          {serverNameErrors.length > 0 && (
            <div className="rounded-2xl border border-rose-500/50 bg-rose-900/30 p-4 text-sm font-medium text-rose-300 shadow-[0_12px_25px_rgba(244,63,94,0.18)]">
              <ul className="list-disc space-y-1 pl-4 marker:text-rose-400">
                {serverNameErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            {page === 0 && (
              <div className="flex flex-col gap-4">
                <label
                  className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400"
                  htmlFor="serverName"
                >
                  Server name
                </label>
                <div className="relative flex flex-col gap-2">
                  <input
                    placeholder="e.g. Studio Sessions"
                    className="peer w-full rounded-2xl border border-slate-600 bg-slate-700/90 px-5 py-3.5 text-base font-medium text-slate-100 placeholder:text-slate-500 shadow-[0_14px_30px_rgba(0,0,0,0.3)] transition-all focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-500/20"
                    type="text"
                    name="serverName"
                    id="serverName"
                    maxLength="20"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    autoFocus
                  />
                  <span className="absolute inset-y-0 right-4 flex items-center text-xs font-semibold text-slate-400">
                    {serverName.trim().length}/20
                  </span>
                  <p className="text-xs text-slate-400">
                    Keep it short, welcoming, and easy to spot in your server list.
                  </p>
                </div>
              </div>
            )}

            {page === 1 && (
              <div className="flex flex-col gap-4">
                <label className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  Server icon
                </label>
                {fileError && (
                  <div className="rounded-2xl border border-rose-500/50 bg-rose-900/30 p-4 text-sm font-medium text-rose-300 shadow-[0_12px_25px_rgba(244,63,94,0.18)]">
                    <p>{fileError}</p>
                  </div>
                )}
                <label
                  htmlFor="serverImage"
                  className="group relative flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border border-dashed border-slate-600/80 bg-slate-700/60 px-6 py-12 text-center transition-all hover:border-sky-400/70 hover:bg-slate-700/80 shadow-[0_18px_48px_rgba(0,0,0,0.3)]"
                >
                  {previewImage ? (
                    <div className="flex flex-col items-center gap-4 text-slate-300">
                      <img
                        className="h-28 w-28 rounded-3xl border border-slate-600 object-cover shadow-[0_18px_38px_rgba(0,0,0,0.4)]"
                        src={previewImage}
                        alt="Server preview"
                      />
                      <p className="text-sm font-medium text-slate-300">
                        Swap this image for another
                      </p>
                      <p className="text-xs text-slate-400">
                        Looks sharp! Recommended size 256 × 256 px.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-600 bg-slate-700 text-3xl font-semibold text-slate-400 shadow-[0_12px_25px_rgba(0,0,0,0.4)]">
                        +
                      </div>
                      <p className="text-sm font-semibold text-slate-300">
                        Drag & drop or click to upload
                      </p>
                      <p className="text-xs text-slate-400">
                        PNG, JPG, or WEBP up to 2 MB.
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    name="serverImage"
                    id="serverImage"
                    className="hidden"
                    accept={ALLOWED_IMAGE_MIME_TYPES}
                    onChange={updateFile}
                  />
                </label>
              </div>
            )}

            {page === 2 && (
              <div className="flex flex-col gap-6">
                <div className="grid gap-6 rounded-3xl border border-slate-600 bg-slate-700/60 p-6 shadow-[0_24px_50px_rgba(0,0,0,0.4)] sm:grid-cols-[auto,1fr] sm:items-center sm:gap-10">
                  <div className="flex justify-center">
                    <img
                      className="h-24 w-24 rounded-3xl border border-slate-600 object-cover shadow-[0_18px_38px_rgba(0,0,0,0.4)]"
                      src={previewImage ? previewImage : discordIcon}
                      alt="Server icon preview"
                    />
                  </div>
                  <div className="flex flex-col gap-2 text-center sm:text-left">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-slate-400">
                      Preview
                    </p>
                    <h3 className="text-2xl font-semibold text-slate-100">
                      {serverName || "Your new server"}
                    </h3>
                    <p className="text-sm text-slate-400">
                      This is how your space will appear in the switcher. You can always refine it later.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleBackButton}
                disabled={page === 0}
                className="rounded-2xl border border-slate-600/80 bg-slate-700/80 px-5 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-slate-300 transition-all hover:border-slate-500 hover:text-slate-100 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-600"
              >
                Back
              </button>

              {page < steps.length - 1 && (
                <button
                  type="button"
                  onClick={handleNextButton}
                  disabled={page === 0 && !isNameValid}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[0_18px_45px_rgba(79,70,229,0.35)] transition-all hover:shadow-[0_20px_55px_rgba(59,130,246,0.45)] focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                >
                  Next
                </button>
              )}

              {page === steps.length - 1 && (
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[0_18px_45px_rgba(16,185,129,0.35)] transition-all hover:shadow-[0_20px_55px_rgba(5,150,105,0.45)] focus:outline-none focus:ring-4 focus:ring-emerald-200 sm:flex-none"
                >
                  Create Server
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddServerForm;
