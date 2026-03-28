import { PATHS } from "@/app/routes/route.constant";
import SupplierForm from "@/modules/masterData/supplier/components/SupplierForm";
import { supplierMockStore } from "@/modules/masterData/supplier/data/supplier.mock-store";
import { mapSupplierFormValuesToPayload } from "@/modules/masterData/supplier/mappers/supplier-form.mapper";
import type { SupplierFormValues } from "@/modules/masterData/supplier/schemas/supplier.schema";
import PageHeader from "@/shared/components/common/PageHeader";
import { useNavigate, useParams } from "react-router-dom";

export default function EditSupplierPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEdit = Boolean(id);
  const item = id ? supplierMockStore.getById(id) : undefined;

  const handleSubmit = (values: SupplierFormValues) => {
    if (isEdit && id) {
      supplierMockStore.update(id, mapSupplierFormValuesToPayload(values));
    } else {
      supplierMockStore.create(mapSupplierFormValuesToPayload(values));
    }
    navigate(PATHS.MASTER_DATA.SUPPLIER);
  };

  const handleCancel = () => navigate(PATHS.MASTER_DATA.SUPPLIER);

  return (
    <div className='space-y-6'>
      <PageHeader
        title={isEdit ? "Cập nhật nhà cung cấp" : "Thêm mới nhà cung cấp"}
        description={isEdit ? `Cập nhật thông tin cho nhà cung cấp ${item?.code}` : "Điền thông tin để tạo mới nhà cung cấp"}
      />
      <SupplierForm defaultValues={item} onSubmit={handleSubmit} onCancel={handleCancel} isEdit={isEdit} />
    </div>
  );
}
