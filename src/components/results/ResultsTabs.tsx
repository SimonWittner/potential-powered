
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RevenueStackingTab from "./tabs/RevenueStackingTab";
import PeakShavingTab from "./tabs/PeakShavingTab";
import SelfConsumptionTab from "./tabs/SelfConsumptionTab";

const ResultsTabs = () => {
  return (
    <Tabs defaultValue="revenue-stacking" className="w-full">
      <TabsList className="grid w-full grid-cols-3 p-0 bg-[#F1F1F1]">
        <TabsTrigger value="revenue-stacking" className="text-lg font-medium rounded-b-none text-black data-[state=active]:bg-white data-[state=active]:shadow-sm">
          Revenue Stacking
        </TabsTrigger>
        <TabsTrigger value="peak-shaving" className="text-lg font-medium rounded-b-none text-black data-[state=active]:bg-white data-[state=active]:shadow-sm">
          Peak Shaving
        </TabsTrigger>
        <TabsTrigger value="self-consumption" className="text-lg font-medium rounded-b-none text-black data-[state=active]:bg-white data-[state=active]:shadow-sm">
          Self-Consumption
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="revenue-stacking" className="mt-0 bg-white rounded-b-lg shadow-sm">
        <RevenueStackingTab />
      </TabsContent>

      <TabsContent value="peak-shaving" className="mt-0 bg-white rounded-b-lg shadow-sm">
        <PeakShavingTab />
      </TabsContent>

      <TabsContent value="self-consumption" className="mt-0 bg-white rounded-b-lg shadow-sm">
        <SelfConsumptionTab />
      </TabsContent>
    </Tabs>
  );
};

export default ResultsTabs;
