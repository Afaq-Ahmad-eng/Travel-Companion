// Internal modules
import prisma from "../../config/database.js";

const objectForCustomErrorOfBudgetManager = {
  status: 404,
  message: "Dear user, you are not registered with us. Thank you!",
};

//function for get the use data using user_id
export const userAndTripDataForBudgetManger = async (user_id) => {
  try {
    const userWithTripData = await prisma.user.findUnique({
      where: { user_id },
      include: {
        trips: {
          orderBy: {
            created_at: "desc", // 👈 newest trip first
          },
          take: 1, // 👈 only take the latest trip
        },
      },
    });

    if (userWithTripData) {
      return userWithTripData;
    } else {
      throw objectForCustomErrorOfBudgetManager;
    }
  } catch (userDataForBudgetMangerError) {
    //We set our custom error codes at the top, and if any error occurs, we use the corresponding error object. However, it’s better to use the actual error that comes from the real cause and show that message to the user.
    throw objectForCustomErrorOfBudgetManager;
  }
};

//Function for storing budget manager data in the DB using Prisma

export const storingDataOfBudgetsAndCategeriesAndExpenses = async (
  budgetManagerData,
  tripsData
) => {
  try {
    // Convert the object into an array (ignore the TotalBudget key) but don't understand proper on the below logic of converting object into array
    const categories = Object.values(budgetManagerData).filter(
      (item) => item && typeof item === "object" && item.categoryName
    );


    const existingBudget = await prisma.budgets.findUnique({
  where: { trip_id: tripsData[0].trip_id },
  include: {
    categories: {
      include: {
        expenses: true,
      },
    },
  },
});

if (!existingBudget) {
  await prisma.budgets.create({
    data: {
      trip_id: tripsData[0].trip_id,
      trip_budget_title: tripsData[0].trip_title,
      total_amount: budgetManagerData.TotalBudget || 0,
      categories: {
        create: categories.map((category) => ({
          category_name: category.categoryName,
          allocated_amount: category.categoryTotalBudget,
          expenses: {
            create: (category.categoryExpenses || []).map((expense) => ({
              description: expense.expenseDescription || "",
              amount: expense.expenseTotalAmount || 0,
              expense_date: expense.expenseDate
                ? new Date(expense.expenseDate)
                : new Date(),
            })),
          },
        })),
      },
    },
  });
}else {
  // Update only changed budget fields
  await prisma.budgets.update({
    where: { trip_id: tripsData[0].trip_id },
    data: {
      ...(existingBudget.trip_budget_title !== tripsData[0].trip_title && {
        trip_budget_title: tripsData[0].trip_title,
      }),
      ...(existingBudget.total_amount !== budgetManagerData.TotalBudget && {
        total_amount: budgetManagerData.TotalBudget,
      }),
    },
  });

  // For each category in frontend data
  for (const category of categories) {
    const existingCategory = existingBudget.categories.find(
      (c) => c.category_name === category.categoryName
    );

    if (existingCategory) {
      // Update existing category fields
      await prisma.categories.update({
        where: { category_id: existingCategory.category_id },
        data: {
          ...(existingCategory.allocated_amount !==
            category.categoryTotalBudget && {
            allocated_amount: category.categoryTotalBudget,
          }),
        },
      });

      // Handle expenses of this category
      for (const expense of category.categoryExpenses || []) {
        const existingExpense = existingCategory.expenses.find(
          (e) => e.description === expense.expenseDescription
        );

        if (existingExpense) {
          // Update only changed fields
          await prisma.expenses.update({
            where: { expense_id: existingExpense.expense_id },
            data: {
              ...(existingExpense.amount !== expense.expenseTotalAmount && {
                amount: expense.expenseTotalAmount,
              }),
              ...(existingExpense.expense_date.toISOString() !==
                new Date(expense.expenseDate).toISOString() && {
                expense_date: new Date(expense.expenseDate),
              }),
            },
          });
        } else {
          // Create new expense
          await prisma.expenses.create({
            data: {
              category_id: existingCategory.category_id,
              description: expense.expenseDescription,
              amount: expense.expenseTotalAmount,
              expense_date: expense.expenseDate
                ? new Date(expense.expenseDate)
                : new Date(),
            },
          });
        }
      }
    } else {
      // Create new category with its expenses
      await prisma.categories.create({
        data: {
          budget_id: existingBudget.budget_id,
          category_name: category.categoryName,
          allocated_amount: category.categoryTotalBudget,
          expenses: {
            create: (category.categoryExpenses || []).map((expense) => ({
              description: expense.expenseDescription,
              amount: expense.expenseTotalAmount,
              expense_date: expense.expenseDate
                ? new Date(expense.expenseDate)
                : new Date(),
            })),
          },
        },
      });
    }
  }
}    
  } catch (saveBudgetDataError) {
    console.log("we get error ",saveBudgetDataError);
    
    throw saveBudgetDataError;
  }
};


export const tripDataForBudgetCheck = async (user_id) => {

  try {
    const tripStart = await prisma.trips.findFirst({
      where: { user_id },
      orderBy: {
        start_date: "desc", // newest budget first
      },
    });
    return tripStart;
  } catch (tripDataForBudgetCheckError) {
    throw  {
      prismaStatusCode: 404,
      message: `Sorry! Something went wrong while loading your trip information.`
    }
  }
};