import { PATHS } from "@/app/routes/route.constant";
import GroupTourForm from "@/modules/masterData/groupTour/components/GroupTourForm";
import { groupTourMockStore } from "@/modules/masterData/groupTour/data/group-tour.mock-store";
import { mapGroupTourFormValuesToPayload } from "@/modules/masterData/groupTour/mappers/group-tour-form.mapper";
import type { GroupTourFormValues } from "@/modules/masterData/groupTour/schemas/group-tour.schema";
import PageHeader from "@/shared/components/common/PageHeader";
import { useNavigate, useParams } from "react-router-dom";

export default function EditGroupTourPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEdit = Boolean(id);
  const item = id ? groupTourMockStore.getById(id) : undefined;

  const handleSubmit = (values: GroupTourFormValues) => {
    if (isEdit && id) {
      groupTourMockStore.update(id, mapGroupTourFormValuesToPayload(values));
    } else {
      groupTourMockStore.create(mapGroupTourFormValuesToPayload(values));
    }

    handleCancel();
  };

  const handleCancel = () => navigate(PATHS.MASTER_DATA.GROUP_TOUR);

  return (
    <div className='space-y-6'>
      <PageHeader
        title={isEdit ? "Cập nhật Nhóm Tour" : "Thêm mới Nhóm Tour"}
        description={isEdit ? `Cập nhật thông tin cho tour ${item?.code}` : "Điền thông tin để tạo mới nhóm tour"}
      />
      <GroupTourForm defaultValues={item} onSubmit={handleSubmit} onCancel={handleCancel} isEdit={isEdit} />
    </div>
  );
}
