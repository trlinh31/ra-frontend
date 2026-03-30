import { PATHS } from "@/app/routes/route.constant";
import EntranceFeeForm from "@/modules/masterData/entranceFee/components/EntranceFeeForm";
import { entranceFeeMockStore } from "@/modules/masterData/entranceFee/data/entrance-fee.mock-store";
import { mapEntranceFeeFormValuesToPayload } from "@/modules/masterData/entranceFee/mappers/entrance-fee-form.mapper";
import type { EntranceFeeFormValues } from "@/modules/masterData/entranceFee/schemas/entrance-fee.schema";
import PageHeader from "@/shared/components/common/PageHeader";
import { useNavigate, useParams } from "react-router-dom";

export default function EditEntranceFeePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEdit = Boolean(id);
  const item = id ? entranceFeeMockStore.getItemById(id) : undefined;

  const handleSubmit = (values: EntranceFeeFormValues) => {
    if (isEdit && id) {
      entranceFeeMockStore.updateItem(id, mapEntranceFeeFormValuesToPayload(values));
    } else {
      entranceFeeMockStore.createItem(mapEntranceFeeFormValuesToPayload(values));
    }

    handleCancel();
  };

  const handleCancel = () => navigate(PATHS.MASTER_DATA.ENTRANCE_FEE);

  return (
    <div className='space-y-6'>
      <PageHeader
        title={isEdit ? "Cập nhật Phí vào cổng" : "Thêm mới Phí vào cổng"}
        description={isEdit ? `Cập nhật thông tin cho Phí vào cổng ${item?.code}` : "Điền thông tin để tạo mới Phí vào cổng"}
      />
      <EntranceFeeForm defaultValues={item} onSubmit={handleSubmit} onCancel={handleCancel} isEdit={isEdit} />
    </div>
  );
}
