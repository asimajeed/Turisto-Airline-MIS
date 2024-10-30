import React from "react";

const Ticket: React.FC = () => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200">
            {/* Main Container */}
            <div className="p-6 max-w-md mx-auto bg-white border border-gray-200 shadow-md print:max-w-full print:shadow-none">
                {/* Header */}
                <h1 className="text-2xl font-bold text-center mb-6">Boarding Pass</h1>

                {/* Passenger Section */}
                <div className="p-4 bg-gray-100 rounded mb-4">
                    <h2 className="text-lg font-semibold">Passengers</h2>
                    <div className="mt-2">
                        <p className="font-bold">Zarina Ghazi Rana</p>
                        <p className="text-sm">Ticket #: 0142103963964</p>
                        <p className="text-sm">Seats: IAH - YYZ, YYZ - YHZ</p>
                    </div>
                </div>

                {/* Flight Details Section */}
                <div className="p-4 bg-gray-100 rounded mb-4">
                    <h2 className="text-lg font-semibold">Depart</h2>
                    <p className="text-sm">Sat 21 Sep, 2024 • Economy - Basic</p>
                    <div className="mt-4 space-y-4">
                        <div className="flex justify-between">
                            <div>
                                <p>Houston IAH</p>
                                <p className="text-sm text-gray-500">07:00</p>
                                <p className="text-xs text-gray-500">G. Bush Intercontinental, Terminal A</p>
                            </div>
                            <div>
                                <p>Toronto YYZ</p>
                                <p className="text-sm text-gray-500">11:17</p>
                                <p className="text-xs text-gray-500">Toronto-Pearson Int., Terminal 1</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">AC590</p>
                                <p className="text-xs text-gray-500">3hr 17m</p>
                                <p className="text-xs text-gray-500">Economy Class (G)</p>
                                <p className="text-xs text-gray-500">Operated by: Air Canada</p>
                                <p className="text-xs text-blue-500 underline">Wi-Fi, A220-300</p>
                                <p className="text-xs text-gray-500">Food for purchase on board</p>
                            </div>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-4">
                            <div>
                                <p>Toronto YYZ</p>
                                <p className="text-sm text-gray-500">12:55</p>
                                <p className="text-xs text-gray-500">Toronto-Pearson Int., Terminal 1</p>
                            </div>
                            <div>
                                <p>Halifax YHZ</p>
                                <p className="text-sm text-gray-500">16:01</p>
                                <p className="text-xs text-gray-500">Halifax Stanfield Int., Nova Scotia</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">AC606</p>
                                <p className="text-xs text-gray-500">2hr 06m</p>
                                <p className="text-xs text-gray-500">Economy Class (G)</p>
                                <p className="text-xs text-gray-500">Operated by: Air Canada</p>
                                <p className="text-xs text-blue-500 underline">Wi-Fi, A220-300</p>
                                <p className="text-xs text-gray-500">Food for purchase on board</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Purchase Summary Section */}
                <div className="p-4 bg-gray-100 rounded mb-4">
                    <h2 className="text-lg font-semibold">Purchase Summary</h2>
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-sm">1 adult</p>
                        <p className="text-sm font-bold">GB £136.80</p>
                    </div>
                    <p className="text-sm text-gray-500">Base fare - Economy - Basic: £108.00</p>
                </div>

                {/* Print Button */}
                <button
                    onClick={handlePrint}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 print:hidden"
                >
                    Print Ticket
                </button>
            </div>
        </div>
    );
};

export default Ticket;