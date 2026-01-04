import { useState, useEffect, useCallback, memo } from 'react'

// Cache des sons chargés
const audioCache = new Map()

// Mapping des caractères arabes vers les fichiers audio
const soundMapping = {
  // Lettres isolées
  'ا': 'alif', 'ب': 'ba', 'ت': 'ta', 'ث': 'tha', 'ج': 'jim', 'ح': 'ha', 'خ': 'kha',
  'د': 'dal', 'ذ': 'dhal', 'ر': 'ra', 'ز': 'zay', 'س': 'sin', 'ش': 'shin',
  'ص': 'sad', 'ض': 'dad', 'ط': 'ta_emph', 'ظ': 'dha_emph', 'ع': 'ayn', 'غ': 'ghayn',
  'ف': 'fa', 'ق': 'qaf', 'ك': 'kaf', 'ل': 'lam', 'م': 'mim', 'ن': 'nun',
  'ه': 'ha_light', 'و': 'waw', 'ي': 'ya',
  // Avec Fatha
  'أَ': 'alif_fatha', 'بَ': 'ba_fatha', 'تَ': 'ta_fatha', 'ثَ': 'tha_fatha', 'جَ': 'jim_fatha',
  'حَ': 'ha_fatha', 'خَ': 'kha_fatha', 'دَ': 'dal_fatha', 'ذَ': 'dhal_fatha', 'رَ': 'ra_fatha',
  'زَ': 'zay_fatha', 'سَ': 'sin_fatha', 'شَ': 'shin_fatha', 'صَ': 'sad_fatha', 'ضَ': 'dad_fatha',
  'طَ': 'ta_emph_fatha', 'ظَ': 'dha_emph_fatha', 'عَ': 'ayn_fatha', 'غَ': 'ghayn_fatha',
  'فَ': 'fa_fatha', 'قَ': 'qaf_fatha', 'كَ': 'kaf_fatha', 'لَ': 'lam_fatha', 'مَ': 'mim_fatha',
  'نَ': 'nun_fatha', 'هَ': 'ha_light_fatha', 'وَ': 'waw_fatha', 'يَ': 'ya_fatha',
  // Avec Kasra
  'إِ': 'alif_kasra', 'بِ': 'ba_kasra', 'تِ': 'ta_kasra', 'ثِ': 'tha_kasra', 'جِ': 'jim_kasra',
  'حِ': 'ha_kasra', 'خِ': 'kha_kasra', 'دِ': 'dal_kasra', 'ذِ': 'dhal_kasra', 'رِ': 'ra_kasra',
  'زِ': 'zay_kasra', 'سِ': 'sin_kasra', 'شِ': 'shin_kasra', 'صِ': 'sad_kasra', 'ضِ': 'dad_kasra',
  'طِ': 'ta_emph_kasra', 'ظِ': 'dha_emph_kasra', 'عِ': 'ayn_kasra', 'غِ': 'ghayn_kasra',
  'فِ': 'fa_kasra', 'قِ': 'qaf_kasra', 'كِ': 'kaf_kasra', 'لِ': 'lam_kasra', 'مِ': 'mim_kasra',
  'نِ': 'nun_kasra', 'هِ': 'ha_light_kasra', 'وِ': 'waw_kasra', 'يِ': 'ya_kasra',
  // Avec Damma
  'أُ': 'alif_damma', 'بُ': 'ba_damma', 'تُ': 'ta_damma', 'ثُ': 'tha_damma', 'جُ': 'jim_damma',
  'حُ': 'ha_damma', 'خُ': 'kha_damma', 'دُ': 'dal_damma', 'ذُ': 'dhal_damma', 'رُ': 'ra_damma',
  'زُ': 'zay_damma', 'سُ': 'sin_damma', 'شُ': 'shin_damma', 'صُ': 'sad_damma', 'ضُ': 'dad_damma',
  'طُ': 'ta_emph_damma', 'ظُ': 'dha_emph_damma', 'عُ': 'ayn_damma', 'غُ': 'ghayn_damma',
  'فُ': 'fa_damma', 'قُ': 'qaf_damma', 'كُ': 'kaf_damma', 'لُ': 'lam_damma', 'مُ': 'mim_damma',
  'نُ': 'nun_damma', 'هُ': 'ha_light_damma', 'وُ': 'waw_damma', 'يُ': 'ya_damma',
  // Avec Sukun
  'أْ': 'alif_sukun', 'بْ': 'ba_sukun', 'تْ': 'ta_sukun', 'ثْ': 'tha_sukun', 'جْ': 'jim_sukun',
  'حْ': 'ha_sukun', 'خْ': 'kha_sukun', 'دْ': 'dal_sukun', 'ذْ': 'dhal_sukun', 'رْ': 'ra_sukun',
  'زْ': 'zay_sukun', 'سْ': 'sin_sukun', 'شْ': 'shin_sukun', 'صْ': 'sad_sukun', 'ضْ': 'dad_sukun',
  'طْ': 'ta_emph_sukun', 'ظْ': 'dha_emph_sukun', 'عْ': 'ayn_sukun', 'غْ': 'ghayn_sukun',
  'فْ': 'fa_sukun', 'قْ': 'qaf_sukun', 'كْ': 'kaf_sukun', 'لْ': 'lam_sukun', 'مْ': 'mim_sukun',
  'نْ': 'nun_sukun', 'هْ': 'ha_light_sukun', 'وْ': 'waw_sukun', 'يْ': 'ya_sukun',
  // Harakat
  'بّ': 'haraka_shadda', 'بًا': 'haraka_tanwin_fath', 'بٍ': 'haraka_tanwin_kasr', 'بٌ': 'haraka_tanwin_damm',
}

