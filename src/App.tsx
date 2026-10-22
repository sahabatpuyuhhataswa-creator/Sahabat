/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserRole,
  UserAccount,
  EggRecord,
  EggSaleRecord,
  FeedRecord,
  PopulationRecord,
  ExpenseRecord,
  QuailSeedSaleRecord,
  StaffAttendanceRecord,
} from './types/quail';
import {
  getInitialEggRecords,
  getInitialEggSaleRecords,
  getInitialFeedRecords,
  getInitialPopulationRecords,
  getInitialExpenseRecords,
  getInitialSeedSaleRecords,
  getInitialAttendanceRecords,
} from './data/mockData';
import { calculateFarmMetrics } from './utils/calculations';
import { getStoredSession, saveStoredSession, DEFAULT_USERS } from './utils/auth';
import { Navbar } from './components/Navbar';
import { Sidebar, TabKey } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { EggRecordingView } from './components/EggRecordingView';
import { EggSalesView } from './components/EggSalesView';
import { FeedRecordingView } from './components/FeedRecordingView';
import { PopulationRecordingView } from './components/PopulationRecordingView';
import { SeedSalesView } from './components/SeedSalesView';
import { AttendanceView } from './components/AttendanceView';
import { ExpensesView } from './components/ExpensesView';
import { ProfitLossView } from './components/ProfitLossView';
import { AiAdvisorView } from './components/AiAdvisorView';
import { ModalForm } from './components/ModalForm';
import { AttendanceModal } from './components/AttendanceModal';
import { LoginScreen } from './components/LoginScreen';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { OwnerVerificationModal } from './components/OwnerVerificationModal';
import { EditPopulationModal } from './components/EditPopulationModal';
import { EditEggModal } from './components/EditEggModal';
import { EditEggSaleModal } from './components/EditEggSaleModal';
import { CheckCircle2, AlertTriangle, Cloud, HardDrive } from 'lucide-react';

