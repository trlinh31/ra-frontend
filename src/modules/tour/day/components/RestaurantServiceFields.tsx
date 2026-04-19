import { useCities } from "@/modules/masterData/country/hooks/useCities";
import { useCountries } from "@/modules/masterData/country/hooks/useCountries";
import { restaurantMockStore } from "@/modules/masterData/restaurant/data/restaurant.mock-store";
import { useNumberOfPeople } from "@/modules/tour/day/contexts/NumberOfPeopleContext";
import type { DayFormValues } from "@/modules/tour/day/schemas/day.schema";
import AppSelect from "@/shared/components/common/AppSelect";
import FormSelect from "@/shared/components/form/FormSelect";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import InlinePriceInput from "./InlinePriceInput";

interface RestaurantServiceFieldsProps {
  index: number;
}

export default function RestaurantServiceFields({ index }: RestaurantServiceFieldsProps) {
  const { control, setValue } = useFormContext<DayFormValues>();
  const numberOfPeople = useNumberOfPeople();

  const [filterCountry, setFilterCountry] = useState("");
  const [filterCity, setFilterCity] = useState("");

  const restaurantId = useWatch({ control, name: `services.${index}.restaurantDetail.restaurantId` });

  const allRestaurants = useMemo(() => restaurantMockStore.getAll().filter((r) => r.isActive), []);

  const { data: countries = [] } = useCountries();
  const countryOptions = useMemo(() => countries.map((c) => ({ label: c.country, value: c.country })), [countries]);

  const { data: cities = [] } = useCities(filterCountry);
  const cityOptions = useMemo(() => cities.map((city) => ({ label: city, value: city })), [cities]);

  const restaurantOptions = useMemo(() => {
    let items = allRestaurants;
    if (filterCountry) items = items.filter((r) => r.country === filterCountry);
    if (filterCity) items = items.filter((r) => r.city === filterCity);
    return items.map((r) => ({ label: r.name, value: r.id }));
  }, [allRestaurants, filterCountry, filterCity]);

  const selectedRestaurant = useMemo(() => allRestaurants.find((r) => r.id === restaurantId), [allRestaurants, restaurantId]);

  const menuTotal = useMemo(() => selectedRestaurant?.menuItems.reduce((sum, item) => sum + item.price, 0) ?? 0, [selectedRestaurant]);

  const prevRestaurantIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (restaurantId === prevRestaurantIdRef.current) return;
    prevRestaurantIdRef.current = restaurantId;
    if (selectedRestaurant) {
      setValue(`services.${index}.name`, selectedRestaurant.name, { shouldValidate: true });
      setValue(`services.${index}.unitPrice`, menuTotal * numberOfPeople, { shouldValidate: true });
      setValue(`services.${index}.currency`, "VND", { shouldValidate: true });
    }
  }, [restaurantId, selectedRestaurant, menuTotal, numberOfPeople, index, setValue]);

  return (
    <div className='space-y-4 mt-3'>
      <div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
        <Field>
          <FieldLabel>Lọc theo quốc gia</FieldLabel>
          <AppSelect
            value={filterCountry}
            options={countryOptions}
            placeholder='Tất cả quốc gia'
            onChange={(v) => {
              setFilterCountry(v);
              setFilterCity("");
            }}
          />
        </Field>

        <Field>
          <FieldLabel>Lọc theo thành phố</FieldLabel>
          <AppSelect value={filterCity} options={cityOptions} placeholder='Tất cả thành phố' disabled={!filterCountry} onChange={setFilterCity} />
        </Field>
      </div>

      <FormSelect name={`services.${index}.restaurantDetail.restaurantId`} label='Nhà hàng' options={restaurantOptions} required />

      {selectedRestaurant && (
        <div className='space-y-2'>
          <div className='space-y-1 bg-muted/50 p-3 rounded-md text-sm'>
            <p className='text-muted-foreground'>
              Địa điểm:{" "}
              <span className='font-medium text-foreground'>
                {selectedRestaurant.city}, {selectedRestaurant.country}
              </span>
            </p>
            <p className='text-muted-foreground'>
              Sức chứa: <span className='font-medium text-foreground'>{selectedRestaurant.capacity} người</span>
            </p>
          </div>

          <div className='border rounded-md overflow-hidden text-sm'>
            <table className='w-full'>
              <thead>
                <tr className='bg-muted text-muted-foreground'>
                  <th className='px-3 py-2 font-medium text-left'>Tên món</th>
                  <th className='px-3 py-2 font-medium text-right'>Giá</th>
                </tr>
              </thead>
              <tbody>
                {selectedRestaurant.menuItems.map((item, i) => (
                  <tr key={i} className='border-t'>
                    <td className='px-3 py-1.5'>{item.name}</td>
                    <td className='px-3 py-1.5 text-right'>{formatNumberVN(item.price)} VND</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className='bg-muted/50 border-t font-semibold'>
                  <td className='px-3 py-2'>Tổng/người</td>
                  <td className='px-3 py-2 text-primary text-right'>{formatNumberVN(menuTotal)} VND</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      <InlinePriceInput
        index={index}
        breakdownText={selectedRestaurant && numberOfPeople > 0 ? `${formatNumberVN(menuTotal)} VND/người × ${numberOfPeople} người` : undefined}
      />
    </div>
  );
}
