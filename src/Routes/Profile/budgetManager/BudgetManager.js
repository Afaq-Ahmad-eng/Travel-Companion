import { useEffect, useState } from "react";
import CategoryList from "./categoryList/CategoryList";
import styles from "./BudgetManager.module.css";
import { fetchDataFromServer } from "../../../utils/api";
import { useNavigate, useLocation } from "react-router-dom";

let prepareExpenses = undefined;

const BudgetManager = ({ userId }) => {
  const [budgets, setBudgets] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const res = await fetchDataFromServer(
          `http://localhost:3001/user/profile/${userId}/budget-data`
        );

        console.log("We are at the budget manager ", res);
        

        const preparedBudgets = (res?.budgetData || [])
          .filter((item) => item?.budgets)
          .map((item) => {
            const budget = item.budgets;
            const StartDate = item?.start_date
              ? new Date(item.start_date)
              : null;
            const EndDate = item?.end_date ? new Date(item.end_date) : null;
            const days =
              StartDate && EndDate
                ? Math.ceil((EndDate - StartDate) / (1000 * 60 * 60 * 24))
                : "N/A";

            return {
              tripId: item.trip_id ?? null,
              tripTitle: item.trip_title || "Untitled Trip",
              destination: item.destination || "Unknown destination",
              StartDate: StartDate ? StartDate.toLocaleDateString() : "N/A",
              EndDate: EndDate ? EndDate.toLocaleDateString() : "N/A",
              TotalDays: days,
              BudgetId: budget?.budget_id,
              totalAmount: budget?.total_amount
                ? Number(budget.total_amount)
                : 0,
              budgetCreatedAt: budget?.created_at
                ? new Date(budget.created_at).toLocaleDateString()
                : "Not created yet",
            };
          });

        setBudgets(preparedBudgets);

        const preparedCategories = (res?.budgetData || [])
          .filter((item) => item?.budgets?.categories)
          .flatMap((item) =>
            item.budgets.categories.map((category) => ({
              CategoryId: category.category_id,
              CategoryName: category.category_name,
              CategoryCreatedAt: category.created_at,
              BudgetId: category.budget_id,
              AllocatedAmountForThisCategory: category.allocated_amount,
              trip_title: item?.budgets?.trip_budget_title,
            }))
          );

          console.log("we check the category object structure ", preparedCategories);
          

        prepareExpenses = (res?.budgetData || [])
          .filter((item) => Array.isArray(item?.budgets?.categories))
          .flatMap((item) =>
            item.budgets.categories
              .filter(
                (category) =>
                  Array.isArray(category.expenses) &&
                  category.expenses.length > 0
              )
              .flatMap((category) =>
                category.expenses.map((expense) => ({
                  ExpenseId: expense?.expense_id,
                  CategoryId: expense?.category_id,
                  CategoryName: category?.category_name || "Unnamed Category",
                  ExpenseDescription: expense?.description,
                  AllocatedAmountForExpense: expense?.amount,
                  DateOnWhichThisExpenseWeDo: expense?.expense_date,
                  ExpenseCreatedAt: expense?.created_at,
                  ExpenseUpdateAt: expense?.updated_at,
                }))
              )
          );

        setAllCategories(preparedCategories);
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    };

    fetchBudgets();
  }, [userId]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
    }).format(amount);

  const isCategoriesPage = location.pathname.includes("/Categories");
  const routeState = location.state || {};
  const categoriesFromState = routeState.categoriesData || [];
  const budgetIdFromState = routeState.budgetId;

  if (budgets.length === 0) {
    return (
      <div className={styles.noBudget}>
        <i className="fas fa-wallet"></i>
        <div>
          No budgets found. Create a budget to start managing your trips!
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {!isCategoriesPage ? (
        <>
          <div className={styles.categorySection}>
            <button
              className={styles.backBtn}
              onClick={() => navigate("/profile")}
            >
              &larr; Back to Profile
            </button>
            <h2 className={styles.pageTitle}>Budget Manager</h2>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.budgetTable}>
              <thead>
                <tr>
                  <th>Trip Title</th>
                  <th>Destination</th>
                  <th>Planned On</th>
                  <th>Trip Dates</th>
                  <th>Duration</th>
                  <th>Total Budget</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((budget) => (
                  <tr
                    key={budget.tripId}
                    className={styles.tableRow}
                    onClick={() =>
                      navigate("/profile/Budget-manager/Categories", {
                        state: {
                          budgetId: budget.BudgetId,
                          categoriesData: allCategories.filter(
                            (cat) => cat.BudgetId === budget.BudgetId
                          ),
                        },
                      })
                    }
                  >
                    <td>{budget.tripTitle}</td>
                    <td>{budget.destination}</td>
                    <td>{budget.budgetCreatedAt}</td>
                    <td>
                      {budget.StartDate} - {budget.EndDate}
                    </td>
                    <td>{budget.TotalDays} days</td>
                    <td>{formatCurrency(budget.totalAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <CategoryList
          budgetId={budgetIdFromState}
          categoriesData={categoriesFromState}
          expensesData={prepareExpenses}
        />
      )}
    </div>
  );
};

export default BudgetManager;
