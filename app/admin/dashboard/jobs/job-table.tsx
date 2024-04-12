import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  MRT_TableOptions,
} from "mantine-react-table";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css"; //if using mantine date picker features
import "mantine-react-table/styles.css";
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  MantineProvider,
  Text,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { IconDownload, IconEdit, IconTrash } from "@tabler/icons-react";
import { jsPDF } from "jspdf"; //or use your library of choice here
import autoTable from "jspdf-autotable";
import { Tables } from "@/types_db";
import { useMemo, useState } from "react";
import { ModalsProvider, modals } from "@mantine/modals";
import { deleteJob, updateJob } from "@/components/supabaseServer";

type Jobs = Tables<"jobs">;

// Create ComboboxItem objects for boolean options
const boolOptions = ["true", "false"];
const jobOptions = ["pending", "complete", "error", "hold"];

function convertDateFormat(dateString: string) {
  // Split the input date string into month, day, and year components
  const [month, day, year] = dateString.split("/").map(Number);

  // Create a new Date object using the extracted components
  const date = new Date(year, month - 1, day);

  // Extract date components
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1 and pad with leading zero if needed
  const dd = String(date.getDate()).padStart(2, "0");

  // Construct the yyyy-mm-dd formatted date string
  const formattedDateString = `${yyyy}-${mm}-${dd}`;

  return formattedDateString;
}

