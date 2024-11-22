import { create } from "zustand";
import { airportType } from "@/utils/types";

export interface GlobalState {
  first_name: string | null;
  last_name: string | null;
  start_date: Date | null;
  end_date: Date | null;
  departure_airport: airportType | null;
  arrival_airport: airportType | null;
  airport_list: string[] | null;
  adminAccess: boolean;
  isOneWay: boolean;
  setFirstName: (firstName: string | null) => void;
  setLastName: (lastName: string | null) => void;
  setStartDate: (startDate: Date | null) => void;
  setEndDate: (endDate: Date | null) => void;
  setDepartureAirport: (airport: airportType | null) => void;
  setArrivalAirport: (airport: airportType | null) => void;
  setAirportList: (airportList: string[] | null) => void;
  setAdminAccess: (access: boolean) => void;
  setIsOneWay: (isOneWay: boolean) => void;
  setAll: (newState: Partial<GlobalState>) => void;
}

const defaultUserState: GlobalState = {
  first_name: null,
  last_name: null,
  start_date: null,
  end_date: null,
  departure_airport: null,
  arrival_airport: null,
  airport_list: null,
  adminAccess: false,
  isOneWay: false,
  setFirstName: () => {},
  setLastName: () => {},
  setStartDate: () => {},
  setEndDate: () => {},
  setDepartureAirport: () => {},
  setArrivalAirport: () => {},
  setAirportList: () => {},
  setAdminAccess: () => {},
  setIsOneWay: () => { },
  
  setAll: () => {},
};

export const useGlobalStore = create<GlobalState>((set) => ({
  ...defaultUserState,
  setFirstName: (firstName: string | null) => set({ first_name: firstName }),
  setLastName: (lastName: string | null) => set({ last_name: lastName }),
  setStartDate: (startDate: Date | null) => set({ start_date: startDate }),
  setEndDate: (endDate: Date | null) => set({ end_date: endDate }),
  setDepartureAirport: (airport: airportType | null) =>
    set({ departure_airport: airport }),
  setArrivalAirport: (airport: airportType | null) =>
    set({ arrival_airport: airport }),
  setAirportList: (airportList: string[] | null) =>
    set({ airport_list: airportList }),
  setAdminAccess: (access: boolean) => set({ adminAccess: access }),
  setIsOneWay: (isOneWay: boolean) => set({ isOneWay: isOneWay }),
  
  setAll: (newState: Partial<GlobalState>) => set(newState),
}));
