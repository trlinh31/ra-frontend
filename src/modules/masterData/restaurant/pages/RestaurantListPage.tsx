import { PATHS } from "@/app/routes/route.constant";
import RestaurantFilterBar from "@/modules/masterData/restaurant/components/RestaurantFilterBar";
import { restaurantMockStore } from "@/modules/masterData/restaurant/data/restaurant.mock-store";
import type { ComboPackage, Restaurant } from "@/modules/masterData/restaurant/types/restaurant.type";
import { AppTable } from "@/shared/components/common/AppTable";
import ActionButton from "@/shared/components/table/ActionButton";
import TableToolbar from "@/shared/components/table/TableToolbar";
import { Switch } from "@/shared/components/ui/switch";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import type { ColumnDef } from "@tanstack/react-table";
import { UtensilsCrossed } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const DEFAULT_FILTERS = {
  name: "",
  country: "",
  city: "",
};

export default function RestaurantListPage() {
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => restaurantMockStore.getAll());
  const [filters, setFilters] = useState<typeof DEFAULT_FILTERS>(DEFAULT_FILTERS);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((item) => {
      if (filters.name && !item.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
      if (filters.country && item.country !== filters.country) return false;
      if (filters.city && item.city !== filters.city) return false;
      return true;
    });
  }, [restaurants, filters]);

  const handleAdd = () => navigate(PATHS.MASTER_DATA.RESTAURANT_CREATE);

  const handleEdit = (restaurant: Restaurant) => {
    navigate(PATHS.MASTER_DATA.RESTAURANT_EDIT.replace(":id", restaurant.id));
  };

  const handleDelete = async (restaurant: Restaurant) => {
    if (!restaurant) return;

    const ok = await confirm({
      description: "Bạn có chắc chắn muốn xóa nhà hàng này không? Hành động này không thể hoàn tác.",
    });

    if (!ok) return;

    restaurantMockStore.delete(restaurant.id);
    setRestaurants(restaurantMockStore.getAll());
  };

  const columns: ColumnDef<Restaurant>[] = [
    { id: "index", header: "STT", cell: ({ row }) => row.index + 1 },
    { header: "Quốc gia", accessorKey: "country" },
    { header: "Thành phố", accessorKey: "city" },
    { header: "Mã nhà hàng", accessorKey: "code" },
    { header: "Tên nhà hàng", accessorKey: "name" },
    { header: "Sức chứa", accessorKey: "capacity" },
    { header: "Số gói combo", accessorKey: "comboPackages", cell: ({ row }) => `${row.original.comboPackages.length} gói` },
    { header: "Email", accessorKey: "email" },
    { header: "Số điện thoại", accessorKey: "phone" },
    {
      header: "Hoạt động",
      accessorKey: "isActive",
      enableSorting: false,
      cell: ({ row }) => <Switch defaultChecked={row.original.isActive} />,
    },
    {
      id: "actions",
      header: "Hành động",
      enableSorting: false,
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <ActionButton action='edit' onClick={() => handleEdit(row.original)} />
          <ActionButton action='delete' onClick={() => handleDelete(row.original)} />
        </div>
      ),
    },
  ];

  const renderMenu = (restaurant: Restaurant) => {
    const comboColumns: ColumnDef<ComboPackage>[] = [
      { id: "index", header: "STT", cell: ({ row }) => row.index + 1, enableSorting: false },
      { header: "Tên gói combo", accessorKey: "name" },
    ];

    return (
      <div className='space-y-2'>
        <p className='mb-2 font-semibold text-muted-foreground text-xs uppercase'>Gói combo – {restaurant.name}</p>
        <AppTable columns={comboColumns} data={restaurant.comboPackages} enablePagination={false} />
      </div>
    );
  };

  return (
    <div className='space-y-4'>
      <TableToolbar title='Quản lý nhà hàng' description='Danh sách các nhà hàng của hệ thống' icon={UtensilsCrossed} onAdd={handleAdd} />
      <RestaurantFilterBar onFilter={setFilters} />
      <AppTable columns={columns} data={filteredRestaurants} enableExpanding renderExpandedRow={renderMenu} />
    </div>
  );
}
