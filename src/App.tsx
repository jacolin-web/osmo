import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import Search from "./components/Search";
import Table from "./components/Table";
import { parseCSV } from "./helpers/csvHelper";
import type { FragranceData } from "./types/FragranceTypes";

// App.tsx - Add overflow-hidden to prevent page scroll
function App() {
  const [originalData, setOriginalData] = useState<FragranceData[]>([]);
  const [data, setData] = useState<FragranceData[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
      fetch("/data/interview.csv")
      .then(res => {
          if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.text();
      })
      .then(csv => {
          const parsed = parseCSV(csv);
          setOriginalData(parsed);
          setData(parsed);
          setHeaders(parsed.length > 0 ? Object.keys(parsed[0]) : []);
      })
      .catch(err => {
          console.error("Failed to load CSV:", err);
      });
  }, []);

  // Apply search filter
  const searchFilteredData = searchQuery.trim() === '' 
    ? data 
    : data.filter(item =>
        ['formula_name', 'notes'].some(key =>
          String(item[key as keyof FragranceData])
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );

   return (
    <div className="h-screen flex flex-col overflow-hidden"> 
      {/* Fixed header */}
      <main>
        <div className="flex-none bg-gray-100 border-b px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl">Fragrance Table</h1>
            
            <div className="flex gap-2">
              <Search 
                value={searchQuery}
                onChange={setSearchQuery}
              />
              <Filter
                data={originalData}
                filterBy="category"
                onChange={setData}
              />
            </div>
          </div>
        </div>

        {/* Table container */}
        <div className="flex-1 min-h-0 px-4 py-4">
          <div 
            className="h-full overflow-auto border border-gray-300 rounded-lg"
            tabIndex={0}
            role="region"
            aria-label="Fragrance data table">
            <Table data={searchFilteredData} headers={headers}/>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App