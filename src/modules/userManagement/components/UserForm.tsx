import { USER_ROLE_OPTIONS } from "@/modules/userManagement/constants/user.constant";
import { userSchema, type UserFormValues } from "@/modules/userManagement/schemas/user.schema";
import type { User } from "@/modules/userManagement/types/user.type";
import Section from "@/shared/components/common/Section";
import FormInput from "@/shared/components/form/FormInput";
import FormSelect from "@/shared/components/form/FormSelect";
import FormTextarea from "@/shared/components/form/FormTextarea";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";

interface UserFormProps {
  defaultValues?: User;
  generatedCode?: string;
  onSubmit: (values: UserFormValues) => void;
  onCancel: () => void;
  isEdit?: boolean;
  isSubmitting?: boolean;
}

function mapUserToFormValues(user?: User, generatedCode?: string): UserFormValues {
  return {
    code: user?.code ?? generatedCode ?? "",
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    role: user?.role ?? "SELLER",
    isActive: user?.isActive ?? true,
    note: user?.note ?? "",
  };
}

export default function UserForm({ defaultValues, generatedCode, onSubmit, onCancel, isEdit, isSubmitting }: UserFormProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: mapUserToFormValues(defaultValues, generatedCode),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <Section title='1. Thông tin tài khoản'>
          <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
            <FormInput name='code' label='Mã người dùng' required disabled={isEdit} />
            <FormInput name='fullName' label='Họ và tên' placeholder='VD: Nguyễn Văn A' required />
            <FormInput name='email' label='Email' placeholder='VD: user@ratravel.vn' required />
            <FormInput name='phone' label='Số điện thoại' placeholder='VD: 0901234567' />
          </div>
        </Section>

        <Section title='2. Phân quyền'>
          <div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
            <FormSelect name='role' label='Vai trò' required options={USER_ROLE_OPTIONS} placeholder='Chọn vai trò...' />
          </div>
        </Section>

        <Section title='3. Ghi chú'>
          <FormTextarea name='note' label='Ghi chú nội bộ' placeholder='VD: Nhân viên mới, phụ trách khu vực miền Nam...' rows={3} />
        </Section>

        <div className='flex justify-start gap-3'>
          <Button type='button' variant='outline' size='lg' onClick={onCancel}>
            Hủy
          </Button>
          <Button type='submit' size='lg' disabled={isSubmitting}>
            <Save />
            {isEdit ? "Cập nhật" : "Lưu"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
