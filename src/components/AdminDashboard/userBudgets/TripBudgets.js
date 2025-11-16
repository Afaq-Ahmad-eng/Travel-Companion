import { useState, useEffect } from "react";
import styles from "./TripBudgets.module.css";
import { fetchDataFromServer } from "../../../utils/api";

const TripBudgets = ({ trip, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
   console.log("We are at the Trip Budget Component ", trip);
   
  // Load categories for selected trip
  useEffect(() => {
    const loadBudgets = async () => {
      try {
        const res = await fetchDataFromServer(
          `http://localhost:3001/admin/trips/${trip.trip_id}/budget`
        );
        setCategories(res?.data?.categories || []);
      } catch (err) {
        console.error("Error loading categories:", err);
      } finally {
        setLoading(false);
      }
    };
    loadBudgets();
  }, [trip]);

  // Load expenses when category selected
  const handleCategoryClick = async (category) => {
    console.log("we are at the handle Category Click at frontend ",category.category_id);
    
    setSelectedCategory(category);
    setExpenses([]);
    try {
      const res = await fetchDataFromServer(
        `http://localhost:3001/admin/categories/${category.category_id}/expnenses`
      );
      console.log("We get the category data ", res?.data);
      
      setExpenses(res.data || []);
    } catch (err) {
      console.error("Error loading expenses:", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>
          Budgets for: <span>{trip.trip_title}</span>
        </h2>
        <button className={styles.closeButton} onClick={onClose}>
          ✖ Close
        </button>
      </div>

      {loading ? (
        <p>Loading categories...</p>
      ) : categories.length === 0 ? (
        <p>No budgets available for this trip.</p>
      ) : (
        <div className={styles.content}>
          <div className={styles.categorySection}>
            <h3>Categories</h3>
            <ul>
              {categories.map((cat) => (
                <li
                  key={cat.category_id}
                  className={
                    selectedCategory?.category_id === cat.category_id
                      ? styles.activeCategory
                      : ""
                  }
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat.category_name}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.expenseSection}>
            {selectedCategory ? (
              <>
                <h3>
                  Expenses for <span>{selectedCategory.category_name}</span>
                </h3>
                {expenses.length === 0 ? (
                  <p>No expenses recorded for this category.</p>
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
                      {expenses.map((e) => (
                        <tr key={e.expense_id}>
                          <td>{e.description}</td>
                          <td>Rs {e.amount}</td>
                          <td>{new Date(e.expense_date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            ) : (
              <p>Select a category to view expenses.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripBudgets;