const JobsTable = ({ data }: { data: Jobs[] }) => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const columns = useMemo<MRT_ColumnDef<Jobs>[]>(
    () => [
      { accessorKey: "id", header: "ID", size: 120, enableEditing: false },
      {
        accessorKey: "created_at",
        header: "Start Date",
        size: 40,
        Cell: ({ row }) => {
          // Assuming row.original.created_at is in the format "yyyy-mm-dd HH:mm:ss.ssssss+00"
          const inputDate = row.original.created_at.split(" ")[0]; // Extracting the date part

          // Create a Date object from the input date string
          const currentDate = new Date(inputDate);

          // Create an Intl.DateTimeFormat object for formatting the date
          const dateFormatter = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });

          // Format the date using the dateFormatter object
          const formattedDate = dateFormatter.format(currentDate);

          return <div>{formattedDate}</div>;
        },

        enableEditing: false,
      },
      {
        accessorKey: "invoice_id",
        header: "Invoice Id",
        size: 120,
        enableEditing: false,
      },
      {
        accessorKey: "is_paid",
        header: "Paid",
        size: 40,
        Cell: ({ row }) => (
          <div className="capitalize">{row.original.is_paid.toString()}</div>
        ),
        enableEditing: false,
      },
      {
        accessorKey: "is_work_done",
        header: "Complete",
        size: 40,
        Cell: ({ row }) => (
          <div className="capitalize">
            {row.original.is_work_done.toString()}
          </div>
        ),
        editVariant: "select",
        mantineEditSelectProps: {
          data: boolOptions,
          error: validationErrors?.boolOptions,
        },
      },
      {
        accessorKey: "work_completed_date",
        header: "Job Completion",
        size: 120,
        mantineEditTextInputProps: {
          error: validationErrors?.work_completed_date,
          placeholder: "yyyy-mm-dd",
        },
        // Cell: ({ row }) => {
        //   // Check if work_completed_date is not null and not undefined
        //   if (row.original.work_completed_date != null) {
        //     const currentDate = new Date(
        //       row.original.work_completed_date.toString()
        //     );

        //     // Create an Intl.DateTimeFormat object for Eastern Time
        //     const easternTimeFormatter = new Intl.DateTimeFormat("en-US", {
        //       timeZone: "America/New_York", // 'America/New_York' corresponds to Eastern Time
        //       year: "numeric",
        //       month: "2-digit",
        //       day: "2-digit",
        //     });

        //     // Format the date in Eastern Time
        //     const formattedDate = easternTimeFormatter.format(currentDate);

        //     return <div>{formattedDate}</div>;
        //   } else {
        //     // Handle case where work_completed_date is null or undefined
        //     return <div></div>; // Or any other placeholder or message
        //   }
        // },
      },

      {
        accessorKey: "products",
        header: "Products",
        size: 120,
        Cell: ({ row }) => {
          const products = row.original.products || [];
          const formattedProducts = products.map((product) => {
            return `${product.id} (Quantity: ${product.quantity})`;
          });
          return <div>{formattedProducts.join(", ")}</div>;
        },
        enableEditing: false,
      },
      {
        accessorKey: "customer",
        header: "Customer",
        size: 120,
        enableEditing: false,
      },
      {
        accessorKey: "employee",
        header: "Employee",
        size: 120,
        enableEditing: false,
      },
      {
        accessorKey: "job_status",
        header: "Job Status",
        size: 40,
        editVariant: "select",
        mantineEditSelectProps: {
          data: jobOptions,
          error: validationErrors?.jobOptions,
        },
      },
      {
        accessorKey: "invoice_status",
        header: "Invoice Status",
        size: 40,
        enableEditing: false,
      },

      {
        accessorKey: "address",
        header: "Shipping Address",
        size: 120,
        Cell: ({ row }) => {
          const { city, line1, line2, state, country, postal_code } =
            row.original.address || {};
          const addressString = `${line1}${line1 && line2 ? ", " : ""}${line2}${
            line1 && city ? ", " : ""
          }${city}${city && state ? ", " : ""}${state}${
            (line1 || city || state) && postal_code ? " " : ""
          }${postal_code}`;
          return <div>{addressString}</div>;
        },
        enableEditing: false,
      },
    ],
    [validationErrors]
  );

  const handleExportRows = (rows: MRT_Row<Jobs>[]) => {
    const doc = new jsPDF({ orientation: "landscape" });
    const tableData: string[][] = rows.map((row) => {
      const rowData: string[] = [];

      // Process each column
      columns.forEach((column) => {
        const value = row.original[column.accessorKey as keyof Jobs];

        // Check if the column is "start_date" and the value is a date string
        if (column.accessorKey === "created_at" && typeof value === "string") {
          const startDate = new Date(value);
          const month = startDate.toLocaleString("default", { month: "long" });
          const day = startDate.getDate();
          const year = startDate.getFullYear();
          const formattedStartDate = `${month} ${day}, ${year}`;

          rowData.push(formattedStartDate);
        } else if (column.accessorKey === "products" && Array.isArray(value)) {
          // If the column is "Products" and the value is an array, format the products data
          const productString = value
            .map(
              (product) => `${product.id} (Quantity: ${product.quantity || ""})`
            )
            .join(", ");
          rowData.push(productString);
        } else if (
          column.accessorKey === "address" &&
          typeof value === "object" &&
          value !== null
        ) {
          // If the column is "Address" and the value is an object (address), format the address
          const addressString = `${value.line1}${
            value.line1 && value.line2 ? ", " : ""
          }${value.line2}${value.line1 && value.city ? ", " : ""}${value.city}${
            value.city && value.state ? ", " : ""
          }${value.state}${
            (value.line1 || value.city || value.state) && value.postal_code
              ? " "
              : ""
          }${value.postal_code || ""}`;
          rowData.push(addressString);
        } else {
          // For other columns, handle as before
          if (typeof value === "object" && value !== null) {
            rowData.push(JSON.stringify(value));
          } else {
            rowData.push(value === null ? "" : String(value));
          }
        }
      });

      return rowData;
    });

    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData, // Pass tableData directly here

      styles: {
        overflow: "linebreak",
        fontSize: 5, // Adjust the font size
      },
      showHead: "everyPage",
    });

    doc.save("HRS-Jobs.pdf");
  };

  const handleSaveJob: MRT_TableOptions<Jobs>["onEditingRowSave"] = async ({
    values,
    table,
  }) => {
    let formattedDate = null;

    // Check if values.work_completed_date is already in "YYYY-MM-DD" format
    const dateFormatPattern = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD pattern
    if (
      values.work_completed_date &&
      dateFormatPattern.test(values.work_completed_date)
    ) {
      formattedDate = values.work_completed_date; // Use the existing date format as is
    } else if (
      values.work_completed_date &&
      typeof values.work_completed_date === "string"
    ) {
      // Convert the date to the desired format if it's a valid date string
      formattedDate = convertDateFormat(values.work_completed_date);

      // Check if formattedDate is a valid date string
      if (!formattedDate || typeof formattedDate !== "string") {
        console.error("Invalid formatted date:", formattedDate);
        // Handle invalid date formatting, e.g., show an error message
      }
    } else {
      console.error("Invalid input date:", values.work_completed_date);
      // Handle invalid input date or missing date, e.g., show an error message
    }

    // Update the job with or without the formatted date
    const updatedValues = { ...values, work_completed_date: formattedDate };
    console.log(updatedValues);
    await updateJob(updatedValues);
    table.setEditingRow(null);
    window.location.reload(); //exit editing mode
  };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Jobs>) => {
    console.log("Opening delete confirmation modal for row:", row);
    modals.openConfirmModal({
      title: "Are you sure you want to delete this job?",

      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteJob(row.original),
    });
  };

  const table = useMantineReactTable({
    columns,
    data,
    enableRowSelection: true,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveJob,
    initialState: { density: "xs", showColumnFilters: true },
    columnFilterDisplayMode: "subheader",
    paginationDisplayMode: "pages",
    enableGlobalFilter: false,
    editDisplayMode: "row",
    enableEditing: true,
    getRowId: (row) => row.id,
    positionToolbarAlertBanner: "bottom",
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        style={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="filled"
          className="bg-blue-400"
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          leftSection={<IconDownload />}
        >
          Export All Rows
        </Button>
        <Button
          variant="filled"
          className="bg-blue-400"
          disabled={table.getRowModel().rows.length === 0}
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getRowModel().rows)}
          leftSection={<IconDownload />}
        >
          Export Page Rows
        </Button>
        <Button
          variant="filled"
          className="bg-blue-400"
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          //only export selected rows
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          leftSection={<IconDownload />}
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        <Tooltip label="Edit">
          <ActionIcon onClick={() => table.setEditingRow(row)}>
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),
  });

  return <MantineReactTable table={table} />;
};

export default JobsTable;
