import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

interface TableData {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: string;
  date_end: string;
}

const Home = () => {
  const [data, setData] = useState<TableData[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<TableData[]>([]);
  const [persistedSelected, setPersistedSelected] = useState<TableData[]>([]);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const rowsPerPage = 12;
  const op = useRef<OverlayPanel>(null);
  const [rowNumber, setRowNumber] = useState<number | "">("");

  const [headerToggle, setHeaderToggle] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${rowsPerPage}`
        );
        const res = await response.json();
        const filteredData = res.data;

        setData(
          filteredData.map((item: any) => ({
            id: item.id,
            title: item.title,
            place_of_origin: item.place_of_origin,
            artist_display: item.artist_display,
            inscriptions: item.inscriptions,
            date_start: item.date_start,
            date_end: item.date_end,
          }))
        );

        setTotalRecords(res.pagination.total);

        const selectedForPage = persistedSelected.filter((item) =>
          filteredData.some((dataItem: any) => dataItem.id === item.id)
        );
        setSelectedProducts(selectedForPage);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, [page, persistedSelected]);

  const onPageChange = (event: any) => {
    setPage(event.page + 1);
  };

  const onSelectionChange = (e: any) => {
    const selected = e.value || [];

    const updatedSelection = [
      ...persistedSelected.filter(
        (item) => !data.some((dataItem) => dataItem.id === item.id)
      ),
      ...selected,
    ];
    setPersistedSelected(updatedSelection);

    setSelectedProducts(selected);
  };

  const titleHeader = (
    <div className="flex items-center">
      <button
        onClick={(e: any) => {
          setHeaderToggle(!headerToggle);
          op.current?.toggle(e);
        }}
        className="p-2 rounded-lg transition-colors duration-300 focus:outline-none"
      >
        {headerToggle ? <AiOutlineUp size={20} /> : <AiOutlineDown size={20} />}
      </button>
      <span className="ml-2">Title</span>
    </div>
  );

  const handleRowSelection = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof rowNumber === "number") {
      const selectedRow = data.find((_item, index) => index + 1 === rowNumber);
      if (selectedRow) {
        const updatedPersisted = [
          ...persistedSelected.filter((item) => item.id !== selectedRow.id),
          selectedRow,
        ];
        setPersistedSelected(updatedPersisted);
        setSelectedProducts([selectedRow]);
        op.current?.hide();
      } else {
        alert("Row number isn't valid for the current page");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="card w-full" style={{ maxWidth: "57rem" }}>
        <DataTable
          value={data}
          paginator
          rows={rowsPerPage}
          totalRecords={totalRecords}
          onPage={onPageChange}
          lazy
          first={(page - 1) * rowsPerPage}
          selectionMode={"multiple"}
          selection={selectedProducts}
          onSelectionChange={onSelectionChange}
          tableStyle={{ minWidth: "30rem", maxHeight: "400px" }}
          scrollable
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
          <Column field="title" header={titleHeader} style={{ width: "25%" }} />
          <Column
            field="place_of_origin"
            header="Place Of Origin"
            style={{ width: "25%" }}
          ></Column>
          <Column
            field="artist_display"
            header="Artist Display"
            style={{ width: "25%" }}
          ></Column>
          <Column
            field="inscriptions"
            header="Inscriptions"
            style={{ width: "25%" }}
          ></Column>
        </DataTable>

        <OverlayPanel ref={op}>
          <form onSubmit={handleRowSelection} className="p-4">
            <input
              type="number"
              value={rowNumber}
              onChange={(e) => setRowNumber(Number(e.target.value) || "")}
              placeholder="Select rows..."
              className="border p-2 mb-2 rounded"
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded"
            >
              Submit
            </button>
          </form>
        </OverlayPanel>
      </div>
    </div>
  );
};

export default Home;
