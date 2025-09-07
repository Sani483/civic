import AsyncStorage from '@react-native-async-storage/async-storage';
import { Issue } from '../types';

const KEYS = {
  ISSUES: 'cached_issues',
  USER_TOKEN: 'user_token',
  DRAFT_REPORTS: 'draft_reports',
};

export const storage = {
  async cacheIssues(issues: Issue[]) {
    await AsyncStorage.setItem(KEYS.ISSUES, JSON.stringify(issues));
  },

  async getCachedIssues(): Promise<Issue[]> {
    const cached = await AsyncStorage.getItem(KEYS.ISSUES);
    return cached ? JSON.parse(cached) : [];
  },

  async saveDraftReport(report: any) {
    const drafts = await this.getDraftReports();
    drafts.push({ ...report, id: Date.now().toString() });
    await AsyncStorage.setItem(KEYS.DRAFT_REPORTS, JSON.stringify(drafts));
  },

  async getDraftReports() {
    const drafts = await AsyncStorage.getItem(KEYS.DRAFT_REPORTS);
    return drafts ? JSON.parse(drafts) : [];
  },

  async clearDrafts() {
    await AsyncStorage.removeItem(KEYS.DRAFT_REPORTS);
  }
};