import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../../context/LangContext";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export function StoryInput({ onSubmit }: { onSubmit: (text: string) => void }) {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showResources, setShowResources] = useState(false);
  const [flagWarning, setFlagWarning] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function execCmd(cmd: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
  }

  function handleImageInsert(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      editorRef.current?.focus();
      document.execCommand("insertImage", false, reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function close() {
    setOpen(false);
    setTitle("");
    setError(null);
    setShowResources(false);
    setFlagWarning(null);
    if (editorRef.current) editorRef.current.innerHTML = "";
  }

  async function handleSubmit() {
    const body = editorRef.current?.innerText?.trim() ?? "";
    const fullContent = title.trim() ? `${title.trim()}\n\n${body}` : body;

    if (fullContent.length < 10) {
      setError("Ali lambo lekhnus na — kamti ma 10 akshar chaincha");
      return;
    }

    setError(null);
    setShowResources(false);
    setFlagWarning(null);
    setSubmitting(true);

    try {
      const res = await fetch(`${API}/api/stories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: fullContent }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error);
        if (data.showResources) setShowResources(true);
        return;
      }

      if (data.flags?.includes("clinical_language")) {
        setFlagWarning(
          "Tapaaiko kura suneko chha. Yaha hami clinical shabda bhanda mann ko bhasa maa bolchhau — tara tapaaiko feelings valid chhan.",
        );
        return; // keep modal open to show nudge
      }

      onSubmit(fullContent);
      close();
    } catch {
      setError("Server sanga connect huna sakena. Feri try garnus.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Collapsed trigger bar */}
      <button
        id="story-input"
        type="button"
        onClick={() => setOpen(true)}
        className="group w-full flex items-center gap-3 bg-pageBg border border-sand rounded-xl px-4 py-3 text-left hover:border-sand/80 hover:bg-cardWhite transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-himalayan/35 focus-visible:ring-offset-2 focus-visible:ring-offset-pageBg"
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-pageBg text-lg font-light leading-none shadow-sm group-hover:opacity-95 transition-opacity"
          aria-hidden
        >
          +
        </span>
        <span className="text-sm text-textMuted font-sans group-hover:text-textBody transition-colors">
          {lang === 'en' ? "What's on your mind?" : 'Tapaiko katha share garnuhos...'}
        </span>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={close}
          />

          {/* Dialog card */}
          <div className="relative w-full max-w-lg bg-cardWhite rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-sand/40">
              <span className="font-serif text-base text-ink">
                Aafno katha...
              </span>
              <button
                onClick={close}
                className="w-6 h-6 flex items-center justify-center rounded-full text-textMuted hover:text-ink hover:bg-sand/40 transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            {/* Title input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ek line ma — optional"
              maxLength={120}
              className="px-5 py-3 text-sm font-sans text-ink placeholder:text-textMuted/60 bg-transparent border-b border-sand/30 outline-none"
            />

            {/* Toolbar */}
            <div className="flex items-center gap-0.5 px-4 py-2 border-b border-sand/30 bg-feedBg/60">
              <ToolBtn
                onMouseDown={() => execCmd("bold")}
                title="Bold"
                className="font-bold text-sm"
              >
                B
              </ToolBtn>
              <ToolBtn
                onMouseDown={() => execCmd("italic")}
                title="Italic"
                className="italic text-sm"
              >
                I
              </ToolBtn>

              <div className="w-px h-4 bg-sand/60 mx-1" />

              <ToolBtn
                onMouseDown={() => execCmd("insertUnorderedList")}
                title="Bullet list"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                >
                  <circle cx="2" cy="4" r="1.5" />
                  <rect x="5" y="3" width="10" height="2" rx="1" />
                  <circle cx="2" cy="8" r="1.5" />
                  <rect x="5" y="7" width="10" height="2" rx="1" />
                  <circle cx="2" cy="12" r="1.5" />
                  <rect x="5" y="11" width="10" height="2" rx="1" />
                </svg>
              </ToolBtn>
              <ToolBtn
                onMouseDown={() => execCmd("insertOrderedList")}
                title="Numbered list"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                >
                  <text x="0.5" y="5.5" fontSize="5" fontFamily="monospace">
                    1.
                  </text>
                  <rect x="5" y="3" width="10" height="2" rx="1" />
                  <text x="0.5" y="9.5" fontSize="5" fontFamily="monospace">
                    2.
                  </text>
                  <rect x="5" y="7" width="10" height="2" rx="1" />
                  <text x="0.5" y="13.5" fontSize="5" fontFamily="monospace">
                    3.
                  </text>
                  <rect x="5" y="11" width="10" height="2" rx="1" />
                </svg>
              </ToolBtn>

              <div className="w-px h-4 bg-sand/60 mx-1" />

              <ToolBtn
                onMouseDown={() => fileInputRef.current?.click()}
                title="Insert image"
              >
                <svg
                  viewBox="0 0 16 16"
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="2" width="14" height="12" rx="2" />
                  <circle cx="5.5" cy="6" r="1.5" />
                  <path d="M1 11l4-3 3 3 2-2 4 4" />
                </svg>
              </ToolBtn>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageInsert}
              />
            </div>

            {/* Rich text editor */}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              data-placeholder="Aaja mann maa ke chha? Yahaa lekhnus — koi judge gardaina..."
              onPaste={(e) => {
                e.preventDefault();
                const text = e.clipboardData.getData("text/plain");
                document.execCommand("insertText", false, text);
              }}
              className="min-h-[140px] max-h-[260px] overflow-y-auto px-5 py-4 text-sm font-sans text-ink outline-none leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:mt-2 [&_b]:font-bold [&_i]:italic"
            />

            {/* Feedback messages */}
            {(error || showResources || flagWarning) && (
              <div className="px-5 pb-1 space-y-2">
                {error && (
                  <div className="p-2.5 rounded-lg bg-sindoor/10 border border-sindoor/20 text-sindoor text-xs font-sans">
                    {error}
                  </div>
                )}
                {showResources && (
                  <div className="p-3 rounded-lg bg-peach/50 border border-marigold/30 text-ink text-xs font-sans space-y-1">
                    <p className="font-medium">
                      Sahara chahiyo? Yahaa sampark garnus:
                    </p>
                    <ul className="space-y-0.5 text-textBody">
                      <li>
                        Saathi Nepal: <strong>01-4268474</strong>
                      </li>
                      <li>
                        TPO Nepal: <strong>01-4423596</strong>
                      </li>
                      <li>
                        Emergency: <strong>100</strong>
                      </li>
                    </ul>
                    <Link
                      to="/sahara"
                      className="inline-block text-himalayan underline"
                    >
                      Sahara page ma janus →
                    </Link>
                  </div>
                )}
                {flagWarning && (
                  <div className="p-2.5 rounded-lg bg-marigold/10 border border-marigold/20 text-textBody text-xs font-sans">
                    {flagWarning}
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-5 py-4">
              <button
                onClick={close}
                className="text-xs text-textMuted hover:text-ink font-sans transition-colors"
              >
                Chodnus
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-ink text-pageBg rounded-full px-5 py-2 text-xs font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                {submitting ? "Pathaaudai..." : "Share gara"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Small toolbar button helper
function ToolBtn({
  children,
  onMouseDown,
  title,
  className = "",
}: {
  children: React.ReactNode;
  onMouseDown: () => void;
  title: string;
  className?: string;
}) {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown();
      }}
      title={title}
      className={`w-7 h-7 rounded flex items-center justify-center text-textBody hover:bg-sand/60 hover:text-ink transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
