// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./BudgetManager.css";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import {
//   FaPlus,
//   FaTrash,
//   FaEdit,
//   FaSave,
//   FaFileDownload,
// } from "react-icons/fa";
// import { jsPDF } from "jspdf";
// import { toPng } from "html-to-image";

// const defaultCategories = [
//   "Food",
//   "Accommodation",
//   "Transport",
//   "Activities",
//   "Shopping",
//   "Miscellaneous",
// ];

// const COLORS = [
//   "#00C49F",
//   "#FFBB28",
//   "#FF8042",
//   "#8884d8",
//   "#82ca9d",
//   "#d84b4b",
// ];

// const BudgetManager = () => {
//   const navigate = useNavigate();
//   const [totalBudget, setTotalBudget] = useState(0);
//   const [categories, setCategories] = useState([]);
//   const [newCategory, setNewCategory] = useState("");
//   const [editingExpense, setEditingExpense] = useState({});
//   const [activeCategoryIndex, setActiveCategoryIndex] = useState(null);
//   const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
//   const [categoryBudgetWarning, setCategoryBudgetWarning] = useState(null);
//   const [expenseWarning, setExpenseWarning] = useState(null);

//   useEffect(() => {
//     const storedBudget = localStorage.getItem("totalBudget");
//     const storedCategories = localStorage.getItem("categories");
//     if (storedBudget) setTotalBudget(parseFloat(storedBudget));
//     if (storedCategories) {
//       setCategories(JSON.parse(storedCategories));
//     } else {
//       setCategories(
//         defaultCategories.map((cat) => ({ name: cat, budget: 0, expenses: [] }))
//       );
//     }

//     return () => {};
//   }, []);

//   const saveToLocalStorage = () => {
//     localStorage.setItem("totalBudget", totalBudget);
//     localStorage.setItem("categories", JSON.stringify(categories));
//   };

//   const handleContinue = () => {
//     saveToLocalStorage();
//     localStorage.setItem("budgetSaved", "true");
//     navigate("/", { state: { budgetSaved: true } });
//   };

//   const handleReset = () => {
//     if (
//       window.confirm("Are you sure you want to reset your entire budget plan?")
//     ) {
//       // localStorage ko Clear krna
//       localStorage.removeItem("totalBudget");
//       localStorage.removeItem("categories");
//       localStorage.removeItem("budgetSaved");

//       // reset krta hy all states into initial
//       setTotalBudget(0);
//       setCategories(
//         defaultCategories.map((cat) => ({ name: cat, budget: 0, expenses: [] }))
//       );
//       setNewCategory("");
//       setEditingExpense({});
//       setActiveCategoryIndex(null);
//       setCategoryBudgetWarning(null);
//       setExpenseWarning(null);

//       // Optional: Clear any input fields
//       const amountInputs = document.querySelectorAll('input[type="number"]');
//       const textInputs = document.querySelectorAll('input[type="text"]');
//       const dateInputs = document.querySelectorAll('input[type="date"]');

//       amountInputs.forEach((input) => (input.value = ""));
//       textInputs.forEach((input) => {
//         if (input.placeholder !== "Add new category...") {
//           input.value = "";
//         }
//       });
//       dateInputs.forEach((input) => (input.value = ""));
//     }
//   };

//   const handleBudgetChange = (index, budget) => {
//     if (budget === "") {
//       const updated = [...categories];
//       updated[index].budget = 0;
//       setCategories(updated);
//       setCategoryBudgetWarning(null);
//       return;
//     }

//     const parsed = parseFloat(budget);
//     const totalAllocated = categories.reduce(
//       (sum, cat, i) => (i === index ? sum : sum + cat.budget),
//       0
//     );

//     if (totalAllocated + parsed > Number(totalBudget || 0)) {
//       setCategoryBudgetWarning({
//         index: index,
//         message: `⚠️ Category budget cannot exceed total trip budget! Available: PKR ${(
//           Number(totalBudget || 0) - totalAllocated
//         ).toFixed(2)}`,
//       });
//       return;
//     }

//     if (!isNaN(parsed) && parsed >= 0) {
//       const updated = [...categories];
//       updated[index].budget = parsed;
//       setCategories(updated);
//       setCategoryBudgetWarning(null);
//     }
//   };

//   const handleAddExpense = (index, amount, description, date) => {
//     setActiveCategoryIndex(index);
//     const parsedAmount = parseFloat(amount);

