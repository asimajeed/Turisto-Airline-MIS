import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const Report: React.FC = () => {
    const routes = [
        { route: 'NYC-LAX', date: '2024-01-01', totalBookings: 100, cancellations: 5, modifications: 10 },
        { route: 'LON-DUB', date: '2024-01-02', totalBookings: 80, cancellations: 8, modifications: 5 },
    ];

    const revenueBreakdown = [
        { flight: 'NYC-LAX', revenue: '15000 EUR' },
        { flight: 'LON-DUB', revenue: '10000 EUR' },
    ];

    const totalRevenue = '50000 EUR';
    const discountsApplied = '3000 EUR';

    const handlePrint = (): void => {
        window.print();
    };

    return (
        <div className="flex justify-center items-center min-h-screen print:block">
            <div className="w-full max-w-4xl border border-gray-300 shadow-lg rounded-lg p-8 bg-card print:w-full print:max-w-none text-sm mt-10 mb-10">
                {/* Print Button */}
                <div className="text-right mb-4 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
                    >
                        Print Report
                    </button>
                </div>

                {/* Report Header */}
                <div className="text-center border-b pb-4 mb-6">
                    <h1 className="text-2xl font-bold">Turistoe Report</h1>
                    <p className="text-sm text-foreground">Bookings and Revenue Insights</p>
                </div>

                {/* Booking Details */}
                <div>
                    <h2 className="text-lg font-bold mb-4">Booking Summary</h2>
                    <Table>
                        <TableCaption>A summary of recent bookings.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Route</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Total Bookings</TableHead>
                                <TableHead>Cancellations</TableHead>
                                <TableHead>Modifications</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {routes.map((route, index) => (
                                <TableRow key={index}>
                                    <TableCell>{route.route}</TableCell>
                                    <TableCell>{route.date}</TableCell>
                                    <TableCell>{route.totalBookings}</TableCell>
                                    <TableCell>{route.cancellations}</TableCell>
                                    <TableCell>{route.modifications}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Revenue Details */}
                <div className="mt-6">
                    <h2 className="text-lg font-bold mb-4">Revenue Overview</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border p-4">
                            <h3 className="font-bold">Total Revenue</h3>
                            <p>{totalRevenue}</p>
                        </div>
                        <div className="border p-4">
                            <h3 className="font-bold">Discount Impact</h3>
                            <p>{discountsApplied}</p>
                        </div>
                    </div>
                    <h3 className="text-lg mt-6">Revenue Breakdown by Flight</h3>
                    <Table className="mt-4">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Flight</TableHead>
                                <TableHead>Revenue</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {revenueBreakdown.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.flight}</TableCell>
                                    <TableCell>{item.revenue}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Footer */}
                <div className="text-center pt-4 border-t mt-4">
                    <p className="text-xs text-foreground">Generated at: {new Date().toLocaleString()}</p>
                    <p className="text-xs text-foreground mt-2">Thank you for using Turistoe!</p>
                </div>
            </div>
        </div>
    );
};

export default Report;
