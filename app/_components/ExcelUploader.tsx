"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from 'lucide-react';
import { SheetData } from "@/types/excel-table";


interface ExcelUploaderProps {
  setXmlFileList: (data: SheetData | null) => void;
}

export default function ExcelUploader({ setXmlFileList }: ExcelUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // For loading state
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    setLoading(true); 

    if (file) {
      
      const validFileTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      if (!validFileTypes.includes(file.type)) {
        setError("Please upload a valid Excel file (.xlsx or .xls).");
        setLoading(false); 
        setXmlFileList(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });

          const sheetData: SheetData = {};
          workbook.SheetNames.forEach((sheetName) => {
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as SheetData[string];
            if (jsonData.length > 0) {
              sheetData[sheetName] = jsonData;
            }
          });

          if (Object.keys(sheetData).length === 0) {
            setError("The uploaded Excel file is empty or contains no valid data.");
            setXmlFileList(null);
          } else {
            setXmlFileList(sheetData);
            
            sessionStorage.setItem("excelData", JSON.stringify(sheetData));
          }
        } catch (err) {
          console.error("Error parsing Excel file:", err);
          setError("Error parsing Excel file. Please make sure it's a valid Excel file.");
          setXmlFileList(null);
        } finally {
          setLoading(false); 
        }
      };

      reader.onerror = () => {
        setError("Error reading the file. Please try again.");
        setXmlFileList(null);
        setLoading(false); 
      };

      reader.readAsArrayBuffer(file);
    } else {
      setLoading(false); 
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Excel File</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="flex-1"
            disabled={loading} 
          />
          <Button
            disabled={loading}
            onClick={() => {
              const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
              fileInput?.click(); 
            }}
          >
            <Upload className="mr-2 h-4 w-4" />
            {loading ? "Uploading..." : "Upload"}
          </Button>
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </CardContent>
    </Card>
  );
}
