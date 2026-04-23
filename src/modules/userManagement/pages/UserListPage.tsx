import { PATHS } from "@/app/routes/route.constant";
import UserRoleBadge from "@/modules/userManagement/components/UserRoleBadge";
import { USER_ROLE_DEPARTMENT, USER_ROLE_OPTIONS } from "@/modules/userManagement/constants/user.constant";
import { userMockStore } from "@/modules/userManagement/data/user.mock-store";
import type { User } from "@/modules/userManagement/types/user.type";
import { AppTable } from "@/shared/components/common/AppTable";
import ActionButton from "@/shared/components/table/ActionButton";
import TableToolbar from "@/shared/components/table/TableToolbar";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import { useConfirm } from "@/shared/contexts/ConfirmContext";
import type { ColumnDef } from "@tanstack/react-table";
import { Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_FILTERS = {
  search: "",
  role: "",
};

export default function UserListPage() {
  const navigate = useNavigate();
  const { confirm } = useConfirm();

  const [users, setUsers] = useState<User[]>(() => userMockStore.getAll());
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = filters.search.toLowerCase();
      if (q && !u.fullName.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q) && !u.code.toLowerCase().includes(q)) return false;
      if (filters.role && u.role !== filters.role) return false;
      return true;
    });
  }, [users, filters]);

  const handleAdd = () => navigate(PATHS.USER_MANAGEMENT.USER_CREATE);
  const handleEdit = (user: User) => navigate(PATHS.USER_MANAGEMENT.USER_EDIT.replace(":id", user.id));

  const handleToggleActive = (user: User) => {
    userMockStore.toggleActive(user.id);
    setUsers(userMockStore.getAll());
  };

  const handleDelete = async (user: User) => {
    const ok = await confirm({
      description: `Bạn có chắc chắn muốn xóa người dùng "${user.fullName}" không? Hành động này không thể hoàn tác.`,
    });
    if (!ok) return;
    userMockStore.delete(user.id);
    setUsers(userMockStore.getAll());
  };

  const columns: ColumnDef<User>[] = [
    { id: "index", header: "STT", cell: ({ row }) => row.index + 1 },
    { header: "Mã", accessorKey: "code" },
    { header: "Họ và tên", accessorKey: "fullName" },
    { header: "Email", accessorKey: "email" },
    { header: "Số điện thoại", accessorKey: "phone" },
    {
      header: "Vai trò",
      accessorKey: "role",
      cell: ({ row }) => <UserRoleBadge role={row.original.role} />,
    },
    {
      header: "Phòng ban",
      accessorKey: "role",
      id: "department",
      cell: ({ row }) => USER_ROLE_DEPARTMENT[row.original.role],
    },
    {
      header: "Hoạt động",
      accessorKey: "isActive",
      enableSorting: false,
      cell: ({ row }) => <Switch checked={row.original.isActive} onCheckedChange={() => handleToggleActive(row.original)} />,
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

  return (
    <div className='space-y-4'>
      <TableToolbar title='Quản lý người dùng' description='Danh sách tài khoản người dùng trong hệ thống' icon={Users} onAdd={handleAdd} />

      <div className='flex flex-wrap gap-3'>
        <Input
          className='w-72'
          placeholder='Tìm theo tên, email, mã...'
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
        />
        <Select value={filters.role || "all"} onValueChange={(v) => setFilters((f) => ({ ...f, role: v === "all" ? "" : v }))}>
          <SelectTrigger className='w-56'>
            <SelectValue placeholder='Tất cả vai trò' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tất cả vai trò</SelectItem>
            {USER_ROLE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AppTable columns={columns} data={filteredUsers} />
    </div>
  );
}
