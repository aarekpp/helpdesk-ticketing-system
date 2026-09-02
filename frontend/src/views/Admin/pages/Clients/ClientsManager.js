import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import mobileStyles from "../../../../scss/AdminMobileView.module.scss";
import Loader from "components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import ConfirmDeletePopup from "views/Admin/components/ConfirmDeletePopup/ConfirmDeletePopup";
import Tile from "views/Admin/components/Tile/Tile";
import AddButton from "views/Admin/components/Buttons/AddButton";
import SortSelect from "views/Admin/components/SortSelect/SortSelect";
import CustomTable from "views/Admin/components/CustomTable/CustomTable";
import NotificationContext from "context/NotificationContext";
import ClientService from "api/ClientService";

export default function ClientsManager() {
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [clients, setClients] = useState([]);
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
    { key: "company.name", label: "Firma" },
    { key: "createdAt", label: "Data utworzenia" },
    { key: "updatedAt", label: "Data modyfikacji" },
  ];

  const sortedClients = useMemo(() => {
    return [...clients].sort((a, b) => {
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
        field === "username" ||
        field === "companyName"
      ) {
        compareA = a[field].toLowerCase();
        compareB = b[field].toLowerCase();
      }

      if (compareA < compareB) return order === "asc" ? -1 : 1;
      if (compareA > compareB) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [clients, sortBy]);

  const getAllClients = useCallback(async () => {
    const response =
      await ClientService.getAllClientsWithCompanyData(addNotification);
    if (response) {
      setClients(response.data.data);
    }
    setIsDataLoaded(true);
  }, [addNotification]);

  const deleteClient = async () => {
    await ClientService.deleteClient(itemToDelete.id, addNotification);
    getAllClients();
    closeDeletePopup();
  };

  const handleEdit = (row) => {
    navigate(`/admin/clients/edit-client/${row.id}`);
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
    getAllClients();
  }, [getAllClients]);

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
        Header: "Nazwa firmy",
        accessor: "company.name",
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

  const data = useMemo(() => clients, [clients]);

  if (isMobile) {
    return (
      <div className={mobileStyles.mobileContainer}>
        <ConfirmDeletePopup
          isOpen={showConfirmDelete}
          onClose={closeDeletePopup}
          onDelete={deleteClient}
          itemLabel={itemToDelete?.name || ""}
          itemType="client"
        />
        <div className={mobileStyles.topContainer}>
          <AddButton type="client" />
          <SortSelect
            fields={sortFields}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
        <div className={mobileStyles.tilesContainer}>
          {!isDataLoaded ? (
            <Loader />
          ) : clients.length === 0 ? (
            <p className={mobileStyles.noDataInfo}>Brak dodanych klientów</p>
          ) : (
            sortedClients.map((client) => (
              <Tile
                title={client.firstName + " " + client.lastName}
                key={client.id}
                data={client}
                keysToShow={[
                  "id",
                  "email",
                  "username",
                  "company.name",
                  "createdAt",
                  "updatedAt",
                ]}
                keyMappings={{
                  id: { label: "ID" },
                  email: { label: "E-mail" },
                  username: { label: "Nazwa użytkownika" },
                  "company.name": { label: "Firma" },
                  createdAt: { label: "Data utworzenia" },
                  updatedAt: { label: "Data modyfikacji" },
                }}
                nullReplacements={{
                  "company.name": "Brak przypisanej firmy",
                }}
                onEdit={(id) => navigate(`/admin/clients/edit-client/${id}`)}
                onDelete={() => handleDeleteClick(client)}
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
        onDelete={deleteClient}
        itemLabel={itemToDelete?.name || ""}
        itemType="client"
      />
      {!isDataLoaded ? (
        <Loader />
      ) : (
        <CustomTable
          columns={columns}
          data={data}
          nullReplacements={{
            "company.name": "Brak przypisanej firmy",
          }}
          defaultFilter="email"
          buttonType="client"
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}
    </>
  );
}
