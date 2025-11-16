import { useMemo } from "react";
import styles from "./ExpenseList.module.css";

const ExpenseList = ({ categoryId, expensesData, onClose }) => {
  console.log("We print the expense Data ",expensesData);
  
  // Filter only expenses belonging to the selected category
  const filteredExpenses = useMemo(() => {
    return (expensesData || []).filter(
      (expense) => expense.CategoryId === categoryId
    );
  }, [categoryId, expensesData]);

  return (
  <div>
    <h4 className={styles.heading}>
      Expenses for{" "}
      <span className={styles.categoryName}>
        {
          expensesData.find((e) => e.CategoryId === categoryId)?.CategoryName ||
          "Category"
        }
      </span>
    </h4>

    {(!filteredExpenses || filteredExpenses.length === 0) ? (
      <div className={styles.noExpense}>
        <i className="fas fa-receipt"></i>
        <div>No expenses recorded in this category yet.</div>
      </div>
    ) : (
      <table className={styles.expenseTable}>
        <thead>
          <tr>
            <th>Expense Name</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.map((expense) => (
            <tr key={expense.ExpenseId}>
              <td>{expense.ExpenseDescription}</td>
              <td>Rs {expense.AllocatedAmountForExpense}</td>
              <td>
                {new Date(
                  expense.DateOnWhichThisExpenseWeDo
                ).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

};

export default ExpenseList;
