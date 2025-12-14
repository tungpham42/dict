// Merriam-Webster Sound Object
export interface MWSound {
  audio: string;
  ref?: string;
  stat?: string;
}

// Merriam-Webster Pronunciation
export interface MWPrs {
  mw?: string; // Written pronunciation (e.g., "kuh-mpyoo-ter")
  sound?: MWSound;
}

// Headword Information
export interface MWHeadword {
  hw: string; // The word itself (e.g., "com*put*er")
  prs?: MWPrs[]; // Pronunciations
}

// The Main Entry Object
export interface MWEntry {
  meta: {
    id: string;
    uuid: string;
    sort: string;
    stems: string[];
    offensive: boolean;
  };
  hwi: MWHeadword;
  fl?: string; // Functional Label (noun, verb, etc.)
  shortdef: string[]; // Simple definitions
  date?: string; // Date of first use
}

export interface MWThesaurusEntry {
  meta: {
    id: string;
    uuid: string;
    syns: string[][]; // Array of arrays of strings
    ants: string[][]; // Array of arrays of strings
  };
  fl: string; // Functional label (noun, verb)
  shortdef: string[];
}
