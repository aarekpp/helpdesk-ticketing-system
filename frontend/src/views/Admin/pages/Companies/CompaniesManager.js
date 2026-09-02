import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Loader from "components/Loader/Loader";
import ConfirmDeletePopup from "views/Admin/components/ConfirmDeletePopup/ConfirmDeletePopup";
import NotificationContext from "context/NotificationContext";
import CompanyService from "api/CompanyService";
import mobileStyles from "../../../../scss/AdminMobileView.module.scss";
import AddButton from "views/Admin/components/Buttons/AddButton";
import SortSelect from "views/Admin/components/SortSelect/SortSelect";
import Tile from "views/Admin/components/Tile/Tile";
import CustomTable from "views/Admin/components/CustomTable/CustomTable";

export default function CompaniesManager() {
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const isMobile = useMediaQuery("(max-width:992px)");
  const [sortBy, setSortBy] = useState("id-asc");

  const sortFields = [
    { key: "id", label: "ID" },
    { key: "name", label: "Nazwa" },
    { key: "city", label: "Miasto" },
    { key: "address", label: "Adres" },
    { key: "zipCode", label: "Kod pocztowy" },
    { key: "services", label: "Liczba usług" },
    { key: "clients", label: "Liczba klientów" },
    { key: "createdAt", label: "Data utworzenia" },
    { key: "updatedAt", label: "Data modyfikacji" },
  ];

  const sortedCompanies = useMemo(() => {
    return [...companies].sort((a, b) => {
      const [field, order] = sortBy.split("-");
      let compareA = a[field];
      let compareB = b[field];

      if (field === "services" || field === "clients" || field === "managers") {
        compareA = a.companies.length;
        compareB = b.companies.length;
      } else if (field === "createdAt" || field === "updatedAt") {
        compareA = new Date(a[field]);
        compareB = new Date(b[field]);
      } else if (
        field === "name" ||
        field === "address" ||
        field === "city" ||
        field === "zipCode"
      ) {
        compareA = a.name.toLowerCase();
        compareB = b.name.toLowerCase();
      }

      if (compareA < compareB) return order === "asc" ? -1 : 1;
      if (compareA > compareB) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [companies, sortBy]);

  const getAllCompanies = useCallback(async () => {
    const repsonse =
      await CompanyService.getAllCompaniesWithExtendedData(addNotification);
    if (repsonse) {
      setCompanies(repsonse.data.data);
    }
    setIsDataLoaded(true);
  }, [addNotification]);

  const deleteCompany = async () => {
    await CompanyService.deleteCompany(itemToDelete.id, addNotification);
    getAllCompanies();
    closeDeletePopup();
  };

  const handleEdit = (row) => {
    navigate(`/admin/companies/edit-company/${row.id}`);
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
    getAllCompanies();
  }, [getAllCompanies]);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Nazwa",
        accessor: "name",
      },
      {
        Header: "Miasto",
        accessor: "city",
      },
      {
        Header: "Adres",
        accessor: "address",
      },
      {
        Header: "Kod pocztowy",
        accessor: "zipCode",
      },
      {
        Header: "Liczba usług",
        accessor: "serviceProducts",
      },
      {
        Header: "Liczba klientów",
        accessor: "clients",
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

  const data = useMemo(() => companies, [companies]);

  if (isMobile) {
    return (
      <div className={mobileStyles.mobileContainer}>
        <ConfirmDeletePopup
          isOpen={showConfirmDelete}
          onClose={closeDeletePopup}
          onDelete={deleteCompany}
          itemLabel={itemToDelete?.name || ""}
          itemType="company"
        />
        <div className={mobileStyles.topContainer}>
          <AddButton type="company" />
          <SortSelect
            fields={sortFields}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
        <div className={mobileStyles.tilesContainer}>
          {!isDataLoaded ? (
            <Loader />
          ) : companies.length === 0 ? (
            <p className={mobileStyles.noDataInfo}>Brak dodanych usług</p>
          ) : (
            sortedCompanies.map((company) => (
              <Tile
                key={company.id}
                title={company.name}
                data={company}
                keysToShow={[
                  "id",
                  "city",
                  "address",
                  "zipCode",
                  "serviceProducts",
                  "clients",
                  "managers",
                  "createdAt",
                  "updatedAt",
                ]}
                keyMappings={{
                  id: { label: "ID" },
                  city: { label: "Miasto" },
                  address: { label: "Adres" },
                  zipCode: { label: "Kod pocztowy" },
                  serviceProducts: {
                    label: "Liczba usług",
                    transform: (value) => value.length,
                  },
                  clients: {
                    label: "Liczba klientów",
                    transform: (value) => value.length,
                  },
                  managers: {
                    label: "Liczba menadżerów",
                    transform: (value) => value.length,
                  },
                  createdAt: { label: "Data utworzenia" },
                  updatedAt: { label: "Data modyfikacji" },
                }}
                onEdit={(id) => navigate(`/admin/companies/edit-company/${id}`)}
                onDelete={() => handleDeleteClick(company)}
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
        onDelete={deleteCompany}
        itemLabel={itemToDelete?.name || ""}
        itemType="company"
      />
      {!isDataLoaded ? (
        <Loader />
      ) : (
        <CustomTable
          columns={columns}
          data={data}
          defaultFilter="name"
          buttonType="company"
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}
    </>
  );
}
