import type { DayFormValues } from "@/modules/tour/day/schemas/day.schema";
import { SERVICE_TYPE_CONFIG, ServiceType } from "@/modules/tour/day/types/day.type";
import Section from "@/shared/components/common/Section";
import ActionButton from "@/shared/components/table/ActionButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Controller, useFormContext } from "react-hook-form";
import AddonServiceFields from "./AddonServiceFields";
import CustomServiceFields from "./CustomServiceFields";
import EntranceFeeServiceFields from "./EntranceFeeServiceFields";
import FlightServiceFields from "./FlightServiceFields";
import HotelServiceFields from "./HotelServiceFields";
import RestaurantServiceFields from "./RestaurantServiceFields";
import TourGuideServiceFields from "./TourGuideServiceFields";
import TransportServiceFields from "./TransportServiceFields";
import VisaServiceFields from "./VisaServiceFields";

interface DayServiceRowProps {
  index: number;
  onRemove: () => void;
}

const HIDDEN_TOP_LEVEL = new Set<ServiceType>([ServiceType.CUSTOM]);

export default function DayServiceRow({ index, onRemove }: DayServiceRowProps) {
  const { control, setValue } = useFormContext<DayFormValues>();

  const handleServiceTypeChange = (newType: string) => {
    setValue(`services.${index}.name`, "");
    setValue(`services.${index}.unitPrice`, 0);
    setValue(`services.${index}.currency`, "");
    setValue(`services.${index}.hotelDetail`, undefined as never);
    setValue(`services.${index}.transportDetail`, undefined as never);
    setValue(`services.${index}.visaDetail`, undefined as never);
    setValue(`services.${index}.entranceFeeDetail`, undefined as never);
    setValue(`services.${index}.flightDetail`, undefined as never);
    setValue(`services.${index}.tourGuideDetail`, undefined as never);
    setValue(`services.${index}.restaurantDetail`, undefined as never);
    setValue(`services.${index}.addonDetail`, undefined as never);
    setValue(`services.${index}.customDetail`, undefined as never);
    setValue(`services.${index}.serviceType`, newType as DayFormValues["services"][number]["serviceType"]);
  };

  const handleAddonSubTabChange = (subTab: string) => {
    setValue(`services.${index}.addonDetail`, undefined as never);
    setValue(`services.${index}.customDetail`, undefined as never);
    setValue(`services.${index}.name`, "");
    setValue(`services.${index}.unitPrice`, 0);
    setValue(`services.${index}.currency`, "");
    setValue(`services.${index}.serviceType`, subTab as DayFormValues["services"][number]["serviceType"]);
  };

  return (
    <Section type='dashed' borderColor='red'>
      <div className='flex justify-between items-center'>
        <p className='font-semibold text-sm'>Dịch vụ #{index + 1}</p>
        <ActionButton action='delete' onClick={onRemove} />
      </div>

      <Controller
        control={control}
        name={`services.${index}.serviceType`}
        render={({ field }) => {
          const outerTabValue = field.value === ServiceType.CUSTOM ? ServiceType.ADDON : field.value;

          return (
            <Tabs value={outerTabValue} onValueChange={handleServiceTypeChange}>
              <TabsList className='flex-wrap gap-1 mt-3 h-auto'>
                {(Object.entries(SERVICE_TYPE_CONFIG) as [ServiceType, (typeof SERVICE_TYPE_CONFIG)[ServiceType]][])
                  .filter(([key]) => !HIDDEN_TOP_LEVEL.has(key))
                  .map(([key, cfg]) => (
                    <TabsTrigger key={key} value={key}>
                      {cfg.icon}
                      {cfg.label}
                    </TabsTrigger>
                  ))}
              </TabsList>

              <TabsContent value={ServiceType.HOTEL}>
                <HotelServiceFields index={index} />
              </TabsContent>

              <TabsContent value={ServiceType.TRANSPORT}>
                <TransportServiceFields index={index} />
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

              <TabsContent value={ServiceType.TOUR_GUIDE}>
                <TourGuideServiceFields index={index} />
              </TabsContent>

              <TabsContent value={ServiceType.RESTAURANT}>
                <RestaurantServiceFields index={index} />
              </TabsContent>

              <TabsContent value={ServiceType.ADDON}>
                <Tabs value={field.value === ServiceType.CUSTOM ? ServiceType.CUSTOM : ServiceType.ADDON} onValueChange={handleAddonSubTabChange}>
                  <TabsList className='mt-3 w-full'>
                    <TabsTrigger value={ServiceType.ADDON} className='flex-1'>
                      Có sẵn
                    </TabsTrigger>
                    <TabsTrigger value={ServiceType.CUSTOM} className='flex-1'>
                      Tùy chỉnh
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value={ServiceType.ADDON}>
                    <AddonServiceFields index={index} />
                  </TabsContent>

                  <TabsContent value={ServiceType.CUSTOM}>
                    <CustomServiceFields index={index} />
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          );
        }}
      />
    </Section>
  );
}
