
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RevenueStackingTab from "./tabs/RevenueStackingTab";
import PeakShavingTab from "./tabs/PeakShavingTab";
import SelfConsumptionTab from "./tabs/SelfConsumptionTab";

const ResultsTabs = () => {
  return (
    <Tabs defaultValue="revenue-stacking" className="w-full">
      <TabsList className="grid w-full grid-cols-3 p-0 bg-transparent">
        <TabsTrigger value="revenue-stacking" className="text-lg font-medium rounded-b-none text-white data-[state=active]:bg-white/95 data-[state=active]:backdrop-blur-sm data-[state=active]:text-black">
          Revenue Stacking
        </TabsTrigger>
        <TabsTrigger value="peak-shaving" className="text-lg font-medium rounded-b-none text-white data-[state=active]:bg-white/95 data-[state=active]:backdrop-blur-sm data-[state=active]:text-black">
          Peak Shaving
        </TabsTrigger>
        <TabsTrigger value="self-consumption" className="text-lg font-medium rounded-b-none text-white data-[state=active]:bg-white/95 data-[state=active]:backdrop-blur-sm data-[state=active]:text-black">
          Self-Consumption
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="revenue-stacking" className="mt-0">
        <RevenueStackingTab />
      </TabsContent>

      <TabsContent value="peak-shaving" className="mt-0">
        <PeakShavingTab />
      </TabsContent>

      <TabsContent value="self-consumption" className="mt-0">
        <SelfConsumptionTab />
      </TabsContent>
    </Tabs>
  );
};

export default ResultsTabs;
