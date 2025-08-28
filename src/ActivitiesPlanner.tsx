import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Upload, Printer, Plus, Trash2, AlertTriangle, X } from "lucide-react";

// Tailwind-based, single-file React + TypeScript app
// — Visualize activities (Midday/Afternoon by weekday)
// — Add kids (color-coded)
// — Assign kids to activities
// — See a financial summary (monthly normalized and per-term)
// — Export/Import your plan as JSON (local-only)
// — Prints nicely

// ——— i18n (minimal, inline, module scope so ActivityCard can use) ———
type Lang = 'en' | 'es' | 'ca';
const I18N: Record<Lang, Record<string, string>> = {
  en: {
    title: 'Activities Planner',
    addKid: 'Add Kid',
    add: 'Add',
    namePlaceholder: 'Name',
    allKids: 'All Kids',
    middayAndAfternoon: 'Midday & Afternoon',
    middayOnly: 'Midday Only',
    afternoonOnly: 'Afternoon Only',
    allDays: 'All Days',
    onlyAssigned: 'Only assigned activities',
    onlyAssignedSuffixForKid: 'for this kid',
    normalizedToggle: 'Show monthly normalized prices',
    materialsInfo: 'Materials fees are charged once per kid per activity',
    clearAll: 'Clear All',
    clearAllConfirm: 'Are you sure you want to clear all data?',
    import: 'Import Plan',
    importInvalid: 'Invalid import data',
    export: 'Export Plan',
    print: 'Print',
    conflictsTitle: 'Conflicts',
    remove: 'Remove',
    filters: 'Filters',
    financialView: 'Financial view',
    schedule: 'Schedule',
    day: 'Day',
    midday: 'Midday',
    afternoon: 'Afternoon',
    noActivities: 'No activities',
    financialSummary: 'Financial summary',
    addKidsHint: 'Add kids and assign activities to see the summary',
    kid: 'Kid',
    monthlyNorm: 'Monthly (normalized)',
    termTotal: 'Term total',
    materialsOnce: 'Materials (once)',
    perMonthShort: 'mo',
    perTermShort: 'term',
    total: 'Total',
    note: 'Note: Monthly normalized divides per-term prices by ~3 months/term.',
    legendGrades: 'Grades:',
    legendText: 'I3–I5 (Infantil) and 1st–6th (Primary).',
    andMore: '...and {count} more',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    timeMiddaySlot: 'Midday slot',
    timeAfternoonSlot: 'Afternoon slot',
    plusMaterialsOnce: '+ {fee}€ materials (once)',
    noKidsAssigned: 'No kids assigned yet',
    removeKidTitle: 'Remove {name}',
    addKidsFirst: 'Add kids first',
    assignKidTitle: 'Assign kid',
    assignKid: '+ Assign kid',
    allKidsAssigned: 'All kids assigned',
    notEligibleTitle: 'Not eligible: {kidGrade} vs {activityGrades}',
    notEligibleShort: 'not eligible',
    notEligibleAlert: '{kidName} ({kidGrade}) is not eligible for {activityName} ({activityGrades}).',
    slot: 'slot',
  },
  es: {
    title: 'Planificador de Actividades',
    addKid: 'Agregar Niño',
    add: 'Agregar',
    namePlaceholder: 'Nombre',
    allKids: 'Todos los Niños',
    middayAndAfternoon: 'Mediodía y Tarde',
    middayOnly: 'Solo Mediodía',
    afternoonOnly: 'Solo Tarde',
    allDays: 'Todos los Días',
    onlyAssigned: 'Solo actividades asignadas',
    onlyAssignedSuffixForKid: 'para este niño',
    normalizedToggle: 'Mostrar precios normalizados mensuales',
    materialsInfo: 'Los costos de materiales se cobran una vez por niño por actividad',
    clearAll: 'Borrar Todo',
    clearAllConfirm: '¿Estás seguro de que deseas borrar todos los datos?',
    import: 'Importar Plan',
    importInvalid: 'Datos de importación inválidos',
    export: 'Exportar Plan',
    print: 'Imprimir',
    conflictsTitle: 'Conflictos',
    remove: 'Eliminar',
    filters: 'Filtros',
    financialView: 'Vista financiera',
    schedule: 'Horario',
    day: 'Día',
    midday: 'Mediodía',
    afternoon: 'Tarde',
    noActivities: 'Sin actividades',
    financialSummary: 'Resumen financiero',
    addKidsHint: 'Añade niños y asigna actividades para ver el resumen',
    kid: 'Niño',
    monthlyNorm: 'Mensual (normalizado)',
    termTotal: 'Total por trimestre',
    materialsOnce: 'Materiales (una vez)',
    perMonthShort: 'mes',
    perTermShort: 'trimestre',
    total: 'Total',
    note: 'Nota: El mensual normalizado divide los precios por trimestre entre ~3 meses.',
    legendGrades: 'Cursos:',
    legendText: 'I3–I5 (Infantil) y 1º–6º (Primaria).',
    andMore: '...y {count} más',
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    timeMiddaySlot: 'Turno de mediodía',
    timeAfternoonSlot: 'Turno de tarde',
    plusMaterialsOnce: '+ {fee}€ materiales (una vez)',
    noKidsAssigned: 'Sin niños asignados',
    removeKidTitle: 'Quitar a {name}',
    addKidsFirst: 'Añade niños primero',
    assignKidTitle: 'Asignar niño',
    assignKid: '+ Asignar niño',
    allKidsAssigned: 'Todos los niños asignados',
    notEligibleTitle: 'No elegible: {kidGrade} vs {activityGrades}',
    notEligibleShort: 'no elegible',
    notEligibleAlert: '{kidName} ({kidGrade}) no es elegible para {activityName} ({activityGrades}).',
    slot: 'turno',
  },
  ca: {
    title: "Planificador d'Activitats",
    addKid: 'Afegir Infant',
    add: 'Afegir',
    namePlaceholder: 'Nom',
    allKids: 'Tots els Infants',
    middayAndAfternoon: 'Migdia i Tarda',
    middayOnly: 'Només Migdia',
    afternoonOnly: 'Només Tarda',
    allDays: 'Tots els Dies',
    onlyAssigned: 'Només activitats assignades',
    onlyAssignedSuffixForKid: 'per a aquest infant',
    normalizedToggle: 'Mostrar preus normalitzats mensuals',
    materialsInfo: "Els costos de materials es cobren una vegada per infant per activitat",
    clearAll: 'Esborrar Tot',
    clearAllConfirm: 'Esteu segur que voleu esborrar totes les dades?',
    import: 'Importar Pla',
    importInvalid: 'Dades d\'importació invàlides',
    export: 'Exportar Pla',
    print: 'Imprimir',
    conflictsTitle: 'Conflictes',
    remove: 'Eliminar',
    filters: 'Filtres',
    financialView: 'Vista financera',
    schedule: 'Horari',
    day: 'Dia',
    midday: 'Migdia',
    afternoon: 'Tarda',
    noActivities: 'Sense activitats',
    financialSummary: 'Resum financer',
    addKidsHint: 'Afegeix infants i assigna activitats per veure el resum',
    kid: 'Infant',
    monthlyNorm: 'Mensual (normalitzat)',
    termTotal: 'Total per trimestre',
    materialsOnce: 'Materials (una vegada)',
    perMonthShort: 'mes',
    perTermShort: 'trimestre',
    total: 'Total',
    note: 'Nota: El mensual normalitzat divideix els preus trimestrals entre ~3 mesos.',
    legendGrades: 'Cursos:',
    legendText: 'I3–I5 (Infantil) i 1r–6è (Primària).',
    andMore: '...i {count} més',
    monday: 'Dilluns',
    tuesday: 'Dimarts',
    wednesday: 'Dimecres',
    thursday: 'Dijous',
    friday: 'Divendres',
    timeMiddaySlot: 'Torn de migdia',
    timeAfternoonSlot: 'Torn de tarda',
    plusMaterialsOnce: '+ {fee}€ materials (una vegada)',
    noKidsAssigned: 'Sense infants assignats',
    removeKidTitle: 'Treure {name}',
    addKidsFirst: 'Afegeix infants primer',
    assignKidTitle: 'Assignar infant',
    assignKid: '+ Assignar infant',
    allKidsAssigned: 'Tots els infants assignats',
    notEligibleTitle: 'No elegible: {kidGrade} vs {activityGrades}',
    notEligibleShort: 'no elegible',
    notEligibleAlert: '{kidName} ({kidGrade}) no és elegible per a {activityName} ({activityGrades}).',
    slot: 'torn',
  },
};

