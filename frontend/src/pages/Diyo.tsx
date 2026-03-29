import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type Affirmation = {
  id: string
  text: string
  author: string
}

const SEED_COUNT = 4

const DIYOS = [
  {
    id: 'chedchhad',
    label: 'छेडछाड',
    sublabel: 'Sexual Harassment',
    affirmations: [
      { id: 'c1', text: 'Timro galti hoina — kabhi thiena. Timi brave chau bolna sakera.', author: 'Sita, Kathmandu' },
      { id: 'c2', text: 'Timilai vishwas garchhu. Timro awaz matter garchha.', author: 'Priya, Virginia' },
      { id: 'c3', text: 'Jo bhayo tyo timro parichay hoina. Timi usko bhanda badi ho.', author: 'Anita, Pokhara' },
      { id: 'c4', text: 'Bolna saknu nai himmat ho. Proud chhu timilai.', author: 'Maya, New York' },
    ] as Affirmation[],
    pos: { top: '18%', left: '12%' },
    rotate: '-6deg',
  },
  {
    id: 'society',
    label: 'समाजको बोझ',
    sublabel: 'Society Pressure',
    affirmations: [
      { id: 's1', text: 'Timro life timro definition ho. Kasaiko expectations timhro story hoina.', author: 'Deepa, London' },
      { id: 's2', text: 'Log ke sochcha — tyo timle control garna sakdinas, ani garna pardaina pani.', author: 'Rima, Kathmandu' },
      { id: 's3', text: 'Samaj ko mold ma fit huna pardaina. Timi afai ek mold ho.', author: 'Sunita, Texas' },
      { id: 's4', text: 'Afno pace ma hidnu thik ho. Timro khushi ko permission kasaile dina hudaina.', author: 'Puja, Melbourne' },
    ] as Affirmation[],
    pos: { top: '14%', left: '62%' },
    rotate: '5deg',
  },
  {
    id: 'naya-aama',
    label: 'नयाँ आमाको मन',
    sublabel: 'Naya Aama',
    affirmations: [
      { id: 'n1', text: 'Ramri aama banna lai perfect huna pardaina. Timi afaile enough ho.', author: 'Kamala, Lalitpur' },
      { id: 'n2', text: 'Rest linu galat hoina — timro baby lai healthy aama chahieko ho.', author: 'Binita, Canada' },
      { id: 'n3', text: 'Help maagna weakness hoina, wisdom ho. Sab aama help maagchhan.', author: 'Sabina, Chitwan' },
      { id: 'n4', text: 'Timro feelings real chan, valid chan. Koi judge gardaina yahaan.', author: 'Laxmi, Sydney' },
    ] as Affirmation[],
    pos: { top: '58%', left: '20%' },
    rotate: '-3deg',
  },
  {
    id: 'mann-bechain',
    label: 'मन बेचैन',
    sublabel: 'Anxiety',
    affirmations: [
      { id: 'm1', text: 'Ek breath — bas ek breath. Yo moment bitchha, timi strong chau.', author: 'Anjali, Bhaktapur' },
      { id: 'm2', text: 'Chinta le define gardaina timilai. Timro bhanda badi timro katha cha.', author: 'Nisha, Seattle' },
      { id: 'm3', text: 'Bistarai — koi rush chhaina. Aafu sanga gentle hunu thik ho.', author: 'Saru, Biratnagar' },
      { id: 'm4', text: 'Timro pace nai thik pace ho. Aaja ko lagi yeti pugcha.', author: 'Kriti, Toronto' },
    ] as Affirmation[],
    pos: { top: '55%', left: '65%' },
    rotate: '8deg',
  },
]

const AMBIENT = [
  { id: 'a1', pos: { top: '38%', left: '44%' }, rotate: '-2deg', size: 'sm' },
  { id: 'a2', pos: { top: '80%', left: '45%' }, rotate: '4deg', size: 'xs' },
  { id: 'a3', pos: { top: '5%', left: '40%' }, rotate: '-5deg', size: 'xs' },
  { id: 'a4', pos: { top: '75%', left: '8%' }, rotate: '3deg', size: 'xs' },
  { id: 'a5', pos: { top: '72%', left: '82%' }, rotate: '-4deg', size: 'xs' },
]

type Phase = 'idle' | 'darkening' | 'lit'

