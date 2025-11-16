import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseList from "../expenseList/ExpenseList";
import styles from "./CategoryList.module.css";

const CategoryList = ({ budgetId, categoriesData, expensesData }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  //Load categories when budget changes
  useEffect(() => {
    if (categoriesData && categoriesData.length > 0) {
      setCategories(categoriesData);
    }
  }, [budgetId, categoriesData]);

  // ✅ If no categories exist, show message
  if (!categories || categories.length === 0) {
    return (
      <div className={styles.noCategory}>
        <i className="fas fa-tags"></i>
        <div>No categories available for this budget yet.</div>
        <button
          className={styles.backBtn}
          onClick={() => navigate("/profile/Budget-manager")}
        >
          &larr; Back to Budgets
        </button>
      </div>
    );
  }

  return (
    <div className={styles.managerContainer}>
      {/* Header Section */}
      <div className={styles.headerRow}>
        <button
          className={styles.backBtn}
          onClick={() => navigate("/profile/Budget-manager")}
        >
          &larr; Back to Budgets
        </button>
        <h3>
          Budget for:{" "}
          <span className={styles.budgetName}>
            {categoriesData[0]?.trip_title || "Trip"}
          </span>
        </h3>
      </div>

      {/* Main Content: Categories & Expenses */}
      <div className={styles.budgetContent}>
        {/* LEFT SIDE - Category List */}
        <div className={styles.categoriesSection}>
          <h4>Categories</h4>
          {categories.map((category) => (
            <button
              key={category.CategoryId}
              className={`${styles.categoryButton} ${
                selectedCategory === category.CategoryId
                  ? styles.activeCategory
                  : ""
              }`}
              onClick={() => setSelectedCategory(category.CategoryId)}
            >
              {category.CategoryName}
            </button>
          ))}
        </div>

        {/* RIGHT SIDE - Expense Details */}
        <div className={styles.expensesSection}>
          {selectedCategory ? (
            <ExpenseList
              categoryId={selectedCategory}
              expensesData={expensesData}
              onClose={() => setSelectedCategory(null)}
            />
          ) : (
            <div className={styles.noExpenseSelect}>
              Select a category to view its expenses
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
