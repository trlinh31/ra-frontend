import type { SupplierFormValues } from "@/modules/masterData/supplier/schemas/supplier.schema";
import type { Supplier } from "@/modules/masterData/supplier/types/supplier.type";

export const mapSupplierDataToFormValues = (data: Supplier | undefined): SupplierFormValues => {
  return {
    code: data?.code ?? "",
    name: data?.name ?? "",
    country: data?.country ?? "",
    city: data?.city ?? "",
    address: data?.address ?? "",
    taxCode: data?.taxCode ?? "",
    email: data?.email ?? "",
    phone: data?.phone ?? "",
    isActive: data?.isActive ?? true,
  };
};

export const mapSupplierFormValuesToPayload = (values: SupplierFormValues): Omit<Supplier, "id"> => {
  return { ...values };
};
