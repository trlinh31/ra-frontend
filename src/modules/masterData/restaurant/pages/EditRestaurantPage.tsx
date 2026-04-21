import { PATHS } from "@/app/routes/route.constant";
import AddonServiceSection from "@/modules/masterData/addon/components/AddonServiceSection";
import RestaurantForm from "@/modules/masterData/restaurant/components/RestaurantForm";
import { restaurantMockStore } from "@/modules/masterData/restaurant/data/restaurant.mock-store";
import { mapRestaurantFormValuesToPayload } from "@/modules/masterData/restaurant/mappers/restaurant-form.mapper";
import type { RestaurantFormValues } from "@/modules/masterData/restaurant/schemas/restaurant.schema";
import PageHeader from "@/shared/components/common/PageHeader";
import { useNavigate, useParams } from "react-router-dom";

export default function EditRestaurantPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEdit = Boolean(id);
  const item = id ? restaurantMockStore.getById(id) : undefined;

  const handleSubmit = (values: RestaurantFormValues) => {
    if (isEdit && id) {
      restaurantMockStore.update(id, mapRestaurantFormValuesToPayload(values));
    } else {
      restaurantMockStore.create(mapRestaurantFormValuesToPayload(values));
    }
    navigate(PATHS.MASTER_DATA.RESTAURANT);
  };

  const handleCancel = () => navigate(PATHS.MASTER_DATA.RESTAURANT);

  return (
    <div className='space-y-6'>
      <PageHeader
        title={isEdit ? "Cập nhật nhà hàng" : "Thêm mới nhà hàng"}
        description={isEdit ? `Cập nhật thông tin cho nhà hàng ${item?.code}` : "Điền thông tin để tạo mới nhà hàng"}
      />
      <RestaurantForm defaultValues={item} onSubmit={handleSubmit} onCancel={handleCancel} isEdit={isEdit} />

      {isEdit && id && (
        <AddonServiceSection entityType="restaurant" entityId={id} />
      )}
    </div>
  );
}