// Fonction pour jouer le son (MP3 local avec fallback Web Speech API)
const playSound = (text) => {
  const soundId = soundMapping[text]
  
  if (soundId) {
    // Essayer de jouer le fichier MP3 local
    const audioPath = `${import.meta.env.BASE_URL}audio/${soundId}.mp3`
    
    // Utiliser le cache si disponible
    if (audioCache.has(soundId)) {
      const audio = audioCache.get(soundId)
      audio.currentTime = 0
      audio.play().catch(() => fallbackToSpeech(text))
      return
    }
    
    const audio = new Audio(audioPath)
    audio.addEventListener('canplaythrough', () => {
      audioCache.set(soundId, audio)
      audio.play().catch(() => fallbackToSpeech(text))
    })
    audio.addEventListener('error', () => {
      fallbackToSpeech(text)
    })
    audio.load()
  } else {
    fallbackToSpeech(text)
  }
}

// Fallback vers Web Speech API si le fichier MP3 n'existe pas
const fallbackToSpeech = (text) => {
  if (!('speechSynthesis' in window)) {
    console.log('Speech synthesis not supported')
    return
  }
  
  window.speechSynthesis.cancel()
  
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ar-SA'
  utterance.rate = 0.8
  utterance.pitch = 1
  utterance.volume = 1
  
  const voices = window.speechSynthesis.getVoices()
  const arabicVoice = voices.find(v => v.lang.startsWith('ar'))
  if (arabicVoice) {
    utterance.voice = arabicVoice
  }
  
  window.speechSynthesis.speak(utterance)
}

