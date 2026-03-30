import { supplierMockStore } from "@/modules/masterData/supplier/data/supplier.mock-store";
import Section from "@/shared/components/common/Section";
import FormCurrencyInput from "@/shared/components/form/FormCurrencyInput";
import FormInput from "@/shared/components/form/FormInput";
import FormSelect from "@/shared/components/form/FormSelect";
import { CURRENCY_OPTIONS } from "@/shared/constants/currency.constant";
import { useMemo } from "react";

export default function GroupTourBasicInfoSection() {
  const suppliersOptions = useMemo(() => supplierMockStore.getAll().map((supplier) => ({ label: supplier.name, value: supplier.name })), []);

  return (
    <Section title='2. Thông tin cơ bản'>
      <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
        <FormInput name='code' label='Mã tour' placeholder='VD: GT001' required />
        <FormInput name='tourName' label='Tên tour' placeholder='VD: Tour Hà Nội - Hạ Long' required />
        <FormSelect name='supplier' options={suppliersOptions} label='Nhà cung cấp' required />
        <div className='flex gap-4'>
          <FormSelect name='currency' options={CURRENCY_OPTIONS} label='Đơn vị tiền tệ' required />
          <FormCurrencyInput name='price' label='Giá tiền' required />
        </div>
      </div>
    </Section>
  );
}
