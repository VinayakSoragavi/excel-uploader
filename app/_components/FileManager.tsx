"use client";

import { useState, useEffect } from "react";
import ExcelUploader from "./ExcelUploader";
// import ExcelTable from "./ExcelTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DownloadExcel from "./DownloadExcel";
import ExcelTable from "./ExcelTable";
import { SheetData } from "@/types/excel-table";
// import DownloadExcel from "./DownloadExcel";



export default function FileManager() {
  const [excelData, setExcelData] = useState<SheetData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    // Load data from session storage on mount
    const storedData = sessionStorage.getItem("excelData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setExcelData(parsedData);
      setActiveTab(Object.keys(parsedData)[0]);
    }
  }, []);

  const handleExcelDataUpdate = (newData: SheetData | null) => {
    setExcelData(newData);
    if (newData) {
      sessionStorage.setItem("excelData", JSON.stringify(newData));
      setActiveTab(Object.keys(newData)[0]);
    } else {
      sessionStorage.removeItem("excelData");
    }
  };

  const handleTableDataUpdate = (updatedData: SheetData) => {
    setExcelData(updatedData);
    sessionStorage.setItem("excelData", JSON.stringify(updatedData));
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Excel File Manager</h1>
      
      <ExcelUploader setXmlFileList={handleExcelDataUpdate} />

      {excelData && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {Object.keys(excelData).map((sheetName) => (
              <TabsTrigger key={sheetName} value={sheetName}>
                {sheetName}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.keys(excelData).map((sheetName) => (
            <TabsContent key={sheetName} value={sheetName}>
              <ExcelTable 
                excelData={excelData} 
                tab={sheetName} 
                onDataUpdate={handleTableDataUpdate}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}
      <DownloadExcel excelData={excelData}/>
    </div>
  );
}

