import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { entranceFeeGroupSchema, type EntranceFeeGroupFormValues } from "../schemas/entrance-fee.schema";

type Props = {
  defaultValues?: Partial<EntranceFeeGroupFormValues>;
  onSubmit: (values: EntranceFeeGroupFormValues) => void;
  onCancel: () => void;
};

export default function EntranceFeeGroupForm({ defaultValues, onSubmit, onCancel }: Props) {
  const form = useForm<EntranceFeeGroupFormValues>({
    resolver: zodResolver(entranceFeeGroupSchema) as Resolver<EntranceFeeGroupFormValues>,
    defaultValues: { code: "", name: "", ...defaultValues },
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
                <Input placeholder='Ví dụ: I, II, III...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên nhóm (không bắt buộc)</FormLabel>
              <FormControl>
                <Input placeholder='Tên mô tả nhóm...' {...field} />
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
