import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "mantine-react-table";
import { Box, Button } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import { jsPDF } from "jspdf"; //or use your library of choice here
import autoTable from "jspdf-autotable";
import { Tables } from "@/types_db";

type Jobs = Tables<"jobs">;

const columns: MRT_ColumnDef<Jobs>[] = [
  { accessorKey: "id", header: "ID", size: 120 },
  {
    accessorKey: "created_at",
    header: "Init Date",
    size: 150,
    Cell: ({ row }) => {
      const currentDate = new Date(row.original.created_at);

      // Create an Intl.DateTimeFormat object for Eastern Time
      const easternTimeFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York", // 'America/New_York' corresponds to Eastern Time
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      // Format the date in Eastern Time
      const formattedDate = easternTimeFormatter.format(currentDate);

      return <div>{formattedDate}</div>;
    },
  },
  { accessorKey: "invoice_id", header: "Invoice Id", size: 120 },
  { accessorKey: "is_paid", header: "Paid", size: 40 },
  { accessorKey: "is_work_done", header: "Complete", size: 40 },
  {
    accessorKey: "work_completed_date",
    header: "Job Completion Date",
    size: 120,
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
  },
  { accessorKey: "customer", header: "Customer", size: 120 },
  { accessorKey: "employee", header: "Employee", size: 120 },
  { accessorKey: "job_status", header: "Job Status", size: 40 },
  { accessorKey: "invoice_status", header: "Invoice Status", size: 40 },
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
  },
];

const JobsTable = ({ data }: { data: Jobs[] }) => {
  const handleExportRows = (rows: MRT_Row<Jobs>[]) => {
    const doc = new jsPDF({ orientation: "landscape" });
    const tableData: string[][] = rows.map((row) => {
      const rowData: string[] = [];

      // Process each column
      columns.forEach((column) => {
        const value = row.original[column.accessorKey as keyof Jobs];

        // Check if the column is "Products"
        if (column.accessorKey === "products") {
          // If yes, format the products data
          if (Array.isArray(value)) {
            const productString = value
              .map(
                (product) =>
                  `${product.id} (Quantity: ${product.quantity || ""})`
              )
              .join(", ");
            rowData.push(productString);
          } else {
            rowData.push(value === null ? "" : String(value));
          }
        } else if (column.accessorKey === "address") {
          // If yes, format the shipping address
          if (typeof value === "object" && value !== null) {
            const addressString = `${value.line1}${
              value.line1 && value.line2 ? ", " : ""
            }${value.line2}${value.line1 && value.city ? ", " : ""}${
              value.city
            }${value.city && value.state ? ", " : ""}${value.state}${
              (value.line1 || value.city || value.state) && value.postal_code
                ? " "
                : ""
            }${value.postal_code || ""}`;
            rowData.push(addressString);
          } else {
            rowData.push(value === null ? "" : String(value));
          }
        } else {
          // If not "Products", format other columns
          if (Array.isArray(value)) {
            rowData.push(
              value
                .flat()
                .map((item) => (item === null ? "" : String(item)))
                .join(", ")
            );
          } else if (typeof value === "object" && value !== null) {
            rowData.push(JSON.stringify(value));
          } else {
            rowData.push(value === null ? "" : String(value));
          }
        }
      });

      return rowData;
    });

    const flattenedTableData: string[] = tableData.flat();
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: [flattenedTableData],

      styles: {
        overflow: "linebreak",
        fontSize: 5, // Adjust the font size
      },
      showHead: "everyPage",
    });

    doc.save("jobs.pdf");
  };

  const table = useMantineReactTable({
    columns,
    data,
    enableRowSelection: true,
    initialState: { density: "xs" },
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
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
          leftIcon={<IconDownload />}
        >
          Export All Rows
        </Button>
        <Button
          variant="filled"
          className="bg-blue-400"
          disabled={table.getRowModel().rows.length === 0}
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getRowModel().rows)}
          leftIcon={<IconDownload />}
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
          leftIcon={<IconDownload />}
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
  });

  return <MantineReactTable table={table} />;
};

export default JobsTable;
