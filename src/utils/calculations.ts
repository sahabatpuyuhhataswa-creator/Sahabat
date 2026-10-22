import {
  EggRecord,
  EggSaleRecord,
  FeedRecord,
  PopulationRecord,
  ExpenseRecord,
  QuailSeedSaleRecord,
  FarmMetrics,
} from '../types/quail';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatDecimal(num: number, maxDecimals: number = 8): string {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  }).format(num);
}

export function calculateFarmMetrics(
  eggs: EggRecord[],
  feeds: FeedRecord[],
  populations: PopulationRecord[],
  expenses: ExpenseRecord[],
  seedSales: QuailSeedSaleRecord[] = [],
  eggSales: EggSaleRecord[] = []
): FarmMetrics {
  // Separate populations by flockType
  const layerPops = populations
    .filter((p) => p.flockType === 'Layer (Petelur)')
    .sort((a, b) => b.date.localeCompare(a.date));

  const growerPops = populations
    .filter((p) => p.flockType === 'Pembesaran (Starter/Grower)')
    .sort((a, b) => b.date.localeCompare(a.date));

  const activeLayerPopulation = layerPops[0]?.activeCount || 5000;
  const activeGrowerPopulation = growerPops[0]?.activeCount || 1450;
  const activePopulation = activeLayerPopulation + activeGrowerPopulation;

  // Separate feeds
  const sortedEggs = [...eggs].sort((a, b) => b.date.localeCompare(a.date));
  const latestEgg = sortedEggs[0] || {
    goodEggsPcs: 0,
    brokenEggsPcs: 0,
    totalWeightKg: 0,
    revenue: 0,
  };

  const layerFeeds = feeds.filter((f) => f.feedCategory === 'Pakan Petelur (Layer)');
  const growerFeeds = feeds.filter((f) => f.feedCategory === 'Pakan Pembesaran (Starter/Grower)');

  const latestLayerFeed = [...layerFeeds].sort((a, b) => b.date.localeCompare(a.date))[0] || {
    quantityKg: 115,
    sackCount: 2.3,
    totalCost: 966000,
  };

  const todayEggsPcs = (latestEgg.goodEggsPcs || 0) + (latestEgg.brokenEggsPcs || 0);
  const todayEggsKg = latestEgg.totalWeightKg || 0;
  const todayBrokenPcs = latestEgg.brokenEggsPcs || 0;

  // Hen-Day Production (%) = (Total Eggs Pcs / Active Layer Population) * 100
  const hdp = activeLayerPopulation > 0 ? Number(((todayEggsPcs / activeLayerPopulation) * 100).toFixed(1)) : 0;

  // FCR Layer = Layer Feed Intake Kg / Egg Production Kg
  const fcr = todayEggsKg > 0 ? Number(((latestLayerFeed.quantityKg || 0) / todayEggsKg).toFixed(2)) : 0;

  // Average Egg Weight = (Kg * 1000) / Pcs
  const avgEggWeightGram = todayEggsPcs > 0 ? Number(((todayEggsKg * 1000) / todayEggsPcs).toFixed(1)) : 0;

  // Feed consumption per bird (layer)
  const feedPerBirdGram = activeLayerPopulation > 0
    ? Number((((latestLayerFeed.quantityKg || 0) * 1000) / activeLayerPopulation).toFixed(1))
    : 0;

  // Mortality
  const mortality30DaysLayer = layerPops.reduce((sum, p) => sum + (p.mortalityCount || 0), 0);
  const mortality30DaysGrower = growerPops.reduce((sum, p) => sum + (p.mortalityCount || 0), 0);
  const mortality30Days = mortality30DaysLayer + mortality30DaysGrower;
  const mortalityRate = activePopulation > 0 ? Number(((mortality30Days / activePopulation) * 100).toFixed(2)) : 0;

  // Harvest & Sales Volume
  const totalEggHarvestKg = Number(eggs.reduce((sum, e) => sum + (e.totalWeightKg || 0), 0).toFixed(1));
  const totalEggSalesKg = Number(eggSales.reduce((sum, s) => sum + (s.quantityKg || 0), 0).toFixed(1));
  const eggStockKg = Math.max(0, Number((totalEggHarvestKg - totalEggSalesKg).toFixed(1)));

  // Revenues - separate egg sales transactions from harvest records
  const monthlyEggRevenue = eggSales.length > 0
    ? eggSales.reduce((sum, s) => sum + (s.totalRevenue || 0), 0)
    : eggs.reduce((sum, e) => sum + (e.revenue || 0), 0);
  const monthlySeedRevenue = seedSales.reduce((sum, s) => sum + (s.totalRevenue || 0), 0);
  const monthlyCullRevenue = populations.reduce((sum, p) => sum + (p.cullRevenue || 0), 0);
  const monthlyRevenue = monthlyEggRevenue + monthlySeedRevenue + monthlyCullRevenue;

  // Costs
  const monthlyLayerFeedCost = layerFeeds.reduce((sum, f) => sum + (f.totalCost || 0), 0);
  const monthlyGrowerFeedCost = growerFeeds.reduce((sum, f) => sum + (f.totalCost || 0), 0);
  const monthlyFeedCost = monthlyLayerFeedCost + monthlyGrowerFeedCost;
  const monthlyOpCost = expenses.reduce((sum, x) => sum + (x.amount || 0), 0);
  const monthlyCost = monthlyFeedCost + monthlyOpCost;

  // Net Profit & Margin
  const monthlyNetProfit = monthlyRevenue - monthlyCost;
  const profitMargin = monthlyRevenue > 0 ? Number(((monthlyNetProfit / monthlyRevenue) * 100).toFixed(1)) : 0;

  // BEP Egg per Kg (attributed against layer feed + operational share)
  const totalEggKg = totalEggHarvestKg;
  const bepPerKg = totalEggKg > 0 ? Math.round((monthlyLayerFeedCost + monthlyOpCost) / totalEggKg) : 0;

  return {
    activeLayerPopulation,
    activeGrowerPopulation,
    activePopulation,
    todayEggsKg,
    todayEggsPcs,
    todayBrokenPcs,
    hdp,
    fcr,
    avgEggWeightGram,
    feedPerBirdGram,
    mortality30DaysLayer,
    mortality30DaysGrower,
    mortality30Days,
    mortalityRate,
    monthlyEggRevenue,
    monthlySeedRevenue,
    monthlyCullRevenue,
    monthlyRevenue,
    monthlyLayerFeedCost,
    monthlyGrowerFeedCost,
    monthlyCost,
    monthlyNetProfit,
    profitMargin,
    bepPerKg,
    feedStockSacksLayer: 18,
    feedStockSacksGrower: 8,
    feedStockSacks: 26,
    totalEggHarvestKg,
    totalEggSalesKg,
    eggStockKg,
  };
}
