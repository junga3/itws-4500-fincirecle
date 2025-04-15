"use client";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";

interface graphData {
    cardName: string,
    transactions: {
        timestamp: Date;
        amount: number;
        description: string;
        runningBalance: number;
    }[],
    total: number;
}

interface PageProps {
    data: graphData[];
}

export default function Graph({ data }: PageProps) {

    return ((
        data.length > 0 ? (
            <div className="flex flex-col min-h-screen justify-center items-center">
                <ResponsiveContainer width="50%" height={300}>
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="cardName" />
                        <YAxis domain={[
                            (dataMin: number) => Math.round(dataMin - Math.abs(dataMin) * 0.2),
                            (dataMax: number) => Math.round(dataMax + Math.abs(dataMax) * 0.2)
                        ]} />
                        <Tooltip />
                        <ReferenceLine y={0} stroke="#000" />
                        <Bar dataKey="total">
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.total >= 0 ? "#4CAF50" : "#F44336"}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                {data.map((card, index) => (
                    <div key={card.cardName} className="w-full max-w-2xl mx-auto mb-8 p-4 bg-white shadow-md rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">
                            {card.cardName} — Total: {card.total.toFixed(2)}
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={card.transactions}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="timestamp"
                                    tickFormatter={(value: string) =>
                                        format(new Date(value), 'MM/dd HH:mm')
                                    }
                                />
                                <YAxis />
                                <Tooltip
                                    formatter={(value: number, name: string) => {
                                        if (name === 'runningBalance') return [`${value}`, 'Balance'];
                                        if (name === 'amount') return [`${value}`, 'Transaction'];
                                        return [value, name];
                                    }}
                                    labelFormatter={(label: string) =>
                                        `Time: ${format(new Date(label), 'PPpp')}`
                                    }
                                />
                                <Line
                                    type="monotone"
                                    dataKey="runningBalance"
                                    stroke={`hsl(${index * 60}, 70%, 50%)`}
                                    dot={{ r: 3 }}
                                    name="Balance"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ))}
            </div>
        ) : (
            <Link href="/dashboard">Please add a card or transaction information here</Link>
        )
    )
    );
}