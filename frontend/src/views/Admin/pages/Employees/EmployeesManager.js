import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ConfirmDeletePopup from "views/Admin/components/ConfirmDeletePopup/ConfirmDeletePopup";
import Loader from "components/Loader/Loader";
import NotificationContext from "context/NotificationContext";
import EmployeeService from "api/EmployeeService";
import AddButton from "views/Admin/components/Buttons/AddButton";
import SortSelect from "views/Admin/components/SortSelect/SortSelect";
import mobileStyles from "../../../../scss/AdminMobileView.module.scss";
import Tile from "views/Admin/components/Tile/Tile";
import CustomTable from "views/Admin/components/CustomTable/CustomTable";

export default function EmployesManager() {
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const isMobile = useMediaQuery("(max-width:992px)");
  const [sortBy, setSortBy] = useState("id-asc");

  const sortFields = [
    { key: "id", label: "ID" },
    { key: "firstName", label: "Imię" },
    { key: "lastName", label: "Nazwisko" },
    { key: "email", label: "E-mail" },
    { key: "username", label: "Nazwa użytkownika" },
    { key: "createdAt", label: "Data utworzenia" },
    { key: "updatedAt", label: "Data modyfikacji" },
  ];

  const sortedEmployees = useMemo(() => {
    return [...employees].sort((a, b) => {
      const [field, order] = sortBy.split("-");
      let compareA = a[field];
      let compareB = b[field];

      if (field === "createdAt" || field === "updatedAt") {
        compareA = new Date(a[field]).getTime();
        compareB = new Date(b[field]).getTime();
      } else if (
        field === "firstName" ||
        field === "lastName" ||
        field === "email" ||
        field === "username"
      ) {
        compareA = a[field].toLowerCase();
        compareB = b[field].toLowerCase();
      }

      if (compareA < compareB) return order === "asc" ? -1 : 1;
      if (compareA > compareB) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [employees, sortBy]);

  const getAllEmployees = useCallback(async () => {
    const response = await EmployeeService.getAllEmployees(addNotification);
    if (response) {
      setEmployees(response.data.data);
    }
    setIsDataLoaded(true);
  }, [addNotification]);

  const deleteEmployee = async () => {
    await EmployeeService.deleteEmployee(itemToDelete.id, addNotification);
    getAllEmployees();
    closeDeletePopup();
  };

  const handleEdit = (row) => {
    navigate(`/admin/employees/edit-employee/${row.id}`);
  };

  const handleDeleteClick = (item) => {
    setShowConfirmDelete(true);
    setItemToDelete(item);
  };

  const closeDeletePopup = () => {
    setShowConfirmDelete(false);
    setItemToDelete(null);
  };

  useEffect(() => {
    getAllEmployees();
  }, [getAllEmployees]);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Imię",
        accessor: "firstName",
      },
      {
        Header: "Nazwisko",
        accessor: "lastName",
      },
      {
        Header: "E-mail",
        accessor: "email",
      },
      {
        Header: "Nazwa użytkownika",
        accessor: "username",
      },
      {
        Header: "Data utworzenia",
        accessor: "createdAt",
      },
      {
        Header: "Data modyfikacji",
        accessor: "updatedAt",
      },
    ],
    [],
  );

  const data = useMemo(() => employees, [employees]);

  if (isMobile) {
    return (
      <div className={mobileStyles.mobileContainer}>
        <ConfirmDeletePopup
          isOpen={showConfirmDelete}
          onClose={closeDeletePopup}
          onDelete={deleteEmployee}
          itemLabel={
            itemToDelete?.firstName + " " + itemToDelete?.lastName || ""
          }
          itemType="employee"
        />
        <div className={mobileStyles.topContainer}>
          <AddButton type="employee" />
          <SortSelect
            fields={sortFields}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
        <div className={mobileStyles.tilesContainer}>
          {!isDataLoaded ? (
            <Loader />
          ) : employees.length === 0 ? (
            <p className={mobileStyles.noDataInfo}>Brak dodanych pracowników</p>
          ) : (
            sortedEmployees.map((employee) => (
              <Tile
                title={employee.firstName + " " + employee.lastName}
                key={employee.id}
                data={employee}
                keysToShow={[
                  "id",
                  "email",
                  "username",
                  "createdAt",
                  "updatedAt",
                ]}
                keyMappings={{
                  id: { label: "ID" },
                  email: { label: "E-mail" },
                  username: { label: "Nazwa użytkownika" },
                  createdAt: { label: "Data utworzenia" },
                  updatedAt: { label: "Data modyfikacji" },
                }}
                onEdit={(id) =>
                  navigate(`/admin/employees/edit-employee/${id}`)
                }
                onDelete={() => handleDeleteClick(employee)}
              />
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <ConfirmDeletePopup
        isOpen={showConfirmDelete}
        onClose={closeDeletePopup}
        onDelete={deleteEmployee}
        itemLabel={itemToDelete?.firstName + " " + itemToDelete?.lastName || ""}
        itemType="employee"
      />
      {!isDataLoaded ? (
        <Loader />
      ) : (
        <CustomTable
          columns={columns}
          data={data}
          defaultFilter="email"
          buttonType="employee"
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}
    </>
  );
}
