import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import balanceFormat from "./balanceFormat";

const PAGE_MARGIN = 10; // Adjust as needed

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#E4E4E4",
    padding: PAGE_MARGIN,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "right", // Align date to the right
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableCell: {
    flex: 1, // Equal flex for all cells
    padding: 5,
  },
  content: {
    fontSize: 12,
    marginBottom: 5,
  },
  pageNumber: {
    position: "absolute",
    bottom: PAGE_MARGIN,
    left: PAGE_MARGIN,
    right: PAGE_MARGIN,
    textAlign: "center",
    fontSize: 10,
  },
});

const MyDocument = ({ customer }: { customer: any[] }) => {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${(
    currentDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;

  function formatAddress(address: any) {
    const { city, line1, line2, state, country, postal_code } = address;
    const addressString = `${line1}${line1 && line2 ? ", " : ""}${line2}${
      (line1 || line2) && city ? ", " : ""
    }${city}${(line1 || line2 || city) && state ? ", " : ""}${state}${
      (line1 || line2 || city || state) && postal_code ? " " : ""
    }${postal_code}`;
    return addressString;
  }

  const rowsPerPage = 15; // Adjust as needed
  const totalRows = customer.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const pages = Array.from({ length: totalPages }, (_, index) => {
    const start = index * rowsPerPage;
    const end = Math.min(start + rowsPerPage, totalRows);
    const pageData = customer.slice(start, end);

    return (
      <Page key={index} size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.date}>Date: {formattedDate}</Text>
          <Text style={styles.heading}>Customer Information</Text>
          <Text style={styles.content}>Name: {pageData[0]?.name}</Text>
          <Text style={styles.content}>Email: {pageData[0]?.email}</Text>
          <Text style={styles.content}>Phone: {pageData[0]?.phone}</Text>
          <Text style={styles.content}>
            Address: {formatAddress(pageData[0]?.address)}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Products Purchased</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.content}>Product</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.content}>Price</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.content}>Quantity</Text>
              </View>
            </View>
            {pageData[0].product ? (
              pageData.map((product: any, idx: number) => (
                <View key={idx} style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text style={styles.content}>{product.product}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.content}>
                      {balanceFormat(product.price.toString())}
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text style={styles.content}>{product.quantity}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={styles.content}>No products purchased.</Text>
                </View>
              </View>
            )}
          </View>
        </View>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    );
  });

  return <Document>{pages}</Document>;
};

export default MyDocument;
