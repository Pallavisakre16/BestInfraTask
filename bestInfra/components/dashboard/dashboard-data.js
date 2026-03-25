export const DASHBOARD_OVERVIEW = {
  greeting: 'Hi, Sandeep',
  subheading: 'Staying efficient today?',
  dueAmount: 'Due Amount: Rs 3,180',
  dueDate: 'Due on 5 Feb 2026',
  paymentTitle: 'Pay securely\nto stay on track.',
  paymentHint: 'Avoid service disruption.',
  daysLeft: '9 Days Left',
  connectionTitle: 'GMR AERO TOWER\n2 INCOMER',
  connectionStatus: 'Tap for Details',
  connectionNumber: '18132429',
  connectionLabel: 'Last Communication',
  connectionDate: '07 Jan 2025, 6:35 PM',
};

export const ENERGY_SUMMARY = {
  title: 'Energy Summary',
  cta: 'Pick a Date',
  usageLabel: "This Month's Usage:",
  usageValue: '620 kWh',
  usageDelta: '10%',
  usageDeltaIcon: 'trending-up',
  usageComparison: 'vs. Last Month.',
  ranges: ['7D', '30D', '90D', '1Y'],
  activeRange: '30D',
  chartAction: 'Chart',
  primarySeriesLabel: 'This Month',
  secondarySeriesLabel: 'Last Month',
  bars: [
    { month: 'Jan', height: 145, compareHeight: 122 },
    { month: 'Feb', height: 132, compareHeight: 118 },
    { month: 'Mar', height: 132, compareHeight: 124 },
    { month: 'Apr', height: 93, compareHeight: 101 },
    { month: 'May', height: 136, compareHeight: 121 },
    { month: 'Jun', height: 126, compareHeight: 114 },
    { month: 'Jul', height: 132, compareHeight: 119 },
    { month: 'Aug', height: 93, compareHeight: 97 },
    { month: 'Sep', height: 136, compareHeight: 126 },
    { month: 'Oct', height: 126, compareHeight: 116 },
  ],
};

export const METRIC_SUMMARY = {
  averageLabel: 'Average Daily',
  averageValue: '2,867.634 kWh',
  peakLabel: 'Peak Usage',
  peakValue: '329 kWh',
  comparisonTitle: 'Comparison',
  currentLabel: 'This Month',
  currentValue: '2,060 kWh',
  previousLabel: 'Last Month',
  previousValue: '2,340 kWh',
  savedLabel: 'You saved 280 kWh',
  savedProgress: 0.74,
};

export const ALERT_ROWS = [
  { id: '1', serialNo: '1', meterNumber: '18132429', consumerName: 'GMR Aero Tower 2' },
  { id: '2', serialNo: '2', meterNumber: '18132429', consumerName: 'GMR Aero Tower 2' },
  { id: '3', serialNo: '3', meterNumber: '18132429', consumerName: 'GMR Aero Tower 2' },
];

export const DASHBOARD_NAV_ITEMS = [
  { id: 'home', icon: 'home', label: 'Home', active: true },
  { id: 'pay', icon: 'account-balance-wallet', label: 'Pay', active: false },
  { id: 'usage', icon: 'insert-chart-outlined', label: 'Usage', active: false },
  { id: 'tickets', icon: 'support-agent', label: 'Tickets', active: false },
  { id: 'invoice', icon: 'receipt-long', label: 'Invoice', active: false },
];

export const DASHBOARD_MENU = {
  userName: 'Rakesh Kumar',
  userId: 'ID: GMR-2024-001234',
  version: 'Version 1.0.26',
  items: [
    { id: 'dashboard', icon: 'space-dashboard', label: 'Dashboard', active: true },
    { id: 'usage', icon: 'sync', label: 'Usage', active: false },
    { id: 'payments', icon: 'description', label: 'Payments', active: false },
    { id: 'reports', icon: 'article', label: 'Reports', active: false },
    { id: 'tickets', icon: 'support-agent', label: 'Tickets', active: false },
    { id: 'alerts', icon: 'notifications-none', label: 'Alerts', active: false },
  ],
  footerItems: [
    { id: 'settings', icon: 'settings', label: 'Settings' },
    { id: 'logout', icon: 'logout', label: 'Logout' },
  ],
};