//     if (parsedAmount < 0 || isNaN(parsedAmount)) return;

//     const updated = [...categories];
//     const cat = updated[index];
//     const totalSpent = cat.expenses.reduce((sum, e) => sum + e.amount, 0);

//     if (totalSpent + parsedAmount > cat.budget) {
//       setExpenseWarning({
//         index: index,
//         message: `⚠️ You are exceeding your budget in ${
//           cat.name
//         } category! Available: PKR ${(cat.budget - totalSpent).toFixed(2)}`,
//       });
//       return;
//     }

//     cat.expenses.push({ amount: parsedAmount, description, date });
//     setCategories(updated);
//     setExpenseWarning(null);

//     document.getElementById(`amount-${index}`).value = "";
//     document.getElementById(`desc-${index}`).value = "";
//     document.getElementById(`date-${index}`).value = "";
//   };

//   const handleAddCategory = () => {
//     if (newCategory && !categories.find((c) => c.name === newCategory)) {
//       setCategories([
//         ...categories,
//         { name: newCategory, budget: 0, expenses: [] },
//       ]);
//       setNewCategory("");
//     }
//   };

//   const handleDeleteCategory = (index) => {
//     const updated = [...categories];
//     updated.splice(index, 1);
//     setCategories(updated);
//   };

//   const handleEditExpense = (catIndex, expIndex) => {
//     setEditingExpense({ catIndex, expIndex });
//   };

//   const handleSaveExpense = (catIndex, expIndex, amount, description, date) => {
//     const parsed = parseFloat(amount);
//     if (parsed < 0 || isNaN(parsed)) return;

//     const updated = [...categories];
//     updated[catIndex].expenses[expIndex] = {
//       amount: parsed,
//       description,
//       date,
//     };
//     setCategories(updated);
//     setEditingExpense({});
//   };

//   //pdf section
//  const generatePDF = async () => {
//   setIsGeneratingPDF(true);
//   try {
//     const doc = new jsPDF();

//     // Title
//     doc.setFontSize(20);
//     doc.setTextColor(40);
//     doc.text("Trip Budget Report", 105, 15, { align: "center" });

//     const totalBudgetNum = Number(totalBudget || 0);

//     // 📌 Summary Box
//     doc.setFontSize(12);
//     doc.setDrawColor(0);
//     doc.setFillColor(230, 230, 230); // light gray background
//     doc.rect(12, 25, 185, 40, "F"); // x, y, width, height, style (F=filled)

//     doc.setTextColor(0, 0, 0);
//     doc.text(`Total Budget: PKR ${totalBudgetNum.toFixed(2)}`, 14, 35);
//     doc.text(`Total Spent: PKR ${totalSpent.toFixed(2)}`, 14, 45);
//     doc.text(
//       `Remaining: PKR ${(totalBudgetNum - totalSpent).toFixed(2)}`,
//       14,
//       55
//     );

//     const today = new Date();
//     doc.text(`Generated on: ${today.toLocaleDateString()}`, 150, 55);

//     // 📌 Categories Section
//     let yPosition = 80;
//     categories.forEach((category, index) => {
//       // Category Header
//       doc.setFontSize(14);
//       doc.setTextColor(255, 255, 255);
//       doc.setFillColor(60, 120, 216); // blue background
//       doc.rect(12, yPosition - 6, 185, 8, "F");
//       doc.text(`${category.name} (Budget: PKR ${category.budget.toFixed(2)})`, 14, yPosition);

//       doc.setFontSize(10);
//       doc.setTextColor(0, 0, 0);
//       yPosition += 10;

//       if (category.expenses.length > 0) {
//         category.expenses.forEach((expense) => {
//           doc.text(
//             `${expense.date}  |  ${expense.description}  |  PKR ${expense.amount.toFixed(2)}`,
//             20,
//             yPosition
//           );
//           yPosition += 7;
//         });
//       } else {
//         doc.text("No expenses recorded", 20, yPosition);
//         yPosition += 7;
//       }

//       // Category Total
//       const spent = category.expenses.reduce((sum, e) => sum + e.amount, 0);
//       doc.setFontSize(11);
//       doc.text(
//         `Total spent: PKR ${spent.toFixed(2)} | Remaining: PKR ${(category.budget - spent).toFixed(2)}`,
//         14,
//         yPosition + 2
//       );
//       yPosition += 15;

