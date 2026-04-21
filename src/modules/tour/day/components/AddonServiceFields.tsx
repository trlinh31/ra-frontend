import { ADDON_ENTITY_LABELS } from "@/modules/masterData/addon/constants/addon.constant";
import { addonMockStore } from "@/modules/masterData/addon/data/addon.mock-store";
import type { AddonEntityType } from "@/modules/masterData/addon/types/addon.type";
import { entranceFeeMockStore } from "@/modules/masterData/entranceFee/data/entrance-fee.mock-store";
import { flightMockStore } from "@/modules/masterData/flights/data/flight.mock-store";
import { groupTourMockStore } from "@/modules/masterData/groupTour/data/group-tour.mock-store";
import { hotelMockStore } from "@/modules/masterData/hotel/data/hotel.mock-store";
import { restaurantMockStore } from "@/modules/masterData/restaurant/data/restaurant.mock-store";
import { tourGuideMockStore } from "@/modules/masterData/tourGuide/data/tourGuide.mock-store";
import { transportMockStore } from "@/modules/masterData/transportation/data/transportation.mock-store";
import { visaFastTrackMockStore } from "@/modules/masterData/visaFastTrack/data/visa-fast-track.mock-store";
import { useNumberOfPeople } from "@/modules/tour/day/contexts/NumberOfPeopleContext";
import type { DayFormValues } from "@/modules/tour/day/schemas/day.schema";
import AppSelect from "@/shared/components/common/AppSelect";
import type { SelectOption } from "@/shared/components/common/AppSelect/AppSelect";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { CURRENCIES } from "@/shared/constants/currency.constant";
import { formatNumberVN } from "@/shared/helpers/formatNumberVN";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import InlinePriceInput from "./InlinePriceInput";

interface AddonServiceFieldsProps {
  index: number;
}

// Lấy danh sách entity options theo loại
function getEntityOptions(entityType: AddonEntityType): SelectOption[] {
  switch (entityType) {
    case "hotel":
      return hotelMockStore.getAll().map((h) => ({ label: h.name, value: h.id }));
    case "restaurant":
      return restaurantMockStore.getAll().map((r) => ({ label: r.name, value: r.id }));
    case "transport":
      return transportMockStore.getAll().map((t) => ({ label: t.name, value: t.id }));
    case "flight":
      return flightMockStore.getAll().map((f) => ({
        label: `${f.airline}: ${f.origin} → ${f.destination}`,
        value: f.id,
      }));
    case "tour_guide":
      return tourGuideMockStore.getAll().map((g) => ({ label: g.name, value: g.id }));
    case "visa":
      return visaFastTrackMockStore.getAll().map((v) => ({ label: v.provider, value: v.id }));
    case "entrance_fee":
      return entranceFeeMockStore.getAllItems().map((e) => ({ label: e.serviceName, value: e.id }));
    case "group_tour":
      return groupTourMockStore.getAll().map((gt) => ({ label: gt.tourName, value: gt.id }));
    default:
      return [];
  }
}

const entityTypeOptions: SelectOption[] = (Object.entries(ADDON_ENTITY_LABELS) as [AddonEntityType, string][]).map(([value, label]) => ({
  label,
  value,
}));

