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
import ServiceProductService from "api/ServiceProductService";
import Tile from "views/Admin/components/Tile/Tile";
import AddButton from "views/Admin/components/Buttons/AddButton";
import SortSelect from "views/Admin/components/SortSelect/SortSelect";
import CustomTable from "views/Admin/components/CustomTable/CustomTable";
import NotificationContext from "context/NotificationContext";

export default function ServicesManager() {
  const { addNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [services, setServices] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const isMobile = useMediaQuery("(max-width:992px)");
  const [sortBy, setSortBy] = useState("id-asc");

  const sortFields = [
    { key: "id", label: "ID" },
    { key: "name", label: "Nazwa" },
    { key: "companies", label: "Liczba firm" },
    { key: "createdAt", label: "Data utworzenia" },
    { key: "updatedAt", label: "Data modyfikacji" },
  ];

  const sortedServices = useMemo(() => {
    return [...services].sort((a, b) => {
      const [field, order] = sortBy.split("-");
      let compareA = a[field];
      let compareB = b[field];

      if (field === "companies") {
        compareA = a.companies.length;
        compareB = b.companies.length;
      } else if (field === "createdAt" || field === "updatedAt") {
        compareA = new Date(a[field]);
        compareB = new Date(b[field]);
      } else if (field === "name") {
        compareA = a.name.toLowerCase();
        compareB = b.name.toLowerCase();
      }

      if (compareA < compareB) return order === "asc" ? -1 : 1;
      if (compareA > compareB) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [services, sortBy]);

  const getAllServices = useCallback(async () => {
    const response =
      await ServiceProductService.getAllServicesWithCompanies(addNotification);
    if (response) {
      setServices(response.data.data);
    }
    setIsDataLoaded(true);
  }, [addNotification]);

  const deleteService = async () => {
    await ServiceProductService.deleteService(itemToDelete.id, addNotification);
    getAllServices();
    closeDeletePopup();
  };

  const handleEdit = (row) => {
    navigate(`/admin/services/edit-service/${row.id}`);
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
    getAllServices();
  }, [getAllServices]);

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
        Header: "Data utworzenia",
        accessor: "createdAt",
      },
      {
        Header: "Data modyfikacji",
        accessor: "updatedAt",
      },
      {
        Header: "Liczba firm",
        accessor: "companies",
      },
    ],
    [],
  );

  const data = useMemo(() => services, [services]);

  if (isMobile) {
    return (
      <div className={mobileStyles.mobileContainer}>
        <ConfirmDeletePopup
          isOpen={showConfirmDelete}
          onClose={closeDeletePopup}
          onDelete={deleteService}
          itemLabel={itemToDelete?.name || ""}
          itemType="service"
        />
        <div className={mobileStyles.topContainer}>
          <AddButton type="service" />
          <SortSelect
            fields={sortFields}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
        <div className={mobileStyles.tilesContainer}>
          {!isDataLoaded ? (
            <Loader />
          ) : services.length === 0 ? (
            <p className={mobileStyles.noDataInfo}>Brak dodanych usług</p>
          ) : (
            sortedServices.map((service) => (
              <Tile
                key={service.id}
                title={service.name}
                data={service}
                keysToShow={["id", "createdAt", "updatedAt", "companies"]}
                keyMappings={{
                  id: { label: "ID" },
                  createdAt: { label: "Data utworzenia" },
                  updatedAt: { label: "Data modyfikacji" },
                  companies: {
                    label: "Liczba przypisanych firm",
                    transform: (value) => value.length,
                  },
                }}
                onEdit={(id) => navigate(`/admin/services/edit-service/${id}`)}
                onDelete={() => handleDeleteClick(service)}
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
        onDelete={deleteService}
        itemLabel={itemToDelete?.name || ""}
        itemType="service"
      />
      {!isDataLoaded ? (
        <Loader />
      ) : (
        <CustomTable
          columns={columns}
          data={data}
          defaultFilter="name"
          buttonType="service"
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}
    </>
  );
}