const t = (lang: Lang, key: string, vars?: Record<string, string | number>) => {
  let str = I18N[lang][key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return str;
};

/**
 * Data models
 */
 type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
 type Slot = "Midday" | "Afternoon";
 type Period = "month" | "term";

 type Activity = {
  id: string;
  name: string;
  day: Day;
  slot: Slot;
  /** Example: "12:30–13:30" or "16:30–17:45". If an activity spans two potential lunch turns, we mark both in notes. */
  time?: string; // for conflict detection; if omitted, we'll assume it occupies the whole slot
  grades: string; // e.g., "I4/I5–2nd"
  price: number;
  period: Period; // month or term
  provider?: string; // e.g., UNICOR Languages, Musicarea, etc.
  location?: string; // e.g., Municipal Pool
  notes?: string; // free-form, e.g., "2×/week (Mon+Wed)"
  /** One-time materials fee — only charged once per kid per materialsKey */
  materialsFee?: number;
  materialsKey?: string; // unique key to dedupe per-kid materials fees
  /** Optional bundle key for special pricing across multiple days (e.g., Psychomotricity 1-day vs 2-days price) */
  bundleKey?: string; // e.g., "psychomotricity"
 };

 type GradeLevel = 'I3' | 'I4' | 'I5' | '1st' | '2nd' | '3rd' | '4th' | '5th' | '6th';

// Grade helpers (module-scope so both component and ActivityCard can use them)
const gradeOrder: Record<GradeLevel, number> = { I3: -2, I4: -1, I5: 0, '1st': 1, '2nd': 2, '3rd': 3, '4th': 4, '5th': 5, '6th': 6 };
const normalizeGradeToken = (s: string): GradeLevel | null => {
  const t = s.trim();
  const mI = t.match(/^I([3-5])$/i);
  if (mI) return (`I${mI[1]}`) as GradeLevel;
  const mN = t.match(/^([1-6])(st|nd|rd|th)$/i);
  if (mN) return (`${mN[1]}${mN[2].toLowerCase()}`) as GradeLevel;
  return null;
};
const isKidEligibleFor = (activity: Activity, kid: Kid): boolean => {
  const raw = (activity.grades || '').replace(/\(.*?\)/g, ''); // drop parentheticals like (G1)
  const parts = raw.split(/[,;&]|\band\b/i).map(s => s.trim()).filter(Boolean);
  const kidVal = gradeOrder[kid.grade];
  if (parts.length === 0) return true; // if unspecified, allow
  for (const part of parts) {
    const rangeSplit = part.split(/[–-]/); // en dash or hyphen
    if (rangeSplit.length === 1) {
      // Could be like "I4/I5" or single like "3rd"
      const alts = rangeSplit[0].split('/').map(s => normalizeGradeToken(s)).filter(Boolean) as GradeLevel[];
      if (alts.some(g => gradeOrder[g] === kidVal)) return true;
    } else if (rangeSplit.length === 2) {
      const leftAlts = rangeSplit[0].split('/').map(s => normalizeGradeToken(s)).filter(Boolean) as GradeLevel[];
      const rightTok = normalizeGradeToken(rangeSplit[1]);
      if (rightTok) {
        const start = Math.min(...leftAlts.map(g => gradeOrder[g]));
        const end = gradeOrder[rightTok];
        if (kidVal >= start && kidVal <= end) return true;
      }
    }
  }
  return false;
};
type Kid = {
  id: string;
  name: string;
  color: string; // hex color
  grade: GradeLevel; // school year
};

 type PlanState = {
  kids: Kid[];
  // Map activityId -> array of kidIds assigned
  assignments: Record<string, string[]>;
 };

 /**
  * Helpers
  */
 const uid = () => Math.random().toString(36).slice(2, 9);
 const DAYS: Day[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
 const SLOTS: Slot[] = ["Midday", "Afternoon"];

 const parseMinutes = (t: string): number | null => {
  // Accept formats like "16:30" or "16.30" or "16h30"
  const m = t.match(/(\d{1,2})[:h\.](\d{2})/);
  if (!m) return null;
  const hh = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  return hh * 60 + mm;
 };

 const parseTimeRange = (range?: string): [number, number] | null => {
  // Accept "16:30–17:45" or "12:30-13:30"
  if (!range) return null;
  const parts = range.split(/[–-]/);
  if (parts.length !== 2) return null;
  const a = parseMinutes(parts[0].trim());
  const b = parseMinutes(parts[1].trim());
  if (a == null || b == null) return null;
  return [a, b];
 };

 const overlap = (a: [number, number], b: [number, number]) => Math.max(a[0], b[0]) < Math.min(a[1], b[1]);

 /**
  * Activities dataset
  * Based on the official Gat per Lleure pages for Colegio Maria Ossó (Sitges) 2025–2026.
  * Notes reflect 2×/week pairings when applicable; each day appears as its own entry for clarity.
  */
 const ACTIVITIES: Activity[] = [
  // ————— MIDDAY —————
  // Monday
  { id: "m_en_i4-2_mon", name: "English (UNICOR)", day: "Monday", slot: "Midday", time: "12:30–13:30", grades: "I4/I5–2nd", price: 58, period: "month", provider: "UNICOR Languages", notes: "2×/week (Mon+Wed)", materialsFee: 40, materialsKey: "unicor-english" },
  { id: "m_theatre_3-6_mon", name: "Theatre (Núria Granell)", day: "Monday", slot: "Midday", time: "12:30–13:30", grades: "3rd–6th", price: 36, period: "month" },

  // Tuesday
  { id: "m_en_3-6_tue", name: "English (UNICOR)", day: "Tuesday", slot: "Midday", time: "12:30–13:30", grades: "3rd–6th", price: 58, period: "month", provider: "UNICOR Languages", notes: "2×/week (Tue+Thu)", materialsFee: 40, materialsKey: "unicor-english" },
  { id: "m_chess_1-2_tue", name: "Chess", day: "Tuesday", slot: "Midday", time: "12:30–13:30", grades: "1st–2nd", price: 75, period: "term" },
  { id: "m_rhythmic_tue", name: "Rhythmic Gymnastics", day: "Tuesday", slot: "Midday", time: "12:30–13:30", grades: "I4/I5–6th", price: 44, period: "month", notes: "2×/week (Tue+Thu)", provider: "Club Rítmica Sitges-Garraf" },
  { id: "m_taijitsu_g1_tue", name: "Tai-Jitsu (Group 1)", day: "Tuesday", slot: "Midday", time: "12:30–13:30", grades: "3rd–6th", price: 28, period: "month", provider: "Mari Carmen Vila" },

  // Wednesday
  { id: "m_en_i4-2_wed", name: "English (UNICOR)", day: "Wednesday", slot: "Midday", time: "12:30–13:30", grades: "I4/I5–2nd", price: 58, period: "month", provider: "UNICOR Languages", notes: "2×/week (Mon+Wed)", materialsFee: 40, materialsKey: "unicor-english" },
  { id: "m_chess_3-6_wed", name: "Chess", day: "Wednesday", slot: "Midday", time: "12:30–13:30", grades: "3rd–6th", price: 75, period: "term" },
  { id: "m_hiphop_wed", name: "Hip Hop", day: "Wednesday", slot: "Midday", time: "12:30–13:30", grades: "1st–6th", price: 28, period: "month", provider: "Anna Batista" },
  { id: "m_taijitsu_g2_wed", name: "Tai-Jitsu (Group 2)", day: "Wednesday", slot: "Midday", time: "12:30–13:30", grades: "I4/I5", price: 28, period: "month", provider: "Mari Carmen Vila" },
  { id: "m_taijitsu_g3_wed", name: "Tai-Jitsu (Group 3)", day: "Wednesday", slot: "Midday", time: "12:30–13:30", grades: "1st–2nd", price: 28, period: "month", provider: "Mari Carmen Vila" },

  // Thursday
  { id: "m_art_thu", name: "Creative Art", day: "Thursday", slot: "Midday", time: "12:30–13:30", grades: "I4/I5 (G1) & 1st–3rd (G2)", price: 78, period: "term", provider: "Irene Gil", materialsFee: 12, materialsKey: "creative-art-materials" },
  { id: "m_en_3-6_thu", name: "English (UNICOR)", day: "Thursday", slot: "Midday", time: "12:30–13:30", grades: "3rd–6th", price: 58, period: "month", provider: "UNICOR Languages", notes: "2×/week (Tue+Thu)", materialsFee: 40, materialsKey: "unicor-english" },
  { id: "m_robotics_thu", name: "Robotics", day: "Thursday", slot: "Midday", time: "12:30–13:30", grades: "1st–6th", price: 48, period: "month", provider: "Gerard Tristante" },
  { id: "m_rhythmic_thu", name: "Rhythmic Gymnastics", day: "Thursday", slot: "Midday", time: "12:30–13:30", grades: "I4/I5–6th", price: 44, period: "month", notes: "2×/week (Tue+Thu)", provider: "Club Rítmica Sitges-Garraf" },

  // Friday
  { id: "m_comic_fri", name: "Comic & Manga", day: "Friday", slot: "Midday", time: "12:30–13:30", grades: "3rd–6th", price: 33, period: "month", provider: "Jordi Inglada", notes: "Only 12:30–13:30 shift" },
  { id: "m_theatre_tracart_fri", name: "Theatre (TRACART)", day: "Friday", slot: "Midday", time: "12:30–13:30", grades: "I4/I5–2nd", price: 36, period: "month" },

  // ————— AFTERNOON —————
  // Monday
  { id: "a_psy_mo", name: "Psychomotricity", day: "Monday", slot: "Afternoon", time: "16:30–17:45", grades: "I3–I5", price: 75, period: "term", bundleKey: "psychomotricity" },
  { id: "a_cooking_mo", name: "Creative Cooking", day: "Monday", slot: "Afternoon", time: "16:30–17:45", grades: "1st–6th", price: 45, period: "month" },
  { id: "a_futsal_mo", name: "Futsal", day: "Monday", slot: "Afternoon", time: "16:30–17:45", grades: "1st–6th", price: 75, period: "term" },
  { id: "a_acogida_mo", name: "Acogida", day: "Monday", slot: "Afternoon", time: "16:30–17:30", grades: "I4–6th", price: 35, period: "month" },

  // Tuesday
  { id: "a_swim_tu", name: "Swimming", day: "Tuesday", slot: "Afternoon", time: "16:30–17:45", grades: "I3–6th", price: 147, period: "term", location: "Municipal Pool (Sitges)" },
  { id: "a_padel_tu", name: "Padel", day: "Tuesday", slot: "Afternoon", time: "16:30–17:45", grades: "1st–6th", price: 147, period: "term", location: "Municipal Pool (Sitges)" },
  { id: "a_basket_tu", name: "Basketball", day: "Tuesday", slot: "Afternoon", time: "16:30–17:45", grades: "1st–6th", price: 75, period: "term" },
  { id: "a_french_tu", name: "French (UNICOR)", day: "Tuesday", slot: "Afternoon", time: "16:30–17:45", grades: "I4/I5–6th", price: 36, period: "month", provider: "UNICOR Languages", materialsFee: 20, materialsKey: "unicor-french" },
  { id: "a_acogida_tu", name: "Acogida", day: "Tuesday", slot: "Afternoon", time: "16:30–17:30", grades: "I4–6th", price: 35, period: "month" },

  // Wednesday
  { id: "a_yoga12_we", name: "Creative Yoga", day: "Wednesday", slot: "Afternoon", time: "16:30–17:45", grades: "1st–2nd", price: 35, period: "month", provider: "Sara Argibay" },
  { id: "a_dance_we", name: "Creative Dance", day: "Wednesday", slot: "Afternoon", time: "16:30–17:30", grades: "I4/I5–2nd", price: 75, period: "term", provider: "Eva Hernández" },
  { id: "a_skate_we", name: "Skateboarding", day: "Wednesday", slot: "Afternoon", time: "16:30–17:45", grades: "1st–6th", price: 120, period: "term" },
  { id: "a_beginskate_we", name: "Beginner Skating", day: "Wednesday", slot: "Afternoon", time: "16:30–17:45", grades: "I4/I5–2nd", price: 75, period: "term" },
  { id: "a_lettering_we", name: "Lettering (Hand-lettering)", day: "Wednesday", slot: "Afternoon", time: "16:30–17:45", grades: "I4/I5–6th", price: 35, period: "month", provider: "Mercè Pedraza" },
  { id: "a_acogida_we", name: "Acogida", day: "Wednesday", slot: "Afternoon", time: "16:30–17:30", grades: "I4–6th", price: 35, period: "month" },

  // Thursday
  { id: "a_psy_th", name: "Psychomotricity", day: "Thursday", slot: "Afternoon", time: "16:30–17:45", grades: "I3–I5", price: 75, period: "term", bundleKey: "psychomotricity" },
  { id: "a_yoga_i4i5_th", name: "Creative Yoga", day: "Thursday", slot: "Afternoon", time: "16:30–17:45", grades: "I4/I5", price: 35, period: "month", provider: "Sara Argibay" },
  { id: "a_sportsinit_th", name: "Sports Initiation", day: "Thursday", slot: "Afternoon", time: "16:30–17:45", grades: "1st–2nd", price: 75, period: "term" },
  { id: "a_tennis_th", name: "Tennis at school", day: "Thursday", slot: "Afternoon", time: "16:30–17:45", grades: "1st–6th", price: 35, period: "month", provider: "Izan Madera" },
  { id: "a_acogida_th", name: "Acogida", day: "Thursday", slot: "Afternoon", time: "16:30–17:30", grades: "I4–6th", price: 35, period: "month" },

  // Friday
  { id: "a_ukulele_fr", name: "Ukulele", day: "Friday", slot: "Afternoon", time: "16:30–17:45", grades: "2nd–6th", price: 45, period: "month", provider: "Musicarea", notes: "Bring your ukulele (options shared at start of term)" },
  { id: "a_musicsense_fr", name: "Music Sensitization", day: "Friday", slot: "Afternoon", time: "16:30–17:45", grades: "I4/I5–1st", price: 45, period: "month", provider: "Musicarea" },
  { id: "a_fencing_fr", name: "Fencing", day: "Friday", slot: "Afternoon", time: "16:30–17:45", grades: "1st–6th", price: 38, period: "month", provider: "SAG Club d'Esgrima" },
  { id: "a_acogida_fr", name: "Acogida", day: "Friday", slot: "Afternoon", time: "16:30–17:30", grades: "I4–6th", price: 35, period: "month" },
 ];

 /**
  * Pricing logic
  * — month: use as-is for monthly view
  * — term: for normalized-monthly view, divide by 3 (≈ 3 months/term)
  * — bundles: psychomotricity (Mon+Thu) is 75€/term for 1 day or 135€/term for 2 days (per kid)
  */
 function computeFinancials(
  plan: PlanState,
  normalizeMonthly: boolean
 ) {
  const perKid = new Map<string, { monthly: number; term: number; monthItems: number; materials: number }>();
  const kidMaterialsKeys = new Map<string, Set<string>>();

  // Initialize
  for (const kid of plan.kids) {
    perKid.set(kid.id, { monthly: 0, term: 0, monthItems: 0, materials: 0 });
    kidMaterialsKeys.set(kid.id, new Set());
  }

  // Psychomotricity bundle handling
  // Collect psychomotricity selections per kid
  const psychoCountByKid = new Map<string, number>();
  for (const [actId, kidIds] of Object.entries(plan.assignments)) {
    const act = ACTIVITIES.find(a => a.id === actId);
    if (!act) continue;
    kidIds.forEach(kidId => {
      if (act.bundleKey === "psychomotricity") {
        psychoCountByKid.set(kidId, (psychoCountByKid.get(kidId) || 0) + 1);
      }
    });
  }

  // First pass: add up all non-bundle and month items, and collect materials
  for (const [actId, kidIds] of Object.entries(plan.assignments)) {
    const act = ACTIVITIES.find(a => a.id === actId);
    if (!act) continue;
    for (const kidId of kidIds) {
      const agg = perKid.get(kidId);
      if (!agg) continue;

      // Materials fee: charge once per kid per materialsKey
      if (act.materialsFee && act.materialsKey) {
        const set = kidMaterialsKeys.get(kidId)!;
        if (!set.has(act.materialsKey)) {
          set.add(act.materialsKey);
          agg.materials += act.materialsFee;
        }
      }

      // Skip psychomotricity here; handle as a bundle later in a second pass
      if (act.bundleKey === "psychomotricity") continue;

      if (act.period === "month") {
        agg.monthly += act.price;
      } else {
        // term item
        agg.term += act.price;
        if (normalizeMonthly) agg.monthly += act.price / 3;
      }
    }
  }

  // Second pass: apply psychomotricity bundle per kid
  for (const kid of plan.kids) {
    const count = psychoCountByKid.get(kid.id) || 0;
    if (count === 0) continue;
    const agg = perKid.get(kid.id)!;
    const bundleTerm = count >= 2 ? 135 : 75; // one price per kid regardless of 2+ selections (cap at 2)
    agg.term += bundleTerm;
    if (normalizeMonthly) agg.monthly += bundleTerm / 3;
  }

  // Totals
  let totalMonthly = 0, totalTerm = 0, totalMaterials = 0;
  for (const agg of perKid.values()) {
    totalMonthly += agg.monthly;
    totalTerm += agg.term;
    totalMaterials += agg.materials;
  }

  return { perKid, totalMonthly, totalTerm, totalMaterials };
 }

 /**
  * Conflict detection: when the same kid is assigned to two overlapping activities on the same day & slot.
  * If time is missing, we treat the whole slot as potentially conflicting.
  */
 function listConflicts(plan: PlanState) {
  type Crash = { kidId: string; kidName: string; day: Day; slot: Slot; a: Activity; b: Activity };
  const result: Crash[] = [];

  for (const kid of plan.kids) {
    for (const day of DAYS) {
      for (const slot of SLOTS) {
        const selected = ACTIVITIES.filter(a => a.day === day && a.slot === slot && (plan.assignments[a.id] || []).includes(kid.id));
        for (let i = 0; i < selected.length; i++) {
          for (let j = i + 1; j < selected.length; j++) {
            const A = selected[i], B = selected[j];
            const ra = parseTimeRange(A.time || (slot === "Midday" ? "12:30–14:40" : "16:30–18:00"));
            const rb = parseTimeRange(B.time || (slot === "Midday" ? "12:30–14:40" : "16:30–18:00"));
            if (!ra || !rb || overlap(ra, rb)) {
              result.push({ kidId: kid.id, kidName: kid.name, day, slot, a: A, b: B });
            }
          }
        }
      }
    }
  }
  return result;
 }

 /**
  * Local storage helpers
  */
 const LS_KEY = "maria-osso-planner-v1";
 function loadState(): PlanState | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PlanState;
  } catch {
    return null;
  }
 }
 function saveState(state: PlanState) {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
 }

 /**
  * Main Component
  */
 export default function ActivitiesPlanner() {
  const [plan, setPlan] = useState<PlanState>(() => loadState() || { kids: [], assignments: {} });
  const [normalizeMonthly, setNormalizeMonthly] = useState(true);
  const [filterKidId, setFilterKidId] = useState<string | "all">("all");
  const [filterSlot, setFilterSlot] = useState<Slot | "both">("both");
  const [filterDay, setFilterDay] = useState<Day | "all">("all");
  const [onlyAssignedForKid, setOnlyAssignedForKid] = useState(false);
  const [lang, setLang] = useState<Lang>('es');


  // Kid form state
  const [newKidName, setNewKidName] = useState("");
  const [newKidColor, setNewKidColor] = useState("#22c55e");
  const [newKidGrade, setNewKidGrade] = useState<GradeLevel>('1st');

  // Back-compat: ensure existing kids have a grade
  useEffect(() => {
    const needsMigration = plan.kids.some(k => (k as any).grade === undefined);
    if (needsMigration) {
      setPlan(p => ({
        ...p,
        kids: p.kids.map(k => ({ ...k, grade: ((k as any).grade ?? '1st') as GradeLevel }))
      }));
      return; // avoid saving twice
    }
    saveState(plan);
  }, [plan]);

  const financials = useMemo(() => computeFinancials(plan, normalizeMonthly), [plan, normalizeMonthly]);
  const conflicts = useMemo(() => listConflicts(plan), [plan]);

  const addKid = () => {
    const name = newKidName.trim();
    if (!name) return;
    const kid: Kid = { id: uid(), name, color: newKidColor, grade: newKidGrade };
    setPlan(p => ({ ...p, kids: [...p.kids, kid] }));
    setNewKidName("");
    // keep chosen color; reset grade to default for convenience
    setNewKidGrade('1st');
  };

  const removeKid = (kidId: string) => {
    setPlan(p => {
      const kids = p.kids.filter(k => k.id !== kidId);
      const assignments: Record<string, string[]> = {};
      for (const [actId, arr] of Object.entries(p.assignments)) {
        assignments[actId] = arr.filter(id => id !== kidId);
      }
      return { kids, assignments };
    });
  };

  // grade helpers moved to module scope

  const toggleAssignment = (activityId: string, kidId: string) => {
    setPlan(p => {
      const current = p.assignments[activityId] || [];
      const exists = current.includes(kidId);
      // When assigning (not removing), enforce grade eligibility
      if (!exists) {
        const activity = ACTIVITIES.find(a => a.id === activityId);
        const kid = p.kids.find(k => k.id === kidId) as Kid | undefined;
        if (activity && kid && !isKidEligibleFor(activity, kid)) {
          alert(t(lang, 'notEligibleAlert', { kidName: kid.name, kidGrade: kid.grade, activityName: activity.name, activityGrades: activity.grades }));
          return p; // no change
        }
      }
      const next = exists ? current.filter(id => id !== kidId) : [...current, kidId];
      return { ...p, assignments: { ...p.assignments, [activityId]: next } };
    });
  };

  const exportPlan = () => {
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `maria-osso-plan-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importPlan = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as PlanState;
        setPlan(data);
      } catch (e) {
        alert(t(lang, 'importInvalid'));
      }
    };
    reader.readAsText(file);
  };

  const clearAll = () => {
    if (!confirm(t(lang, 'clearAllConfirm'))) return;
    setPlan({ kids: [], assignments: {} });
  };

  const filteredActivities = ACTIVITIES.filter(a => {
    const assigned = plan.assignments[a.id] || [];
    const slotOk = (filterSlot === "both" || a.slot === filterSlot);
    const dayOk = (filterDay === "all" || a.day === filterDay);
    if (!slotOk || !dayOk) return false;

    if (onlyAssignedForKid) {
      // If All kids, show activities that have any assignment
      if (filterKidId === "all") return assigned.length > 0;
      // If a kid is selected, show activities assigned to that kid
      return assigned.includes(filterKidId);
    } else {
      // Default behavior: if a kid is selected, filter to their activities; otherwise show all
      return (filterKidId === "all") || assigned.includes(filterKidId);
    }
  });

  // Group for grid rendering
  const byDaySlot: Record<Day, Record<Slot, Activity[]>> = {
    Monday: { Midday: [], Afternoon: [] },
    Tuesday: { Midday: [], Afternoon: [] },
    Wednesday: { Midday: [], Afternoon: [] },
    Thursday: { Midday: [], Afternoon: [] },
    Friday: { Midday: [], Afternoon: [] }
  };
  for (const a of filteredActivities) byDaySlot[a.day][a.slot].push(a);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700">
        <div className="w-full px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{t(lang, 'title')}</h1>
          <div className="flex gap-2 items-center">
            <select value={lang} onChange={e => setLang(e.target.value as Lang)} className="rounded-xl border px-2 py-1 text-sm bg-white dark:bg-slate-800 dark:border-slate-700">
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="ca">CA</option>
            </select>
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:border-slate-700">
              <Printer className="w-4 h-4"/> {t(lang, 'print')}
            </button>
            <button onClick={exportPlan} className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:border-slate-700">
              <Download className="w-4 h-4"/> {t(lang, 'export')}
            </button>
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl border bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:border-slate-700 cursor-pointer">
              <Upload className="w-4 h-4"/> {t(lang, 'import')}
              <input type="file" accept="application/json" className="hidden" onChange={e => e.target.files && importPlan(e.target.files[0])} />
            </label>
          </div>
        </div>
      </header>

      <main className="w-full px-4 md:px-6 py-6">
        {/* Controls */}
        <section className="grid md:grid-cols-3 gap-4 mb-6">
          {/* Add Kid */}
          <div className="rounded-2xl border bg-white dark:bg-slate-800 dark:border-slate-700 p-4 shadow-sm">
            <h2 className="font-medium mb-3">{t(lang, 'addKid')}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <input value={newKidName} onChange={e => setNewKidName(e.target.value)} placeholder={t(lang, 'namePlaceholder')} className="flex-1 rounded-xl border px-3 py-2 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400" />
              <input type="color" value={newKidColor} onChange={e => setNewKidColor(e.target.value)} className="h-10 w-12 rounded-xl border p-1 dark:border-slate-700" />
              <select value={newKidGrade} onChange={e => setNewKidGrade(e.target.value as GradeLevel)} className="rounded-xl border px-3 py-2 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 text-sm">
                <option value="I3">I3</option>
                <option value="I4">I4</option>
                <option value="I5">I5</option>
                <option value="1st">1st</option>
                <option value="2nd">2nd</option>
                <option value="3rd">3rd</option>
                <option value="4th">4th</option>
                <option value="5th">5th</option>
                <option value="6th">6th</option>
              </select>
              <button onClick={addKid} className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"><Plus className="w-4 h-4"/>{t(lang, 'add')}</button>
            </div>
            {plan.kids.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {plan.kids.map(k => (
                  <span key={k.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm dark:border-slate-700">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: k.color }} /> {k.name}
                    <span className="text-xs text-slate-500 dark:text-slate-300">({k.grade})</span>
                    <button onClick={() => removeKid(k.id)} className="ml-1 text-slate-400 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400" title={t(lang, 'remove')}><X className="w-4 h-4"/></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="rounded-2xl border bg-white dark:bg-slate-800 dark:border-slate-700 p-4 shadow-sm">
            <h2 className="font-medium mb-3">{t(lang, 'filters')}</h2>
            <div className="grid grid-cols-2 gap-2">
              <select value={filterKidId} onChange={e => setFilterKidId(e.target.value as any)} className="rounded-xl border px-3 py-2 bg-white text-slate-700 border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300/70 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:focus:ring-slate-600/60">
                <option value="all">{t(lang, 'allKids')}</option>
                {plan.kids.map(k => (
                  <option key={k.id} value={k.id}>{k.name}</option>
                ))}
              </select>
              <select value={filterSlot} onChange={e => setFilterSlot(e.target.value as any)} className="rounded-xl border px-3 py-2 text-slate-700 bg-white border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300/70 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:focus:ring-slate-600/60">
                <option value="both">{t(lang, 'middayAndAfternoon')}</option>
                <option value="Midday">{t(lang, 'middayOnly')}</option>
                <option value="Afternoon">{t(lang, 'afternoonOnly')}</option>
              </select>
              <select value={filterDay} onChange={e => setFilterDay(e.target.value as any)} className="rounded-xl border px-3 py-2 col-span-2 text-slate-700 bg-white border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300/70 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:focus:ring-slate-600/60">
                <option value="all">{t(lang, 'allDays')}</option>
                {DAYS.map(d => <option key={d} value={d}>{t(lang, d.toLowerCase() as any)}</option>)}
              </select>
              <label className="col-span-2 flex items-center gap-2 text-sm mt-1">
                <input
                  type="checkbox"
                  checked={onlyAssignedForKid}
                  onChange={e => setOnlyAssignedForKid(e.target.checked)}
                />
                <span>
                  {t(lang, 'onlyAssigned')} {filterKidId !== "all" && t(lang, 'onlyAssignedSuffixForKid')}
                </span>
              </label>
            </div>
          </div>

          {/* Finance toggle & housekeeping */}
          <div className="rounded-2xl border bg-white dark:bg-slate-800 dark:border-slate-700 p-4 shadow-sm">
            <h2 className="font-medium mb-3">{t(lang, 'financialView')}</h2>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={normalizeMonthly} onChange={e => setNormalizeMonthly(e.target.checked)} />
              <span>{t(lang, 'normalizedToggle')}</span>
            </label>
            <p className="text-sm text-slate-500 mt-2">{t(lang, 'materialsInfo')}</p>
            <div className="mt-3">
              <button onClick={clearAll} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-200 text-slate-900 hover:bg-slate-300 border border-slate-300 dark:bg-slate-600 dark:text-slate-100 dark:hover:bg-slate-500 dark:border-slate-600"><Trash2 className="w-4 h-4"/> {t(lang, 'clearAll')}</button>
            </div>
          </div>
        </section>

        {/* Conflicts */}
        {conflicts.length > 0 && (
          <div className="mb-6 rounded-2xl border bg-amber-50 dark:bg-amber-900/30 dark:border-amber-800 p-4 shadow-sm">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5"/>
              <div>
                <h3 className="font-medium text-amber-800">{t(lang, 'conflictsTitle')}</h3>
                <ul className="mt-2 text-sm text-amber-900 list-disc ml-5 space-y-1">
                  {conflicts.slice(0, 8).map((c, i) => (
                    <li key={i}><b>{c.kidName}</b>: {c.day} {c.slot} — "{c.a.name}" vs "{c.b.name}" ({c.a.time || t(lang, 'slot')} / {c.b.time || t(lang, 'slot')})</li>
                  ))}
                </ul>
                {conflicts.length > 8 && <p className="text-sm mt-1">{t(lang, 'andMore', { count: conflicts.length - 8 })}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Schedule Table: Day / Midday / Afternoon */}
        <section>
          <div className="rounded-2xl border bg-white dark:bg-slate-800 dark:border-slate-700 p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">{t(lang, 'schedule')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-fixed text-sm">
                <colgroup>
                  <col className="w-28" />
                  {(filterSlot === 'both' || filterSlot === 'Midday') && <col className="w-1/2" />}
                  {(filterSlot === 'both' || filterSlot === 'Afternoon') && <col className="w-1/2" />}
                </colgroup>
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-2 w-28">{t(lang, 'day')}</th>
                    { (filterSlot === 'both' || filterSlot === 'Midday') && <th className="py-2 px-2 w-1/2">{t(lang, 'midday')}</th> }
                    { (filterSlot === 'both' || filterSlot === 'Afternoon') && <th className="py-2 px-2 w-1/2">{t(lang, 'afternoon')}</th> }
                  </tr>
                </thead>
                <tbody>
                  {DAYS.filter(d => filterDay === 'all' || d === filterDay).map(day => (
                    <tr key={day} className="align-top border-b last:border-0">
                      <td className="py-3 pr-2 font-medium">{t(lang, day.toLowerCase() as any)}</td>
                      { (filterSlot === 'both' || filterSlot === 'Midday') && (
                        <td className="py-3 px-2 w-1/2">
                          <div className="space-y-3">
                            {byDaySlot[day]['Midday'].length === 0 && (
                              <p className="text-slate-400">{t(lang, 'noActivities')}</p>
                            )}
                            {byDaySlot[day]['Midday']
                              .slice()
                              .sort((a,b) => ((plan.assignments[b.id]?.length||0) - (plan.assignments[a.id]?.length||0)))
                              .map(act => (
                                <ActivityCard key={act.id} activity={act} plan={plan} onToggle={toggleAssignment} lang={lang} />
                              ))}
                          </div>
                        </td>
                      )}
                      { (filterSlot === 'both' || filterSlot === 'Afternoon') && (
                        <td className="py-3 px-2 w-1/2">
                          <div className="space-y-3">
                            {byDaySlot[day]['Afternoon'].length === 0 && (
                              <p className="text-slate-400">{t(lang, 'noActivities')}</p>
                            )}
                            {byDaySlot[day]['Afternoon']
                              .slice()
                              .sort((a,b) => ((plan.assignments[b.id]?.length||0) - (plan.assignments[a.id]?.length||0)))
                              .map(act => (
                                <ActivityCard key={act.id} activity={act} plan={plan} onToggle={toggleAssignment} lang={lang} />
                              ))}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Financial Summary */}
        <section className="mt-8">
          <div className="rounded-2xl border bg-white dark:bg-slate-800 dark:border-slate-700 p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">{t(lang, 'financialSummary')}</h2>
            {plan.kids.length === 0 ? (
              <p className="text-slate-500">{t(lang, 'addKidsHint')}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-2">{t(lang, 'kid')}</th>
                      <th className="py-2 px-2">{t(lang, 'monthlyNorm')}</th>
                      <th className="py-2 px-2">{t(lang, 'termTotal')}</th>
                      <th className="py-2 px-2">{t(lang, 'materialsOnce')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.kids.map(k => {
                      const row = financials.perKid.get(k.id)!;
                      return (
                        <tr key={k.id} className="border-b last:border-0">
                          <td className="py-2 pr-2">
                            <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: k.color }} /> {k.name}</span>
                          </td>
                          <td className="py-2 px-2">{normalizeMonthly ? `${row.monthly.toFixed(2)} € / ${t(lang, 'perMonthShort')}` : <span className="text-slate-400">(toggle on)</span>}</td>
                          <td className="py-2 px-2">{row.term.toFixed(2)} € / {t(lang, 'perTermShort')}</td>
                          <td className="py-2 px-2">{row.materials.toFixed(2)} €</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="py-2 pr-2 font-medium">{t(lang, 'total')}</td>
                      <td className="py-2 px-2 font-medium">{normalizeMonthly ? `${financials.totalMonthly.toFixed(2)} € / ${t(lang, 'perMonthShort')}` : <span className="text-slate-400">(toggle on)</span>}</td>
                      <td className="py-2 px-2 font-medium">{financials.totalTerm.toFixed(2)} € / {t(lang, 'perTermShort')}</td>
                      <td className="py-2 px-2 font-medium">{financials.totalMaterials.toFixed(2)} €</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
            <p className="text-xs text-slate-500 mt-2">{t(lang, 'note')}</p>
          </div>
        </section>

        {/* Legend */}
        <section className="mt-6 text-xs text-slate-500">
          <p><b>{t(lang, 'legendGrades')}</b> {t(lang, 'legendText')}</p>
        </section>
      </main>

      <style>{`
        @media print {
          header, .no-print { display:none; }
          main { padding: 0; }
          .shadow-sm, .shadow { box-shadow: none !important; }
          .rounded-2xl, .rounded-xl { border-radius: 0 !important; }
        }
      `}</style>
    </div>
  );
 }

 function ActivityCard({ activity, plan, onToggle, lang }: { activity: Activity; plan: PlanState; onToggle: (activityId: string, kidId: string) => void; lang: Lang }) {
  const [open, setOpen] = useState(false);
  const assignedKids = plan.assignments[activity.id] || [];
  const assigned = plan.kids.filter(k => assignedKids.includes(k.id));
  const unassigned = plan.kids.filter(k => !assignedKids.includes(k.id));

  // Refs for outside-click handling
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const onDocMouseDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (menuRef.current && menuRef.current.contains(target)) return; // inside menu
      if (buttonRef.current && buttonRef.current.contains(target)) return; // on toggle button
      setOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
    };
  }, [open]);

  // Language is now passed as a prop from parent component

  return (
    <div className="rounded-xl border p-3 shadow-sm hover:shadow transition dark:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium">{activity.name}</div>
          <div className="text-xs text-slate-500 mt-0.5">{activity.grades}</div>
          <div className="text-xs text-slate-500">{activity.time || (activity.slot === "Midday" ? t(lang, 'timeMiddaySlot') : t(lang, 'timeAfternoonSlot'))}</div>
          {activity.provider && <div className="text-xs text-slate-500">{activity.provider}{activity.location ? ` · ${activity.location}` : ""}</div>}
          {activity.notes && <div className="text-xs text-slate-500 italic">{activity.notes}</div>}
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm font-semibold">{activity.price} € <span className="text-xs font-normal text-slate-500">/{activity.period === "month" ? t(lang, 'perMonthShort') : t(lang, 'perTermShort')}</span></div>
          {activity.materialsFee && (
            <div className="text-[11px] text-slate-500">{t(lang, 'plusMaterialsOnce', { fee: activity.materialsFee })}</div>
          )}
        </div>
      </div>

      {/* Kid assignment chips (assigned only) */}
      <div className="mt-3 flex flex-wrap gap-2 items-center">
        {assigned.length === 0 && (
          <span className="text-xs text-slate-400">{t(lang, 'noKidsAssigned')}</span>
        )}
        {assigned.map(kid => (
          <span key={kid.id} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs dark:border-slate-600" style={{ borderColor: kid.color }}>
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: kid.color }} />
            {kid.name}
            <button
              className="ml-1 inline-flex items-center justify-center w-6 h-6 rounded-full text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 dark:text-slate-700 dark:bg-slate-100 dark:hover:bg-slate-200 dark:border-slate-300"
              title={t(lang, 'removeKidTitle', { name: kid.name })}
              onClick={() => onToggle(activity.id, kid.id)}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}

        {/* Assign menu */}
        <div className="relative">
          <button
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:border-slate-600"
            onClick={() => setOpen(v => !v)}
            disabled={plan.kids.length === 0}
            title={plan.kids.length === 0 ? t(lang, 'addKidsFirst') : t(lang, 'assignKidTitle')}
            ref={buttonRef}
          >
            {t(lang, 'assignKid')}
          </button>
          {open && (
            <div ref={menuRef} className="absolute z-10 mt-1 w-40 rounded-lg border bg-white shadow-lg p-1 dark:bg-slate-800 dark:border-slate-600">
              {unassigned.length === 0 ? (
                <div className="px-2 py-1 text-xs text-slate-500">{t(lang, 'allKidsAssigned')}</div>
              ) : (
              unassigned.map(kid => {
                const eligible = isKidEligibleFor(activity, kid);
                const base = "w-full text-left px-2 py-1 rounded text-xs flex items-center gap-2";
                const cls = eligible
                  ? base + " hover:bg-slate-50 dark:hover:bg-slate-700"
                  : base + " opacity-60 cursor-not-allowed";
                return (
                  <button
                    key={kid.id}
                    onClick={() => { if (eligible) { onToggle(activity.id, kid.id); setOpen(false); } }}
                    className={cls}
                    disabled={!eligible}
                    title={eligible ? undefined : t(lang, 'notEligibleTitle', { kidGrade: kid.grade, activityGrades: activity.grades })}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: kid.color }} /> {kid.name}
                    {!eligible && <span className="ml-1 text-[10px] text-slate-500">{t(lang, 'notEligibleShort')}</span>}
                  </button>
                );
              })
            )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
