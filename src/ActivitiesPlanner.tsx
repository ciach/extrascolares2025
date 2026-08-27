import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Download,
  ExternalLink,
  Info,
  Plus,
  Printer,
  Search,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";

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
    title: 'Maria Ossó Activities',
    eyebrow: 'Escola Maria Ossó · Sitges',
    courseLabel: '2026–27 course',
    heroDescription: 'Build a weekly plan with the current midday, afternoon and after-school care catalog.',
    verifiedOn: 'Official pages checked 27 Aug 2026',
    officialSources: 'Official sources',
    middaySource: 'Midday catalog',
    afternoonSource: 'Afternoon catalog',
    careSource: 'Afternoon care',
    sourceCaveat: 'Source note: the midday page announces 2026–27, although its detailed timetable still carries a 2025–26 heading.',
    changesCompared: 'Compared with the previous planner data',
    priceIncreases: 'price increases',
    priceDecrease: 'price decrease',
    catalogChanges: 'catalog changes',
    removedActivities: 'No longer listed: Creative Dance, Lettering, Ukulele and Music Sensitization.',
    addKid: 'Add Person',
    add: 'Add',
    namePlaceholder: 'Name',
    allKids: 'Everyone',
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
    searchActivities: 'Search activities',
    clearFilters: 'Reset filters',
    financialView: 'Financial view',
    schedule: 'Weekly schedule',
    day: 'Day',
    midday: 'Midday',
    afternoon: 'Afternoon',
    noActivities: 'No activities',
    financialSummary: 'Financial summary',
    addKidsHint: 'Add a person and assign activities to see the summary',
    kid: 'Person',
    monthlyNorm: 'Monthly (normalized)',
    termTotal: 'Term total',
    materialsOnce: 'Materials (once)',
    perMonthShort: 'mo',
    perTermShort: 'term',
    total: 'Total',
    note: 'Note: Monthly normalized divides per-term prices by ~3 months/term.',
    legendGrades: 'Grades:',
    legendText: 'I3–I5 (Infantil), 1st–6th (Primary) and Adult.',
    previousPlannerPrice: 'Previously in this planner: {price}€',
    priceUp: '+{delta}€',
    priceDown: '−{delta}€',
    newActivity: 'New in the catalog',
    renamedActivity: 'Renamed',
    schoolService: 'School service',
    source: 'Source',
    twoLunchTurns: 'Two lunch turns',
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
    title: 'Actividades Maria Ossó',
    eyebrow: 'Escola Maria Ossó · Sitges',
    courseLabel: 'Curso 2026–27',
    heroDescription: 'Crea un plan semanal con el catálogo actual de mediodía, tarde y acogida.',
    verifiedOn: 'Páginas oficiales verificadas el 27 ago 2026',
    officialSources: 'Fuentes oficiales',
    middaySource: 'Catálogo de mediodía',
    afternoonSource: 'Catálogo de tarde',
    careSource: 'Acogida de tarde',
    sourceCaveat: 'Nota de fuente: la página de mediodía anuncia 2026–27, aunque el cuadro detallado todavía conserva el título 2025–26.',
    changesCompared: 'Comparado con los datos anteriores del planificador',
    priceIncreases: 'subidas de precio',
    priceDecrease: 'bajada de precio',
    catalogChanges: 'cambios de catálogo',
    removedActivities: 'Ya no aparecen: Danza creativa, Lettering, Ukelele y Sensibilización musical.',
    addKid: 'Añadir Persona',
    add: 'Agregar',
    namePlaceholder: 'Nombre',
    allKids: 'Todas las personas',
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
    searchActivities: 'Buscar actividades',
    clearFilters: 'Restablecer filtros',
    financialView: 'Vista financiera',
    schedule: 'Horario semanal',
    day: 'Día',
    midday: 'Mediodía',
    afternoon: 'Tarde',
    noActivities: 'Sin actividades',
    financialSummary: 'Resumen financiero',
    addKidsHint: 'Añade una persona y asigna actividades para ver el resumen',
    kid: 'Persona',
    monthlyNorm: 'Mensual (normalizado)',
    termTotal: 'Total por trimestre',
    materialsOnce: 'Materiales (una vez)',
    perMonthShort: 'mes',
    perTermShort: 'trimestre',
    total: 'Total',
    note: 'Nota: El mensual normalizado divide los precios por trimestre entre ~3 meses.',
    legendGrades: 'Cursos:',
    legendText: 'I3–I5 (Infantil), 1º–6º (Primaria) y Adultos.',
    previousPlannerPrice: 'Antes en este planificador: {price}€',
    priceUp: '+{delta}€',
    priceDown: '−{delta}€',
    newActivity: 'Nueva en el catálogo',
    renamedActivity: 'Nombre actualizado',
    schoolService: 'Servicio escolar',
    source: 'Fuente',
    twoLunchTurns: 'Dos turnos de comedor',
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
    title: 'Activitats Maria Ossó',
    eyebrow: 'Escola Maria Ossó · Sitges',
    courseLabel: 'Curs 2026–27',
    heroDescription: 'Crea un pla setmanal amb el catàleg actual de migdia, tarda i acollida.',
    verifiedOn: 'Pàgines oficials verificades el 27 ag. 2026',
    officialSources: 'Fonts oficials',
    middaySource: 'Catàleg de migdia',
    afternoonSource: 'Catàleg de tarda',
    careSource: 'Acollida de tarda',
    sourceCaveat: 'Nota de font: la pàgina de migdia anuncia 2026–27, tot i que el quadre detallat encara conserva el títol 2025–26.',
    changesCompared: 'Comparat amb les dades anteriors del planificador',
    priceIncreases: 'pujades de preu',
    priceDecrease: 'baixada de preu',
    catalogChanges: 'canvis de catàleg',
    removedActivities: 'Ja no hi apareixen: Dansa creativa, Lettering, Ukelele i Sensibilització musical.',
    addKid: 'Afegir Persona',
    add: 'Afegir',
    namePlaceholder: 'Nom',
    allKids: 'Totes les persones',
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
    searchActivities: 'Cercar activitats',
    clearFilters: 'Restablir filtres',
    financialView: 'Vista financera',
    schedule: 'Horari setmanal',
    day: 'Dia',
    midday: 'Migdia',
    afternoon: 'Tarda',
    noActivities: 'Sense activitats',
    financialSummary: 'Resum financer',
    addKidsHint: 'Afegeix una persona i assigna activitats per veure el resum',
    kid: 'Persona',
    monthlyNorm: 'Mensual (normalitzat)',
    termTotal: 'Total per trimestre',
    materialsOnce: 'Materials (una vegada)',
    perMonthShort: 'mes',
    perTermShort: 'trimestre',
    total: 'Total',
    note: 'Nota: El mensual normalitzat divideix els preus trimestrals entre ~3 mesos.',
    legendGrades: 'Cursos:',
    legendText: 'I3–I5 (Infantil), 1r–6è (Primària) i Adults.',
    previousPlannerPrice: 'Abans en aquest planificador: {price}€',
    priceUp: '+{delta}€',
    priceDown: '−{delta}€',
    newActivity: 'Nova al catàleg',
    renamedActivity: 'Nom actualitzat',
    schoolService: 'Servei escolar',
    source: 'Font',
    twoLunchTurns: 'Dos torns de menjador',
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
  /** Optional localized names */
  nameEs?: string;
  nameCa?: string;
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
  notesEs?: string;
  notesCa?: string;
  /** One-time materials fee — only charged once per kid per materialsKey */
  materialsFee?: number;
  materialsKey?: string; // unique key to dedupe per-kid materials fees
  /** Optional bundle key for special pricing across multiple days (e.g., Psychomotricity 1-day vs 2-days price) */
  bundleKey?: string; // e.g., "psychomotricity"
  /** Shared billing key for multi-day activities that appear once on each day. */
  billingKey?: string;
  /** Previous value from the planner's former dataset, never presented as an official historical price. */
  previousPrice?: number;
  status?: "new" | "renamed" | "service";
 };

