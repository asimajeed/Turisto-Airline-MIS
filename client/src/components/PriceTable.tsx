import React from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const PriceTable = () => {
    const columnHeaders = ["Flights Grid", "2/12", "2/13", "2/14", "2/15", "2/16"];
    const rows = [
        { date: "3/7", prices: ["$837", "$592", "$592", "$1,308", "$937"] },
        { date: "3/8", prices: ["$837", "$592", "$592", "$837", "$1,308"] },
        { date: "3/9", prices: ["$624", "$592", "$624", "$592", "$592"] },
        { date: "3/10", prices: ["$1,308", "$624", "$624", "$837", "$837"] },
        { date: "3/11", prices: ["$592", "$624", "$1,308", "$837", "$624"] },
        // Additional rows as needed
    ];

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columnHeaders.map((header, index) => (
                        <TableHead key={index} className="text-center font-bold">
                            {header}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                        <TableCell className="text-center font-medium">{row.date}</TableCell>
                        {row.prices.map((price, priceIndex) => (
                            <TableCell key={priceIndex} className="text-center">
                                {price}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default PriceTable;
