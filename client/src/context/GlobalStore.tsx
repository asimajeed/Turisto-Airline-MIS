import { create } from "zustand";
import { airportType } from "@/utils/types";

export interface GlobalState {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
  date_of_birth: string | null;
  loyalty_points: number | null;
  loyalty_points_redeemed: number | null;
  departure_airport: airportType | null;
  arrival_airport: airportType | null;
  is_admin: boolean;
  is_guest: boolean;

  start_date: Date | null;
  end_date: Date | null;
  isOneWay: boolean;
  airport_list: string[] | null;

  setFirstName: (firstName: string | null) => void;
  setLastName: (lastName: string | null) => void;
  setEmail: (email: string | null) => void;
  setPhoneNumber: (phoneNumber: string | null) => void;
  setDateOfBirth: (dateOfBirth: string | null) => void;
  setLoyaltyPoints: (points: number | null) => void;
  setDepartureAirport: (airport: airportType | null) => void;
  setArrivalAirport: (airport: airportType | null) => void;
  setAdminAccess: (access: boolean) => void;
  setStartDate: (startDate: Date | null) => void;
  setEndDate: (endDate: Date | null) => void;
  setIsOneWay: (isOneWay: boolean) => void;
  setAirportList: (airportList: string[] | null) => void;
  setAll: (newState: Partial<GlobalState>) => void;
  resetUserFields: () => void; // New method to reset user-related fields
}

const defaultUserState: GlobalState = {
  first_name: null,
  last_name: null,
  email: null,
  phone_number: null,
  date_of_birth: null,
  loyalty_points: null,
  loyalty_points_redeemed: null,
  start_date: null,
  end_date: null,
  departure_airport: null,
  arrival_airport: null,
  airport_list: null,
  is_admin: false,
  is_guest: false,
  isOneWay: false,
  setFirstName: () => {},
  setLastName: () => {},
  setEmail: () => {},
  setPhoneNumber: () => {},
  setDateOfBirth: () => {},
  setLoyaltyPoints: () => {},
  setStartDate: () => {},
  setEndDate: () => {},
  setDepartureAirport: () => {},
  setArrivalAirport: () => {},
  setAirportList: () => {},
  setAdminAccess: () => {},
  setIsOneWay: () => {},
  setAll: () => {},
  resetUserFields: () => {}, // Initialize with an empty function
};

export const useGlobalStore = create<GlobalState>((set) => ({
  ...defaultUserState,
  setFirstName: (firstName) => set({ first_name: firstName }),
  setLastName: (lastName) => set({ last_name: lastName }),
  setEmail: (email) => set({ email }),
  setPhoneNumber: (phoneNumber) => set({ phone_number: phoneNumber }),
  setDateOfBirth: (dateOfBirth) => set({ date_of_birth: dateOfBirth }),
  setLoyaltyPoints: (points) => set({ loyalty_points: points }),
  setStartDate: (startDate) => set({ start_date: startDate }),
  setEndDate: (endDate) => set({ end_date: endDate }),
  setDepartureAirport: (airport) => set({ departure_airport: airport }),
  setArrivalAirport: (airport) => set({ arrival_airport: airport }),
  setAirportList: (airportList) => set({ airport_list: airportList }),
  setAdminAccess: (access) => set({ is_admin: access }),
  setIsOneWay: (isOneWay) => set({ isOneWay }),
  setAll: (newState) => set(newState),

  resetUserFields: () => {
    set({
      first_name: null,
      last_name: null,
      email: null,
      phone_number: null,
      date_of_birth: null,
      loyalty_points: null,
      loyalty_points_redeemed: null,
      is_admin: false,
      is_guest: false,
    });
  },
}));