// Helper to display activity name in current language
const activityDisplayName = (a: Activity, lang: Lang): string => {
  if (lang === 'es' && a.nameEs) return a.nameEs;
  if (lang === 'ca' && a.nameCa) return a.nameCa;
  return a.name;
};

const activityDisplayNotes = (a: Activity, lang: Lang): string | undefined => {
  if (lang === 'es' && a.notesEs) return a.notesEs;
  if (lang === 'ca' && a.notesCa) return a.notesCa;
  return a.notes;
};

 type GradeLevel = 'I3' | 'I4' | 'I5' | '1st' | '2nd' | '3rd' | '4th' | '5th' | '6th' | 'Adult';

// Grade helpers (module-scope so both component and ActivityCard can use them)
const gradeOrder: Record<GradeLevel, number> = { I3: -2, I4: -1, I5: 0, '1st': 1, '2nd': 2, '3rd': 3, '4th': 4, '5th': 5, '6th': 6, Adult: 7 };
const normalizeGradeToken = (s: string): GradeLevel | null => {
  const t = s.trim();
  const mI = t.match(/^I([3-5])$/i);
  if (mI) return (`I${mI[1]}`) as GradeLevel;
  const mN = t.match(/^([1-6])(st|nd|rd|th)$/i);
  if (mN) return (`${mN[1]}${mN[2].toLowerCase()}`) as GradeLevel;
  if (/^(adult|adulto|adults)$/i.test(t)) return 'Adult';
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
  const m = t.match(/(\d{1,2})[:h.](\d{2})/);
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

 const SOURCE_URLS = {
  midday: "https://www.gatperlleure.com/actividades-extraescolares-mediodia-colegio-maria-osso/",
  afternoon: "https://www.gatperlleure.com/actividades-extraescolares-tardes-colegio-maria-osso/",
  care: "https://www.gatperlleure.com/acogida-tarde/",
 } as const;

 /**
  * Escola Maria Ossó dataset, verified against the official Gat per Lleure pages on 2026-08-27.
  * Each multi-day activity is rendered once per weekday; billingKey prevents double charging.
  */
 const ACTIVITIES: Activity[] = [
  // ————— MIDDAY —————
  // Monday
  { id: "m_en_i4-2_mon", name: "English (UNICOR)", nameEs: "Inglés (UNICOR)", nameCa: "Anglès (UNICOR)", day: "Monday", slot: "Midday", time: "12:30–13:30 / 13:40–14:40", grades: "I4/I5–2nd", price: 58, period: "month", provider: "UNICOR Languages", notes: "2 days/week · minimum 8 · Mon + Wed", notesEs: "2 días/semana · mínimo 8 · lunes + miércoles", notesCa: "2 dies/setmana · mínim 8 · dilluns + dimecres", materialsFee: 40, materialsKey: "unicor-english-i4-2", billingKey: "unicor-english-i4-2" },
  { id: "m_theatre_3-6_mon", name: "Theatre", nameEs: "Teatro", nameCa: "Teatre", day: "Monday", slot: "Midday", time: "12:30–13:30 / 13:40–14:40", grades: "3rd–6th", price: 37, previousPrice: 36, period: "month", provider: "Núria Granell", notes: "1 day/week · minimum 8", notesEs: "1 día/semana · mínimo 8", notesCa: "1 dia/setmana · mínim 8" },

  // Tuesday
  { id: "m_en_3-6_tue", name: "English (UNICOR)", nameEs: "Inglés (UNICOR)", nameCa: "Anglès (UNICOR)", day: "Tuesday", slot: "Midday", time: "12:30–13:30 / 13:40–14:40", grades: "3rd–6th", price: 58, period: "month", provider: "UNICOR Languages", notes: "2 days/week · minimum 8 · Tue + Thu", notesEs: "2 días/semana · mínimo 8 · martes + jueves", notesCa: "2 dies/setmana · mínim 8 · dimarts + dijous", materialsFee: 40, materialsKey: "unicor-english-3-6", billingKey: "unicor-english-3-6" },
  { id: "m_chess_1-2_tue", name: "Chess", nameEs: "Ajedrez", nameCa: "Escacs", day: "Tuesday", slot: "Midday", time: "12:30–13:30", grades: "1st–2nd", price: 75, period: "term", provider: "Xavier Ávila", notes: "1 day/week · minimum 8", notesEs: "1 día/semana · mínimo 8", notesCa: "1 dia/setmana · mínim 8" },
  { id: "m_rhythmic_tue", name: "Rhythmic Gymnastics", nameEs: "Gimnasia rítmica", nameCa: "Gimnàstica rítmica", day: "Tuesday", slot: "Midday", time: "12:30–13:30 / 13:40–14:40", grades: "I4/I5–6th", price: 46, previousPrice: 44, period: "month", notes: "2 days/week · minimum 8 · Tue + Thu", notesEs: "2 días/semana · mínimo 8 · martes + jueves", notesCa: "2 dies/setmana · mínim 8 · dimarts + dijous", provider: "Núria Moreno · Club Rítmica Sitges-Garraf", billingKey: "rhythmic" },
  { id: "m_taijitsu_g1_tue", name: "Tai-Jitsu (Group 1)", nameEs: "Tai-Jitsu (Grupo 1)", nameCa: "Tai-Jitsu (Grup 1)", day: "Tuesday", slot: "Midday", time: "12:30–13:30 / 13:40–14:40", grades: "3rd–6th", price: 28, period: "month", provider: "Mari Carmen Vila", notes: "1 day/week · minimum 10", notesEs: "1 día/semana · mínimo 10", notesCa: "1 dia/setmana · mínim 10" },

  // Wednesday
  { id: "m_en_i4-2_wed", name: "English (UNICOR)", nameEs: "Inglés (UNICOR)", nameCa: "Anglès (UNICOR)", day: "Wednesday", slot: "Midday", time: "12:30–13:30 / 13:40–14:40", grades: "I4/I5–2nd", price: 58, period: "month", provider: "UNICOR Languages", notes: "2 days/week · minimum 8 · Mon + Wed", notesEs: "2 días/semana · mínimo 8 · lunes + miércoles", notesCa: "2 dies/setmana · mínim 8 · dilluns + dimecres", materialsFee: 40, materialsKey: "unicor-english-i4-2", billingKey: "unicor-english-i4-2" },
  { id: "m_chess_3-6_wed", name: "Chess", nameEs: "Ajedrez", nameCa: "Escacs", day: "Wednesday", slot: "Midday", time: "12:30–13:30 / 13:40–14:40", grades: "3rd–6th", price: 75, period: "term", provider: "Xavier Ávila", notes: "1 day/week · minimum 8", notesEs: "1 día/semana · mínimo 8", notesCa: "1 dia/setmana · mínim 8" },
  { id: "m_hiphop_wed", name: "Hip Hop", nameEs: "Hip Hop", nameCa: "Hip Hop", day: "Wednesday", slot: "Midday", time: "12:30–13:30 / 13:40–14:40", grades: "1st–6th", price: 30, previousPrice: 28, period: "month", provider: "Anna Batista", notes: "1 day/week · minimum 10", notesEs: "1 día/semana · mínimo 10", notesCa: "1 dia/setmana · mínim 10" },
  { id: "m_taijitsu_g2_wed", name: "Tai-Jitsu (Group 2)", nameEs: "Tai-Jitsu (Grupo 2)", nameCa: "Tai-Jitsu (Grup 2)", day: "Wednesday", slot: "Midday", time: "12:30–13:30 / 13:40–14:40", grades: "I4/I5", price: 28, period: "month", provider: "Mari Carmen Vila", notes: "1 day/week · minimum 10", notesEs: "1 día/semana · mínimo 10", notesCa: "1 dia/setmana · mínim 10" },
  { id: "m_taijitsu_g3_wed", name: "Tai-Jitsu (Group 3)", nameEs: "Tai-Jitsu (Grupo 3)", nameCa: "Tai-Jitsu (Grup 3)", day: "Wednesday", slot: "Midday", time: "12:30–13:30 / 13:40–14:40", grades: "1st–2nd", price: 28, period: "month", provider: "Mari Carmen Vila", notes: "1 day/week · minimum 10", notesEs: "1 día/semana · mínimo 10", notesCa: "1 dia/setmana · mínim 10" },

  // Thursday
  { id: "m_art_thu", name: "Creative Art", nameEs: "Arte creativo", nameCa: "Art creatiu", day: "Thursday", slot: "Midday", time: "12:30–13:30 / 13:40–14:40", grades: "I4/I5 & 1st–3rd", price: 78, period: "term", provider: "Irene Gil", notes: "2 groups · minimum 8 per group", notesEs: "2 grupos · mínimo 8 por grupo", notesCa: "2 grups · mínim 8 per grup", materialsFee: 12, materialsKey: "creative-art-midday-materials" },
  { id: "m_en_3-6_thu", name: "English (UNICOR)", nameEs: "Inglés (UNICOR)", nameCa: "Anglès (UNICOR)", day: "Thursday", slot: "Midday", time: "12:30–13:30 / 13:40–14:40", grades: "3rd–6th", price: 58, period: "month", provider: "UNICOR Languages", notes: "2 days/week · minimum 8 · Tue + Thu", notesEs: "2 días/semana · mínimo 8 · martes + jueves", notesCa: "2 dies/setmana · mínim 8 · dimarts + dijous", materialsFee: 40, materialsKey: "unicor-english-3-6", billingKey: "unicor-english-3-6" },
  { id: "m_robotics_thu", name: "Robotics", nameEs: "Robótica", nameCa: "Robòtica", day: "Thursday", slot: "Midday", time: "12:30–13:30 / 13:40–14:40", grades: "1st–6th", price: 42, previousPrice: 48, period: "month", provider: "FUNLAB", notes: "1 day/week · minimum 6, maximum 10", notesEs: "1 día/semana · mínimo 6, máximo 10", notesCa: "1 dia/setmana · mínim 6, màxim 10" },
  { id: "m_rhythmic_thu", name: "Rhythmic Gymnastics", nameEs: "Gimnasia rítmica", nameCa: "Gimnàstica rítmica", day: "Thursday", slot: "Midday", time: "12:30–13:30 / 13:40–14:40", grades: "I4/I5–6th", price: 46, previousPrice: 44, period: "month", notes: "2 days/week · minimum 8 · Tue + Thu", notesEs: "2 días/semana · mínimo 8 · martes + jueves", notesCa: "2 dies/setmana · mínim 8 · dimarts + dijous", provider: "Núria Moreno · Club Rítmica Sitges-Garraf", billingKey: "rhythmic" },

  // Friday
  { id: "m_comic_fri", name: "Comic & Manga", nameEs: "Cómic y manga", nameCa: "Còmic i manga", day: "Friday", slot: "Midday", time: "12:30–13:30 / 13:40–14:40", grades: "3rd–6th", price: 33, period: "month", provider: "Jordi Inglada", notes: "1 day/week · minimum 8", notesEs: "1 día/semana · mínimo 8", notesCa: "1 dia/setmana · mínim 8" },
  { id: "m_theatre_tracart_fri", name: "Theatre (TRACART)", nameEs: "Teatro (TRACART)", nameCa: "Teatre (TRACART)", day: "Friday", slot: "Midday", time: "12:30–13:30 / 13:40–14:40", grades: "I4/I5–2nd", price: 37, previousPrice: 36, period: "month", provider: "TRACART", notes: "1 day/week · minimum 8", notesEs: "1 día/semana · mínimo 8", notesCa: "1 dia/setmana · mínim 8" },

  // ————— AFTERNOON —————
  // Monday
  { id: "a_psy_mo", name: "Psychomotricity", nameEs: "Psicomotricidad", nameCa: "Psicomotricitat", day: "Monday", slot: "Afternoon", time: "16:30–18:00", grades: "I3–I5", price: 75, period: "term", provider: "Nil", notes: "1 or 2 days/week · minimum 10 · 2 days: 135€/term", notesEs: "1 o 2 días/semana · mínimo 10 · 2 días: 135€/trimestre", notesCa: "1 o 2 dies/setmana · mínim 10 · 2 dies: 135€/trimestre", bundleKey: "psychomotricity" },
  { id: "a_cooking_mo", name: "Creative Cooking", nameEs: "Cocina creativa", nameCa: "Cuina creativa", day: "Monday", slot: "Afternoon", time: "16:30–18:00", grades: "1st–6th", price: 45, period: "month", notes: "1 day/week · teacher to be confirmed", notesEs: "1 día/semana · profesor/a por confirmar", notesCa: "1 dia/setmana · professor/a per confirmar" },
  { id: "a_futsal_mo", name: "Futsal", nameEs: "Fútbol sala", nameCa: "Futbol sala", day: "Monday", slot: "Afternoon", time: "16:30–18:00", grades: "1st–6th", price: 75, period: "term", notes: "1 day/week · minimum 10", notesEs: "1 día/semana · mínimo 10", notesCa: "1 dia/setmana · mínim 10" },
  { id: "a_yoga_adults_mo", name: "Yoga for adults", nameEs: "Yoga para adultos", nameCa: "Ioga per a adults", day: "Monday", slot: "Afternoon", time: "16:45–17:45 / 18:00–19:00", grades: "Adult", price: 75, period: "term", provider: "Sandra", notes: "Two available groups", notesEs: "Dos grupos disponibles", notesCa: "Dos grups disponibles", status: "new" },
  { id: "a_acogida_mo", name: "Afternoon care", nameEs: "Acogida de tarde", nameCa: "Acollida de tarda", day: "Monday", slot: "Afternoon", time: "16:30–17:30", grades: "I3–6th", price: 35, period: "month", notes: "Fixed user · minimum 15 · Sep–Jun", notesEs: "Usuario fijo · mínimo 15 · septiembre–junio", notesCa: "Usuari fix · mínim 15 · setembre–juny", billingKey: "afternoon-care", status: "service" },

  // Tuesday
  { id: "a_swim_tu", name: "Swimming", nameEs: "Natación", nameCa: "Natació", day: "Tuesday", slot: "Afternoon", time: "17:00–17:45", grades: "I3–6th", price: 147, period: "term", provider: "Piscina Municipal", notes: "1 day/week · maximum 30", notesEs: "1 día/semana · máximo 30", notesCa: "1 dia/setmana · màxim 30" },
  { id: "a_padel_tu", name: "Padel", nameEs: "Pádel", nameCa: "Pàdel", day: "Tuesday", slot: "Afternoon", time: "16:30–17:45", grades: "1st–6th", price: 147, period: "term", provider: "Piscina Municipal Sitges", notes: "Travels on the swimming bus", notesEs: "Desplazamiento en el autobús de natación", notesCa: "Desplaçament amb l'autobús de natació" },
  { id: "a_basket_tu", name: "Basketball", nameEs: "Baloncesto", nameCa: "Bàsquet", day: "Tuesday", slot: "Afternoon", time: "16:30–18:00", grades: "1st–6th", price: 75, period: "term", notes: "1 day/week · minimum 10", notesEs: "1 día/semana · mínimo 10", notesCa: "1 dia/setmana · mínim 10" },
  { id: "a_french_tu", name: "French (UNICOR)", nameEs: "Francés (UNICOR)", nameCa: "Francès (UNICOR)", day: "Tuesday", slot: "Afternoon", time: "16:30–17:45", grades: "I4/I5–6th", price: 38, previousPrice: 36, period: "month", provider: "UNICOR Languages", notes: "1 day/week · minimum 10", notesEs: "1 día/semana · mínimo 10", notesCa: "1 dia/setmana · mínim 10", materialsFee: 20, materialsKey: "unicor-french" },
  { id: "a_acogida_tu", name: "Afternoon care", nameEs: "Acogida de tarde", nameCa: "Acollida de tarda", day: "Tuesday", slot: "Afternoon", time: "16:30–17:30", grades: "I3–6th", price: 35, period: "month", notes: "Fixed user · minimum 15 · Sep–Jun", notesEs: "Usuario fijo · mínimo 15 · septiembre–junio", notesCa: "Usuari fix · mínim 15 · setembre–juny", billingKey: "afternoon-care", status: "service" },

  // Wednesday
  { id: "a_yoga12_we", name: "Dance", nameEs: "Danza", nameCa: "Dansa", day: "Wednesday", slot: "Afternoon", time: "16:30–18:00", grades: "1st–2nd", price: 35, period: "month", provider: "Sara Argibay", notes: "1 day/week · minimum 7, maximum 14", notesEs: "1 día/semana · mínimo 7, máximo 14", notesCa: "1 dia/setmana · mínim 7, màxim 14", status: "renamed" },
  { id: "a_writing_we", name: "Creative Writing", nameEs: "Escritura creativa", nameCa: "Escriptura creativa", day: "Wednesday", slot: "Afternoon", time: "16:30–18:00", grades: "5th–6th", price: 32, period: "month", provider: "Melanie Rostock", status: "new" },
  { id: "a_skate_we", name: "Skateboarding", nameEs: "Skate", nameCa: "Skate", day: "Wednesday", slot: "Afternoon", time: "16:30–18:00", grades: "1st–6th", price: 120, period: "term", provider: "Jaume y Sergi", notes: "1 day/week · minimum 6", notesEs: "1 día/semana · mínimo 6", notesCa: "1 dia/setmana · mínim 6" },
  { id: "a_beginskate_we", name: "Beginner Skating", nameEs: "Iniciación al patín", nameCa: "Iniciació al patinatge", day: "Wednesday", slot: "Afternoon", time: "16:30–18:00", grades: "I4/I5–2nd", price: 90, previousPrice: 75, period: "term", notes: "1 day/week · minimum 10", notesEs: "1 día/semana · mínimo 10", notesCa: "1 dia/setmana · mínim 10" },
  { id: "a_acogida_we", name: "Afternoon care", nameEs: "Acogida de tarde", nameCa: "Acollida de tarda", day: "Wednesday", slot: "Afternoon", time: "16:30–17:30", grades: "I3–6th", price: 35, period: "month", notes: "Fixed user · minimum 15 · Sep–Jun", notesEs: "Usuario fijo · mínimo 15 · septiembre–junio", notesCa: "Usuari fix · mínim 15 · setembre–juny", billingKey: "afternoon-care", status: "service" },

  // Thursday
  { id: "a_psy_th", name: "Psychomotricity", nameEs: "Psicomotricidad", nameCa: "Psicomotricitat", day: "Thursday", slot: "Afternoon", time: "16:30–18:00", grades: "I3–I5", price: 75, period: "term", notes: "1 or 2 days/week · minimum 10 · 2 days: 135€/term", notesEs: "1 o 2 días/semana · mínimo 10 · 2 días: 135€/trimestre", notesCa: "1 o 2 dies/setmana · mínim 10 · 2 dies: 135€/trimestre", bundleKey: "psychomotricity" },
  { id: "a_yogadance_th", name: "Yoga Dance Kaleidoscope", nameEs: "Yoga Dance Kaleidoscope", nameCa: "Yoga Dance Kaleidoscope", day: "Thursday", slot: "Afternoon", time: "16:30–17:45", grades: "1st–6th", price: 45, period: "month", provider: "Niahm Condrom", notes: "1 day/week · minimum 8, maximum 12", notesEs: "1 día/semana · mínimo 8, máximo 12", notesCa: "1 dia/setmana · mínim 8, màxim 12", status: "new" },
  { id: "a_sportsinit_th", name: "Sports Initiation", nameEs: "Iniciación deportiva", nameCa: "Iniciació esportiva", day: "Thursday", slot: "Afternoon", time: "16:30–18:00", grades: "1st–2nd", price: 75, period: "term", notes: "1 day/week · minimum 10", notesEs: "1 día/semana · mínimo 10", notesCa: "1 dia/setmana · mínim 10" },
  { id: "a_tennis_th", name: "Tennis at school", nameEs: "Tenis en el cole", nameCa: "Tennis a l'escola", day: "Thursday", slot: "Afternoon", time: "16:30–17:45", grades: "1st–6th", price: 35, period: "month", provider: "Tenis en el meu cole · Izan Madera", notes: "1 day/week · maximum 10", notesEs: "1 día/semana · máximo 10", notesCa: "1 dia/setmana · màxim 10" },
  { id: "a_acogida_th", name: "Afternoon care", nameEs: "Acogida de tarde", nameCa: "Acollida de tarda", day: "Thursday", slot: "Afternoon", time: "16:30–17:30", grades: "I3–6th", price: 35, period: "month", notes: "Fixed user · minimum 15 · Sep–Jun", notesEs: "Usuario fijo · mínimo 15 · septiembre–junio", notesCa: "Usuari fix · mínim 15 · setembre–juny", billingKey: "afternoon-care", status: "service" },

  // Friday
  { id: "a_fencing_fr", name: "Fencing", nameEs: "Esgrima", nameCa: "Esgrima", day: "Friday", slot: "Afternoon", time: "16:30–17:45", grades: "1st–6th", price: 45, previousPrice: 38, period: "month", provider: "SAG Club d'Esgrima", notes: "1 day/week · minimum 4, maximum 15", notesEs: "1 día/semana · mínimo 4, máximo 15", notesCa: "1 dia/setmana · mínim 4, màxim 15" },
  { id: "a_acogida_fr", name: "Afternoon care", nameEs: "Acogida de tarde", nameCa: "Acollida de tarda", day: "Friday", slot: "Afternoon", time: "16:30–17:30", grades: "I3–6th", price: 35, period: "month", notes: "Fixed user · minimum 15 · Sep–Jun", notesEs: "Usuario fijo · mínimo 15 · septiembre–junio", notesCa: "Usuari fix · mínim 15 · setembre–juny", billingKey: "afternoon-care", status: "service" },
 ];

 const UNIQUE_PRICE_CHANGES = Array.from(
  new Map(
    ACTIVITIES
      .filter(activity => activity.previousPrice !== undefined)
      .map(activity => [activity.billingKey ?? activity.id, activity])
  ).values()
 );
 const PRICE_INCREASES = UNIQUE_PRICE_CHANGES.filter(activity => activity.price > (activity.previousPrice ?? activity.price)).length;
 const PRICE_DECREASES = UNIQUE_PRICE_CHANGES.filter(activity => activity.price < (activity.previousPrice ?? activity.price)).length;
 const CATALOG_CHANGES = ACTIVITIES.filter(activity => activity.status === "new" || activity.status === "renamed").length + 4;


 /**
  * Pricing logic
  * — month: use as-is for monthly view
  * — term: for normalized-monthly view, divide by 3 (≈ 3 months/term)
  * — bundles: psychomotricity (Mon+Thu) is 75€/term for 1 day or 135€/term for 2 days (per kid)
  * — Acogida: fixed 35€/month per kid regardless of how many days they attend (Mon-Fri)
  */
 function computeFinancials(
  plan: PlanState,
  normalizeMonthly: boolean
 ) {
  const perKid = new Map<string, { monthly: number; term: number; monthItems: number; materials: number }>();
  const kidMaterialsKeys = new Map<string, Set<string>>();
  const kidBillingKeys = new Map<string, Set<string>>();

  // Initialize
  for (const kid of plan.kids) {
    perKid.set(kid.id, { monthly: 0, term: 0, monthItems: 0, materials: 0 });
    kidMaterialsKeys.set(kid.id, new Set());
    kidBillingKeys.set(kid.id, new Set());
  }

  // Psychomotricity bundle handling
  // Collect psychomotricity selections per kid
  const psychoCountByKid = new Map<string, number>();
  // Track Acogida assignments per kid
  const acogidaByKid = new Map<string, boolean>();
  
  for (const [actId, kidIds] of Object.entries(plan.assignments)) {
    const act = ACTIVITIES.find(a => a.id === actId);
    if (!act) continue;
    kidIds.forEach(kidId => {
      if (act.bundleKey === "psychomotricity") {
        psychoCountByKid.set(kidId, (psychoCountByKid.get(kidId) || 0) + 1);
      }
      // Track if kid is assigned to any Acogida activity
      if (act.billingKey === "afternoon-care") {
        acogidaByKid.set(kidId, true);
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
      
      // Skip Acogida here; handle as a special case later
      if (act.billingKey === "afternoon-care") continue;

      // Multi-day activities share one fee even though each weekday has its own card.
      if (act.billingKey) {
        const billed = kidBillingKeys.get(kidId)!;
        if (billed.has(act.billingKey)) continue;
        billed.add(act.billingKey);
      }

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
  
  // Third pass: apply Acogida special pricing (fixed 35€/month regardless of days attended)
  for (const kid of plan.kids) {
    const hasAcogida = acogidaByKid.get(kid.id) || false;
    if (!hasAcogida) continue;
    const agg = perKid.get(kid.id)!;
    // Add the fixed 35€ monthly fee once per kid
    agg.monthly += 35;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [lang, setLang] = useState<Lang>('es');


  // Kid form state
  const [newKidName, setNewKidName] = useState("");
  const [newKidColor, setNewKidColor] = useState("#22c55e");
  const [newKidGrade, setNewKidGrade] = useState<GradeLevel>('1st');

  // Back-compat: ensure existing kids have a grade
  useEffect(() => {
    const needsMigration = plan.kids.some(k => !k.grade);
    if (needsMigration) {
      setPlan(p => ({
        ...p,
        kids: p.kids.map(k => ({ ...k, grade: k.grade || '1st' }))
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
      const activity = ACTIVITIES.find(a => a.id === activityId);
      const targetIds = activity?.billingKey
        ? ACTIVITIES.filter(candidate => candidate.billingKey === activity.billingKey).map(candidate => candidate.id)
        : [activityId];
      const current = p.assignments[activityId] || [];
      const exists = current.includes(kidId);
      // When assigning (not removing), enforce grade eligibility
      if (!exists) {
        const kid = p.kids.find(k => k.id === kidId) as Kid | undefined;
        if (activity && kid && !isKidEligibleFor(activity, kid)) {
          alert(t(lang, 'notEligibleAlert', { kidName: kid.name, kidGrade: kid.grade, activityName: activityDisplayName(activity, lang), activityGrades: activity.grades }));
          return p; // no change
        }
      }
      const assignments = { ...p.assignments };
      for (const targetId of targetIds) {
        const ids = assignments[targetId] || [];
        assignments[targetId] = exists ? ids.filter(id => id !== kidId) : Array.from(new Set([...ids, kidId]));
      }
      return { ...p, assignments };
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
      } catch {
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
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
    const queryOk = !normalizedQuery || [a.name, a.nameEs, a.nameCa, a.provider, a.grades]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase()
      .includes(normalizedQuery);
    if (!slotOk || !dayOk || !queryOk) return false;

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
  const visibleDays = DAYS.filter(day => {
    if (filterDay !== 'all' && day !== filterDay) return false;
    const middayVisible = filterSlot !== 'Afternoon' && byDaySlot[day].Midday.length > 0;
    const afternoonVisible = filterSlot !== 'Midday' && byDaySlot[day].Afternoon.length > 0;
    return middayVisible || afternoonVisible;
  });

  const resetFilters = () => {
    setFilterKidId("all");
    setFilterSlot("both");
    setFilterDay("all");
    setOnlyAssignedForKid(false);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="no-print sticky top-0 z-30 border-b border-slate-200/80 bg-[#f4f7f6]/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-700 text-white shadow-sm">
              <CalendarDays className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold tracking-tight">{t(lang, 'title')}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{t(lang, 'courseLabel')}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <select aria-label="Language" value={lang} onChange={e => setLang(e.target.value as Lang)} className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold dark:border-slate-700 dark:bg-slate-900">
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="ca">CA</option>
            </select>
            <button onClick={() => window.print()} className="app-icon-button" title={t(lang, 'print')}>
              <Printer className="h-4 w-4"/><span className="hidden lg:inline">{t(lang, 'print')}</span>
            </button>
            <button onClick={exportPlan} className="app-icon-button" title={t(lang, 'export')}>
              <Download className="h-4 w-4"/><span className="hidden lg:inline">{t(lang, 'export')}</span>
            </button>
            <label className="app-icon-button cursor-pointer" title={t(lang, 'import')}>
              <Upload className="h-4 w-4"/><span className="hidden lg:inline">{t(lang, 'import')}</span>
              <input type="file" accept="application/json" className="hidden" onChange={e => e.target.files?.[0] && importPlan(e.target.files[0])} />
            </label>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-5">
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-5 py-5 text-white shadow-xl shadow-slate-900/10 sm:px-6 sm:py-6">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-sky-400/15 blur-3xl" />
          <div className="relative grid gap-4 lg:grid-cols-[1.3fr_.7fr] lg:items-end">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300">
                <span>{t(lang, 'eyebrow')}</span>
                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 tracking-normal text-white">{t(lang, 'courseLabel')}</span>
              </div>
              <h1 className="max-w-3xl text-2xl font-black tracking-[-0.04em] sm:text-3xl">{t(lang, 'title')}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-5 text-slate-300">{t(lang, 'heroDescription')}</p>
              <p className="mt-2 inline-flex items-center gap-2 text-[11px] font-medium text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />{t(lang, 'verifiedOn')}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.07] p-2.5">
                <div className="flex items-center gap-1 text-rose-300"><ArrowUpRight className="h-3.5 w-3.5"/><span className="text-xl font-black">{PRICE_INCREASES}</span></div>
                <p className="text-[10px] leading-4 text-slate-300">{t(lang, 'priceIncreases')}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.07] p-2.5">
                <div className="flex items-center gap-1 text-emerald-300"><ArrowDownRight className="h-3.5 w-3.5"/><span className="text-xl font-black">{PRICE_DECREASES}</span></div>
                <p className="text-[10px] leading-4 text-slate-300">{t(lang, 'priceDecrease')}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.07] p-2.5">
                <div className="flex items-center gap-1 text-sky-300"><Sparkles className="h-3.5 w-3.5"/><span className="text-xl font-black">{CATALOG_CHANGES}</span></div>
                <p className="text-[10px] leading-4 text-slate-300">{t(lang, 'catalogChanges')}</p>
              </div>
            </div>
          </div>
          <div className="relative mt-4 border-t border-white/10 pt-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{t(lang, 'officialSources')}</p>
            <div className="flex flex-wrap gap-2">
              {([
                [SOURCE_URLS.midday, 'middaySource'],
                [SOURCE_URLS.afternoon, 'afternoonSource'],
                [SOURCE_URLS.care, 'careSource'],
              ] as const).map(([url, label]) => (
                <a key={url} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-white/15">
                  {t(lang, label)}<ExternalLink className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-3 grid gap-2 lg:grid-cols-2">
          <div className="flex items-start gap-2 rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs leading-5 text-sky-950 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-100">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
            <p>{t(lang, 'sourceCaveat')}</p>
          </div>
          <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
            <div><p className="font-semibold text-slate-900 dark:text-white">{t(lang, 'changesCompared')}</p><p>{t(lang, 'removedActivities')}</p></div>
          </div>
        </section>

        <section className="no-print mt-4 grid gap-3 lg:grid-cols-12">
          <div className="app-panel lg:col-span-5">
            <h2 className="app-panel-title">{t(lang, 'addKid')}</h2>
            <div className="grid grid-cols-[1fr_auto] gap-1.5 sm:grid-cols-[1fr_auto_auto_auto]">
              <input value={newKidName} onChange={e => setNewKidName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addKid()} placeholder={t(lang, 'namePlaceholder')} className="app-field min-w-0" />
              <input aria-label="Color" type="color" value={newKidColor} onChange={e => setNewKidColor(e.target.value)} className="h-9 w-10 rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900" />
              <select value={newKidGrade} onChange={e => setNewKidGrade(e.target.value as GradeLevel)} className="app-field col-span-1 sm:col-span-1">
                {(['I3','I4','I5','1st','2nd','3rd','4th','5th','6th','Adult'] as GradeLevel[]).map(grade => <option key={grade} value={grade}>{grade}</option>)}
              </select>
              <button onClick={addKid} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-emerald-700 px-3 text-xs font-bold text-white transition hover:bg-emerald-600"><Plus className="h-3.5 w-3.5"/>{t(lang, 'add')}</button>
            </div>
            {plan.kids.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {plan.kids.map(person => (
                  <span key={person.id} className="inline-flex min-h-7 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 text-xs dark:border-slate-700 dark:bg-slate-800">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: person.color }} />{person.name}
                    <span className="text-xs text-slate-500">{person.grade}</span>
                    <button onClick={() => removeKid(person.id)} className="-mr-1 grid h-7 w-7 place-items-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600" title={t(lang, 'remove')}><X className="h-4 w-4" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="app-panel lg:col-span-5">
            <div className="mb-2 flex items-center justify-between gap-3"><h2 className="app-panel-title mb-0">{t(lang, 'filters')}</h2><button onClick={resetFilters} className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-600">{t(lang, 'clearFilters')}</button></div>
            <div className="relative mb-1.5">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t(lang, 'searchActivities')} className="app-field w-full pl-9" />
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <select value={filterKidId} onChange={e => setFilterKidId(e.target.value)} className="app-field">
                <option value="all">{t(lang, 'allKids')}</option>
                {plan.kids.map(person => <option key={person.id} value={person.id}>{person.name}</option>)}
              </select>
              <select value={filterSlot} onChange={e => setFilterSlot(e.target.value as Slot | "both")} className="app-field">
                <option value="both">{t(lang, 'middayAndAfternoon')}</option>
                <option value="Midday">{t(lang, 'middayOnly')}</option>
                <option value="Afternoon">{t(lang, 'afternoonOnly')}</option>
              </select>
              <select value={filterDay} onChange={e => setFilterDay(e.target.value as Day | "all")} className="app-field col-span-2">
                <option value="all">{t(lang, 'allDays')}</option>
                {DAYS.map(day => <option key={day} value={day}>{t(lang, day.toLowerCase())}</option>)}
              </select>
              <label className="col-span-2 flex cursor-pointer items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <input type="checkbox" checked={onlyAssignedForKid} onChange={e => setOnlyAssignedForKid(e.target.checked)} className="h-4 w-4 accent-emerald-700" />
                <span>{t(lang, 'onlyAssigned')} {filterKidId !== "all" && t(lang, 'onlyAssignedSuffixForKid')}</span>
              </label>
            </div>
          </div>

          <div className="app-panel lg:col-span-2">
            <h2 className="app-panel-title">{t(lang, 'financialView')}</h2>
            <label className="flex cursor-pointer items-start gap-2 text-xs leading-5">
              <input type="checkbox" checked={normalizeMonthly} onChange={e => setNormalizeMonthly(e.target.checked)} className="mt-0.5 h-4 w-4 accent-emerald-700" />
              <span>{t(lang, 'normalizedToggle')}</span>
            </label>
            <p className="mt-2 text-[11px] leading-4 text-slate-500">{t(lang, 'materialsInfo')}</p>
            <button onClick={clearAll} className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 hover:text-rose-500"><Trash2 className="h-3.5 w-3.5"/>{t(lang, 'clearAll')}</button>
          </div>
        </section>

        {conflicts.length > 0 && (
          <section className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 shadow-sm dark:border-amber-900 dark:bg-amber-950/30">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"/>
            <div>
              <h3 className="text-sm font-bold text-amber-950 dark:text-amber-100">{t(lang, 'conflictsTitle')}</h3>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs leading-5 text-amber-900 dark:text-amber-200">
                {conflicts.slice(0, 8).map((conflict, index) => (
                  <li key={index}><b>{conflict.kidName}</b>: {t(lang, conflict.day.toLowerCase())} — “{activityDisplayName(conflict.a, lang)}” / “{activityDisplayName(conflict.b, lang)}”</li>
                ))}
              </ul>
              {conflicts.length > 8 && <p className="mt-1 text-xs">{t(lang, 'andMore', { count: conflicts.length - 8 })}</p>}
            </div>
          </section>
        )}

        <section className="mt-5" aria-labelledby="weekly-schedule">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">{t(lang, 'eyebrow')}</p><h2 id="weekly-schedule" className="text-xl font-black tracking-tight sm:text-2xl">{t(lang, 'schedule')}</h2></div>
            <p className="hidden text-sm text-slate-500 sm:block">{filteredActivities.length} · {t(lang, 'courseLabel')}</p>
          </div>

          {visibleDays.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-7 text-center text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900">{t(lang, 'noActivities')}</div>
          ) : (
            <div className="space-y-3">
              {visibleDays.map(day => (
                <article key={day} className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="rounded-t-[0.95rem] border-b border-slate-100 bg-slate-50/70 px-4 py-2 dark:border-slate-800 dark:bg-slate-900">
                    <h3 className="text-base font-black tracking-tight">{t(lang, day.toLowerCase())}</h3>
                  </div>
                  <div className={`grid gap-px bg-slate-200 dark:bg-slate-800 ${filterSlot === 'both' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
                    {(filterSlot === 'both' || filterSlot === 'Midday') && (
                      <ScheduleColumn slot="Midday" activities={byDaySlot[day].Midday} plan={plan} onToggle={toggleAssignment} lang={lang} />
                    )}
                    {(filterSlot === 'both' || filterSlot === 'Afternoon') && (
                      <ScheduleColumn slot="Afternoon" activities={byDaySlot[day].Afternoon} plan={plan} onToggle={toggleAssignment} lang={lang} />
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-black tracking-tight">{t(lang, 'financialSummary')}</h2>
          {plan.kids.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">{t(lang, 'addKidsHint')}</p>
          ) : (
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[650px] text-sm">
                <thead><tr className="border-b border-slate-200 text-left text-[11px] uppercase tracking-wide text-slate-500 dark:border-slate-700"><th className="py-2 pr-3">{t(lang, 'kid')}</th><th className="px-3 py-2">{t(lang, 'monthlyNorm')}</th><th className="px-3 py-2">{t(lang, 'termTotal')}</th><th className="px-3 py-2">{t(lang, 'materialsOnce')}</th></tr></thead>
                <tbody>
                  {plan.kids.map(person => {
                    const row = financials.perKid.get(person.id)!;
                    return <tr key={person.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800"><td className="py-2 pr-3"><span className="inline-flex items-center gap-2 font-semibold"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: person.color }} />{person.name}</span></td><td className="px-3 py-2">{normalizeMonthly ? `${row.monthly.toFixed(2)} € / ${t(lang, 'perMonthShort')}` : '—'}</td><td className="px-3 py-2">{row.term.toFixed(2)} € / {t(lang, 'perTermShort')}</td><td className="px-3 py-2">{row.materials.toFixed(2)} €</td></tr>;
                  })}
                </tbody>
                <tfoot><tr className="border-t-2 border-slate-200 font-black dark:border-slate-700"><td className="py-2 pr-3">{t(lang, 'total')}</td><td className="px-3 py-2">{normalizeMonthly ? `${financials.totalMonthly.toFixed(2)} € / ${t(lang, 'perMonthShort')}` : '—'}</td><td className="px-3 py-2">{financials.totalTerm.toFixed(2)} € / {t(lang, 'perTermShort')}</td><td className="px-3 py-2">{financials.totalMaterials.toFixed(2)} €</td></tr></tfoot>
              </table>
            </div>
          )}
          <p className="mt-2 text-[11px] leading-4 text-slate-500">{t(lang, 'note')}</p>
        </section>

        <section className="mt-3 rounded-xl bg-slate-100 px-3 py-2 text-[11px] leading-4 text-slate-600 dark:bg-slate-900 dark:text-slate-400">
          <b>{t(lang, 'legendGrades')}</b> {t(lang, 'legendText')}
        </section>
      </main>

      <style>{`
        @media print {
          header, .no-print { display:none !important; }
          main { max-width: none; padding: 0; }
          section, article { break-inside: avoid; box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
 }

 function ScheduleColumn({ slot, activities, plan, onToggle, lang }: { slot: Slot; activities: Activity[]; plan: PlanState; onToggle: (activityId: string, kidId: string) => void; lang: Lang }) {
  const sourceUrl = slot === "Midday" ? SOURCE_URLS.midday : SOURCE_URLS.afternoon;
  const sortedActivities = activities.slice().sort((a, b) => {
    const assignmentDelta = (plan.assignments[b.id]?.length || 0) - (plan.assignments[a.id]?.length || 0);
    return assignmentDelta || activityDisplayName(a, lang).localeCompare(activityDisplayName(b, lang));
  });

  return (
    <div className="min-w-0 bg-white p-3 dark:bg-slate-900">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h4 className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-700 dark:text-slate-200">
          <span className={`h-2 w-2 rounded-full ${slot === 'Midday' ? 'bg-amber-400' : 'bg-violet-500'}`} />
          {t(lang, slot === 'Midday' ? 'midday' : 'afternoon')}
        </h4>
        <a href={sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-700">
          {t(lang, 'source')}<ExternalLink className="h-3 w-3" />
        </a>
      </div>
      {sortedActivities.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400 dark:border-slate-700">{t(lang, 'noActivities')}</div>
      ) : (
        <div className="grid gap-2 xl:grid-cols-2">
          {sortedActivities.map(activity => <ActivityCard key={activity.id} activity={activity} plan={plan} onToggle={onToggle} lang={lang} />)}
        </div>
      )}
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

  const delta = activity.previousPrice === undefined ? 0 : activity.price - activity.previousPrice;
  const notes = activityDisplayNotes(activity, lang);
  const sourceUrl = activity.status === "service"
    ? SOURCE_URLS.care
    : activity.slot === "Midday" ? SOURCE_URLS.midday : SOURCE_URLS.afternoon;

  return (
    <div className={`group relative rounded-xl border bg-white p-3 transition hover:shadow-md dark:bg-slate-900 ${open ? 'z-40' : 'z-0'} ${delta > 0 ? 'border-rose-200 dark:border-rose-900' : delta < 0 ? 'border-emerald-200 dark:border-emerald-900' : 'border-slate-200 dark:border-slate-700'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap gap-1">
            {activity.status === 'new' && <span className="rounded-full bg-sky-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-sky-700 dark:bg-sky-950 dark:text-sky-300">{t(lang, 'newActivity')}</span>}
            {activity.status === 'renamed' && <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-violet-700 dark:bg-violet-950 dark:text-violet-300">{t(lang, 'renamedActivity')}</span>}
            {activity.status === 'service' && <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">{t(lang, 'schoolService')}</span>}
          </div>
          <h5 className="text-sm font-black leading-4 tracking-tight text-slate-950 dark:text-white">{activityDisplayName(activity, lang)}</h5>
          <div className="mt-1.5 flex flex-wrap gap-1 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">{activity.grades}</span>
            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">{activity.time || (activity.slot === "Midday" ? t(lang, 'timeMiddaySlot') : t(lang, 'timeAfternoonSlot'))}</span>
          </div>
          {activity.provider && <p className="mt-1 line-clamp-1 text-[11px] leading-4 text-slate-500">{activity.provider}{activity.location ? ` · ${activity.location}` : ""}</p>}
          {notes && <p className="line-clamp-2 text-[10px] leading-4 text-slate-500">{notes}</p>}
        </div>
        <div className="shrink-0 text-right">
          <div className="whitespace-nowrap text-base font-black tracking-tight">{activity.price} €<span className="ml-0.5 text-[9px] font-medium text-slate-500">/{activity.period === "month" ? t(lang, 'perMonthShort') : t(lang, 'perTermShort')}</span></div>
          {delta !== 0 && (
            <div className={`mt-1 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-black ${delta > 0 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'}`} title={t(lang, 'previousPlannerPrice', { price: activity.previousPrice! })}>
              {delta > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {t(lang, delta > 0 ? 'priceUp' : 'priceDown', { delta: Math.abs(delta) })}
            </div>
          )}
          {activity.materialsFee && (
            <div className="mt-0.5 max-w-24 text-[9px] leading-3 text-slate-500">{t(lang, 'plusMaterialsOnce', { fee: activity.materialsFee })}</div>
          )}
        </div>
      </div>

      {delta !== 0 && <p className="mt-1 text-[9px] text-slate-500"><span className="line-through">{activity.previousPrice} €</span> · {t(lang, 'changesCompared')}</p>}

      <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-2 dark:border-slate-800">
        {assigned.length === 0 && (
          <span className="text-xs text-slate-400">{t(lang, 'noKidsAssigned')}</span>
        )}
        {assigned.map(kid => (
          <span key={kid.id} className="inline-flex min-h-7 items-center gap-1 rounded-full border bg-white px-2 text-[11px] dark:bg-slate-900" style={{ borderColor: kid.color }}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: kid.color }} />
            {kid.name}
            <button
              className="ml-0.5 grid h-6 w-6 place-items-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              style={{ color: kid.color }}
              title={t(lang, 'removeKidTitle', { name: kid.name })}
              onClick={() => onToggle(activity.id, kid.id)}
            >
              <X className="h-3.5 w-3.5" strokeWidth={3} />
            </button>
          </span>
        ))}

        <div className="no-print relative">
          <button
            className="inline-flex min-h-7 items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 text-[11px] font-bold text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            onClick={() => setOpen(v => !v)}
            disabled={plan.kids.length === 0}
            title={plan.kids.length === 0 ? t(lang, 'addKidsFirst') : t(lang, 'assignKidTitle')}
            ref={buttonRef}
            aria-expanded={open}
          >
            {t(lang, 'assignKid')}
          </button>
          {open && (
            <div ref={menuRef} className="absolute left-0 z-20 mt-1 w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              {unassigned.length === 0 ? (
                <div className="px-2 py-1.5 text-[11px] text-slate-500">{t(lang, 'allKidsAssigned')}</div>
              ) : (
              unassigned.map(kid => {
                const eligible = isKidEligibleFor(activity, kid);
                const base = "w-full text-left px-2 py-1.5 rounded-md text-[11px] flex items-center gap-1.5";
                const cls = eligible
                  ? base + " hover:bg-emerald-50 dark:hover:bg-slate-800"
                  : base + " opacity-60 cursor-not-allowed";
                return (
                  <button
                    key={kid.id}
                    onClick={() => { if (eligible) { onToggle(activity.id, kid.id); setOpen(false); } }}
                    className={cls}
                    disabled={!eligible}
                    title={eligible ? undefined : t(lang, 'notEligibleTitle', { kidGrade: kid.grade, activityGrades: activity.grades })}
                  >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: kid.color }} /> {kid.name}
                    {!eligible && <span className="ml-1 text-[10px] text-slate-500">{t(lang, 'notEligibleShort')}</span>}
                  </button>
                );
              })
            )}
            </div>
          )}
        </div>
        <a href={sourceUrl} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-emerald-700">{t(lang, 'source')}<ExternalLink className="h-3 w-3" /></a>
      </div>
    </div>
  );
}