// Alphabet arabe complet avec les 4 formes d'écriture et les sons vocaliques
const arabicAlphabet = [
  { name: 'Alif', isolated: 'ا', initial: 'ا', medial: 'ـا', final: 'ـا', transliteration: 'a/ā', 
    withFatha: 'أَ', withKasra: 'إِ', withDamma: 'أُ', withSukun: 'أْ' },
  { name: 'Ba', isolated: 'ب', initial: 'بـ', medial: 'ـبـ', final: 'ـب', transliteration: 'b',
    withFatha: 'بَ', withKasra: 'بِ', withDamma: 'بُ', withSukun: 'بْ' },
  { name: 'Ta', isolated: 'ت', initial: 'تـ', medial: 'ـتـ', final: 'ـت', transliteration: 't',
    withFatha: 'تَ', withKasra: 'تِ', withDamma: 'تُ', withSukun: 'تْ' },
  { name: 'Tha', isolated: 'ث', initial: 'ثـ', medial: 'ـثـ', final: 'ـث', transliteration: 'th',
    withFatha: 'ثَ', withKasra: 'ثِ', withDamma: 'ثُ', withSukun: 'ثْ' },
  { name: 'Jim', isolated: 'ج', initial: 'جـ', medial: 'ـجـ', final: 'ـج', transliteration: 'j',
    withFatha: 'جَ', withKasra: 'جِ', withDamma: 'جُ', withSukun: 'جْ' },
  { name: 'Ha', isolated: 'ح', initial: 'حـ', medial: 'ـحـ', final: 'ـح', transliteration: 'ḥ',
    withFatha: 'حَ', withKasra: 'حِ', withDamma: 'حُ', withSukun: 'حْ' },
  { name: 'Kha', isolated: 'خ', initial: 'خـ', medial: 'ـخـ', final: 'ـخ', transliteration: 'kh',
    withFatha: 'خَ', withKasra: 'خِ', withDamma: 'خُ', withSukun: 'خْ' },
  { name: 'Dal', isolated: 'د', initial: 'د', medial: 'ـد', final: 'ـد', transliteration: 'd',
    withFatha: 'دَ', withKasra: 'دِ', withDamma: 'دُ', withSukun: 'دْ' },
  { name: 'Dhal', isolated: 'ذ', initial: 'ذ', medial: 'ـذ', final: 'ـذ', transliteration: 'dh',
    withFatha: 'ذَ', withKasra: 'ذِ', withDamma: 'ذُ', withSukun: 'ذْ' },
  { name: 'Ra', isolated: 'ر', initial: 'ر', medial: 'ـر', final: 'ـر', transliteration: 'r',
    withFatha: 'رَ', withKasra: 'رِ', withDamma: 'رُ', withSukun: 'رْ' },
  { name: 'Zay', isolated: 'ز', initial: 'ز', medial: 'ـز', final: 'ـز', transliteration: 'z',
    withFatha: 'زَ', withKasra: 'زِ', withDamma: 'زُ', withSukun: 'زْ' },
  { name: 'Sin', isolated: 'س', initial: 'سـ', medial: 'ـسـ', final: 'ـس', transliteration: 's',
    withFatha: 'سَ', withKasra: 'سِ', withDamma: 'سُ', withSukun: 'سْ' },
  { name: 'Shin', isolated: 'ش', initial: 'شـ', medial: 'ـشـ', final: 'ـش', transliteration: 'sh',
    withFatha: 'شَ', withKasra: 'شِ', withDamma: 'شُ', withSukun: 'شْ' },
  { name: 'Sad', isolated: 'ص', initial: 'صـ', medial: 'ـصـ', final: 'ـص', transliteration: 'ṣ',
    withFatha: 'صَ', withKasra: 'صِ', withDamma: 'صُ', withSukun: 'صْ' },
  { name: 'Dad', isolated: 'ض', initial: 'ضـ', medial: 'ـضـ', final: 'ـض', transliteration: 'ḍ',
    withFatha: 'ضَ', withKasra: 'ضِ', withDamma: 'ضُ', withSukun: 'ضْ' },
  { name: 'Ta emphatique', isolated: 'ط', initial: 'طـ', medial: 'ـطـ', final: 'ـط', transliteration: 'ṭ',
    withFatha: 'طَ', withKasra: 'طِ', withDamma: 'طُ', withSukun: 'طْ' },
  { name: 'Dha emphatique', isolated: 'ظ', initial: 'ظـ', medial: 'ـظـ', final: 'ـظ', transliteration: 'ẓ',
    withFatha: 'ظَ', withKasra: 'ظِ', withDamma: 'ظُ', withSukun: 'ظْ' },
  { name: 'Ayn', isolated: 'ع', initial: 'عـ', medial: 'ـعـ', final: 'ـع', transliteration: 'ʿ',
    withFatha: 'عَ', withKasra: 'عِ', withDamma: 'عُ', withSukun: 'عْ' },
  { name: 'Ghayn', isolated: 'غ', initial: 'غـ', medial: 'ـغـ', final: 'ـغ', transliteration: 'gh',
    withFatha: 'غَ', withKasra: 'غِ', withDamma: 'غُ', withSukun: 'غْ' },
  { name: 'Fa', isolated: 'ف', initial: 'فـ', medial: 'ـفـ', final: 'ـف', transliteration: 'f',
    withFatha: 'فَ', withKasra: 'فِ', withDamma: 'فُ', withSukun: 'فْ' },
  { name: 'Qaf', isolated: 'ق', initial: 'قـ', medial: 'ـقـ', final: 'ـق', transliteration: 'q',
    withFatha: 'قَ', withKasra: 'قِ', withDamma: 'قُ', withSukun: 'قْ' },
  { name: 'Kaf', isolated: 'ك', initial: 'كـ', medial: 'ـكـ', final: 'ـك', transliteration: 'k',
    withFatha: 'كَ', withKasra: 'كِ', withDamma: 'كُ', withSukun: 'كْ' },
  { name: 'Lam', isolated: 'ل', initial: 'لـ', medial: 'ـلـ', final: 'ـل', transliteration: 'l',
    withFatha: 'لَ', withKasra: 'لِ', withDamma: 'لُ', withSukun: 'لْ' },
  { name: 'Mim', isolated: 'م', initial: 'مـ', medial: 'ـمـ', final: 'ـم', transliteration: 'm',
    withFatha: 'مَ', withKasra: 'مِ', withDamma: 'مُ', withSukun: 'مْ' },
  { name: 'Nun', isolated: 'ن', initial: 'نـ', medial: 'ـنـ', final: 'ـن', transliteration: 'n',
    withFatha: 'نَ', withKasra: 'نِ', withDamma: 'نُ', withSukun: 'نْ' },
  { name: 'Ha léger', isolated: 'ه', initial: 'هـ', medial: 'ـهـ', final: 'ـه', transliteration: 'h',
    withFatha: 'هَ', withKasra: 'هِ', withDamma: 'هُ', withSukun: 'هْ' },
  { name: 'Waw', isolated: 'و', initial: 'و', medial: 'ـو', final: 'ـو', transliteration: 'w/ū',
    withFatha: 'وَ', withKasra: 'وِ', withDamma: 'وُ', withSukun: 'وْ' },
  { name: 'Ya', isolated: 'ي', initial: 'يـ', medial: 'ـيـ', final: 'ـي', transliteration: 'y/ī',
    withFatha: 'يَ', withKasra: 'يِ', withDamma: 'يُ', withSukun: 'يْ' },
]

