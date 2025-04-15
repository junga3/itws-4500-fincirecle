import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Graph from "@/components/Graph";
import Link from "next/link";
import { getCards } from "../actions/cardActions";
import { getTransactions } from "../actions/transactionActions";

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

export default async function ReportsPage() {
    const session = await auth();
    if (!session) {
        redirect("/login");
    }

    let cards;
    const transactionsData: graphData[] = [];

    const cardsResponse = await getCards();
    if (cardsResponse.status === 'success') {
        cards = cardsResponse.data;

        for (const card of cards) {
            const transactionsResponse = await getTransactions(card.cardName);
            if (transactionsResponse.status === 'success') {
                const totalForTransactions = transactionsResponse.data.reduce((acc, transaction) => acc + transaction.amount, 0);
                let runningTotal = 0;
                const transactions = transactionsResponse.data.map(transaction => {
                    runningTotal += transaction.amount;
                    return {
                        timestamp: transaction.timestamp,
                        amount: runningTotal,
                        description: transaction.description,
                        runningBalance: runningTotal,
                    };
                });
                transactionsData.push({
                    cardName: card.cardName,
                    transactions: transactions,
                    total: totalForTransactions,
                });
            }
        }
    }

    return (
        <>
            <div className="container mx-auto p-4">
                <div className="mb-6">
                <Link href="/dashboard" className="text-blue-500 hover:underline flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Dashboard
                </Link>
                </div>
            </div>
            <Graph data={transactionsData} />
        </>
    );
}