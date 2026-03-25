function createFallbackCompareHeight(height, index) {
  const base = Math.max(0, Number(height) || 0);
  const ratioPattern = [0.86, 0.9, 0.92, 0.88, 0.94];
  const ratio = ratioPattern[index % ratioPattern.length];

  return Math.max(1, Math.round(base * ratio));
}

function normalizeEnergySummary(energySummary = {}) {
  const bars = Array.isArray(energySummary.bars) ? energySummary.bars : [];

  const normalizedBars = bars.map((bar, index) => {
    const height = Math.max(0, Number(bar?.height) || 0);
    const compareHeightValue = Number(bar?.compareHeight);
    const compareHeight =
      Number.isFinite(compareHeightValue) && compareHeightValue > 0
        ? compareHeightValue
        : createFallbackCompareHeight(height, index);

    return {
      ...bar,
      month: bar?.month || `M${index + 1}`,
      height,
      compareHeight,
    };
  });

  return {
    ...energySummary,
    primarySeriesLabel: energySummary.primarySeriesLabel || 'This Month',
    secondarySeriesLabel: energySummary.secondarySeriesLabel || 'Last Month',
    bars: normalizedBars,
  };
}

function normalizeDashboardPayload(dashboard) {
  if (!dashboard) {
    return null;
  }

  return {
    ...dashboard,
    energySummary: normalizeEnergySummary(dashboard.energySummary),
  };
}

module.exports = {
  normalizeDashboardPayload,
};
