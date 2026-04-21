import { addonServiceSchema, type AddonServiceFormValues } from "@/modules/masterData/addon/schemas/addon.schema";
import type { AddonService } from "@/modules/masterData/addon/types/addon.type";
import FormCurrencyInput from "@/shared/components/form/FormCurrencyInput";
import FormInput from "@/shared/components/form/FormInput";
import FormSelect from "@/shared/components/form/FormSelect";
import FormTextarea from "@/shared/components/form/FormTextarea";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Form } from "@/shared/components/ui/form";
import { CURRENCY_OPTIONS } from "@/shared/constants/currency.constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface AddonServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: AddonService;
  onSave: (values: AddonServiceFormValues) => void;
}

const emptyValues: AddonServiceFormValues = {
  name: "",
  price: undefined as unknown as number,
  currency: "VND",
  description: "",
};

export default function AddonServiceDialog({ open, onOpenChange, defaultValues, onSave }: AddonServiceDialogProps) {
  const isEdit = Boolean(defaultValues);

  const form = useForm<AddonServiceFormValues>({
    resolver: zodResolver(addonServiceSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (open) {
      if (defaultValues) {
        form.reset({
          name: defaultValues.name,
          price: defaultValues.price,
          currency: defaultValues.currency,
          description: defaultValues.description,
        });
      } else {
        form.reset(emptyValues);
      }
    }
  }, [open, defaultValues, form]);

  const handleSubmit = (values: AddonServiceFormValues) => {
    onSave(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-130'>
        <DialogHeader>
          <DialogTitle className='font-bold'>{isEdit ? "Cập nhật dịch vụ" : "Thêm mới dịch vụ"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <FormInput name='name' label='Tên dịch vụ' placeholder='Nhập tên dịch vụ' required />

            <div className='gap-4 grid grid-cols-2'>
              <FormCurrencyInput name='price' label='Đơn giá' placeholder='Nhập đơn giá' required />
              <FormSelect name='currency' label='Tiền tệ' options={CURRENCY_OPTIONS} required />
            </div>

            <FormTextarea name='description' label='Mô tả' placeholder='Mô tả chi tiết về dịch vụ (tùy chọn)' />

            <DialogFooter className='pt-2'>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type='submit'>
                <Save className='w-4 h-4' />
                {isEdit ? "Cập nhật" : "Lưu"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