export default function App() {
  // Current authenticated session
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    return getStoredSession();
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const session = getStoredSession();
    return session ? session.role : 'owner';
  });

  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [modalType, setModalType] = useState<'egg' | 'eggSale' | 'feed' | 'population' | 'expense' | 'seedSale' | null>(null);

  // Population Edit Modal States
  const [isEditPopulationOpen, setIsEditPopulationOpen] = useState(false);
  const [editingPopulationRecord, setEditingPopulationRecord] = useState<PopulationRecord | null>(null);

  // Egg Harvest Edit Modal States (Murni Panen Harian)
  const [isEditEggOpen, setIsEditEggOpen] = useState(false);
  const [editingEggRecord, setEditingEggRecord] = useState<EggRecord | null>(null);

  // Egg Sale Edit Modal States (Khusus Transaksi Penjualan)
  const [isEditEggSaleOpen, setIsEditEggSaleOpen] = useState(false);
  const [editingEggSaleRecord, setEditingEggSaleRecord] = useState<EggSaleRecord | null>(null);

  // Password & Security Modals
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isOwnerVerifyOpen, setIsOwnerVerifyOpen] = useState(false);
  const [targetOwnerTab, setTargetOwnerTab] = useState<TabKey | null>(null);

  // Data collections with localStorage persistence
  const [eggRecords, setEggRecords] = useState<EggRecord[]>(() => {
    const saved = localStorage.getItem('sph_egg_records');
    return saved ? JSON.parse(saved) : getInitialEggRecords();
  });

  const [eggSaleRecords, setEggSaleRecords] = useState<EggSaleRecord[]>(() => {
    const saved = localStorage.getItem('sph_egg_sales');
    return saved ? JSON.parse(saved) : getInitialEggSaleRecords();
  });

  const [feedRecords, setFeedRecords] = useState<FeedRecord[]>(() => {
    const saved = localStorage.getItem('sph_feed_records');
    return saved ? JSON.parse(saved) : getInitialFeedRecords();
  });

  const [populationRecords, setPopulationRecords] = useState<PopulationRecord[]>(() => {
    const saved = localStorage.getItem('sph_population_records');
    return saved ? JSON.parse(saved) : getInitialPopulationRecords();
  });

  const [seedSaleRecords, setSeedSaleRecords] = useState<QuailSeedSaleRecord[]>(() => {
    const saved = localStorage.getItem('sph_seed_sales');
    return saved ? JSON.parse(saved) : getInitialSeedSaleRecords();
  });

  const [expenseRecords, setExpenseRecords] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem('sph_expense_records');
    return saved ? JSON.parse(saved) : getInitialExpenseRecords();
  });

  const [attendanceRecords, setAttendanceRecords] = useState<StaffAttendanceRecord[]>(() => {
    const saved = localStorage.getItem('sph_attendance_records');
    return saved ? JSON.parse(saved) : getInitialAttendanceRecords();
  });

  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'warn' } | null>(null);

  const showToast = (message: string, type: 'success' | 'warn' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('sph_egg_records', JSON.stringify(eggRecords));
  }, [eggRecords]);

  useEffect(() => {
    localStorage.setItem('sph_egg_sales', JSON.stringify(eggSaleRecords));
  }, [eggSaleRecords]);

  useEffect(() => {
    localStorage.setItem('sph_feed_records', JSON.stringify(feedRecords));
  }, [feedRecords]);

  useEffect(() => {
    localStorage.setItem('sph_population_records', JSON.stringify(populationRecords));
  }, [populationRecords]);

  useEffect(() => {
    localStorage.setItem('sph_seed_sales', JSON.stringify(seedSaleRecords));
  }, [seedSaleRecords]);

  useEffect(() => {
    localStorage.setItem('sph_expense_records', JSON.stringify(expenseRecords));
  }, [expenseRecords]);

  useEffect(() => {
    localStorage.setItem('sph_attendance_records', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  // Auto-backup to server endpoint in addition to localStorage
  useEffect(() => {
    const payload = {
      eggRecords,
      eggSaleRecords,
      feedRecords,
      populationRecords,
      seedSaleRecords,
      expenseRecords,
      attendanceRecords,
    };
    const timeout = setTimeout(() => {
      fetch('/api/farm-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {
        // Offline mode: localStorage already safely saved the data
      });
    }, 1200);
    return () => clearTimeout(timeout);
  }, [eggRecords, eggSaleRecords, feedRecords, populationRecords, seedSaleRecords, expenseRecords, attendanceRecords]);

  // Try initial restore from server backup if localStorage was clean/new device
  useEffect(() => {
    const localSaved = localStorage.getItem('sph_egg_records');
    if (!localSaved) {
      fetch('/api/farm-data')
        .then((res) => res.json())
        .then((res) => {
          if (res?.success && res.data) {
            if (res.data.eggRecords?.length) setEggRecords(res.data.eggRecords);
            if (res.data.eggSaleRecords?.length) setEggSaleRecords(res.data.eggSaleRecords);
            if (res.data.feedRecords?.length) setFeedRecords(res.data.feedRecords);
            if (res.data.populationRecords?.length) setPopulationRecords(res.data.populationRecords);
            if (res.data.seedSaleRecords?.length) setSeedSaleRecords(res.data.seedSaleRecords);
            if (res.data.expenseRecords?.length) setExpenseRecords(res.data.expenseRecords);
            if (res.data.attendanceRecords?.length) setAttendanceRecords(res.data.attendanceRecords);
          }
        })
        .catch(() => {});
    }
  }, []);

  // Handle successful login
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    showToast(`Selamat datang, ${user.name}! Akses berhasil.`);
  };

  // Handle logout
  const handleLogout = () => {
    saveStoredSession(null);
    setCurrentUser(null);
    showToast('Anda telah keluar dari sistem farm.');
  };

  // Handle role switch or attempt to view restricted tab
  const handleRoleChange = (role: UserRole) => {
    if (role === 'owner' && currentRole === 'staff') {
      setIsOwnerVerifyOpen(true);
      return;
    }
    setCurrentRole(role);
    if (currentUser) {
      const updatedUser: UserAccount = {
        ...currentUser,
        role: role,
        name: role === 'owner' ? DEFAULT_USERS.owner.name : DEFAULT_USERS.staff.name,
      };
      setCurrentUser(updatedUser);
      saveStoredSession(updatedUser);
    }
    showToast(
      role === 'owner'
        ? 'Beralih ke Mode Pemilik Farm (Akses Finansial & AI Dibuka)'
        : 'Beralih ke Mode Petugas Kandang (Mode Lapangan Terbatas)'
    );
  };

  const handleTabChangeWithSecurity = (tab: TabKey) => {
    const isOwnerOnly = tab === 'operasional' || tab === 'labarugi' || tab === 'ai-advisor';
    if (isOwnerOnly && currentRole !== 'owner') {
      setTargetOwnerTab(tab);
      setIsOwnerVerifyOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  const handleOwnerVerifySuccess = () => {
    setCurrentRole('owner');
    if (currentUser) {
      const updatedUser: UserAccount = {
        ...currentUser,
        role: 'owner',
        name: DEFAULT_USERS.owner.name,
      };
      setCurrentUser(updatedUser);
      saveStoredSession(updatedUser);
    }
    if (targetOwnerTab) {
      setActiveTab(targetOwnerTab);
      setTargetOwnerTab(null);
    }
    showToast('Akses Pemilik berhasil diverifikasi!');
  };

  // Calculate live aggregated farm metrics
  const farmMetrics = calculateFarmMetrics(
    eggRecords,
    feedRecords,
    populationRecords,
    expenseRecords,
    seedSaleRecords,
    eggSaleRecords
  );

  // Record CRUD handlers (Panen Harian Telur)
  const handleSaveEgg = (data: Omit<EggRecord, 'id' | 'revenue'>) => {
    const newRecord: EggRecord = {
      ...data,
      id: `egg-harvest-${Date.now()}`,
    };
    setEggRecords((prev) => [newRecord, ...prev]);
    showToast('Data panen harian telur berhasil dicatat!');
  };

  const handleUpdateEggRecord = (updated: EggRecord) => {
    setEggRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    showToast('Catatan panen telur berhasil diperbarui dan tersimpan permanen!');
  };

  // Record CRUD handlers (Khusus Penjualan Telur)
  const handleSaveEggSale = (data: Omit<EggSaleRecord, 'id' | 'totalRevenue'>) => {
    const newRecord: EggSaleRecord = {
      ...data,
      id: `egg-sale-${Date.now()}`,
      totalRevenue: Math.round(data.quantityKg * data.pricePerKg),
    };
    setEggSaleRecords((prev) => [newRecord, ...prev]);
    showToast('Transaksi penjualan telur berhasil dicatat!');
  };

  const handleUpdateEggSaleRecord = (updated: EggSaleRecord) => {
    setEggSaleRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    showToast('Nota penjualan telur berhasil diperbarui!');
  };

  const handleDeleteEggSale = (id: string) => {
    setEggSaleRecords((prev) => prev.filter((r) => r.id !== id));
    showToast('Nota penjualan telur dihapus.');
  };

  const handleSaveFeed = (data: Omit<FeedRecord, 'id' | 'totalCost'>) => {
    const newRecord: FeedRecord = {
      ...data,
      id: `feed-${Date.now()}`,
      totalCost: Math.round(data.quantityKg * data.pricePerKg),
    };
    setFeedRecords((prev) => [newRecord, ...prev]);
    showToast(`Catatan ${data.feedCategory} berhasil disimpan!`);
  };

  const handleSavePopulation = (data: Omit<PopulationRecord, 'id'>) => {
    const newRecord: PopulationRecord = {
      ...data,
      id: `pop-${Date.now()}`,
    };
    setPopulationRecords((prev) => [newRecord, ...prev]);
    showToast(`Catatan sensus ${data.flockType} berhasil disimpan!`);
  };

  const handleSaveActivePopulation = (data: {
    layerCount: number;
    growerCount: number;
    notes: string;
    date: string;
  }) => {
    const todayStr = data.date || new Date().toISOString().split('T')[0];

    // Create a new Layer entry with activeCount = layerCount
    const newLayerRecord: PopulationRecord = {
      id: `pop-layer-adjust-${Date.now()}`,
      date: todayStr,
      flockType: 'Layer (Petelur)',
      kandang: 'Kandang Petelur (A & B)',
      batchName: 'Batch Layer Produktif 2026',
      startingCount: data.layerCount,
      mortalityCount: 0,
      culledCount: 0,
      additionsCount: 0,
      activeCount: data.layerCount,
      notes: data.notes || 'Penyesuaian populasi mandiri oleh peternak',
    };

    // Create a new Grower entry with activeCount = growerCount
    const newGrowerRecord: PopulationRecord = {
      id: `pop-grower-adjust-${Date.now() + 1}`,
      date: todayStr,
      flockType: 'Pembesaran (Starter/Grower)',
      kandang: 'Kandang Pembesaran (Blok C & Brooder)',
      batchName: 'Batch Pembesaran 2026',
      startingCount: data.growerCount,
      mortalityCount: 0,
      culledCount: 0,
      additionsCount: 0,
      activeCount: data.growerCount,
      notes: data.notes || 'Penyesuaian populasi mandiri oleh peternak',
    };

    setPopulationRecords((prev) => [newLayerRecord, newGrowerRecord, ...prev]);
    showToast(
      `Populasi berhasil diubah: Petelur ${data.layerCount.toLocaleString('id-ID')} ekor, Pembesaran ${data.growerCount.toLocaleString('id-ID')} ekor!`
    );
  };

  const handleUpdatePopulationRecord = (updated: PopulationRecord) => {
    setPopulationRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    showToast('Catatan sensus populasi berhasil diperbarui!');
  };

  const handleSaveSeedSale = (data: Omit<QuailSeedSaleRecord, 'id' | 'totalRevenue'>) => {
    const newRecord: QuailSeedSaleRecord = {
      ...data,
      id: `seed-${Date.now()}`,
      totalRevenue: Math.round(data.quantityBirds * data.pricePerBird),
    };
    setSeedSaleRecords((prev) => [newRecord, ...prev]);
    showToast('Penjualan bibit puyuh berhasil dicatat!');
  };

  const handleSaveExpense = (data: Omit<ExpenseRecord, 'id'>) => {
    const newRecord: ExpenseRecord = {
      ...data,
      id: `exp-${Date.now()}`,
    };
    setExpenseRecords((prev) => [newRecord, ...prev]);
    showToast('Beban operasional berhasil dicatat!');
  };

  const handleDeleteEgg = (id: string) => {
    setEggRecords((prev) => prev.filter((r) => r.id !== id));
    showToast('Catatan panen dihapus.');
  };

  const handleDeleteFeed = (id: string) => {
    setFeedRecords((prev) => prev.filter((r) => r.id !== id));
    showToast('Catatan pakan dihapus.');
  };

  const handleDeletePopulation = (id: string) => {
    setPopulationRecords((prev) => prev.filter((r) => r.id !== id));
    showToast('Catatan populasi dihapus.');
  };

  const handleDeleteSeedSale = (id: string) => {
    setSeedSaleRecords((prev) => prev.filter((r) => r.id !== id));
    showToast('Catatan penjualan bibit dihapus.');
  };

  const handleDeleteExpense = (id: string) => {
    setExpenseRecords((prev) => prev.filter((r) => r.id !== id));
    showToast('Catatan biaya dihapus.');
  };

  const handleSaveAttendance = (data: Omit<StaffAttendanceRecord, 'id'>) => {
    const newRecord: StaffAttendanceRecord = {
      ...data,
      id: `att-${Date.now()}`,
    };
    setAttendanceRecords((prev) => [newRecord, ...prev]);
    showToast('Presensi petugas kandang berhasil dicatat!');
  };

  const handleDeleteAttendance = (id: string) => {
    setAttendanceRecords((prev) => prev.filter((r) => r.id !== id));
    showToast('Data absensi dihapus.');
  };

  // Reset to initial mock dataset
  const handleResetData = () => {
    if (window.confirm('Kembalikan semua data peternakan ke data sampel awal?')) {
      setEggRecords(getInitialEggRecords());
      setEggSaleRecords(getInitialEggSaleRecords());
      setFeedRecords(getInitialFeedRecords());
      setPopulationRecords(getInitialPopulationRecords());
      setSeedSaleRecords(getInitialSeedSaleRecords());
      setExpenseRecords(getInitialExpenseRecords());
      setAttendanceRecords(getInitialAttendanceRecords());
      showToast('Data farm berhasil di-reset ke data demo.');
    }
  };

  // Export full backup as JSON
  const handleExportData = () => {
    const backupData = {
      farmName: 'Sahabat Puyuh Hataswa',
      exportDate: new Date().toISOString(),
      eggRecords,
      eggSaleRecords,
      feedRecords,
      populationRecords,
      seedSaleRecords,
      expenseRecords,
      attendanceRecords,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sahabat_puyuh_hataswa_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('File backup JSON berhasil diunduh.');
  };

  // IF NOT AUTHENTICATED -> SHOW SECURE LOGIN SCREEN
  if (!currentUser) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl border border-slate-700 animate-fade-in">
          {toast.type === 'warn' ? (
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        onOpenModal={(type) => setModalType(type)}
        onResetData={handleResetData}
        onExportData={handleExportData}
        onOpenChangePassword={() => setIsChangePasswordOpen(true)}
        onLogout={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Body */}
      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChangeWithSecurity}
          currentRole={currentRole}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              metrics={farmMetrics}
              eggRecords={eggRecords}
              feedRecords={feedRecords}
              populationRecords={populationRecords}
              expenseRecords={expenseRecords}
              currentRole={currentRole}
              onOpenModal={(type) => setModalType(type)}
              onOpenAttendanceModal={() => setIsAttendanceModalOpen(true)}
              onNavigateTab={(tab) => handleTabChangeWithSecurity(tab)}
              onOpenEditActivePopulation={() => {
                setEditingPopulationRecord(null);
                setIsEditPopulationOpen(true);
              }}
            />
          )}

          {activeTab === 'telur' && (
            <EggRecordingView
              records={eggRecords}
              currentRole={currentRole}
              onOpenModal={() => setModalType('egg')}
              onDeleteRecord={handleDeleteEgg}
              onEditRecord={(record) => {
                setEditingEggRecord(record);
                setIsEditEggOpen(true);
              }}
              onNavigateToSales={() => setActiveTab('penjualan-telur')}
            />
          )}

          {activeTab === 'penjualan-telur' && (
            <EggSalesView
              records={eggSaleRecords}
              currentRole={currentRole}
              eggStockKg={farmMetrics.eggStockKg}
              totalHarvestKg={farmMetrics.totalEggHarvestKg}
              onOpenModal={() => setModalType('eggSale')}
              onDeleteRecord={handleDeleteEggSale}
              onEditRecord={(record) => {
                setEditingEggSaleRecord(record);
                setIsEditEggSaleOpen(true);
              }}
              onNavigateToHarvest={() => setActiveTab('telur')}
            />
          )}

          {activeTab === 'bibit' && (
            <SeedSalesView
              records={seedSaleRecords}
              currentRole={currentRole}
              onOpenModal={() => setModalType('seedSale')}
              onDeleteRecord={handleDeleteSeedSale}
            />
          )}

          {activeTab === 'pakan' && (
            <FeedRecordingView
              records={feedRecords}
              currentRole={currentRole}
              onOpenModal={() => setModalType('feed')}
              onDeleteRecord={handleDeleteFeed}
              activeLayerPopulation={farmMetrics.activeLayerPopulation}
              activeGrowerPopulation={farmMetrics.activeGrowerPopulation}
            />
          )}

          {activeTab === 'populasi' && (
            <PopulationRecordingView
              records={populationRecords}
              currentRole={currentRole}
              onOpenModal={() => setModalType('population')}
              onDeleteRecord={handleDeletePopulation}
              onOpenEditActivePopulation={() => {
                setEditingPopulationRecord(null);
                setIsEditPopulationOpen(true);
              }}
              onEditRecord={(record) => {
                setEditingPopulationRecord(record);
                setIsEditPopulationOpen(true);
              }}
            />
          )}

          {activeTab === 'absensi' && (
            <AttendanceView
              records={attendanceRecords}
              currentRole={currentRole}
              onOpenModal={() => setIsAttendanceModalOpen(true)}
              onDeleteRecord={handleDeleteAttendance}
            />
          )}

          {activeTab === 'operasional' && (
            <ExpensesView
              records={expenseRecords}
              currentRole={currentRole}
              onOpenModal={() => setModalType('expense')}
              onDeleteRecord={handleDeleteExpense}
              onSwitchToOwner={() => handleRoleChange('owner')}
            />
          )}

          {activeTab === 'labarugi' && (
            <ProfitLossView
              eggRecords={eggRecords}
              eggSaleRecords={eggSaleRecords}
              feedRecords={feedRecords}
              populationRecords={populationRecords}
              expenseRecords={expenseRecords}
              seedSaleRecords={seedSaleRecords}
              currentRole={currentRole}
              onSwitchToOwner={() => handleRoleChange('owner')}
            />
          )}

          {activeTab === 'ai-advisor' && (
            <AiAdvisorView
              metrics={farmMetrics}
              currentRole={currentRole}
              onSwitchToOwner={() => handleRoleChange('owner')}
            />
          )}
        </main>
      </div>

      {/* Unified Input Modal */}
      {modalType && (
        <ModalForm
          type={modalType}
          onClose={() => setModalType(null)}
          onSaveEgg={handleSaveEgg}
          onSaveEggSale={handleSaveEggSale}
          onSaveFeed={handleSaveFeed}
          onSavePopulation={handleSavePopulation}
          onSaveExpense={handleSaveExpense}
          onSaveSeedSale={handleSaveSeedSale}
          latestLayerPopulation={farmMetrics.activeLayerPopulation}
          latestGrowerPopulation={farmMetrics.activeGrowerPopulation}
        />
      )}

      {/* Staff Attendance Modal (Photo in Cage or Manual Form) */}
      {isAttendanceModalOpen && (
        <AttendanceModal
          isOpen={isAttendanceModalOpen}
          onClose={() => setIsAttendanceModalOpen(false)}
          onSaveAttendance={handleSaveAttendance}
        />
      )}

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
          currentRole={currentRole}
          onSuccess={(msg) => showToast(msg)}
        />
      )}

      {/* Owner Security Verification Modal */}
      {isOwnerVerifyOpen && (
        <OwnerVerificationModal
          isOpen={isOwnerVerifyOpen}
          onClose={() => {
            setIsOwnerVerifyOpen(false);
            setTargetOwnerTab(null);
          }}
          onSuccess={handleOwnerVerifySuccess}
        />
      )}

      {/* Direct Population Edit & Calibration Modal */}
      {isEditPopulationOpen && (
        <EditPopulationModal
          isOpen={isEditPopulationOpen}
          onClose={() => {
            setIsEditPopulationOpen(false);
            setEditingPopulationRecord(null);
          }}
          latestLayerCount={farmMetrics.activeLayerPopulation}
          latestGrowerCount={farmMetrics.activeGrowerPopulation}
          editingRecord={editingPopulationRecord}
          onSaveActivePopulation={handleSaveActivePopulation}
          onUpdateRecord={handleUpdatePopulationRecord}
        />
      )}

      {/* Edit Egg Harvest Record Modal */}
      {isEditEggOpen && editingEggRecord && (
        <EditEggModal
          isOpen={isEditEggOpen}
          onClose={() => {
            setIsEditEggOpen(false);
            setEditingEggRecord(null);
          }}
          record={editingEggRecord}
          onSave={handleUpdateEggRecord}
        />
      )}

      {/* Edit Egg Sale Record Modal */}
      {isEditEggSaleOpen && editingEggSaleRecord && (
        <EditEggSaleModal
          isOpen={isEditEggSaleOpen}
          onClose={() => {
            setIsEditEggSaleOpen(false);
            setEditingEggSaleRecord(null);
          }}
          record={editingEggSaleRecord}
          onSave={handleUpdateEggSaleRecord}
        />
      )}
    </div>
  );
}
