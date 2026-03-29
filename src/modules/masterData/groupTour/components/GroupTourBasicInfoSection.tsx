import { useCities } from "@/modules/masterData/country/hooks/useCities";
import { useCountries } from "@/modules/masterData/country/hooks/useCountries";
import type { GroupTourFormValues } from "@/modules/masterData/groupTour/schemas/group-tour.schema";
import { supplierMockStore } from "@/modules/masterData/supplier/data/supplier.mock-store";
import Section from "@/shared/components/common/Section";
import FormCurrencyInput from "@/shared/components/form/FormCurrencyInput";
import FormInput from "@/shared/components/form/FormInput";
import FormSelect from "@/shared/components/form/FormSelect";
import FormSwitch from "@/shared/components/form/FormSwitch/FormSwitch";
import { CURRENCY_OPTIONS } from "@/shared/constants/currency.constant";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

export default function GroupTourBasicInfoSection() {
  const { watch } = useFormContext<GroupTourFormValues>();

  const { data: countries } = useCountries();
  const { data: cities } = useCities(watch("country") || "");

  const countriesOptions = useMemo(() => (countries ?? []).map((item) => ({ label: item.country, value: item.country })), [countries]);
  const citiesOptions = useMemo(() => (cities ?? []).map((city) => ({ label: city, value: city })), [cities]);
  const suppliersOptions = useMemo(() => supplierMockStore.getAll().map((supplier) => ({ label: supplier.name, value: supplier.name })), []);

  return (
    <Section title='1. Thông tin cơ bản'>
      <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
        <FormInput name='code' label='Mã tour' placeholder='VD: GT001' required />
        <FormInput name='tourName' label='Tên tour' placeholder='VD: Tour Hà Nội - Hạ Long' required />
        <FormSelect name='country' options={countriesOptions} label='Quốc gia' required />
        <FormSelect name='city' options={citiesOptions} label='Thành phố' disabled={!watch("country")} required />
        <FormSelect name='supplier' options={suppliersOptions} label='Nhà cung cấp' required />
        <FormSelect name='currency' options={CURRENCY_OPTIONS} label='Đơn vị tiền tệ' required />
        <FormCurrencyInput name='price' label='Giá tiền' required />
        <FormSwitch name='isActive' label='Hoạt động' />
      </div>
    </Section>
  );
}
