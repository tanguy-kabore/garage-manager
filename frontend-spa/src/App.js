import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import { AuthContext } from './contexts/AuthContext';
import Admin from './pages/Admin';
import Home from './pages/Home';
import CreateMaintenance from './pages/maintenance/CreateMaintenance';
import EditMaintenance from './pages/maintenance/EditMaintenance';
import Maintenance from './pages/maintenance/Maintenance';
import ViewMaintenance from './pages/maintenance/ViewMaintenance';
import CreateUser from './pages/user/CreateUser';
import EditUser from './pages/user/EditUser';
import User from './pages/user/User';
import ViewUser from './pages/user/ViewUser';
import CreateVehicule from './pages/vehicule/CreateVehicule';
import EditVehicule from './pages/vehicule/EditVehicule';
import Vehicule from './pages/vehicule/Vehicule';
import ViewVehicule from './pages/vehicule/ViewVehicule';

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="App">
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        {isAuthenticated ? (
          <>
            <Route path="/admin" element={<Admin />} >
              <Route index element={<Maintenance />} />
              <Route path="maintenance" element={<Maintenance />} />
              <Route path="maintenance/create" element={<CreateMaintenance />} />
              <Route path="maintenance/:id" element={<ViewMaintenance />} />
              <Route path="maintenance/edit/:id" element={<EditMaintenance />} />

              <Route path="user" element={<User />} />
              <Route path="user/create" element={<CreateUser />} />
              <Route path="user/:id" element={<ViewUser />} />
              <Route path="user/edit/:id" element={<EditUser />} />

              <Route path="vehicule" element={<Vehicule />} />
              <Route path="vehicule/create" element={<CreateVehicule />} />
              <Route path="vehicule/:id" element={<ViewVehicule />} />
              <Route path="vehicule/edit/:id" element={<EditVehicule />} />
            </Route>
          </>
        ) : (
          <Route path="/" element={<Home />} />
        )}
      </Routes>
    </div>
  );
};

export default App;
