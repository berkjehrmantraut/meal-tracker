// Storage: browser localStorage (with in-memory fallback for non-browser environments).
const STORAGE_KEY = "meal-tracker.dailyFoodCounts";

export type FoodGroupCounts = {
  fruits: number;
  vegetables: number;
  grains: number;
  protein: number;
  dairy: number;
};

export type DailyFoodRecord = {
  date: string;
  counts: FoodGroupCounts;
  target: number;
};

const defaultCounts: FoodGroupCounts = {
  fruits: 0,
  vegetables: 0,
  grains: 0,
  protein: 0,
  dairy: 0,
};

let inMemoryRecords: DailyFoodRecord[] = [];

const isStorageAvailable = (): boolean =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const loadRecords = (): DailyFoodRecord[] => {
  if (!isStorageAvailable()) {
    return inMemoryRecords;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as DailyFoodRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveRecords = (records: DailyFoodRecord[]): void => {
  if (!isStorageAvailable()) {
    inMemoryRecords = records;
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export const listDailyRecords = (): DailyFoodRecord[] => loadRecords();

export const getDailyRecordByDate = (date: string): DailyFoodRecord | undefined =>
  loadRecords().find((record) => record.date === date);

export const upsertDailyRecord = (record: DailyFoodRecord): DailyFoodRecord => {
  const records = loadRecords();
  const existingIndex = records.findIndex((item) => item.date === record.date);

  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.push(record);
  }

  saveRecords(records);
  return record;
};

export const deleteDailyRecord = (date: string): void => {
  const records = loadRecords().filter((record) => record.date !== date);
  saveRecords(records);
};

export const initializeDailyRecord = (target = 5): DailyFoodRecord => {
  const today = getTodayDateString();
  const existing = getDailyRecordByDate(today);

  if (existing) {
    return existing;
  }

  const newRecord: DailyFoodRecord = {
    date: today,
    counts: { ...defaultCounts },
    target,
  };

  return upsertDailyRecord(newRecord);
};

export const updateDailyCounts = (
  date: string,
  counts: Partial<FoodGroupCounts>
): DailyFoodRecord | undefined => {
  const existing = getDailyRecordByDate(date);
  if (!existing) {
    return undefined;
  }

  const updated: DailyFoodRecord = {
    ...existing,
    counts: {
      ...existing.counts,
      ...counts,
    },
  };

  return upsertDailyRecord(updated);
};

export const ensureTodayRecord = (target = 5): DailyFoodRecord =>
  initializeDailyRecord(target);
