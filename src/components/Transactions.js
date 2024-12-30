import TransactionBox from "./TransactionBox";
import Transaction from "./Transaction"; // Import the Transaction component

function Transactions(){
    const dummyTransactions = [
        {
          date: '2023-01-01',
          amount: 2500,
          accountFrom: 'Checking',
          transactionName: 'Salary',
          category: 'Salary',
          type: 'income',
          currency: 'USD'
        },
        {
          date: '2023-01-02',
          amount: 50,
          accountFrom: 'Checking',
          transactionName: 'Groceries',
          category: 'Food',
          type: 'expense',
          currency: 'USD'
        },
        {
          date: '2023-01-03',
          amount: 100,
          accountFrom: 'Checking',
          accountTo: 'Savings',
          transactionName: 'Transfer to Savings',
          category: 'Transfer',
          type: 'transfer',
          currency: 'USD'
        },
        {
          date: '2023-01-04',
          amount: 250,
          accountFrom: 'Credit Card',
          transactionName: 'Online Shopping',
          category: 'Shopping',
          type: 'expense',
          currency: 'USD'
        },
        {
          date: '2023-01-05',
          amount: 75,
          accountFrom: 'Checking',
          transactionName: 'Restaurant',
          category: 'Food',
          type: 'expense',
          currency: 'USD'
        },
        {
          date: '2023-01-06',
          amount: 1000,
          accountFrom: 'Checking',
          transactionName: 'Freelance Income',
          category: 'Freelance',
          type: 'income',
          currency: 'USD'
        },
        {
          date: '2023-01-07',
          amount: 120,
          accountFrom: 'Checking',
          transactionName: 'Gas',
          category: 'Transportation',
          type: 'expense',
          currency: 'USD'
        },
        {
          date: '2023-01-08',
          amount: 30,
          accountFrom: 'Checking',
          transactionName: 'Bus Pass',
          category: 'Transportation',
          type: 'expense',
          currency: 'USD'
        },
        {
          date: '2023-01-09',
          amount: 200,
          accountFrom: 'Savings',
          accountTo: 'Checking',
          transactionName: 'Emergency Transfer',
          category: 'Transfer',
          type: 'transfer',
          currency: 'USD'
        },
        {
          date: '2023-01-10',
          amount: 45,
          accountFrom: 'Checking',
          transactionName: 'Movie Tickets',
          category: 'Entertainment',
          type: 'expense',
          currency: 'USD'
        },
        {
          date: '2023-01-11',
          amount: 3000,
          accountFrom: 'Checking',
          transactionName: 'Bonus',
          category: 'Salary',
          type: 'income',
          currency: 'USD'
        },
        {
          date: '2023-01-12',
          amount: 60,
          accountFrom: 'Checking',
          transactionName: 'Utility Bill',
          category: 'Bills',
          type: 'expense',
          currency: 'USD'
        },
        {
          date: '2023-01-13',
          amount: 150,
          accountFrom: 'Credit Card',
          transactionName: 'Clothes',
          category: 'Shopping',
          type: 'expense',
          currency: 'USD'
        },
        {
          date: '2023-01-14',
          amount: 600,
          accountFrom: 'Checking',
          transactionName: 'Rent',
          category: 'Housing',
          type: 'expense',
          currency: 'USD'
        },
        {
          date: '2023-01-15',
          amount: 100,
          accountFrom: 'Savings',
          accountTo: 'Brokerage',
          transactionName: 'Investing',
          category: 'Transfer',
          type: 'transfer',
          currency: 'USD'
        },
        {
          date: '2023-01-16',
          amount: 220,
          accountFrom: 'Checking',
          transactionName: 'Car Insurance',
          category: 'Bills',
          type: 'expense',
          currency: 'USD'
        },
        {
          date: '2023-01-17',
          amount: 90,
          accountFrom: 'Credit Card',
          transactionName: 'Dining Out',
          category: 'Food',
          type: 'expense',
          currency: 'USD'
        },
        {
          date: '2023-01-18',
          amount: 400,
          accountFrom: 'Checking',
          transactionName: 'Part-Time Work',
          category: 'Freelance',
          type: 'income',
          currency: 'USD'
        },
        {
          date: '2023-01-19',
          amount: 60,
          accountFrom: 'Checking',
          transactionName: 'Gym Membership',
          category: 'Fitness',
          type: 'expense',
          currency: 'USD'
        },
        {
          date: '2023-01-20',
          amount: 80,
          accountFrom: 'Checking',
          transactionName: 'Haircut',
          category: 'Personal Care',
          type: 'expense',
          currency: 'USD'
        }
    ];

    return (
        
        dummyTransactions.map((txn, idx) => (
        <TransactionBox>
            <Transaction
                key={idx}
                date={txn.date}
                amount={txn.amount}
                accountFrom={txn.accountFrom}
                accountTo={txn.accountTo}
                transactionName={txn.transactionName}
                category={txn.category}
                type={txn.type}
                currency={txn.currency}
            />
        </TransactionBox>
        
        ))

    );
}

export default Transactions;