export function Diyo() {
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [msgDiyo, setMsgDiyo] = useState<(typeof DIYOS)[number] | null>(null)
  const [communityAffirmations, setCommunityAffirmations] = useState<Record<string, Affirmation[]>>({})
  const [newText, setNewText] = useState('')
  const [posting, setPosting] = useState(false)
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const listEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const init: Record<string, Affirmation[]> = {}
    DIYOS.forEach((d) => { init[d.id] = [...d.affirmations] })
    setCommunityAffirmations(init)
    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (phase === 'lit') {
      listEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [communityAffirmations, phase])

  // How many user-added affirmations exist beyond the seed (per diyo and total)
  const extraPerDiyo: Record<string, number> = {}
  let totalExtra = 0
  DIYOS.forEach((d) => {
    const extra = Math.max(0, (communityAffirmations[d.id]?.length ?? SEED_COUNT) - SEED_COUNT)
    extraPerDiyo[d.id] = extra
    totalExtra += extra
  })

  // glowBoost: 0 → 1 as totalExtra goes 0 → 16
  const glowBoost = Math.min(totalExtra / 16, 1)

  // Emoji font-size grows per extra affirmation — all start equal at 4rem
  function getDiyoFontSize(id: string): string {
    const extra = extraPerDiyo[id] ?? 0
    return `${Math.min(4 + extra * 1.4, 13)}rem`
  }

  // Drop-shadow intensity grows with size
  function getDiyoGlow(id: string, active = false): string {
    const extra = extraPerDiyo[id] ?? 0
    const base = active ? 20 : 6 + extra * 2
    return `drop-shadow(0 0 ${base}px rgba(217,119,6,${active ? 0.9 : 0.45 + extra * 0.05}))`
  }

  function handleDiyoClick(diyo: (typeof DIYOS)[number]) {
    if (phase === 'darkening') return
    if (activeId === diyo.id && phase === 'lit') return

    setActiveId(diyo.id)
    setMsgDiyo(diyo)
    setNewText('')
    setPhase('darkening')
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current)
    phaseTimerRef.current = setTimeout(() => {
      setPhase('lit')
    }, 600)
  }

  function handleClose() {
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current)
    setActiveId(null)
    setPhase('idle')
    setMsgDiyo(null)
    setNewText('')
  }

  function handlePost() {
    if (!newText.trim() || !activeId) return
    setPosting(true)
    const newAff: Affirmation = {
      id: `u-${Date.now()}`,
      text: newText.trim(),
      author: 'Timi',
    }
    setCommunityAffirmations((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), newAff],
    }))
    setNewText('')
    setTimeout(() => setPosting(false), 400)
  }

  const isLit = phase === 'lit'
  const isDarkening = phase === 'darkening'
  const anyActive = activeId !== null
  const currentAffirmations = activeId ? (communityAffirmations[activeId] ?? []) : []

  // Ambient glow opacity: always-on base + grows with totalExtra; dims when darkening
  const baseGlowOpacity = isDarkening ? 0 : isLit ? 1 : 0.35 + glowBoost * 0.55

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        backgroundColor: isDarkening ? '#040302' : '#0e0c09',
        transition: 'background-color 0.7s ease',
      }}
    >
      {/* Base ambient glow — dims to black while darkening, else brightens with affirmations */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(217,119,6,0.18) 0%, transparent 70%)',
          opacity: baseGlowOpacity,
          transition: 'opacity 0.9s ease',
        }}
      />

      {/* Extra brightness layer — grows as community writes more */}
      {!isDarkening && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 100% 80% at 50% 50%, rgba(217,119,6,0.12) 0%, rgba(180,80,0,0.04) 50%, transparent 80%)',
            opacity: isLit ? 0 : glowBoost,
            transition: 'opacity 1.2s ease',
          }}
        />
      )}

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className={`absolute top-5 left-5 z-30 flex items-center gap-1.5 text-[13px] font-medium transition-colors duration-500 cursor-pointer ${
          anyActive && !isLit ? 'text-[#2a2010]' : 'text-[#7a6a58] hover:text-amber-400'
        }`}
      >
        ← Farka
      </button>

      {/* Page title */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full transition-all duration-700 ${
            isLit
              ? 'bg-amber-400 shadow-[0_0_10px_rgba(217,119,6,0.9)]'
              : isDarkening
                ? 'bg-[#2a2010]'
                : 'bg-amber-600 shadow-[0_0_5px_rgba(217,119,6,0.4)]'
          }`}
        />
        <h1
          className={`text-sm uppercase tracking-widest font-semibold transition-colors duration-700 ${
            isLit ? 'text-amber-400' : isDarkening ? 'text-[#2a2010]' : 'text-[#6a5a48]'
          }`}
        >
          Diyo
        </h1>
      </div>

      {/* Hint text — only idle */}
      {!anyActive && (
        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 text-sm text-[#5a4a38] text-center">
          Yo diyo baln — affirmation paunus
        </p>
      )}

      {/* Ambient decorative diyos */}
      {AMBIENT.map((a) => (
        <div
          key={a.id}
          className="absolute pointer-events-none select-none"
          style={{ top: a.pos.top, left: a.pos.left, transform: `rotate(${a.rotate})` }}
        >
          <span
            className={`inline-block transition-all duration-700 ${
              a.size === 'xs' ? 'text-3xl' : 'text-4xl'
            } ${
              anyActive
                ? isDarkening
                  ? 'opacity-0'
                  : 'opacity-10'
                : 'opacity-25 diyo-ambient'
            }`}
          >
            🪔
          </span>
        </div>
      ))}

      {/* Themed diyos */}
      {DIYOS.map((diyo) => {
        const isActive = activeId === diyo.id
        const isOther = anyActive && !isActive
        const fontSize = getDiyoFontSize(diyo.id)

        return (
          <button
            key={diyo.id}
            onClick={() => handleDiyoClick(diyo)}
            className="absolute z-10 flex flex-col items-center gap-2 cursor-pointer group"
            style={{
              top: diyo.pos.top,
              left: diyo.pos.left,
              transform: `rotate(${diyo.rotate})`,
            }}
          >
            <span
              className={`inline-block ${
                isActive && isLit
                  ? 'diyo-flame-active scale-110'
                  : isActive && isDarkening
                    ? 'diyo-flame-dark'
                    : isOther
                      ? isDarkening
                        ? 'opacity-0 scale-75'
                        : 'opacity-20 scale-90'
                      : 'diyo-flame group-hover:scale-110'
              }`}
              style={{
                fontSize,
                filter: isActive && isLit
                  ? undefined
                  : isActive && isDarkening
                    ? undefined
                    : isOther
                      ? undefined
                      : getDiyoGlow(diyo.id),
                transition: 'font-size 0.9s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease, transform 0.5s ease',
              }}
            >
              🪔
            </span>
            <span
              className={`text-sm font-semibold leading-tight text-center max-w-[110px] transition-all duration-500 ${
                isActive && isLit
                  ? 'text-amber-300'
                  : isActive && isDarkening
                    ? 'text-[#1a1510]'
                    : isOther
                      ? 'opacity-0'
                      : 'text-[#9a8870] group-hover:text-amber-400'
              }`}
            >
              {diyo.label}
            </span>
            <span
              className={`text-[11px] leading-none text-center max-w-[110px] transition-all duration-500 ${
                isActive && isLit
                  ? 'text-amber-600/70'
                  : isActive && isDarkening
                    ? 'text-[#1a1510]'
                    : isOther
                      ? 'opacity-0'
                      : 'text-[#6a5848] group-hover:text-amber-600/60'
              }`}
            >
              {diyo.sublabel}
            </span>
            {/* Affirmation count badge */}
            {!anyActive && extraPerDiyo[diyo.id] > 0 && (
              <span className="text-[9px] text-amber-700/60 mt-0.5">
                +{extraPerDiyo[diyo.id]} naya
              </span>
            )}
          </button>
        )
      })}

      {/* Community affirmations panel */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 z-20 w-[min(420px,90vw)] transition-all duration-500 ease-out ${
          isLit
            ? 'top-1/2 -translate-y-1/2 opacity-100'
            : isDarkening
              ? 'top-[55%] -translate-y-1/2 opacity-0'
              : 'top-[55%] -translate-y-1/2 opacity-0 pointer-events-none'
        }`}
      >
        <div className="bg-gradient-to-b from-[#221a0a] to-[#16110a] border border-[#3a2a10] rounded-2xl overflow-hidden shadow-[0_8px_48px_rgba(217,119,6,0.25),inset_0_0_40px_rgba(217,119,6,0.05)]">

          {/* Card header */}
          <div className="bg-gradient-to-r from-[#2a1e08] to-[#1f1608] px-4 py-3 flex items-center justify-between border-b border-[#3a2a10]">
            <span className="text-sm font-semibold text-amber-400 flex items-center gap-2">
              🪔 {msgDiyo?.label}
              <span className="text-amber-600/60 font-normal text-xs">— {msgDiyo?.sublabel}</span>
            </span>
            <button
              onClick={handleClose}
              className="text-[#5a4a30] hover:text-amber-300 text-sm px-1.5 py-0.5 rounded transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Affirmations list */}
          <div className="px-4 pt-4 pb-2 max-h-[240px] overflow-y-auto flex flex-col gap-3 scrollbar-thin">
            {currentAffirmations.length === 0 && (
              <p className="text-center text-amber-700/50 text-xs py-4 italic">
                Pahilo affirmation timi lekhnus — diyera suru garnus 🪔
              </p>
            )}
            {currentAffirmations.map((aff) => (
              <div
                key={aff.id}
                className="bg-[#1c1508] border border-[#2e2008] rounded-xl px-4 py-3"
              >
                <p className="text-sm text-amber-100/85 leading-relaxed italic font-serif">
                  "{aff.text}"
                </p>
                <p className="text-[10px] text-amber-700/50 mt-1.5 text-right">
                  — {aff.author}
                </p>
              </div>
            ))}
            <div ref={listEndRef} />
          </div>

          {/* Write your affirmation */}
          <div className="px-4 pt-2 pb-4 border-t border-[#2e2008] mt-2">
            <p className="text-[11px] text-amber-700/60 mb-2">
              Timi pani affirmation lekhnus — arko lai help garchha 🕯
            </p>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Aafno mann le ke bhancha… (Nenglish ma thik cha)"
              maxLength={200}
              rows={2}
              className="w-full bg-[#1a1308] border border-[#3a2a10] rounded-xl px-3 py-2.5 text-sm text-amber-100/80 placeholder:text-amber-900/50 resize-none focus:outline-none focus:border-amber-700/60 transition-colors"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-amber-900/40">{newText.length}/200</span>
              <button
                onClick={handlePost}
                disabled={!newText.trim() || posting}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-amber-700/30 text-amber-300 border border-amber-700/40 hover:bg-amber-700/50 hover:text-amber-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {posting ? 'Pathaidai…' : 'Pathau 🪔'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        .diyo-flame {
          animation: flicker 2.5s ease-in-out infinite alternate;
        }
        .diyo-ambient {
          animation: flicker 3.5s ease-in-out infinite alternate;
          filter: drop-shadow(0 0 3px rgba(217,119,6,0.2));
        }
        .diyo-flame-dark {
          filter: grayscale(1) brightness(0.15) !important;
          transition: filter 0.4s ease, opacity 0.4s ease, font-size 0.9s cubic-bezier(0.34,1.56,0.64,1) !important;
        }
        .diyo-flame-active {
          animation: flickerActive 1.8s ease-in-out infinite alternate;
          filter: drop-shadow(0 0 24px rgba(217,119,6,0.95)) !important;
        }
        @keyframes flicker {
          0%, 100% { transform: scale(1) rotate(-1deg); }
          25% { transform: scale(1.04) rotate(0.5deg); }
          50% { transform: scale(0.97) rotate(-0.5deg); }
          75% { transform: scale(1.03) rotate(1deg); }
        }
        @keyframes flickerActive {
          0%, 100% { transform: scale(1) rotate(-1deg); filter: drop-shadow(0 0 24px rgba(217,119,6,0.95)); }
          25% { transform: scale(1.12) rotate(1deg); filter: drop-shadow(0 0 36px rgba(217,119,6,1)); }
          50% { transform: scale(0.95) rotate(-1deg); filter: drop-shadow(0 0 14px rgba(217,119,6,0.6)); }
          75% { transform: scale(1.08) rotate(0.5deg); filter: drop-shadow(0 0 28px rgba(217,119,6,0.95)); }
        }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(217,119,6,0.2); border-radius: 2px; }
      `}</style>
    </div>
  )
}
