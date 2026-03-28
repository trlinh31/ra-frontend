import { VISA_GROUP_OPTIONS } from "@/modules/masterData/visaFastTrack/constants/visa-group-options.constant";
import { VISA_PRICE_UNIT_OPTIONS } from "@/modules/masterData/visaFastTrack/constants/visa-price-unit-options.constant";
import FormCurrenctyInput from "@/shared/components/form/FormCurrenctyInput";
import FormInput from "@/shared/components/form/FormInput";
import FormSelect from "@/shared/components/form/FormSelect";
import FormTextarea from "@/shared/components/form/FormTextarea";
import ActionButton from "@/shared/components/table/ActionButton";
import { Button } from "@/shared/components/ui/button";
import { Save } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";



export default function VisaServiceForm() {
  const {control} = useFormContext();

  const {fields, append, remove} = useFieldArray({
    control,
    name: "services",
  });

  const handleAddService = () => {
    append({
      group: "",
      serviceName: "",
      price: 0,
      priceUnit: "USD",
      description: "",
      pickupLocation: "",
    });
  };
  if(fields.length === 0) {
    return (
      <div className='text-center text-muted-foreground'>
        <p className='mb-3'>Chưa có dịch vụ nào. Nhấn &quot;Thêm dịch vụ&quot; để bắt đầu.</p>
        <Button type='button' onClick={handleAddService}>
          <Save className='w-4 h-4' />
          Thêm dịch vụ
        </Button>
      </div>
    );
  }
    return (
      <div className='space-y-3'>
        {fields.map((field, index) => (
          <div key={field.id}>
            <div  className='flex gap-4 mb-3'>
              <FormSelect name={`services.${index}.group`} label='Nhóm' options={VISA_GROUP_OPTIONS} required />
              <FormInput name={`services.${index}.serviceName`} label='Tên dịch vụ' required />
              <FormCurrenctyInput name={`services.${index}.price`} label='Giá tiền' required />
              <FormSelect name={`services.${index}.priceUnit`} label='Đơn vị giá' options={VISA_PRICE_UNIT_OPTIONS} required />
            </div>
             <FormInput name={`services.${index}.pickupLocation`} label='Địa điểm đón' className="mb-3" />
             <FormTextarea name={`services.${index}.description`} label='Mô tả' className='sm:col-span-2' />
          

            <div className='flex justify-start items-start gap-3 mt-3'>
              <ActionButton action='add' onClick={handleAddService} />
              <ActionButton action='delete' onClick={() => remove(index)} />
            </div>
          </div>
        ))}
      </div>
    );
  // return (
  //   <Form {...form}>
  //     <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
  //       <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
  //         <FormInput name='provider' label='Nhà cung cấp' required />
  //         {/* <FormInput name='code' label='Mã dịch vụ' required /> */}
  //         <FormSelect name='group' label='Nhóm' options={VISA_GROUP_OPTIONS} required />
  //         <FormInput name='serviceName' label='Tên dịch vụ' required />
  //         <FormCurrenctyInput name='price' label='Giá tiền' required />
  //         <FormSelect name='priceUnit' label='Đơn vị giá' options={VISA_PRICE_UNIT_OPTIONS} required />

  //         <FormInput name='pickupLocation' label='Địa điểm đón' />
  //         <FormTextarea name='description' label='Mô tả' className='sm:col-span-2' />
  //       </div>

  //       <div className='flex justify-start gap-3'>
  //         <Button type='button' variant='outline' size='lg' onClick={onCancel}>
  //           Hủy
  //         </Button>

  //         <Button type='submit' size='lg' disabled={isSubmitting}>
  //           <Save />
  //           {isEdit ? "Cập nhật" : "Lưu"}
  //         </Button>
  //       </div>
  //     </form>
  //   </Form>
  // );
}