//       // New page if overflow
//       if (yPosition > 250) {
//         doc.addPage();
//         yPosition = 20;
//       }
//     });

//     // 📌 Chart Section
//     try {
//       const chartElement = document.querySelector(".chart-container");
//       if (chartElement) {
//         const chartDataUrl = await toPng(chartElement);
//         doc.addPage();
//         doc.setFontSize(16);
//         doc.text("Budget Visualization", 105, 15, { align: "center" });
//         doc.addImage(chartDataUrl, "PNG", 30, 30, 150, 150);
//       }
//     } catch (error) {
//       console.error("Could not add chart to PDF:", error);
//     }

//     // Save PDF
//     doc.save(`Trip-Budget-Report-${today.toISOString().slice(0, 10)}.pdf`);
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     alert("Failed to generate PDF. Please try again.");
//   } finally {
//     setIsGeneratingPDF(false);
//   }
// };

//   const totalSpent = categories.reduce(
//     (acc, cat) => acc + cat.expenses.reduce((sum, e) => sum + e.amount, 0),
//     0
//   );

//   const overAllBudgetExceeded = totalSpent > Number(totalBudget || 0);

//   //category ke data ko reset krta hy
//   const handleResetCategory = (catIndex) => {
//     if (
//       window.confirm(
//         `Are you sure you want to reset the ${categories[catIndex].name} category? This will clear all expenses and budget for this category.`
//       )
//     ) {
//       const updated = [...categories];
//       updated[catIndex] = {
//         ...updated[catIndex],
//         budget: 0,
//         expenses: [],
//       };
//       setCategories(updated);

//       // Clear any warnings for this category
//       setCategoryBudgetWarning(null);
//       setExpenseWarning(null);
//     }
//   };

//   return (
//     <div className="budget-manager">
//       <h1>Budget Manager</h1>

//       <div className="summary">
//         <label>Total Trip Budget:</label>
//         <input
//           type="number"
//           min="0"
//           placeholder="Enter Your budget"
//           value={totalBudget}
//           onChange={(e) => {
//             const val = e.target.value;
//             if (val === "") {
//               setTotalBudget("");
//             } else if (!isNaN(val) && Number(val) >= 0) {
//               setTotalBudget(val);
//             }
//           }}
//         />
//         <p>
//           <strong>Total Spent:</strong> PKR {totalSpent?.toFixed(2) || "0.00"}
//         </p>
//         <p>
//           <strong>Remaining:</strong> PKR{" "}
//           {totalBudget === ""
//             ? "0.00"
//             : (Number(totalBudget) - totalSpent)?.toFixed(2)}
//         </p>
//       </div>

//       {overAllBudgetExceeded && (
//         <div className="warning-msg global-warning">
//           ⚠️ You have exceeded your <strong>total trip budget</strong>!
//         </div>
//       )}

//       <div className="chart-container">
//         <h2 className="chart-heading">Budget Distribution Chart</h2>
//         <ResponsiveContainer width="100%" height={250}>
//           <PieChart>
//             <Pie
//               data={categories.map((cat) => ({
//                 name: cat.name,
//                 value: cat.expenses.reduce((sum, e) => sum + e.amount, 0),
//               }))}
//               dataKey="value"
//               outerRadius={80}
//               label={({ name, percent }) =>
//                 `${name}: ${(percent * 100).toFixed(0)}%`
//               }
//             >
//               {categories.map((_, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={COLORS[index % COLORS.length]}
//                 />
//               ))}
//             </Pie>
//             <Tooltip
//               formatter={(value) => [`PKR ${value.toFixed(2)}`, "Amount"]}
//             />
//             <Legend />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       <div className="category-form">
//         <input
//           type="text"
//           placeholder="Add new category..."
//           value={newCategory}
//           onChange={(e) => setNewCategory(e.target.value)}
//         />
//         <button onClick={handleAddCategory}>
//           <FaPlus />
//         </button>
//       </div>

//       <div className="categories">
//         {categories.map((cat, catIndex) => {
//           const spent = cat.expenses.reduce((sum, e) => sum + e.amount, 0);
//           const overBudget = spent > cat.budget;

//           return (
//             <div
//               key={catIndex}
//               className={`category-card ${overBudget ? "over-budget" : ""}`}
//             >
//               <div className="card-header">
//                 <h2>{cat.name}</h2>
//                 <button onClick={() => handleDeleteCategory(catIndex)}>
//                   <FaTrash />
//                 </button>
//               </div>

