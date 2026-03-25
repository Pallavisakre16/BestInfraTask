const Dashboard = require('../models/Dashboard');
const { ensureUserResources } = require('../services/seedService');
const { normalizeDashboardPayload } = require('../services/dashboardTransformService');

async function getDashboard(req, res, next) {
  try {
    await ensureUserResources(req.user);
    const dashboard = await Dashboard.findOne({ user: req.user._id }).lean();

    if (!dashboard) {
      res.status(404);
      throw new Error('Dashboard not found');
    }

    const normalizedDashboard = normalizeDashboardPayload(dashboard);

    res.json({
      overview: normalizedDashboard.overview,
      energySummary: normalizedDashboard.energySummary,
      metricSummary: normalizedDashboard.metricSummary,
      alerts: normalizedDashboard.alerts,
      navItems: normalizedDashboard.navItems,
      menu: normalizedDashboard.menu,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getDashboard };
