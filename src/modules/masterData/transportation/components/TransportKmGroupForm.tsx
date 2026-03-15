import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { transportKmGroupSchema, type TransportKmGroupFormValues } from "../schemas/transport-km.schema";

type Props = {
  defaultValues?: Partial<TransportKmGroupFormValues>;
  onSubmit: (values: TransportKmGroupFormValues) => void;
  onCancel: () => void;
};

export default function TransportKmGroupForm({ defaultValues, onSubmit, onCancel }: Props) {
  const form = useForm<TransportKmGroupFormValues>({
    resolver: zodResolver(transportKmGroupSchema) as Resolver<TransportKmGroupFormValues>,
    defaultValues: { code: "", title: "", ...defaultValues },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='code'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã nhóm</FormLabel>
              <FormControl>
                <Input placeholder='Ví dụ: A, B, C...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên nhóm</FormLabel>
              <FormControl>
                <Input placeholder='Ví dụ: TUYẾN ĐƯỜNG CLASSIC' {...field} />
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
