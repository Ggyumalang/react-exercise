import { create } from "zustand";

export type Role = 'GUEST' | 'EMPLOYEE' | 'DEPT_ADMIN' | 'SYS_ADMIN';

interface AuthStore {
    role : Role;
    setRole: (newRole : Role) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    role : 'EMPLOYEE',
    setRole : (newRole : Role) => set(() => {
        return {
            role : newRole
        }
    })
})

)