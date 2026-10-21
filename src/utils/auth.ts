import { UserAccount, UserRole } from '../types/quail';

const USERS_STORAGE_KEY = 'sph_users_credentials';
const SESSION_STORAGE_KEY = 'sph_auth_session';

export const DEFAULT_USERS: Record<UserRole, UserAccount> = {
  owner: {
    role: 'owner',
    username: 'pemilik',
    name: 'H. Taswa (Pemilik Farm)',
    password: 'pemilik123',
  },
  staff: {
    role: 'staff',
    username: 'petugas',
    name: 'Petugas Lapangan Kandang',
    password: 'petugas123',
  },
};

export function getStoredUsers(): Record<UserRole, UserAccount> {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USERS;
  }
}

export function saveStoredUsers(users: Record<UserRole, UserAccount>): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function getStoredSession(): UserAccount | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStoredSession(user: UserAccount | null): void {
  if (!user) {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } else {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  }
}

export function authenticateUser(
  identifier: string,
  enteredPassword: string
): { success: boolean; user?: UserAccount; error?: string } {
  const users = getStoredUsers();
  const trimmed = identifier.trim().toLowerCase();

  // Check matching username or role keyword or email
  let matchedUser: UserAccount | undefined;

  if (trimmed === 'pemilik' || trimmed === 'owner' || trimmed === 'sahabatpuyuhhataswa@gmail.com') {
    matchedUser = users.owner;
  } else if (trimmed === 'petugas' || trimmed === 'staff' || trimmed === 'kandang') {
    matchedUser = users.staff;
  } else {
    // Search by username
    matchedUser = Object.values(users).find(
      (u) => u.username.toLowerCase() === trimmed
    );
  }

  if (!matchedUser) {
    return {
      success: false,
      error: 'Username tidak ditemukan. Gunakan "pemilik" atau "petugas".',
    };
  }

  if (matchedUser.password !== enteredPassword) {
    return {
      success: false,
      error: 'Password salah. Silakan periksa kembali huruf besar/kecil.',
    };
  }

  const sessionUser: UserAccount = {
    ...matchedUser,
    lastLogin: new Date().toISOString(),
  };

  saveStoredSession(sessionUser);
  return { success: true, user: sessionUser };
}

export function changeUserPassword(
  role: UserRole,
  currentPassword: string,
  newPassword: string
): { success: boolean; error?: string } {
  const users = getStoredUsers();
  const targetUser = users[role];

  if (!targetUser) {
    return { success: false, error: 'Pengguna tidak ditemukan.' };
  }

  if (targetUser.password !== currentPassword) {
    return { success: false, error: 'Password saat ini tidak sesuai.' };
  }

  if (newPassword.length < 6) {
    return { success: false, error: 'Password baru minimal harus 6 karakter.' };
  }

  users[role] = {
    ...targetUser,
    password: newPassword,
  };

  saveStoredUsers(users);

  // Update session if currently logged in user is this role
  const session = getStoredSession();
  if (session && session.role === role) {
    saveStoredSession({ ...session, password: newPassword });
  }

  return { success: true };
}
