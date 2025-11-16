import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom"
// import AdminDashboard from './components/AdminDashboard/AdminDashboard';
// import Profile from './Routes/Profile/Profile';
// import UserReport from '../src/components/AdminDashboard/pages/userReport/UserReport'
// import BudgetManager from './Routes/Profile/budgetManager/BudgetManager';
// import TripsPlan from './Routes/Profile/tripsPlain/TripsPlan';

// import UserTrips from './components/AdminDashboard/pages/userTrips/UserTrips';

// import AuthForm from './components/AuthForm/AuthForm';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
    {/* <UserReport/> */}
    {/* <AdminDashboard /> */}
    {/* <Profile /> */}
    {/* <BudgetManager/> */}
    {/* <TripsPlan/> */}
    {/* <UserTrips /> */}
    {/* <AuthForm /> */}
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
