import { type TourFormValues } from "@/modules/tour/tour/schemas/tour.schema";
import type { Tour } from "@/modules/tour/tour/types/tour.type";

interface TourFormProps {
  defaultValues?: Tour | undefined;
  onSubmit: (values: TourFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  isEdit?: boolean;
}

export default function TourForm({ defaultValues, onSubmit, onCancel, isSubmitting, isEdit }: TourFormProps) {
  // const form = useForm<TourFormValues>({
  //   resolver: zodResolver(tourSchema),
  //   defaultValues: mapTourDataToFormValues(defaultValues),
  // });

  return (
    // <Form {...form}>
    //   <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
    //     <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
    //       <FormInput name='code' label='Mã tour' required />
    //       <FormInput name='name' label='Tên tour' required />
    //       <FormTextarea name='description' label='Mô tả' className='sm:col-span-2' />
    //     </div>

    //     <Section title='Lịch trình ngày'>
    //       <TourDayForm />
    //     </Section>

    //     <div className='flex justify-start gap-3'>
    //       <Button type='button' variant='outline' size='lg' onClick={onCancel}>
    //         Hủy
    //       </Button>
    //       <Button type='submit' size='lg' disabled={isSubmitting}>
    //         <Save />
    //         {isEdit ? "Cập nhật" : "Lưu"}
    //       </Button>
    //     </div>
    //   </form>
    // </Form>
    <></>
  );
}
