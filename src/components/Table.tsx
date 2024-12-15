import React, { useState, useEffect, useRef } from "react"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { OverlayPanel } from 'primereact/overlaypanel'
import { ChevronDownIcon } from 'primereact/icons/chevrondown'
import { LoadingIndicator } from './LoadingIndicator'
import axios from "axios"                          // For API call

interface Row {                                    // Row definition
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: number | null;
    date_end: number | null;
    selected?: boolean;
}

export const Table = () => {
    const [rows, setRows] = useState<Row[]>([]);                                   // hold fetched data
    const [selectedRows, setSelectedRows] = useState<Row[]>([]);                   // track rows selected by user
    const [numRowsToSelect, setNumRowsToSelect] = useState<number>(0);             // user input to limit the number of rows that can be selected

    const [currentPage, setCurrentPage] = useState<number>(1);                     // track current page number
    const [totalRecords, setTotalRecords] = useState<number>(0);                   // Number of records available on the server
    const [first, setFirst] = useState<number>(0);                                 // tracks the start index of records displayed on the current page

    const [loading, setLoading] = useState<boolean>(false);                        // Whether API call is in progress or not

    const op = useRef<OverlayPanel>(null);

    const handleDownButton = (event: React.MouseEvent<HTMLButtonElement>) => {     // Down icon to open panel  
        op.current?.toggle(event);
    };

    const handleSubmitButton = () => {                                             // Submit button in panel
        if (numRowsToSelect > 0) {                                                 // if user gives input then only limit the number of rows that can be selected else no limit
            const rowsToSelect = rows.slice(0, numRowsToSelect);
            setSelectedRows(rowsToSelect);
        } else {
            setSelectedRows(rows);
        }
    };

    const handleSelectionChange = (e: { value: Row[] }) => {                       // track selection
        if (numRowsToSelect > 0 && e.value.length > numRowsToSelect) {
            e.value = e.value.slice(0, numRowsToSelect);
        }
        setSelectedRows(e.value);
    };

    const handlePageChange = (event: { first: number; rows: number; page?: number }) => {  // when user navigates to another page
        const newPage = event.page ?? 0;
        setCurrentPage(newPage + 1);
        setFirst(event.first);
    };

    const fetchData = async (page: number) => {                                   // Fetch API
        try {
            setLoading(true);
            const response = await axios.get(
                `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${12}`
            );
            const data = response.data.data;
            const total = response.data.pagination.total;

            const mappedData: Row[] = data.map((obj: any) => ({                  // mapping of fetched data
                id: obj.id,
                title: obj.title || "N/A",
                place_of_origin: obj.place_of_origin || "N/A",
                artist_display: obj.artist_display || "N/A",
                inscriptions: obj.inscriptions || "N/A",
                date_start: obj.date_start || null,
                date_end: obj.date_end || null,
                selected: false,
            }));

            setRows(mappedData);
            setTotalRecords(total);
        } 
        catch (error) {
            console.error("Error fetching data:", error);
        } 
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {                                                             // Effect hook for API call to fetch the respective page data
        fetchData(currentPage);
    }, [currentPage]);

    return (
        <>
            <h1>Data Table</h1>

            {loading && <LoadingIndicator />}

            <DataTable
                selectionMode="checkbox"
                dataKey="id"
                loading={loading}
                paginator rows={12}
                value={rows}
                first={first}
                totalRecords={totalRecords}
                selection={selectedRows}
                onSelectionChange={handleSelectionChange}
                onPage={handlePageChange}
                lazy                            // Server-side pagination
            >
                <Column selectionMode="multiple" header={<></>}></Column>
                <Column
                    header={
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <button style={{ border: "none", background: "transparent" }} onClick={handleDownButton}>
                                <ChevronDownIcon />
                            </button>

                            <OverlayPanel ref={op} showCloseIcon>
                                <>
                                    <input
                                        id="numRowsSelected"
                                        type="number"
                                        min="1"
                                        value={numRowsToSelect}
                                        placeholder="Select rows..."
                                        onChange={(e) => setNumRowsToSelect(Number(e.target.value))}
                                        style={{ height: '2em', width: '8em' }}
                                    />
                                    <button
                                        onClick={handleSubmitButton}
                                        style={{ display: 'block', height: '2em', marginTop: '0.5em' }}>
                                        Submit
                                    </button>
                                </>
                            </OverlayPanel>
                        </div>
                    }
                ></Column>
                <Column field="title" header="Title" />
                <Column field="place_of_origin" header="Place of Origin" />
                <Column field="artist_display" header="Artist" />
                <Column field="inscriptions" header="Inscriptions" />
                <Column field="date_start" header="Start Date" />
                <Column field="date_end" header="End Date" />
            </DataTable>
        </>
    );
};
