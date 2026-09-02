import React, { useState, useMemo } from "react";
import tableStyles from "./CustomTable.module.scss";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import { format } from "date-fns";
import { ReactComponent as EditSVG } from "../../../../icons/edit.svg";
import { ReactComponent as DeleteSVG } from "../../../../icons/delete.svg";
import AddButton from "../Buttons/AddButton";

export default function CustomTable({
  columns,
  data,
  nullReplacements = {},
  defaultFilter,
  buttonType,
  onEdit,
  onDelete,
  currentUserId,
  isAdminTable = false,
}) {
  const [sortConfig, setSortConfig] = useState({
    field: "id",
    direction: "asc",
  });
  const [filterConfig, setFilterConfig] = useState({
    field: defaultFilter,
    query: "",
  });

  const handleSort = (field) => {
    setSortConfig((prevConfig) => ({
      field,
      direction:
        prevConfig.field === field && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd.MM.yyyy \n HH:mm:ss");
  };

  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const renderCellValue = (row, accessor) => {
    const value = getNestedValue(row, accessor);

    if (value === null || value === undefined) {
      return nullReplacements[accessor] || "Brak danych";
    }

    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return `${value.length}`;
      }

      return value.name || JSON.stringify(value);
    }

    if (
      typeof value === "string" &&
      !/[a-zA-Z]/.test(value) &&
      !isNaN(Date.parse(value))
    ) {
      return formatDate(value);
    }

    return value;
  };

  const filteredData = useMemo(() => {
    let filtered = [...data];

    if (filterConfig.query) {
      filtered = filtered.filter((item) => {
        const value =
          getNestedValue(item, filterConfig.field)?.toString().toLowerCase() ||
          "";
        return value.includes(filterConfig.query.toLowerCase());
      });
    }

    return filtered.sort((a, b) => {
      const { field, direction } = sortConfig;
      let compareA = getNestedValue(a, field);
      let compareB = getNestedValue(b, field);

      if (field === "createdAt" || field === "updatedAt") {
        compareA = new Date(compareA);
        compareB = new Date(compareB);
      } else if (typeof compareA === "string") {
        compareA = compareA.toLowerCase();
        compareB = compareB.toLowerCase();
      }

      if (compareA < compareB) return direction === "asc" ? -1 : 1;
      if (compareA > compareB) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, filterConfig, sortConfig]);

  return (
    <div className={tableStyles.tableMainContainer}>
      <div className={tableStyles.filter}>
        <TextField
          label="Wyszukaj"
          variant="outlined"
          value={filterConfig.query}
          onChange={(e) =>
            setFilterConfig({ ...filterConfig, query: e.target.value })
          }
          className={tableStyles.textInput}
        />
        <FormControl
          className={tableStyles.selectFilterOption}
          variant="outlined"
        >
          <InputLabel id="filter-field-label" shrink>
            Filtruj po
          </InputLabel>
          <Select
            labelId="filter-field-label"
            label="Filtruj po"
            value={filterConfig.field}
            onChange={(e) =>
              setFilterConfig({ ...filterConfig, field: e.target.value })
            }
          >
            {columns.map((col) => (
              <MenuItem key={col.accessor} value={col.accessor}>
                {col.Header}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <AddButton type={buttonType} />
      </div>
      <TableContainer component={Paper} className={tableStyles.tableContainer}>
        <Table className={tableStyles.table}>
          <TableHead className={tableStyles.tableHead}>
            <TableRow className={tableStyles.tableHeadRow}>
              {columns.map((column) => (
                <TableCell key={column.accessor}>
                  <TableSortLabel
                    active={sortConfig.field === column.accessor}
                    direction={
                      sortConfig.field === column.accessor
                        ? sortConfig.direction
                        : "asc"
                    }
                    onClick={() => handleSort(column.accessor)}
                  >
                    {column.Header}
                  </TableSortLabel>
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell className={tableStyles.headCell}>Akcje</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody className={tableStyles.tableBody}>
            {filteredData.map((row) => (
              <TableRow key={row.id} className={tableStyles.tableBodyRow}>
                {columns.map((column) => (
                  <TableCell key={column.accessor}>
                    {renderCellValue(row, column.accessor)}
                  </TableCell>
                ))}
                {(onEdit || onDelete) && (
                  <TableCell className={tableStyles.actionsCell}>
                    {onEdit && (
                      <IconButton
                        onClick={() => onEdit(row)}
                        className={`${tableStyles.iconButton} ${tableStyles.editButton}`}
                      >
                        <EditSVG className={tableStyles.icon} />
                      </IconButton>
                    )}
                    {onDelete &&
                      (!isAdminTable || row.id !== currentUserId) && (
                        <IconButton
                          onClick={() => onDelete(row)}
                          className={`${tableStyles.iconButton} ${tableStyles.deleteButton}`}
                        >
                          <DeleteSVG className={tableStyles.icon} />
                        </IconButton>
                      )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
