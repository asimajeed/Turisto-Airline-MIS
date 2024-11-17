
const TicketGenerator = () => {

    const ticketData = {
        passenger: 'Ms Zarina Rana',
        bookingReference: 'MNJ9GE',
        ticketNumber: '117 - 2524125573',
        flights: [
            {
                flight: 'SK 254 / 05SEP',
                route: 'Birmingham - Copenhagen Kastrup',
                departure: '10:00',
                arrival: '12:45',
                date: '05SEP24',
                terminal: '1',
                gate: '45',
                duration: '01:45',
                baggage: '1PC',
                meal: 'Refreshments For Purchase',
            },
            {
                flight: 'SK 927 / 06SEP',
                route: 'Copenhagen Kastrup - Boston BOS',
                departure: '14:35',
                arrival: '16:00',
                date: '06SEP24',
                terminal: '3',
                gate: '15',
                duration: '08:25',
                baggage: '1PC',
                meal: 'Meal (Non-Specific)',
            },
            {
                flight: 'SK 926 / 07OCT',
                route: 'Boston BOS - Copenhagen Kastrup',
                departure: '18:05',
                arrival: '07:15',
                date: '07OCT24',
                terminal: 'E',
                gate: '50',
                duration: '07:10',
                baggage: '1PC',
                meal: 'Meal (Non-Specific)',
            },
        ],
        fare: {
            baseFare: '138.00 GBP',
            taxes: '260.87 EUR',
            otherCharges: '55.86 EUR',
            total: '550.87 EUR',
        },
        paymentMethod: 'Visa',
        issuedBy: '1831 Diagem',
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 print:block">
            <div className="w-full max-w-2xl border border-gray-300 shadow-lg rounded-lg p-8 bg-white print:w-full print:max-w-none text-sm mt-10 mb-10">

                {/* Print Button */}
                <div className="text-right mb-4 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
                    >
                        Print Ticket
                    </button>
                </div>

                {/* Header */}
                <div className="text-center border-b pb-4 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Turistoe</h1>
                    <p className="text-sm">Electronic Ticket Itinerary and Receipt</p>
                </div>

                {/* Passenger Details */}
                <div className="mb-6">
                    <p className="font-medium text-lg mb-1">Passenger: {ticketData.passenger}</p>
                    <p>Booking Reference: <span className="font-semibold">{ticketData.bookingReference}</span></p>
                    <p>Ticket Number: <span className="font-semibold">{ticketData.ticketNumber}</span></p>
                </div>

                {/* Flight Details */}
                {ticketData.flights.map((flight, index) => (
                    <div key={index} className="border-b py-4">
                        <p className="font-medium text-blue-600 mb-2">{flight.flight}</p>
                        <div className="grid grid-cols-2 gap-4">
                            <p><span className="font-semibold">Route:</span> {flight.route}</p>
                            <p><span className="font-semibold">Date:</span> {flight.date}</p>
                            <p><span className="font-semibold">Departure:</span> {flight.departure} | <span className="font-semibold">Arrival:</span> {flight.arrival}</p>
                            <p><span className="font-semibold">Duration:</span> {flight.duration}</p>
                            <p><span className="font-semibold">Terminal:</span> {flight.terminal} | <span className="font-semibold">Gate:</span> {flight.gate}</p>
                            <p><span className="font-semibold">Baggage:</span> {flight.baggage} | <span className="font-semibold">Meal:</span> {flight.meal}</p>
                        </div>
                    </div>
                ))}

                {/* Fare Details */}
                <div className="mt-6 border-t pt-4">
                    <h2 className="text-center font-semibold mb-2">Fare Details</h2>
                    <div className="flex justify-between text-gray-800">
                        <span>Base Fare</span>
                        <span>{ticketData.fare.baseFare}</span>
                    </div>
                    <div className="flex justify-between text-gray-800">
                        <span>Taxes, Fees, Other Charges</span>
                        <span>{ticketData.fare.taxes}</span>
                    </div>
                    <div className="flex justify-between text-gray-800">
                        <span>Other International Fees</span>
                        <span>{ticketData.fare.otherCharges}</span>
                    </div>
                    <div className="flex justify-between font-semibold mt-2">
                        <span>Total Amount</span>
                        <span>{ticketData.fare.total}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center pt-4 border-t mt-4">
                    <p className="text-xs text-gray-500">Form of Payment: {ticketData.paymentMethod}</p>
                    <p className="text-xs text-gray-500">Issued by: {ticketData.issuedBy}</p>
                    <p className="text-xs text-gray-500 mt-2">Thank you for choosing Turistoe!</p>
                </div>
            </div>
        </div>
    );
};

export default TicketGenerator;