export default function AddonServiceFields({ index }: AddonServiceFieldsProps) {
  const { control, setValue, formState } = useFormContext<DayFormValues>();
  const numberOfPeople = useNumberOfPeople();

  const addonEntityType = useWatch({ control, name: `services.${index}.addonDetail.entityType` });
  const addonEntityId = useWatch({ control, name: `services.${index}.addonDetail.entityId` });
  const addonId = useWatch({ control, name: `services.${index}.addonDetail.addonId` });

  const [localEntityType, setLocalEntityType] = useState<AddonEntityType | "">((addonEntityType as AddonEntityType) || "");
  const [localEntityId, setLocalEntityId] = useState<string>(addonEntityId || "");

  const entityOptions = useMemo(() => (localEntityType ? getEntityOptions(localEntityType as AddonEntityType) : []), [localEntityType]);

  const addonOptions = useMemo<SelectOption[]>(() => {
    if (!localEntityType || !localEntityId) return [];
    return addonMockStore.getByEntity(localEntityType as AddonEntityType, localEntityId).map((a) => ({
      label: a.name,
      value: a.id,
    }));
  }, [localEntityType, localEntityId]);

  const prevKeyRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    const qty = numberOfPeople > 0 ? numberOfPeople : 1;
    const key = addonId ? `${addonId}-${qty}` : undefined;
    if (!key || key === prevKeyRef.current) return;
    prevKeyRef.current = key;

    const addon = addonMockStore.getById(addonId!);
    if (!addon) return;

    setValue(`services.${index}.name`, addon.name, { shouldValidate: true });
    setValue(`services.${index}.currency`, addon.currency, { shouldValidate: true });
    setValue(`services.${index}.unitPrice`, addon.price * qty, { shouldValidate: true });
  }, [addonId, numberOfPeople, index, setValue]);

  const handleEntityTypeChange = (val: string) => {
    setLocalEntityType(val as AddonEntityType);
    setLocalEntityId("");
    setValue(`services.${index}.addonDetail.entityType`, val, { shouldValidate: false });
    setValue(`services.${index}.addonDetail.entityId`, "");
    setValue(`services.${index}.addonDetail.addonId`, "");
    setValue(`services.${index}.name`, "");
    setValue(`services.${index}.unitPrice`, 0);
    setValue(`services.${index}.currency`, "");
  };

  const handleEntityChange = (val: string) => {
    setLocalEntityId(val);
    setValue(`services.${index}.addonDetail.entityId`, val, { shouldValidate: false });
    setValue(`services.${index}.addonDetail.addonId`, "");
    setValue(`services.${index}.name`, "");
    setValue(`services.${index}.unitPrice`, 0);
    setValue(`services.${index}.currency`, "");
  };

  const handleAddonChange = (val: string) => {
    setValue(`services.${index}.addonDetail.addonId`, val, { shouldValidate: true });
  };

  const addonDetailErrors = formState.errors?.services?.[index]?.addonDetail;
  const selectedAddon = addonId ? addonMockStore.getById(addonId) : undefined;
  const currencySymbol = selectedAddon ? (CURRENCIES.find((c) => c.code === selectedAddon.currency)?.symbol ?? selectedAddon.currency) : "";
  const qty = numberOfPeople > 0 ? numberOfPeople : 1;
  const breakdownText = selectedAddon ? `${qty} người × ${formatNumberVN(selectedAddon.price)} ${currencySymbol}` : undefined;

  return (
    <div className='space-y-3 mt-1 pt-3 border-t'>
      {/* Chọn loại entity */}
      <div className='gap-3 grid grid-cols-1 sm:grid-cols-2'>
        <Field>
          <FieldLabel>
            Loại dịch vụ <span className='text-red-500'>*</span>
          </FieldLabel>
          <AppSelect
            options={entityTypeOptions}
            value={localEntityType}
            onChange={handleEntityTypeChange}
            placeholder='Chọn loại (Khách sạn, Nhà hàng...)'
          />
          {addonDetailErrors?.entityType && <FieldError errors={[addonDetailErrors.entityType]} />}
        </Field>

        {/* Chọn entity cụ thể */}
        <Field>
          <FieldLabel>
            Đối tác / Nhà cung cấp <span className='text-red-500'>*</span>
          </FieldLabel>
          <AppSelect
            options={entityOptions}
            value={localEntityId}
            onChange={handleEntityChange}
            placeholder={localEntityType ? "Chọn đối tác" : "Chọn loại trước"}
            disabled={!localEntityType}
          />
          {addonDetailErrors?.entityId && <FieldError errors={[addonDetailErrors.entityId]} />}
        </Field>
      </div>

      <Field>
        <FieldLabel>
          Dịch vụ thêm <span className='text-red-500'>*</span>
        </FieldLabel>
        {addonOptions.length === 0 && localEntityId ? (
          <p className='px-1 text-muted-foreground text-xs italic'>Đối tác này chưa có dịch vụ thêm nào đang hoạt động.</p>
        ) : (
          <AppSelect
            options={addonOptions}
            value={addonId || ""}
            onChange={handleAddonChange}
            placeholder={localEntityId ? "Chọn dịch vụ thêm" : "Chọn đối tác trước"}
            disabled={!localEntityId || addonOptions.length === 0}
          />
        )}
        {addonDetailErrors?.addonId && <FieldError errors={[addonDetailErrors.addonId]} />}
      </Field>

      {addonId && <InlinePriceInput index={index} breakdownText={breakdownText} />}
    </div>
  );
}
