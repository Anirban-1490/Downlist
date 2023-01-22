import { create } from "zustand";

const updateProfileData = (set, get) => {
    return (newProfileData = {}) => {
        return set(() => ({
            profileData: { ...get().profileData, ...newProfileData },
        }));
    };
};

const removeProfileData = (set) => {
    return () => set(() => ({ profileData: {} }));
};

const allMethods = (set, get) => ({
    update: updateProfileData(set, get),
    remove: removeProfileData(set),
});

export const useProfileData = create((set, get) => ({
    profileData: {},
    ...allMethods(set, get),
}));