//               <label>Category Budget:</label>
//               <input
//                 type="number"
//                 min="0"
//                 value={cat.budget === 0 ? "" : cat.budget}
//                 onChange={(e) => handleBudgetChange(catIndex, e.target.value)}
//               />

//               {categoryBudgetWarning &&
//                 categoryBudgetWarning.index === catIndex && (
//                   <div className="warning-msg">
//                     {categoryBudgetWarning.message}
//                   </div>
//                 )}

//               {overBudget && (
//                 <div className="warning-msg">
//                   ⚠️ You're over budget in <strong>{cat.name}</strong>!
//                 </div>
//               )}

//               <div className="expenses">
//                 <h4>Expenses:</h4>
//                 {cat.expenses.map((exp, expIndex) => {
//                   const isEditing =
//                     editingExpense.catIndex === catIndex &&
//                     editingExpense.expIndex === expIndex;

//                   return (
//                     <div key={expIndex} className="expense-item">
//                       {isEditing ? (
//                         <div className="edit-expense-fields">
//                           <input
//                             type="number"
//                             defaultValue={exp.amount}
//                             id={`edit-amount-${catIndex}-${expIndex}`}
//                           />
//                           <input
//                             type="text"
//                             defaultValue={exp.description}
//                             id={`edit-desc-${catIndex}-${expIndex}`}
//                           />
//                           <input
//                             type="date"
//                             defaultValue={exp.date}
//                             id={`edit-date-${catIndex}-${expIndex}`}
//                           />
//                           <button
//                             onClick={() =>
//                               handleSaveExpense(
//                                 catIndex,
//                                 expIndex,
//                                 document.getElementById(
//                                   `edit-amount-${catIndex}-${expIndex}`
//                                 ).value,
//                                 document.getElementById(
//                                   `edit-desc-${catIndex}-${expIndex}`
//                                 ).value,
//                                 document.getElementById(
//                                   `edit-date-${catIndex}-${expIndex}`
//                                 ).value
//                               )
//                             }
//                           >
//                             <FaSave /> Save
//                           </button>
//                         </div>
//                       ) : (
//                         <span>
//                           {exp.description} - PKR{exp.amount} ({exp.date}){" "}
//                           <button
//                             style={{ marginLeft: "10px" }}
//                             onClick={() =>
//                               handleEditExpense(catIndex, expIndex)
//                             }
//                           >
//                             <FaEdit />
//                           </button>
//                         </span>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>

//               <div className="add-expense">
//                 <input
//                   type="number"
//                   placeholder="Amount"
//                   id={`amount-${catIndex}`}
//                 />
//                 <input
//                   type="text"
//                   placeholder="Description"
//                   id={`desc-${catIndex}`}
//                 />
//                 <input type="date" id={`date-${catIndex}`} />
//                 <button
//                   onClick={() =>
//                     handleAddExpense(
//                       catIndex,
//                       document.getElementById(`amount-${catIndex}`).value,
//                       document.getElementById(`desc-${catIndex}`).value,
//                       document.getElementById(`date-${catIndex}`).value
//                     )
//                   }
//                   disabled={spent >= cat.budget}
//                 >
//                   Add expense
//                 </button>

//                 <button
//                   className="reset-category-budget"
//                   onClick={() => handleResetCategory(catIndex)}
//                 >
//                   Reset Category Budget
//                 </button>

//                 {expenseWarning && expenseWarning.index === catIndex && (
//                   <div className="warning-msg">{expenseWarning.message}</div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <div className="buttons-row">
//         <button className="continue-button" onClick={handleContinue}>
//           Continue
//         </button>
//         <button className="reset-button" onClick={handleReset}>
//           Reset Your Budget
//         </button>
//         <button
//           className="download-button"
//           onClick={generatePDF}
//           disabled={isGeneratingPDF}
//         >
//           {isGeneratingPDF ? (
//             "Generating..."
//           ) : (
//             <>
//               <FaFileDownload /> Download Report
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BudgetManager;

//External modules
import Swal from "sweetalert2";

//Internal modules
import { sendDataToServer } from "../../utils/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../AuthForm/AuthForm";
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

