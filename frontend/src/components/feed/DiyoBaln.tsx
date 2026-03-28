import { useState, useRef, useEffect } from 'react'

const DIYOS = [
  {
    id: 'chedchhad',
    label: 'छेडछाड',
    sublabel: 'Sexual Harassment',
    affirmations: [
      'Timro galti hoina — kabhi thiena',
      'Timilai vishwas garchhu',
      'Bolna saknu nai himmat ho',
      'Timi safe hunu deserve garchau',
      'Timro awaz matter garchha',
      'Timi eklai ladhnau pardaina — saath cha',
      'Timro boundary respect hunu parchha',
      'Jo bhayo tyo timro parichay hoina',
    ],
  },
  {
    id: 'society',
    label: 'समाजको बोझ',
    sublabel: 'Society Pressure',
    affirmations: [
      'Timro life timro definition ho',
      'Sabko expectations pura garna bandeko hoinas',
      'Log ke sochcha — tyo timro story hoina',
      'Timro khushi ko permission kasaile dina hudaina',
      'Afno pace ma hidnu thik ho',
      'Samaj ko mold ma fit huna pardaina',
      'Timro choice valid cha',
      'Expectations le timilai define gardaina',
    ],
  },
  {
    id: 'naya-aama',
    label: 'नयाँ आमाको मन',
    sublabel: 'Naya Aama',
    affirmations: [
      'Ramri aama banna lai perfect huna pardaina',
      'Rest linu galat hoina',
      'Timi eklai handle garna pardaina',
      'Timro baby lai timi nai chahieko ho',
      'Aafu lai time dinu pani maya ho',
      'Timi strong chau — aaja pani, bholi pani',
      'Help maagna wisdom ho',
      'Timro feelings real chan, valid chan',
    ],
  },
  {
    id: 'mann-bechain',
    label: 'मन बेचैन',
    sublabel: 'Anxiety',
    affirmations: [
      'Ek breath — bas ek breath',
      'Aaja ko lagi yeti pugcha',
      'Timro pace nai thik pace ho',
      'Yo moment bitchha — timi strong chau',
      'Chinta le define gardaina timilai',
      'Aafu sanga gentle hunu thik ho',
      'Bistarai — koi rush chhaina',
      'Timi bhanda badi timi ko katha cha',
    ],
  },
]

type Phase = 'idle' | 'darkening' | 'lit'

