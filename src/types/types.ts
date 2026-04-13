// types.ts

// Płaski wynik parsera
export interface SensoryRecord {
  nerve: string;
  location: string;
  peakLat: number;
  amp: number;
  cv: number;
}

export interface MotorRecord {
  nerve: string;
  location: string;
  lat: number;
  amp: number;
  cv: number;
  fLat: number;
}

export interface ParsedData {
  sensoryData: SensoryRecord[];
  motorData: MotorRecord[];
}

// 🔹 Nowe typy do zagnieżdżonego JSON do wysyłki
export interface TestSNCS {
  site: string;
  Peak_Lat_ms: number;
  Amp_uV: number;
  CV_m_s: number;
  Ref_Dev_Lat?: number;
}

export interface NerveSNCS {
  nerve: string;
  tests: TestSNCS[];
}

export interface TransformedData {
  SNCS: NerveSNCS[];
  MNCS: NerveMNCS[];
}

export interface TestMNCS {
  site: string;
  Lat_ms: number;
  Amp_mV: number;
  CV_m_s: number | null;
  F_Lat_ms?: number;
}

export interface NerveMNCS {
  nerve: string;
  tests: TestMNCS[];
}