// Voyelles et signes diacritiques (Harakat)
const harakat = [
  { name: 'Fatha', symbol: 'َ', description: 'Voyelle courte "a"', example: 'بَ', sound: 'a', position: 'au-dessus', color: '#ff6b6b' },
  { name: 'Kasra', symbol: 'ِ', description: 'Voyelle courte "i"', example: 'بِ', sound: 'i', position: 'en-dessous', color: '#4ecdc4' },
  { name: 'Damma', symbol: 'ُ', description: 'Voyelle courte "ou"', example: 'بُ', sound: 'ou', position: 'au-dessus', color: '#ffe66d' },
  { name: 'Sukun', symbol: 'ْ', description: 'Absence de voyelle', example: 'بْ', sound: '-', position: 'au-dessus', color: '#95afc0' },
  { name: 'Shadda', symbol: 'ّ', description: 'Doublement de la consonne', example: 'بّ', sound: 'bb', position: 'au-dessus', color: '#a29bfe' },
  { name: 'Tanwin Fath', symbol: 'ً', description: 'Terminaison "an"', example: 'بًا', sound: 'an', position: 'au-dessus', color: '#fd79a8' },
  { name: 'Tanwin Kasr', symbol: 'ٍ', description: 'Terminaison "in"', example: 'بٍ', sound: 'in', position: 'en-dessous', color: '#00b894' },
  { name: 'Tanwin Damm', symbol: 'ٌ', description: 'Terminaison "oun"', example: 'بٌ', sound: 'oun', position: 'au-dessus', color: '#fdcb6e' },
]