export function DiyoBaln() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [message, setMessage] = useState('')
  const lastMsgRef = useRef<Record<string, string>>({})
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current)
    }
  }, [])

  function pickAffirmation(diyo: (typeof DIYOS)[number]) {
    const last = lastMsgRef.current[diyo.id]
    const others = diyo.affirmations.filter((a) => a !== last)
    const pick = others[Math.floor(Math.random() * others.length)]
    lastMsgRef.current[diyo.id] = pick
    return pick
  }

  function handleClick(diyo: (typeof DIYOS)[number]) {
    // clicking the active diyo closes it
    if (activeId === diyo.id) {
      setActiveId(null)
      setPhase('idle')
      setMessage('')
      return
    }

    // Phase 1: darken immediately
    setActiveId(diyo.id)
    setPhase('darkening')
    setMessage('')

    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current)

    // Phase 2: warm light after 600ms
    phaseTimerRef.current = setTimeout(() => {
      setPhase('lit')
      setMessage(pickAffirmation(diyo))
    }, 600)
  }

  function handleClose() {
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current)
    setActiveId(null)
    setPhase('idle')
    setMessage('')
  }

  const activeDiyo = DIYOS.find((d) => d.id === activeId)
  const isLit = phase === 'lit'
  const isDarkening = phase === 'darkening'

  return (
    <div
      className={`
        rounded-xl p-4 transition-all duration-700
        ${isLit
          ? 'bg-[#1a1410] border border-[#4a3820] shadow-[0_0_40px_rgba(217,119,6,0.2),inset_0_0_60px_rgba(217,119,6,0.05)]'
          : isDarkening
            ? 'bg-[#0a0908] border border-[#1a1814] shadow-none'
            : 'bg-cardWhite border border-sand'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`w-2 h-2 rounded-full transition-all duration-700 ${
            isLit
              ? 'bg-amber-400 shadow-[0_0_12px_rgba(217,119,6,0.9)]'
              : isDarkening
                ? 'bg-[#2a2010]'
                : 'bg-amber-500 shadow-[0_0_6px_rgba(217,119,6,0.5)]'
          }`}
        />
        <h3
          className={`text-[11px] uppercase tracking-wider font-semibold transition-colors duration-700 ${
            isLit ? 'text-amber-400' : isDarkening ? 'text-[#2a2010]' : 'text-textMuted'
          }`}
        >
          Diyo Baln
        </h3>
      </div>

      {/* 2×2 grid */}
      <div className="grid grid-cols-2 gap-2">
        {DIYOS.map((diyo) => {
          const isActive = activeId === diyo.id
          return (
            <button
              key={diyo.id}
              onClick={() => handleClick(diyo)}
              className={`
                relative rounded-xl p-3 text-center transition-all duration-500 cursor-pointer overflow-hidden
                ${isActive && isLit
                  ? 'bg-[#2a1e08] border border-amber-500 shadow-[0_0_24px_rgba(217,119,6,0.5)]'
                  : isActive && isDarkening
                    ? 'bg-[#0f0d0a] border border-[#2a2010]'
                    : isLit
                      ? 'bg-[#1f1c16] border border-[#2a2520] hover:border-amber-600 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(217,119,6,0.2)]'
                      : isDarkening
                        ? 'bg-[#0a0908] border border-[#151210] opacity-40'
                        : 'bg-feedBg border border-transparent hover:border-amber-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(217,119,6,0.15)]'
                }
              `}
            >
              {/* Radial warm glow behind the flame when lit */}
              {isActive && isLit && (
                <span className="absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_at_center,rgba(217,119,6,0.18)_0%,transparent_70%)] pointer-events-none" />
              )}

              <span
                className={`text-2xl inline-block relative z-10 ${
                  isActive && isLit
                    ? 'diyo-flame-active'
                    : isActive && isDarkening
                      ? 'diyo-flame-dark'
                      : 'diyo-flame'
                }`}
              >
                🪔
              </span>
              <p
                className={`text-[9px] font-semibold mt-1 leading-tight transition-colors duration-500 relative z-10 ${
                  isActive && isLit
                    ? 'text-amber-300'
                    : isActive && isDarkening
                      ? 'text-[#1a1510]'
                      : isLit
                        ? 'text-[#7a7060]'
                        : isDarkening
                          ? 'text-[#1a1510]'
                          : 'text-textMuted'
                }`}
              >
                {diyo.label}
              </p>
              <p
                className={`text-[8px] mt-0.5 leading-tight transition-colors duration-500 relative z-10 ${
                  isActive && isLit
                    ? 'text-amber-500/60'
                    : 'text-transparent'
                }`}
              >
                {diyo.sublabel}
              </p>
            </button>
          )
        })}
      </div>

      {/* Expanded panel — slides in when lit */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isLit && activeId ? 'max-h-[280px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
        }`}
      >
        <div className="bg-gradient-to-b from-[#221a0a] to-[#16110a] border border-[#3a2a10] rounded-xl overflow-hidden shadow-[inset_0_0_40px_rgba(217,119,6,0.07)]">
          {/* Panel header */}
          <div className="bg-gradient-to-r from-[#2a1e08] to-[#1f1608] px-3 py-2 flex items-center justify-between border-b border-[#3a2a10]">
            <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
              🪔 {activeDiyo?.label}
              <span className="text-amber-600/60 font-normal text-[10px]">— {activeDiyo?.sublabel}</span>
            </span>
            <button
              onClick={handleClose}
              className="text-[#5a4a30] hover:text-amber-300 text-sm px-1.5 py-0.5 rounded transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Flame + affirmation */}
          <div className="p-5 text-center">
            <span className="text-5xl inline-block diyo-flame-big">🪔</span>
            <p className="text-[13px] text-amber-100/90 mt-4 leading-relaxed italic font-serif px-2">
              "{message}"
            </p>
            <p className="text-[10px] text-amber-700/50 mt-3">
              Arko diyo baln — click garnus
            </p>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        .diyo-flame {
          animation: flicker 2.5s ease-in-out infinite alternate;
          filter: drop-shadow(0 0 3px rgba(217,119,6,0.3));
        }
        .diyo-flame-dark {
          filter: drop-shadow(0 0 0px rgba(0,0,0,0)) grayscale(1) brightness(0.2);
          transition: filter 0.4s ease;
        }
        .diyo-flame-active {
          animation: flickerActive 1.8s ease-in-out infinite alternate;
          filter: drop-shadow(0 0 10px rgba(217,119,6,0.7));
        }
        .diyo-flame-big {
          animation: flickerBig 2s ease-in-out infinite alternate;
          filter: drop-shadow(0 0 22px rgba(217,119,6,0.65));
        }
        @keyframes flicker {
          0%, 100% { transform: scale(1) rotate(-1deg); }
          25% { transform: scale(1.03) rotate(0.5deg); }
          50% { transform: scale(0.97) rotate(-0.5deg); }
          75% { transform: scale(1.02) rotate(1deg); }
        }
        @keyframes flickerActive {
          0%, 100% { transform: scale(1) rotate(-1deg); filter: drop-shadow(0 0 10px rgba(217,119,6,0.7)); }
          25% { transform: scale(1.1) rotate(1deg); filter: drop-shadow(0 0 18px rgba(217,119,6,0.9)); }
          50% { transform: scale(0.94) rotate(-1deg); filter: drop-shadow(0 0 7px rgba(217,119,6,0.5)); }
          75% { transform: scale(1.06) rotate(0.5deg); filter: drop-shadow(0 0 14px rgba(217,119,6,0.8)); }
        }
        @keyframes flickerBig {
          0%, 100% { transform: scale(1) rotate(-1deg); filter: drop-shadow(0 0 22px rgba(217,119,6,0.65)); }
          25% { transform: scale(1.07) rotate(1deg); filter: drop-shadow(0 0 34px rgba(217,119,6,0.85)); }
          50% { transform: scale(0.94) rotate(-1deg); filter: drop-shadow(0 0 14px rgba(217,119,6,0.4)); }
          75% { transform: scale(1.05) rotate(0.5deg); filter: drop-shadow(0 0 28px rgba(217,119,6,0.75)); }
        }
      `}</style>
    </div>
  )
}
