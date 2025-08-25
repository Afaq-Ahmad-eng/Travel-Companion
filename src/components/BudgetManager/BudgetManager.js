import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BudgetManager.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaFileDownload,
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";

const defaultCategories = [
  "Food",
  "Accommodation",
  "Transport",
  "Activities",
  "Shopping",
  "Miscellaneous",
];

const COLORS = [
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#d84b4b",
];

const BudgetManager = () => {
  const navigate = useNavigate();
  const [totalBudget, setTotalBudget] = useState(0);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingExpense, setEditingExpense] = useState({});
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const storedBudget = localStorage.getItem("totalBudget");
    const storedCategories = localStorage.getItem("categories");
    if (storedBudget) setTotalBudget(parseFloat(storedBudget));
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(
        defaultCategories.map((cat) => ({ name: cat, budget: 0, expenses: [] }))
      );
    }

    return () => {};
  }, []);

  const saveToLocalStorage = () => {
    localStorage.setItem("totalBudget", totalBudget);
    localStorage.setItem("categories", JSON.stringify(categories));
  };

  const handleContinue = () => {
    saveToLocalStorage();
    localStorage.setItem("budgetSaved", "true");
    navigate("/", { state: { budgetSaved: true } });
  };

  const handleReset = () => {
    if (
      window.confirm("Are you sure you want to reset your entire budget plan?")
    ) {
      localStorage.removeItem("totalBudget");
      localStorage.removeItem("categories");
      localStorage.removeItem("budgetSaved");
      setTotalBudget(0);
      setCategories(
        defaultCategories.map((cat) => ({ name: cat, budget: 0, expenses: [] }))
      );
      navigate("/budget");
    }
  };

  const handleBudgetChange = (index, budget) => {
    const parsed = parseFloat(budget);
    const totalAllocated = categories.reduce(
      (sum, cat, i) => (i === index ? sum : sum + cat.budget),
      0
    );

    if (
      !isNaN(parsed) &&
      parsed >= 0 &&
      totalAllocated + parsed <= totalBudget
    ) {
      const updated = [...categories];
      updated[index].budget = parsed;
      setCategories(updated);
    }
  };

  const handleAddExpense = (index, amount, description, date) => {
    setActiveCategoryIndex(index);
    const parsedAmount = parseFloat(amount);
    if (parsedAmount < 0 || isNaN(parsedAmount)) return;

    const updated = [...categories];
    const cat = updated[index];
    const totalSpent = cat.expenses.reduce((sum, e) => sum + e.amount, 0);
    if (totalSpent + parsedAmount > cat.budget) return;

    cat.expenses.push({ amount: parsedAmount, description, date });
    setCategories(updated);
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.find((c) => c.name === newCategory)) {
      setCategories([
        ...categories,
        { name: newCategory, budget: 0, expenses: [] },
      ]);
      setNewCategory("");
    }
  };

  const handleDeleteCategory = (index) => {
    const updated = [...categories];
    updated.splice(index, 1);
    setCategories(updated);
  };

  const handleEditExpense = (catIndex, expIndex) => {
    setEditingExpense({ catIndex, expIndex });
  };

  const handleSaveExpense = (catIndex, expIndex, amount, description, date) => {
    const parsed = parseFloat(amount);
    if (parsed < 0 || isNaN(parsed)) return;

    const updated = [...categories];
    updated[catIndex].expenses[expIndex] = {
      amount: parsed,
      description,
      date,
    };
    setCategories(updated);
    setEditingExpense({});
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF();

      // Add title and summary
      doc.setFontSize(20);
      doc.setTextColor(40);
      doc.text("Trip Budget Report", 105, 15, { align: "center" });

      doc.setFontSize(12);
      doc.text(`Total Budget: PKR ${totalBudget.toFixed(2)}`, 14, 30);
      doc.text(`Total Spent: PKR ${totalSpent.toFixed(2)}`, 14, 40);
      doc.text(
        `Remaining: PKR ${(totalBudget - totalSpent).toFixed(2)}`,
        14,
        50
      );

      const today = new Date();
      doc.text(`Report generated on: ${today.toLocaleDateString()}`, 14, 60);

      // Add categories and expenses
      let yPosition = 80;
      categories.forEach((category, index) => {
        // Category header
        doc.setFontSize(14);
        doc.setTextColor(COLORS[index % COLORS.length]);
        doc.text(
          `${category.name} (Budget: PKR ${category.budget.toFixed(2)})`,
          14,
          yPosition
        );

        // Reset text color
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        yPosition += 10;

        // Expenses
        if (category.expenses.length > 0) {
          category.expenses.forEach((expense, expIndex) => {
            doc.text(
              `- ${expense.description}: PKR ${expense.amount.toFixed(2)} (${
                expense.date
              })`,
              20,
              yPosition
            );
            yPosition += 7;
          });
        } else {
          doc.text("No expenses recorded", 20, yPosition);
          yPosition += 7;
        }

        // Category summary
        const spent = category.expenses.reduce((sum, e) => sum + e.amount, 0);
        doc.text(
          `Total spent: PKR ${spent.toFixed(2)} | Remaining: PKR ${(
            category.budget - spent
          ).toFixed(2)}`,
          14,
          yPosition
        );
        yPosition += 15;

        // Add new page if needed
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
      });

      // Add the chart as an image
      try {
        const chartElement = document.querySelector(".chart-container");
        if (chartElement) {
          const chartDataUrl = await toPng(chartElement);
          doc.addPage();
          doc.setFontSize(16);
          doc.text("Budget Visualization", 105, 15, { align: "center" });
          doc.addImage(chartDataUrl, "PNG", 30, 30, 150, 150);
        }
      } catch (error) {
        console.error("Could not add chart to PDF:", error);
      }

      // Save the PDF
      doc.save(`Trip-Budget-Report-${today.toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const totalSpent = categories.reduce(
    (acc, cat) => acc + cat.expenses.reduce((sum, e) => sum + e.amount, 0),
    0
  );

  const overAllBudgetExceeded = totalSpent > totalBudget;

  return (
    <div className="budget-manager">
      <h1>Budget Manager</h1>

      <div className="summary">
        <label>Total Trip Budget:</label>
        <input
          type="number"
          min="0"
          placeholder="Enter full budget"
          value={totalBudget}
          onChange={(e) => {
            const val = e.target.value;
            // allow empty input
            if (val === "") {
              setTotalBudget("");
            } else if (!isNaN(val) && Number(val) >= 0) {
              setTotalBudget(val);
            }
          }}
        />
        <p>
          <strong>Total Spent:</strong> PKR {totalSpent?.toFixed(2) || "0.00"}
        </p>
        <p>
          <strong>Remaining:</strong> PKR{" "}
          {totalBudget === ""
            ? "0.00"
            : (Number(totalBudget) - totalSpent)?.toFixed(2)}
        </p>
      </div>

      {overAllBudgetExceeded && (
        <div className="warning-msg global-warning">
          ⚠️ You have exceeded your <strong>total trip budget</strong>!
        </div>
      )}

      <div className="chart-container">
        <h2 className="chart-heading">Budget Distribution Chart</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={categories.map((cat) => ({
                name: cat.name,
                value: cat.expenses.reduce((sum, e) => sum + e.amount, 0),
              }))}
              dataKey="value"
              outerRadius={80}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {categories.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`PKR ${value.toFixed(2)}`, "Amount"]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="category-form">
        <input
          type="text"
          placeholder="Add new category..."
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleAddCategory}>
          <FaPlus />
        </button>
      </div>

      <div className="categories">
        {categories.map((cat, catIndex) => {
          const spent = cat.expenses.reduce((sum, e) => sum + e.amount, 0);
          const overBudget = spent > cat.budget;

          return (
            <div
              key={catIndex}
              className={`category-card ${overBudget ? "over-budget" : ""}`}
            >
              <div className="card-header">
                <h2>{cat.name}</h2>
                <button onClick={() => handleDeleteCategory(catIndex)}>
                  <FaTrash />
                </button>
              </div>

              <label>Category Budget:</label>
              <input
                type="number"
                min="0"
                value={cat.budget === 0 ? "" : cat.budget}
                onChange={(e) => handleBudgetChange(catIndex, e.target.value)}
              />

              {overBudget && (
                <div className="warning-msg">
                  ⚠️ You're over budget in <strong>{cat.name}</strong>!
                </div>
              )}

              <div className="expenses">
                <h4>Expenses:</h4>
                {cat.expenses.map((exp, expIndex) => {
                  const isEditing =
                    editingExpense.catIndex === catIndex &&
                    editingExpense.expIndex === expIndex;

                  return (
                    <div key={expIndex} className="expense-item">
                      {isEditing ? (
                        <div className="edit-expense-fields">
                          <input
                            type="number"
                            defaultValue={exp.amount}
                            id={`edit-amount-${catIndex}-${expIndex}`}
                          />
                          <input
                            type="text"
                            defaultValue={exp.description}
                            id={`edit-desc-${catIndex}-${expIndex}`}
                          />
                          <input
                            type="date"
                            defaultValue={exp.date}
                            id={`edit-date-${catIndex}-${expIndex}`}
                          />
                          <button
                            onClick={() =>
                              handleSaveExpense(
                                catIndex,
                                expIndex,
                                document.getElementById(
                                  `edit-amount-${catIndex}-${expIndex}`
                                ).value,
                                document.getElementById(
                                  `edit-desc-${catIndex}-${expIndex}`
                                ).value,
                                document.getElementById(
                                  `edit-date-${catIndex}-${expIndex}`
                                ).value
                              )
                            }
                          >
                            <FaSave /> Save
                          </button>
                        </div>
                      ) : (
                        <span>
                          {exp.description} - PKR{exp.amount} ({exp.date}){" "}
                          <button
                            style={{ marginLeft: "10px" }}
                            onClick={() =>
                              handleEditExpense(catIndex, expIndex)
                            }
                          >
                            <FaEdit />
                          </button>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="add-expense">
                <input
                  type="number"
                  placeholder="Amount"
                  id={`amount-${catIndex}`}
                />
                <input
                  type="text"
                  placeholder="Description"
                  id={`desc-${catIndex}`}
                />
                <input type="date" id={`date-${catIndex}`} />
                <button
                  onClick={() =>
                    handleAddExpense(
                      catIndex,
                      document.getElementById(`amount-${catIndex}`).value,
                      document.getElementById(`desc-${catIndex}`).value,
                      document.getElementById(`date-${catIndex}`).value
                    )
                  }
                  disabled={spent >= cat.budget}
                >
                  Add
                </button>
                {spent >= cat.budget && activeCategoryIndex === catIndex && (
                  <div className="warning-msg">
                    ⚠️ Cannot add more! You're exceeding your budget. Increase
                    your trip budget.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="buttons-row">
        <button className="continue-button" onClick={handleContinue}>
          Continue
        </button>

        <button className="reset-button" onClick={handleReset}>
          Reset Your Budget
        </button>

        <button
          className="download-button"
          onClick={generatePDF}
          disabled={isGeneratingPDF}
        >
          {isGeneratingPDF ? (
            "Generating..."
          ) : (
            <>
              <FaFileDownload /> Download Report
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BudgetManager;
