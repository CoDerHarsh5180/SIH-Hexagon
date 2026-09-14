import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';

// Default / fallback dataset in case backend endpoint is not yet connected
export const DEFAULT_PUBLIC_DASHBOARD_DATA = {
  metrics: {
    totalReceived: 18450,
    inProgress: 2840,
    approved: 14690,
    rejected: 920,
    turnaroundDays: 4.2,
    slaComplianceRate: 94.2,
  },
  monthlyVelocity: [
    { month: 'Oct 2025', received: 2840, approved: 2320, inProgress: 380, rejected: 140 },
    { month: 'Nov 2025', received: 3120, approved: 2580, inProgress: 390, rejected: 150 },
    { month: 'Dec 2025', received: 2980, approved: 2470, inProgress: 360, rejected: 150 },
    { month: 'Jan 2026', received: 3410, approved: 2890, inProgress: 350, rejected: 170 },
    { month: 'Feb 2026', received: 3260, approved: 2710, inProgress: 400, rejected: 150 },
    { month: 'Mar 2026', received: 2840, approved: 1720, inProgress: 960, rejected: 160 },
  ],
  statusDistribution: [
    { name: 'Approved & Signed', count: 14690, pct: 79.6, color: '#10B981' },
    { name: 'In Progress / Scrutiny', count: 2840, pct: 15.4, color: '#F59E0B' },
    { name: 'Rejected / Deficiencies', count: 920, pct: 5.0, color: '#EF4444' },
  ],
  departments: [
    { code: 'MPCB', name: 'Maharashtra Pollution Control Board', received: 5380, approved: 4410, inProgress: 680, rejected: 290, avgSla: '18 Days', compliance: '94.8%' },
    { code: 'MIDC', name: 'Industrial Development Corporation', received: 4220, approved: 3640, inProgress: 440, rejected: 140, avgSla: '7 Days', compliance: '97.2%' },
    { code: 'DISH', name: 'Directorate of Industrial Safety & Health', received: 3860, approved: 3210, inProgress: 480, rejected: 170, avgSla: '14 Days', compliance: '93.5%' },
    { code: 'FIRE', name: 'Maharashtra State Fire Services', received: 2940, approved: 2420, inProgress: 370, rejected: 150, avgSla: '12 Days', compliance: '91.8%' },
    { code: 'TP', name: 'Urban Development / Town Planning', received: 2050, approved: 1010, inProgress: 870, rejected: 170, avgSla: '24 Days', compliance: '88.4%' },
  ],
  districts: [
    { name: 'Pune Hub', cluster: 'Chakan, Bhosari, Ranjangaon', total: 4410, approved: 3820, inProgress: 430, rejected: 160, turnaround: '14 Days', compliance: '96.2%' },
    { name: 'Thane & Navi Mumbai', cluster: 'TTC, Turbhe, Taloja', total: 3580, approved: 2940, inProgress: 480, rejected: 160, turnaround: '17 Days', compliance: '92.4%' },
    { name: 'Chhatrapati Sambhajinagar', cluster: 'AURIC Shendra, Bidkin, Waluj', total: 2790, approved: 2360, inProgress: 310, rejected: 120, turnaround: '12 Days', compliance: '97.1%' },
    { name: 'Nagpur Industrial Corridor', cluster: 'MIHAN SEZ, Butibori', total: 2150, approved: 1790, inProgress: 260, rejected: 100, turnaround: '18 Days', compliance: '89.6%' },
    { name: 'Nashik Manufacturing Belt', cluster: 'Ambad, Satpur, Sinnar', total: 1840, approved: 1510, inProgress: 240, rejected: 90, turnaround: '16 Days', compliance: '91.5%' },
    { name: 'Kolhapur Foundry Cluster', cluster: 'Shiroli, Gokul Shirgaon', total: 1420, approved: 1190, inProgress: 170, rejected: 60, turnaround: '15 Days', compliance: '93.8%' },
  ],
};

export const publicDashboardService = {
  /**
   * Fetch all consolidated public dashboard statistics (KPIs, monthly velocity, breakdown)
   */
  getPublicMetrics: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_PATHS.PUBLIC_DASHBOARD.GET_METRICS, { params });
      return response?.data || response || DEFAULT_PUBLIC_DASHBOARD_DATA;
    } catch (error) {
      console.warn('Public dashboard API request failed, falling back to cached statistics:', error.message);
      return DEFAULT_PUBLIC_DASHBOARD_DATA;
    }
  },

  /**
   * Fetch monthly application velocity and turnaround trend
   */
  getMonthlyVelocity: async (timeframe = '6M') => {
    try {
      const response = await axiosInstance.get(API_PATHS.PUBLIC_DASHBOARD.GET_MONTHLY_VELOCITY, { params: { timeframe } });
      return response?.data || response;
    } catch (error) {
      console.warn('Monthly velocity API request failed, using fallback:', error.message);
      return DEFAULT_PUBLIC_DASHBOARD_DATA.monthlyVelocity;
    }
  },

  /**
   * Fetch departmental clearance matrix
   */
  getDepartmentMatrix: async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.PUBLIC_DASHBOARD.GET_DEPARTMENT_MATRIX);
      return response?.data || response;
    } catch (error) {
      console.warn('Department matrix API request failed, using fallback:', error.message);
      return DEFAULT_PUBLIC_DASHBOARD_DATA.departments;
    }
  },

  /**
   * Fetch district-wise clearance data
   */
  getDistrictMatrix: async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.PUBLIC_DASHBOARD.GET_DISTRICT_MATRIX);
      return response?.data || response;
    } catch (error) {
      console.warn('District matrix API request failed, using fallback:', error.message);
      return DEFAULT_PUBLIC_DASHBOARD_DATA.districts;
    }
  },
};

export default publicDashboardService;
