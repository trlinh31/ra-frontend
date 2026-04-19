import { restaurantMockStore } from "@/modules/masterData/restaurant/data/restaurant.mock-store";
import { tourGuideMockStore } from "@/modules/masterData/tourGuide/data/tourGuide.mock-store";
import type { DayFormValues } from "@/modules/tour/day/schemas/day.schema";
import Section from "@/shared/components/common/Section";
import { Badge } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { MapPin, UserRound, UtensilsCrossed } from "lucide-react";
import { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";

export default function DayStaffSection() {
  const { setValue } = useFormContext<DayFormValues>();

  const tourGuideIds = useWatch<DayFormValues, "tourGuideIds">({ name: "tourGuideIds" }) ?? [];
  const restaurantIds = useWatch<DayFormValues, "restaurantIds">({ name: "restaurantIds" }) ?? [];

  const allGuides = useMemo(() => tourGuideMockStore.getAll().filter((g) => g.isActive), []);
  const allRestaurants = useMemo(() => restaurantMockStore.getAll().filter((r) => r.isActive), []);

  const toggleGuide = (id: string) => {
    const next = tourGuideIds.includes(id) ? tourGuideIds.filter((x) => x !== id) : [...tourGuideIds, id];
    setValue("tourGuideIds", next, { shouldDirty: true });
  };

  const toggleRestaurant = (id: string) => {
    const next = restaurantIds.includes(id) ? restaurantIds.filter((x) => x !== id) : [...restaurantIds, id];
    setValue("restaurantIds", next, { shouldDirty: true });
  };

  return (
    <Section title='4. Hướng dẫn viên & Nhà hàng'>
      <Tabs defaultValue='guide'>
        <TabsList className='mb-4'>
          <TabsTrigger value='guide' className='gap-2'>
            <UserRound size={14} />
            Hướng dẫn viên
            {tourGuideIds.length > 0 && (
              <Badge variant='secondary' className='ml-1 px-1.5 min-w-5 h-5 text-xs'>
                {tourGuideIds.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value='restaurant' className='gap-2'>
            <UtensilsCrossed size={14} />
            Nhà hàng
            {restaurantIds.length > 0 && (
              <Badge variant='secondary' className='ml-1 px-1.5 min-w-5 h-5 text-xs'>
                {restaurantIds.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value='guide'>
          {allGuides.length === 0 ? (
            <p className='text-muted-foreground text-sm'>Không có hướng dẫn viên nào.</p>
          ) : (
            <div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
              {allGuides.map((guide) => {
                const checked = tourGuideIds.includes(guide.id);
                return (
                  <label
                    key={guide.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${checked ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}>
                    <Checkbox checked={checked} onCheckedChange={() => toggleGuide(guide.id)} className='mt-0.5' />
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium text-sm leading-tight'>{guide.name}</p>
                      <p className='mt-0.5 text-muted-foreground text-xs'>{guide.language}</p>
                      <div className='flex items-center gap-1 mt-1 text-muted-foreground text-xs'>
                        <MapPin size={11} />
                        <span>
                          {guide.city}, {guide.country}
                        </span>
                      </div>
                      <p className='mt-1 font-medium text-primary text-xs'>{guide.pricePerDay.toLocaleString("vi-VN")} ₫/ngày</p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value='restaurant'>
          {allRestaurants.length === 0 ? (
            <p className='text-muted-foreground text-sm'>Không có nhà hàng nào.</p>
          ) : (
            <div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
              {allRestaurants.map((restaurant) => {
                const checked = restaurantIds.includes(restaurant.id);
                return (
                  <label
                    key={restaurant.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${checked ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}>
                    <Checkbox checked={checked} onCheckedChange={() => toggleRestaurant(restaurant.id)} className='mt-0.5' />
                    <div className='flex-1 min-w-0'>
                      <p className='font-medium text-sm leading-tight'>{restaurant.name}</p>
                      <p className='mt-0.5 text-muted-foreground text-xs'>{restaurant.menuItems.length} món trong menu</p>
                      <div className='flex items-center gap-1 mt-1 text-muted-foreground text-xs'>
                        <MapPin size={11} />
                        <span>
                          {restaurant.city}, {restaurant.country}
                        </span>
                      </div>
                      <p className='mt-0.5 text-muted-foreground text-xs'>Sức chứa: {restaurant.capacity} người</p>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Section>
  );
}
