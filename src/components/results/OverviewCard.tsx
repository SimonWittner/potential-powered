import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const OverviewCard = () => {
  const [processedData, setProcessedData] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('processedData');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setProcessedData(data);
        console.log('Loaded processed data in Overview:', data);
      } catch (error) {
        console.error('Error parsing processed data:', error);
      }
    }
  }, []);

  const renderValue = (value: any): string => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Overview</h2>
      <ScrollArea className="h-[400px] w-full rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedData && Object.entries(processedData).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell className="font-medium">{key}</TableCell>
                <TableCell>{renderValue(value)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </Card>
  );
};

export default OverviewCard;