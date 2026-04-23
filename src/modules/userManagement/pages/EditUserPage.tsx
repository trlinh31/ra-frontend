import { PATHS } from "@/app/routes/route.constant";
import UserForm from "@/modules/userManagement/components/UserForm";
import { userMockStore } from "@/modules/userManagement/data/user.mock-store";
import type { UserFormValues } from "@/modules/userManagement/schemas/user.schema";
import PageHeader from "@/shared/components/common/PageHeader";
import { useNavigate, useParams } from "react-router-dom";

export default function EditUserPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEdit = Boolean(id);
  const item = id ? userMockStore.getById(id) : undefined;
  const generatedCode = !isEdit ? userMockStore.generateCode() : undefined;

  const handleSubmit = (values: UserFormValues) => {
    if (isEdit && id) {
      userMockStore.update(id, values);
    } else {
      userMockStore.create(values);
    }
    navigate(PATHS.USER_MANAGEMENT.USERS);
  };

  const handleCancel = () => navigate(PATHS.USER_MANAGEMENT.USERS);

  return (
    <div className='space-y-6'>
      <PageHeader
        title={isEdit ? "Cập nhật người dùng" : "Thêm người dùng mới"}
        description={isEdit ? `Cập nhật thông tin người dùng ${item?.code ?? ""}` : "Điền thông tin để tạo tài khoản người dùng mới"}
      />
      <UserForm defaultValues={item} generatedCode={generatedCode} onSubmit={handleSubmit} onCancel={handleCancel} isEdit={isEdit} />
    </div>
  );
}
