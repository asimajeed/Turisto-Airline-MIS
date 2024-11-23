import { create } from "zustand";

export type airportType = {
    airport_id: number;
    airport_code: string;
    airport_name: string;
    city: string;
    country: string;
    latitude: string;
    longitude: string;
};

export interface GlobalState {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phoneNumber: string | null;
    dateOfBirth: string | null;
    loyaltyPoints: number | null;
    start_date: Date | null;
    end_date: Date | null;
    departure_airport: airportType | null;
    arrival_airport: airportType | null;
    airport_list: string[] | null;
    adminAccess: boolean;
    isOneWay: boolean;

    setFirstName: (firstName: string | null) => void;
    setLastName: (lastName: string | null) => void;
    setEmail: (email: string | null) => void;
    setPhoneNumber: (phoneNumber: string | null) => void;
    setDateOfBirth: (dateOfBirth: string | null) => void;
    setLoyaltyPoints: (points: number | null) => void;
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
    email: null,
    phoneNumber: null,
    dateOfBirth: null,
    loyaltyPoints: null,
    start_date: null,
    end_date: null,
    departure_airport: null,
    arrival_airport: null,
    airport_list: null,
    adminAccess: false,
    isOneWay: false,
    setFirstName: () => { },
    setLastName: () => { },
    setEmail: () => { },
    setPhoneNumber: () => { },
    setDateOfBirth: () => { },
    setLoyaltyPoints: () => { },
    setStartDate: () => { },
    setEndDate: () => { },
    setDepartureAirport: () => { },
    setArrivalAirport: () => { },
    setAirportList: () => { },
    setAdminAccess: () => { },
    setIsOneWay: () => { },
    setAll: () => { },
};

export const useGlobalStore = create<GlobalState>((set) => ({
    ...defaultUserState,
    setFirstName: (firstName) => set({ first_name: firstName }),
    setLastName: (lastName) => set({ last_name: lastName }),
    setEmail: (email) => set({ email }),
    setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
    setDateOfBirth: (dateOfBirth) => set({ dateOfBirth }),
    setLoyaltyPoints: (points) => set({ loyaltyPoints: points }),
    setStartDate: (startDate) => set({ start_date: startDate }),
    setEndDate: (endDate) => set({ end_date: endDate }),
    setDepartureAirport: (airport) => set({ departure_airport: airport }),
    setArrivalAirport: (airport) => set({ arrival_airport: airport }),
    setAirportList: (airportList) => set({ airport_list: airportList }),
    setAdminAccess: (access) => set({ adminAccess: access }),
    setIsOneWay: (isOneWay) => set({ isOneWay }),
    setAll: (newState) => set(newState),
}));