// Default Categories
const defaultCategories = [
  "Food",
  "Accommodation",
  "Transport",
  "Activities",
  "Shopping",
  "Miscellaneous",
];

// Pie Chart Colors
const COLORS = [
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#d84b4b",
];

const budgetManagerApi = "http://localhost:3001/budget/save";
const BudgetManager = () => {
  const navigate = useNavigate();

  // State Management
  const [totalBudget, setTotalBudget] = useState(0);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingExpense, setEditingExpense] = useState({});
  const [, setActiveCategoryIndex] = useState(null);

  const [showAuthForm, setShowAuthForm] = useState({
    show: false,
    mode: "login",
  });

  //activeCategoryIndex
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [categoryBudgetWarning, setCategoryBudgetWarning] = useState(null);
  const [expenseWarning, setExpenseWarning] = useState(null);

  // Load Saved Data
  useEffect(() => {
    const storedBudget = localStorage.getItem("totalBudget");
    const storedCategories = localStorage.getItem("categories");

    if (storedBudget) setTotalBudget(parseFloat(storedBudget));
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(
        defaultCategories.map((cat) => ({
          name: cat,
          budget: 0,
          expenses: [],
        }))
      );
    }
  }, []);

  // Reopen AuthForm event listener
  useEffect(() => {
    const handleShowAuthFormAgain = (event) => {
      const mode = event.detail?.mode || "login";
      setShowAuthForm({ show: true, mode });
    };
    window.addEventListener("showAuthFormAgain", handleShowAuthFormAgain);
    return () => {
      window.removeEventListener("showAuthFormAgain", handleShowAuthFormAgain);
    };
  }, []);

  //we declare the array to send data of the budget manager to the server in the correct formet
  let budgetData = [];

  // Save Data
  const saveToLocalStorage = () => {
    localStorage.setItem("totalBudget", totalBudget);
    console.log("total Budget ",totalBudget);
    
    // Set the budget data to send to the server

    budgetData = categories.map((category) => {
      const categoryData = {
        categoryName: category.name,
        categoryTotalBudget: category.budget,
        categoryExpenses: category.expenses.map((expense) => ({
          expenseTotalAmount: expense.amount,
          expenseDescription: expense.description,
          expenseDate: expense.date,
        })),
      };
      return categoryData;
    });
    budgetData = {
      ...budgetData,
      TotalBudget: totalBudget
    }
    console.log("we set data to send the server ", budgetData);

    localStorage.setItem("categories", JSON.stringify(categories));
  };

  const handleContinue = async () => {
    try {
      saveToLocalStorage();
      const budgetManagerResponse = await sendDataToServer(
        budgetManagerApi,
        budgetData
      );
      console.log(
        "we get the response of the budget manager ",
        budgetManagerResponse
      );

      //Success SweetAlert
      Swal.fire({
        title: "Success!",
        text: budgetManagerResponse.message,
        icon: "success",
        timer: 1500,
        timerProgressBar: true
      }).then(() => {
        localStorage.setItem("budgetSaved", "true");
        navigate("/", { state: { budgetSaved: true } });
      });
    } catch (budgetError) {
      console.log("we get error at budget manager ", budgetError);
      Swal.fire({
        title: "Error!",
        text: budgetError.response.data.message,
        icon: "error",
        confirmButtonText: budgetError.response.data.TokensExpire
          ? "Continue to log in"
          : "Try Again",
        confirmButtonColor: "#d33",
      }).then((result) => {
        //Only show AuthForm when user clicks confirm
        if (budgetError?.response?.data?.TokensExpire && result.isConfirmed) {
          setShowAuthForm({ show: true, mode: "login" });
        }
      });
    }
  };

  // Reset Entire Budget
  const handleReset = () => {
    // if (window.confirm("Are you sure you want to reset your entire budget plan?")) {
    //   localStorage.removeItem("totalBudget");
    //   localStorage.removeItem("categories");
    //   localStorage.removeItem("budgetSaved");

    //   setTotalBudget(0);
    //   setCategories(
    //     defaultCategories.map((cat) => ({
    //       name: cat,
    //       budget: 0,
    //       expenses: [],
    //     }))
    //   );
    //   setNewCategory("");
    //   setEditingExpense({});
    //   setActiveCategoryIndex(null);
    //   setCategoryBudgetWarning(null);
    //   setExpenseWarning(null);

    //   // Reset Input Fields
    //   document.querySelectorAll('input[type="number"], input[type="text"], input[type="date"]')
    //     .forEach((input) => {
    //       if (input.placeholder !== "Add new category...") {
    //         input.value = "";
    //       }
    //     });
    // }

    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to reset your entire budget plan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reset it!",
    }).then((result) => {
      if (result.isConfirmed) {
        //Clear localStorage
        localStorage.removeItem("totalBudget");
        localStorage.removeItem("categories");
        localStorage.removeItem("budgetSaved");

        // 🔁 Reset states
        setTotalBudget(0);
        setCategories(
          defaultCategories.map((cat) => ({
            name: cat,
            budget: 0,
            expenses: [],
          }))
        );
        setNewCategory("");
        setEditingExpense({});
        setActiveCategoryIndex(null);
        setCategoryBudgetWarning(null);
        setExpenseWarning(null);

        // 🧽 Reset input fields
        document
          .querySelectorAll(
            'input[type="number"], input[type="text"], input[type="date"]'
          )
          .forEach((input) => {
            if (input.placeholder !== "Add new category...") {
              input.value = "";
            }
          });

        // Show success message after reset
        Swal.fire({
          title: "Reset!",
          text: "Your entire budget plan has been cleared.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  // Change Category Budget
  const handleBudgetChange = (index, budget) => {
    if (budget === "") {
      const updated = [...categories];
      updated[index].budget = 0;
      setCategories(updated);
      setCategoryBudgetWarning(null);
      return;
    }

    const parsed = parseFloat(budget);
    const totalAllocated = categories.reduce(
      (sum, cat, i) => (i === index ? sum : sum + cat.budget),
      0
    );

    if (totalAllocated + parsed > Number(totalBudget || 0)) {
      setCategoryBudgetWarning({
        index,
        message: `⚠️ Category budget cannot exceed total trip budget! Available: PKR ${(
          Number(totalBudget || 0) - totalAllocated
        ).toFixed(2)}`,
      });
      return;
    }

    if (!isNaN(parsed) && parsed >= 0) {
      const updated = [...categories];
      updated[index].budget = parsed;
      setCategories(updated);
      setCategoryBudgetWarning(null);
    }
  };

  // Add Expense
  const handleAddExpense = (index, amount, description, date) => {
    setActiveCategoryIndex(index);
    const parsedAmount = parseFloat(amount);

    if (parsedAmount < 0 || isNaN(parsedAmount)) return;

    const updated = [...categories];
    const cat = updated[index];
    const totalSpent = cat.expenses.reduce((sum, e) => sum + e.amount, 0);

    if (totalSpent + parsedAmount > cat.budget) {
      setExpenseWarning({
        index,
        message: `⚠️ You are exceeding your budget in ${
          cat.name
        }! Available: PKR ${(cat.budget - totalSpent).toFixed(2)}`,
      });
      return;
    }

    cat.expenses.push({ amount: parsedAmount, description, date });
    setCategories(updated);
    setExpenseWarning(null);

    // Reset Inputs
    document.getElementById(`amount-${index}`).value = "";
    document.getElementById(`desc-${index}`).value = "";
    document.getElementById(`date-${index}`).value = "";
  };

  // Add New Category
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

  // Reset Category
  const handleResetCategory = async (catIndex) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to reset the "${categories[catIndex].name}" category? This will clear all its expenses and budget.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reset it!",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      const updated = [...categories];
      updated[catIndex] = { ...updated[catIndex], budget: 0, expenses: [] };
      setCategories(updated);
      setCategoryBudgetWarning(null);
      setExpenseWarning(null);

      Swal.fire({
        title: "Category Reset!",
        text: `The "${categories[catIndex].name}" category has been cleared.`,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  // Total Spent
  const totalSpent = categories.reduce(
    (acc, cat) => acc + cat.expenses.reduce((sum, e) => sum + e.amount, 0),
    0
  );

  const overAllBudgetExceeded = totalSpent > Number(totalBudget || 0);

  // Generate PDF
  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.setTextColor(40);
      doc.text("Trip Budget Report", 105, 15, { align: "center" });

      const totalBudgetNum = Number(totalBudget || 0);

      // Summary
      doc.setFontSize(12);
      doc.setDrawColor(0);
      doc.setFillColor(230, 230, 230);
      doc.rect(12, 25, 185, 40, "F");

      doc.setTextColor(0, 0, 0);
      doc.text(`Total Budget: PKR ${totalBudgetNum.toFixed(2)}`, 14, 35);
      doc.text(`Total Spent: PKR ${totalSpent.toFixed(2)}`, 14, 45);
      doc.text(
        `Remaining: PKR ${(totalBudgetNum - totalSpent).toFixed(2)}`,
        14,
        55
      );

      const today = new Date();
      doc.text(`Generated on: ${today.toLocaleDateString()}`, 150, 55);

      // Categories
      let yPosition = 80;
      categories.forEach((category) => {
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255);
        doc.setFillColor(60, 120, 216);
        doc.rect(12, yPosition - 6, 185, 8, "F");
        doc.text(
          `${category.name} (Budget: PKR ${category.budget.toFixed(2)})`,
          14,
          yPosition
        );

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        yPosition += 10;

        if (category.expenses.length > 0) {
          category.expenses.forEach((expense) => {
            doc.text(
              `${expense.date} | ${
                expense.description
              } | PKR ${expense.amount.toFixed(2)}`,
              20,
              yPosition
            );
            yPosition += 7;
          });
        } else {
          doc.text("No expenses recorded", 20, yPosition);
          yPosition += 7;
        }

        const spent = category.expenses.reduce((sum, e) => sum + e.amount, 0);
        doc.setFontSize(11);
        doc.text(
          `Total spent: PKR ${spent.toFixed(2)} | Remaining: PKR ${(
            category.budget - spent
          ).toFixed(2)}`,
          14,
          yPosition + 2
        );
        yPosition += 15;

        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
      });

      // Chart Section (if not allow the user to generate the pdf when all the category are fullfil)
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

        // Show SweetAlert2 error popup
        Swal.fire({
          title: "Chart Error",
          text: "Could not add the chart to the PDF.",
          icon: "error",
          showConfirmButton: true,
          confirmButtonText: "Thank You!",
        });
      }

      doc.save(`Trip-Budget-Report-${today.toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // SweetAlert2 popup for error handling
      Swal.fire({
        title: "Failed to Generate PDF",
        text: "Something went wrong while creating your budget report. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "Try again",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="budget-manager">
      {!showAuthForm.show ? (
        <>
          <h1>Budget Manager</h1>

          {/* Summary */}
          <div className="summary">
            <label>Total Trip Budget:</label>
            <input
              type="number"
              min="0"
              placeholder="Enter Your budget"
              value={totalBudget}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  setTotalBudget("");
                } else if (!isNaN(val) && Number(val) >= 0) {
                  setTotalBudget(val);
                }
              }}
            />
            <p>
              <strong>Total Spent:</strong> PKR{" "}
              {totalSpent?.toFixed(2) || "0.00"}
            </p>
            <p>
              <strong>Remaining:</strong> PKR{" "}
              {totalBudget === ""
                ? "0.00"
                : (Number(totalBudget) - totalSpent)?.toFixed(2)}
            </p>
          </div>

          {/* Global Warning */}
          {overAllBudgetExceeded && (
            <div className="warning-msg global-warning">
              ⚠️ You have exceeded your <strong>total trip budget</strong>!
            </div>
          )}

          {/* Chart */}
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

          {/* Add Category */}
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

          {/* Categories */}
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
                    onChange={(e) =>
                      handleBudgetChange(catIndex, e.target.value)
                    }
                  />

                  {categoryBudgetWarning &&
                    categoryBudgetWarning.index === catIndex && (
                      <div className="warning-msg">
                        {categoryBudgetWarning.message}
                      </div>
                    )}

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
                              {exp.description} - PKR {exp.amount} ({exp.date}){" "}
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
                      Add expense
                    </button>

                    <button
                      className="reset-category-budget"
                      onClick={() => handleResetCategory(catIndex)}
                    >
                      Reset Category Budget
                    </button>

                    {expenseWarning && expenseWarning.index === catIndex && (
                      <div className="warning-msg">
                        {expenseWarning.message}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Buttons */}
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
        </>
      ) : (
        <AuthForm
          onClose={() => setShowAuthForm({ show: false, mode: "login" })}
          mode={showAuthForm.mode}
          showAuthSwitchText={false}
          onLoginSuccess={() => {
            setShowAuthForm({ show: false, mode: "login" });
          }}
        />
      )}
    </div>
  );
};

export default BudgetManager;
