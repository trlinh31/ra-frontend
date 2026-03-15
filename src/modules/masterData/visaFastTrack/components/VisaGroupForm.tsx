import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { visaGroupSchema, type VisaGroupFormValues } from "../schemas/visa-fast-track.schema";

type Props = {
  defaultValues?: Partial<VisaGroupFormValues>;
  onSubmit: (values: VisaGroupFormValues) => void;
  onCancel: () => void;
};

export default function VisaGroupForm({ defaultValues, onSubmit, onCancel }: Props) {
  const form = useForm<VisaGroupFormValues>({
    resolver: zodResolver(visaGroupSchema) as Resolver<VisaGroupFormValues>,
    defaultValues: { name: "", ...defaultValues },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên nhóm</FormLabel>
              <FormControl>
                <Input placeholder='Ví dụ: ĐÓN, TIỀN, Dịch vụ thêm...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end gap-3 pt-2'>
          <Button type='button' variant='outline' onClick={onCancel}>
            Hủy
          </Button>
          <Button type='submit'>Lưu</Button>
        </div>
      </form>
    </Form>
  );
}
