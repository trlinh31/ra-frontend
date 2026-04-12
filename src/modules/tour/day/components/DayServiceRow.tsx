import type { DayFormValues } from "@/modules/tour/day/schemas/day.schema";
import { SERVICE_TYPE_CONFIG, ServiceType } from "@/modules/tour/day/types/day.type";
import Section from "@/shared/components/common/Section";
import ActionButton from "@/shared/components/table/ActionButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Controller, useFormContext } from "react-hook-form";
import EntranceFeeServiceFields from "./EntranceFeeServiceFields";
import FlightServiceFields from "./FlightServiceFields";
import GroupTourServiceFields from "./GroupTourServiceFields";
import HotelServiceFields from "./HotelServiceFields";
import TransportServiceFields from "./TransportServiceFields";
import VisaServiceFields from "./VisaServiceFields";

interface DayServiceRowProps {
  index: number;
  onRemove: () => void;
}

export default function DayServiceRow({ index, onRemove }: DayServiceRowProps) {
  const { control } = useFormContext<DayFormValues>();

  return (
    <Section type='dashed' borderColor='red'>
      <div className='flex justify-between items-center'>
        <p className='font-semibold text-sm'>Dịch vụ #{index + 1}</p>
        <ActionButton action='delete' onClick={onRemove} />
      </div>

      <Controller
        control={control}
        name={`services.${index}.serviceType`}
        render={({ field }) => (
          <Tabs value={field.value} onValueChange={field.onChange}>
            <TabsList className='flex-wrap gap-1 mt-3 h-auto'>
              {Object.entries(SERVICE_TYPE_CONFIG).map(([key, value]) => (
                <TabsTrigger key={key} value={key}>
                  {value.icon}
                  {value.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={ServiceType.HOTEL}>
              <HotelServiceFields index={index} />
            </TabsContent>

            <TabsContent value={ServiceType.TRANSPORT}>
              <TransportServiceFields index={index} />
            </TabsContent>

            <TabsContent value={ServiceType.GROUP_TOUR}>
              <GroupTourServiceFields index={index} />
            </TabsContent>

            <TabsContent value={ServiceType.VISA}>
              <VisaServiceFields index={index} />
            </TabsContent>

            <TabsContent value={ServiceType.ENTRANCE_FEE}>
              <EntranceFeeServiceFields index={index} />
            </TabsContent>

            <TabsContent value={ServiceType.FLIGHT}>
              <FlightServiceFields index={index} />
            </TabsContent>
          </Tabs>
        )}
      />
    </Section>
  );
}
