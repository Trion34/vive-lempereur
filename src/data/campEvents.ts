// Re-export Rivoli camp event definitions for backward compatibility.
// Engine code (preBattleCamp.ts) and tests continue to import from here.
export {
  getBriefingEvent,
  getBonaparteEvent,
  getCampfiresEvent,
  getAllPreBattleEvents,
  FORAGE_SUCCESS,
  FORAGE_FAIL,
  SOCIALIZE_NARRATIVES,
} from './battles/rivoli/camp';
