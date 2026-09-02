import { useMediaQuery } from "@mui/material";
import AdminService from "api/AdminService";
import Loader from "components/Loader/Loader";
import NotificationContext from "context/NotificationContext";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import AddButton from "views/Admin/components/Buttons/AddButton";
import ConfirmDeletePopup from "views/Admin/components/ConfirmDeletePopup/ConfirmDeletePopup";
import SortSelect from "views/Admin/components/SortSelect/SortSelect";
import Tile from "views/Admin/components/Tile/Tile";
import mobileStyles from "../../../../scss/AdminMobileView.module.scss";
import { useSelector } from "react-redux";
import CustomTable from "views/Admin/components/CustomTable/CustomTable";

export default function AdminsManager() {
  const { addNotification } = useContext(NotificationContext);
  const { userId } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [admins, setAdmins] = useState([]);
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

  const sortedAdmins = useMemo(() => {
    return [...admins].sort((a, b) => {
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
  }, [admins, sortBy]);

  const getAllAdmins = useCallback(async () => {
    const response = await AdminService.getAllAdmins(addNotification);
    if (response) {
      setAdmins(response.data.data);
    }
    setIsDataLoaded(true);
  }, [addNotification]);

  const deleteAdmin = async () => {
    await AdminService.deleteAdmin(itemToDelete.id, addNotification);
    getAllAdmins();
    closeDeletePopup();
  };

  const handleEdit = (row) => {
    navigate(`/admin/admins/edit-admin/${row.id}`);
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
    getAllAdmins();
  }, [getAllAdmins]);

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

  const data = useMemo(() => admins, [admins]);

  if (isMobile) {
    return (
      <div className={mobileStyles.mobileContainer}>
        <ConfirmDeletePopup
          isOpen={showConfirmDelete}
          onClose={closeDeletePopup}
          onDelete={deleteAdmin}
          itemLabel={itemToDelete?.name || ""}
          itemType="admin"
        />
        <div className={mobileStyles.topContainer}>
          <AddButton type="admin" />
          <SortSelect
            fields={sortFields}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
        <div className={mobileStyles.tilesContainer}>
          {!isDataLoaded ? (
            <Loader />
          ) : admins.length === 0 ? (
            <p className={mobileStyles.noDataInfo}>Błąd</p>
          ) : (
            sortedAdmins.map((admin) => (
              <Tile
                title={admin.firstName + " " + admin.lastName}
                key={admin.id}
                data={admin}
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
                onEdit={(id) => navigate(`/admin/admins/edit-admin/${id}`)}
                onDelete={
                  admin.id === userId ? null : () => handleDeleteClick(admin)
                }
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
        onDelete={deleteAdmin}
        itemLabel={itemToDelete?.name || ""}
        itemType="admin"
      />
      {!isDataLoaded ? (
        <Loader />
      ) : (
        <CustomTable
          columns={columns}
          data={data}
          defaultFilter="email"
          buttonType="admin"
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          currentUserId={userId}
          isAdminTable={true}
        />
      )}
    </>
  );
}
