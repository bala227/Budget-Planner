# Budget Planner App

A modern budget tracking app built using **React Native** and **Supabase**. Users can create budget categories, add expenses, visualize spending through a pie chart, and track budget progress — all with a smooth, animated user interface.


##  Features

-  User authentication (via Supabase)
-  Pie Chart (category-wise budget)
-  Create & manage budget categories
-  Add, view & delete expenses
-  Swipe-to-delete individual expenses
-  Clean, modern design using Tailwind CSS 


##  Screens

- **Home**
  - View all categories
  - Pie chart of total budget distribution
  - Tap a category to manage its expenses
- **Add Category**
  - Pick an icon and color
  - Set a monthly budget
- **Add Expense**
  - Add a title and amount
  - Visual budget tracking per category
  - Delete individual or all expenses in a category


##  Tech Stack

| Tech          | Purpose                                |
|---------------|----------------------------------------|
| Expo (React Native) | Core mobile app framework         |
| Supabase      | Auth, Realtime DB, Category & Expense storage |
| Lottie        | Visual animations  |
| NativeWind    | Tailwind CSS for React Native styling  |



##  Database Schema (Supabase)

### `users`
Handled automatically by Supabase Auth.

### `categories`

| Column       | Type     |
|--------------|----------|
| id           | UUID     |
| user_id      | UUID     |
| name         | Text     |
| icon         | Text     |
| color        | Text     |
| totalBudget  | Numeric  |
| created_at   | Timestamp |

### `expenses`

| Column       | Type     |
|--------------|----------|
| id           | UUID     |
| user_id      | UUID     |
| category_id  | UUID     |
| title        | Text     |
| amount       | Numeric  |
| created_at   | Timestamp |

##  Author

Made with ❤️ by Bala Subramanian S
