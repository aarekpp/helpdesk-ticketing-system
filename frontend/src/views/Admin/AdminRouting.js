import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import EmployesManager from "./pages/Employees/EmployeesManager";
import ClientsManager from "./pages/Clients/ClientsManager";
import CompaniesManager from "./pages/Companies/CompaniesManager";
import ServicesManager from "./pages/Services/ServicesManager";
import Header from "./components/Header/Header";
import AddService from "./pages/Services/AddService";
import EditService from "./pages/Services/EditService";
import AddEmployee from "./pages/Employees/AddEmployee";
import EditEmployee from "./pages/Employees/EditEmployee";
import AdminsManager from "./pages/Admins/AdminsManager";
import AddAdmin from "./pages/Admins/AddAdmin";
import EditAdmin from "./pages/Admins/EditAdmin";
import AddClient from "./pages/Clients/AddClient";
import EditClient from "./pages/Clients/EditClient";
import AddCompany from "./pages/Companies/AddCompany";
import EditCompany from "./pages/Companies/EditCompany";

export default function AdminRouting() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="home" element={<Home />} />
        <Route path="employees/*">
          <Route index element={<EmployesManager />} />
          <Route path="add-employee" element={<AddEmployee />} />
          <Route path="edit-employee/:id" element={<EditEmployee />} />
        </Route>
        <Route path="clients/*">
          <Route index element={<ClientsManager />} />
          <Route path="add-client" element={<AddClient />} />
          <Route path="edit-client/:id" element={<EditClient />} />
        </Route>
        <Route path="companies/*">
          <Route index element={<CompaniesManager />} />
          <Route path="add-company" element={<AddCompany />} />
          <Route path="edit-company/:id" element={<EditCompany />} />
        </Route>
        <Route path="services/*">
          <Route index element={<ServicesManager />} />
          <Route path="add-service" element={<AddService />} />
          <Route path="edit-service/:id" element={<EditService />} />
        </Route>
        <Route path="admins/*">
          <Route index element={<AdminsManager />} />
          <Route path="add-admin" element={<AddAdmin />} />
          <Route path="edit-admin/:id" element={<EditAdmin />} />
        </Route>
      </Routes>
    </>
  );
}