// Styles inline pour éviter le CSS externe
const styles = {
  container: {
    minHeight: '100vh',
    fontFamily: "'Segoe UI', -apple-system, sans-serif",
    position: 'relative',
  },
  decorPattern: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 20% 20%, rgba(212, 175, 55, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(142, 200, 216, 0.03) 0%, transparent 50%)
    `,
    pointerEvents: 'none',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  title: {
    fontFamily: "'Amiri', serif",
    fontSize: 'clamp(32px, 8vw, 48px)',
    color: '#d4af37',
    margin: 0,
    textShadow: '0 4px 30px rgba(212, 175, 55, 0.4)',
  },
  subtitle: {
    color: '#8ec8d8',
    fontSize: 'clamp(14px, 4vw, 18px)',
    marginTop: '8px',
    letterSpacing: '2px',
  },
  navBtn: (active) => ({
    background: active 
      ? 'linear-gradient(145deg, #d4af37 0%, #b8942e 100%)'
      : 'rgba(212, 175, 55, 0.1)',
    color: active ? '#0d2b36' : '#d4af37',
    border: active ? 'none' : '1px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '12px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: active ? '0 8px 20px rgba(212, 175, 55, 0.3)' : 'none',
  }),
  card: (selected) => ({
    background: selected 
      ? 'linear-gradient(145deg, #1a4a5e 0%, #0d2b36 100%)'
      : 'linear-gradient(145deg, #0d2b36 0%, #061820 100%)',
    borderRadius: '16px',
    padding: '16px',
    border: selected ? '2px solid #d4af37' : '1px solid rgba(212, 175, 55, 0.3)',
    boxShadow: selected 
      ? '0 20px 40px rgba(0,0,0,0.4)'
      : '0 8px 20px rgba(0,0,0,0.3)',
    minWidth: '85px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    transform: selected ? 'scale(1.05)' : 'scale(1)',
  }),
  arabicLetter: {
    fontFamily: "'Amiri', serif",
    fontSize: '42px',
    color: '#d4af37',
    textAlign: 'center',
    textShadow: '0 2px 10px rgba(212, 175, 55, 0.5)',
    lineHeight: 1.2,
  },
  panel: {
    background: 'linear-gradient(180deg, rgba(13, 43, 54, 0.95) 0%, rgba(6, 24, 32, 0.98) 100%)',
    borderRadius: '24px',
    padding: '28px',
    border: '2px solid rgba(212, 175, 55, 0.4)',
    boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
  },
  audioBtn: (size = 48) => ({
    background: 'linear-gradient(145deg, #d4af37 0%, #b8942e 100%)',
    border: 'none',
    borderRadius: '50%',
    width: `${size}px`,
    height: `${size}px`,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
    transition: 'all 0.3s ease',
    flexShrink: 0,
  }),
}

// Composant AudioButton mémoïsé
const AudioButton = memo(({ onClick, size = 48 }) => (
  <button onClick={onClick} style={styles.audioBtn(size)}>
    <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24" fill="#0d2b36">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
    </svg>
  </button>
))

// Composant carte de lettre mémoïsé
const LetterCard = memo(({ letter, isSelected, onClick, showDetails }) => (
  <div onClick={onClick} style={styles.card(isSelected)}>
    <div style={styles.arabicLetter}>{letter.isolated}</div>
    <div style={{ fontSize: '11px', color: '#8ec8d8', textAlign: 'center', marginTop: '6px', fontWeight: '500' }}>
      {letter.name}
    </div>
    {showDetails && (
      <div style={{ fontSize: '10px', color: 'rgba(142, 200, 216, 0.7)', textAlign: 'center', marginTop: '2px' }}>
        {letter.transliteration}
      </div>
    )}
  </div>
))

// Composant pour les sons vocaliques
const VowelSounds = memo(({ letter }) => {
  const vowels = [
    { name: 'Fatha', char: letter.withFatha, latin: `${letter.transliteration.split('/')[0]}a`, color: '#ff6b6b', desc: 'son "a"' },
    { name: 'Kasra', char: letter.withKasra, latin: `${letter.transliteration.split('/')[0]}i`, color: '#4ecdc4', desc: 'son "i"' },
    { name: 'Damma', char: letter.withDamma, latin: `${letter.transliteration.split('/')[0]}u`, color: '#ffe66d', desc: 'son "ou"' },
    { name: 'Sukun', char: letter.withSukun, latin: `${letter.transliteration.split('/')[0]}`, color: '#95afc0', desc: 'sans voyelle' },
  ]

  return (
    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '16px', padding: '20px', marginTop: '20px' }}>
      <h3 style={{ color: '#d4af37', fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>🔊</span> Sons avec les différentes voyelles
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
        {vowels.map((v, i) => (
          <div
            key={i}
            onClick={() => playSound(v.char)}
            style={{
              background: `linear-gradient(145deg, ${v.color}22, ${v.color}11)`,
              border: `2px solid ${v.color}55`,
              borderRadius: '12px',
              padding: '16px 8px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ fontFamily: "'Amiri', serif", fontSize: '38px', color: '#fff', marginBottom: '8px', lineHeight: 1.3 }}>
              {v.char}
            </div>
            <div style={{ color: v.color, fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>{v.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontFamily: 'monospace', fontWeight: '600' }}>"{v.latin}"</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginTop: '4px' }}>{v.desc}</div>
            <div style={{ marginTop: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', padding: '4px', fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>
              🔊 Cliquer
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

// Composant détail de lettre
const LetterDetail = memo(({ letter }) => {
  const forms = [
    { label: 'Isolée', form: letter.isolated, desc: 'Seule' },
    { label: 'Initiale', form: letter.initial, desc: 'Début de mot' },
    { label: 'Médiane', form: letter.medial, desc: 'Milieu de mot' },
    { label: 'Finale', form: letter.final, desc: 'Fin de mot' },
  ]

  return (
    <div style={styles.panel}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ color: '#d4af37', fontSize: '28px', fontWeight: '600', margin: 0 }}>{letter.name}</h2>
          <p style={{ color: '#8ec8d8', fontSize: '14px', margin: '4px 0 0 0' }}>
            Translitération: <strong>{letter.transliteration}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontFamily: "'Amiri', serif", fontSize: '64px', color: '#fff' }}>{letter.isolated}</div>
          <AudioButton onClick={() => playSound(letter.isolated)} size={64} />
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ color: '#8ec8d8', fontSize: '14px', marginBottom: '12px', fontWeight: '500' }}>📝 Les 4 formes d'écriture</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px' }}>
          {forms.map((f, i) => (
            <div 
              key={i}
              onClick={() => playSound(f.form)}
              style={{
                background: 'rgba(212, 175, 55, 0.1)',
                borderRadius: '12px',
                padding: '16px 8px',
                textAlign: 'center',
                cursor: 'pointer',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ fontFamily: "'Amiri', serif", fontSize: '36px', color: '#fff', marginBottom: '6px' }}>{f.form}</div>
              <div style={{ color: '#d4af37', fontSize: '12px', fontWeight: '600' }}>{f.label}</div>
              <div style={{ color: 'rgba(142, 200, 216, 0.6)', fontSize: '10px', marginTop: '2px' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <VowelSounds letter={letter} />
    </div>
  )
})

// Section Harakat
const HarakatSection = () => {
  const [selectedLetter, setSelectedLetter] = useState(arabicAlphabet[1])

  return (
    <div style={styles.panel}>
      <h2 style={{ color: '#d4af37', fontSize: '24px', marginBottom: '8px', textAlign: 'center' }}>
        الحَرَكَات - Les Voyelles & Signes
      </h2>
      <p style={{ color: '#8ec8d8', textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>
        Cliquez sur chaque signe pour entendre sa prononciation
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {harakat.map((h, i) => (
          <div
            key={i}
            onClick={() => playSound(h.example)}
            style={{
              background: `linear-gradient(145deg, ${h.color}15, ${h.color}08)`,
              borderRadius: '16px',
              padding: '20px',
              cursor: 'pointer',
              border: `2px solid ${h.color}40`,
              transition: 'all 0.3s ease',
              textAlign: 'center',
            }}
          >
            <div style={{ fontFamily: "'Amiri', serif", fontSize: '52px', color: '#fff', marginBottom: '8px', lineHeight: 1.2 }}>
              {h.example}
            </div>
            <div style={{ color: h.color, fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>{h.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '8px' }}>{h.description}</div>
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '6px', padding: '6px 10px', display: 'inline-block' }}>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>Position: {h.position}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '24px' }}>
        <h3 style={{ color: '#d4af37', fontSize: '18px', marginBottom: '16px', textAlign: 'center' }}>
          🎯 Testez les voyelles avec une lettre
        </h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#8ec8d8', fontSize: '13px', marginBottom: '8px', display: 'block' }}>Choisissez une lettre:</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '120px', overflowY: 'auto', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            {arabicAlphabet.map((letter, i) => (
              <button
                key={i}
                onClick={() => setSelectedLetter(letter)}
                style={{
                  fontFamily: "'Amiri', serif",
                  fontSize: '24px',
                  background: selectedLetter.name === letter.name ? '#d4af37' : 'rgba(212, 175, 55, 0.1)',
                  color: selectedLetter.name === letter.name ? '#0d2b36' : '#fff',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                }}
              >
                {letter.isolated}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px' }}>
          {[
            { name: 'Fatha', char: selectedLetter.withFatha, latin: `${selectedLetter.transliteration.split('/')[0]}a`, color: '#ff6b6b' },
            { name: 'Kasra', char: selectedLetter.withKasra, latin: `${selectedLetter.transliteration.split('/')[0]}i`, color: '#4ecdc4' },
            { name: 'Damma', char: selectedLetter.withDamma, latin: `${selectedLetter.transliteration.split('/')[0]}u`, color: '#ffe66d' },
            { name: 'Sukun', char: selectedLetter.withSukun, latin: `${selectedLetter.transliteration.split('/')[0]}`, color: '#95afc0' },
          ].map((v, i) => (
            <div
              key={i}
              onClick={() => playSound(v.char)}
              style={{
                background: `linear-gradient(145deg, ${v.color}20, ${v.color}10)`,
                border: `2px solid ${v.color}50`,
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ fontFamily: "'Amiri', serif", fontSize: '48px', color: '#fff', marginBottom: '8px' }}>{v.char}</div>
              <div style={{ color: v.color, fontSize: '14px', fontWeight: '700' }}>{v.name}</div>
              <div style={{ color: '#fff', fontSize: '16px', fontWeight: '600', marginTop: '4px' }}>"{v.latin}"</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '8px' }}>🔊 Cliquer</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Quiz Mode
const QuizMode = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [options, setOptions] = useState([])
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [quizType, setQuizType] = useState('identify')
  const [streak, setStreak] = useState(0)

  const generateQuestion = useCallback(() => {
    const letter = arabicAlphabet[Math.floor(Math.random() * arabicAlphabet.length)]
    
    if (quizType === 'identify') {
      const wrongOptions = arabicAlphabet.filter(l => l.name !== letter.name).sort(() => Math.random() - 0.5).slice(0, 3)
      setCurrentQuestion({ letter, type: 'identify' })
      setOptions([...wrongOptions, letter].sort(() => Math.random() - 0.5))
    } else if (quizType === 'form') {
      const forms = ['isolated', 'initial', 'medial', 'final']
      const formLabels = { isolated: 'Isolée', initial: 'Initiale', medial: 'Médiane', final: 'Finale' }
      const correctForm = forms[Math.floor(Math.random() * forms.length)]
      setCurrentQuestion({ letter, correctForm, formLabel: formLabels[correctForm], type: 'form' })
      setOptions(forms.map(f => ({ key: f, label: formLabels[f], char: letter[f] })))
    } else {
      const vowels = ['Fatha', 'Kasra', 'Damma']
      const vowelKeys = { Fatha: 'withFatha', Kasra: 'withKasra', Damma: 'withDamma' }
      const correctVowel = vowels[Math.floor(Math.random() * vowels.length)]
      setCurrentQuestion({ letter, correctVowel, vowelChar: letter[vowelKeys[correctVowel]], type: 'sound' })
      setOptions(vowels.map(v => ({ name: v, char: letter[vowelKeys[v]], latin: v === 'Fatha' ? 'a' : v === 'Kasra' ? 'i' : 'u' })))
    }
    setFeedback(null)
  }, [quizType])

  // Jouer automatiquement le son pour le mode identify
  useEffect(() => {
    if (currentQuestion && currentQuestion.type === 'identify') {
      setTimeout(() => playSound(currentQuestion.letter.isolated), 300)
    }
  }, [currentQuestion])

  useEffect(() => { generateQuestion() }, [generateQuestion])

  const handleAnswer = (answer) => {
    let isCorrect = false
    if (currentQuestion.type === 'identify') isCorrect = answer.name === currentQuestion.letter.name
    else if (currentQuestion.type === 'form') isCorrect = answer.key === currentQuestion.correctForm
    else isCorrect = answer.name === currentQuestion.correctVowel

    setTotal(t => t + 1)
    if (isCorrect) {
      setScore(s => s + 1)
      setStreak(s => s + 1)
      setFeedback({ correct: true, message: 'Excellent ! 🌟' })
      playSound(currentQuestion.letter.isolated)
    } else {
      setStreak(0)
      const correctAnswer = currentQuestion.type === 'identify' ? currentQuestion.letter.name 
        : currentQuestion.type === 'form' ? currentQuestion.formLabel : currentQuestion.correctVowel
      setFeedback({ correct: false, message: `Incorrect. Réponse: ${correctAnswer}` })
    }
    setTimeout(() => generateQuestion(), 1800)
  }

  if (!currentQuestion) return null

  return (
    <div style={styles.panel}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ background: 'rgba(212, 175, 55, 0.15)', borderRadius: '12px', padding: '12px 20px' }}>
            <div style={{ color: '#8ec8d8', fontSize: '11px' }}>Score</div>
            <div style={{ color: '#d4af37', fontSize: '24px', fontWeight: '700' }}>{score}/{total}</div>
          </div>
          <div style={{ background: 'rgba(212, 175, 55, 0.15)', borderRadius: '12px', padding: '12px 20px' }}>
            <div style={{ color: '#8ec8d8', fontSize: '11px' }}>Série</div>
            <div style={{ color: '#fff', fontSize: '24px', fontWeight: '700' }}>🔥 {streak}</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[{ id: 'identify', label: '🔤 Identifier' }, { id: 'form', label: '✍️ Formes' }, { id: 'sound', label: '🔊 Sons' }].map(t => (
            <button
              key={t.id}
              onClick={() => { setQuizType(t.id); setScore(0); setTotal(0); setStreak(0) }}
              style={{
                background: quizType === t.id ? '#d4af37' : 'transparent',
                color: quizType === t.id ? '#0d2b36' : '#8ec8d8',
                border: '1px solid #d4af37',
                borderRadius: '8px',
                padding: '8px 14px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{ color: '#8ec8d8', fontSize: '16px', marginBottom: '16px' }}>
          {currentQuestion.type === 'identify' && 'Écoutez et identifiez la lettre'}
          {currentQuestion.type === 'form' && `Écoutez et cliquez sur la forme "${currentQuestion.formLabel}":`}
          {currentQuestion.type === 'sound' && 'Écoutez et identifiez la voyelle:'}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
          <div 
            onClick={() => playSound(currentQuestion.type === 'sound' ? currentQuestion.vowelChar : currentQuestion.letter.isolated)}
            style={{
              fontFamily: currentQuestion.type === 'identify' ? "'Segoe UI', sans-serif" : "'Amiri', serif",
              fontSize: '100px',
              color: '#d4af37',
              textShadow: '0 4px 30px rgba(212, 175, 55, 0.5)',
              cursor: 'pointer',
              lineHeight: 1.2,
              userSelect: 'none',
            }}
          >
            {currentQuestion.type === 'identify' ? '?' : currentQuestion.letter.isolated}
          </div>
          <AudioButton 
            onClick={() => playSound(currentQuestion.type === 'sound' ? currentQuestion.vowelChar : currentQuestion.letter.isolated)} 
            size={64} 
          />
        </div>
        <div style={{ color: 'rgba(142, 200, 216, 0.6)', fontSize: '12px', marginTop: '8px' }}>🔊 Cliquez pour écouter</div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: currentQuestion.type === 'identify' ? 'repeat(2, 1fr)' : currentQuestion.type === 'sound' ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '24px',
      }}>
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            disabled={feedback !== null}
            style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '16px',
              padding: '16px',
              cursor: feedback ? 'default' : 'pointer',
              opacity: feedback ? 0.7 : 1,
            }}
          >
            {currentQuestion.type === 'identify' && (
              <>
                <div style={{ fontFamily: "'Amiri', serif", fontSize: '42px', color: '#fff', marginBottom: '6px' }}>{opt.isolated}</div>
              </>
            )}
            {currentQuestion.type === 'form' && (
              <>
                <div style={{ fontFamily: "'Amiri', serif", fontSize: '38px', color: '#fff', marginBottom: '6px' }}>{opt.char}</div>
              </>
            )}
            {currentQuestion.type === 'sound' && (
              <>
                <div style={{ fontFamily: "'Amiri', serif", fontSize: '36px', color: '#fff', marginBottom: '6px' }}>{opt.char}</div>
                <div style={{ color: '#d4af37', fontSize: '14px', fontWeight: '600' }}>{opt.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>"{opt.latin}"</div>
              </>
            )}
          </button>
        ))}
      </div>

      {feedback && (
        <div style={{
          background: feedback.correct ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
          border: `2px solid ${feedback.correct ? '#4CAF50' : '#f44336'}`,
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
        }}>
          <div style={{ color: feedback.correct ? '#4CAF50' : '#f44336', fontSize: '18px', fontWeight: '600' }}>
            {feedback.message}
          </div>
        </div>
      )}
    </div>
  )
}

// App principal
export default function App() {
  const [mode, setMode] = useState('learn')
  const [selectedLetter, setSelectedLetter] = useState(null)
  const [showAllDetails, setShowAllDetails] = useState(true)

  return (
    <div style={styles.container}>
      <div style={styles.decorPattern} />
      <div style={styles.content}>
        <header style={{ textAlign: 'center', marginBottom: '32px', paddingTop: '16px' }}>
          <h1 style={styles.title}>الأبجدية العربية</h1>
          <p style={styles.subtitle}>Apprends l'Alphabet Arabe</p>
          
          <nav style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '24px', flexWrap: 'wrap' }}>
            {[{ id: 'learn', label: '📖 Lettres' }, { id: 'harakat', label: '◌َ Voyelles' }, { id: 'quiz', label: '🎯 Quiz' }].map(tab => (
              <button key={tab.id} onClick={() => setMode(tab.id)} style={styles.navBtn(mode === tab.id)}>
                {tab.label}
              </button>
            ))}
          </nav>
        </header>

        {mode === 'learn' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ color: '#8ec8d8', fontSize: '13px' }}>Translitération:</span>
              <button
                onClick={() => setShowAllDetails(!showAllDetails)}
                style={{
                  background: showAllDetails ? '#d4af37' : 'rgba(212, 175, 55, 0.2)',
                  color: showAllDetails ? '#0d2b36' : '#d4af37',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '6px 16px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                {showAllDetails ? 'Oui' : 'Non'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '12px', marginBottom: '28px' }}>
              {arabicAlphabet.map((letter, i) => (
                <LetterCard
                  key={i}
                  letter={letter}
                  isSelected={selectedLetter?.name === letter.name}
                  onClick={() => {
                    setSelectedLetter(selectedLetter?.name === letter.name ? null : letter)
                    playSound(letter.isolated)
                  }}
                  showDetails={showAllDetails}
                />
              ))}
            </div>

            {selectedLetter && <LetterDetail letter={selectedLetter} />}
          </div>
        )}

        {mode === 'harakat' && <HarakatSection />}
        {mode === 'quiz' && <QuizMode />}

        <footer style={{ textAlign: 'center', marginTop: '40px', padding: '20px', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <p style={{ color: 'rgba(142, 200, 216, 0.6)', fontSize: '12px' }}>
            🔊 Cliquez sur n'importe quelle lettre pour l'écouter
          </p>
        </footer>
      </div>
    </div>
  )
}
