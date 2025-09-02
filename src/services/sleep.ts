import { SleepData } from '@/types';

/**
 * Sleep data service
 * Provides dummy data for sleep analytics
 */

// Generate dummy sleep data
const generateSleepData = (startDate: Date, days: number): SleepData[] => {
  const data: SleepData[] = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Generate realistic sleep data with some variance
    const baseDeepSleep = 90 + Math.random() * 60; // 90-150分
    const baseLightSleep = 180 + Math.random() * 120; // 180-300分
    const baseAwake = 15 + Math.random() * 30; // 15-45分
    
    const deepSleep = Math.round(baseDeepSleep);
    const lightSleep = Math.round(baseLightSleep);
    const awake = Math.round(baseAwake);
    const totalSleep = deepSleep + lightSleep;
    
    data.push({
      date: date.toISOString().split('T')[0], // YYYY-MM-DD format
      deepSleep,
      lightSleep,
      awake,
      totalSleep
    });
  }
  
  return data;
};

// Generate weekly aggregated data
const generateWeeklyData = (): SleepData[] => {
  const data: SleepData[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - (i * 7));
    
    // Calculate week range
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const weekLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}-${weekEnd.getMonth() + 1}/${weekEnd.getDate()}`;
    
    // Generate weekly averages
    const baseDeepSleep = 100 + Math.random() * 40;
    const baseLightSleep = 220 + Math.random() * 80;
    const baseAwake = 25 + Math.random() * 20;
    
    const deepSleep = Math.round(baseDeepSleep);
    const lightSleep = Math.round(baseLightSleep);
    const awake = Math.round(baseAwake);
    const totalSleep = deepSleep + lightSleep;
    
    data.push({
      date: weekLabel,
      deepSleep,
      lightSleep,
      awake,
      totalSleep
    });
  }
  
  return data;
};

export class SleepService {
  /**
   * Fetch daily sleep data (last 14 days)
   */
  static async fetchDailyData(): Promise<SleepData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
    
    // Simulate occasional errors
    if (Math.random() < 0.1) { // 10% chance of error
      throw new Error('睡眠データの取得に失敗しました');
    }
    
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 13); // Last 14 days
    
    return generateSleepData(startDate, 14);
  }
  
  /**
   * Fetch weekly sleep data (last 7 weeks)
   */
  static async fetchWeeklyData(): Promise<SleepData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
    
    // Simulate occasional errors
    if (Math.random() < 0.1) { // 10% chance of error
      throw new Error('週間データの取得に失敗しました');
    }
    
    return generateWeeklyData();
  }
}