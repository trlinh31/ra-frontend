import GroupTourBasicInfoSection from "@/modules/masterData/groupTour/components/GroupTourBasicInfoSection";
import GroupTourContentSection from "@/modules/masterData/groupTour/components/GroupTourContentSection";
import GroupTourLocationSection from "@/modules/masterData/groupTour/components/GroupTourLocationSection";
import { mapGroupTourDataToFormValues } from "@/modules/masterData/groupTour/mappers/group-tour-form.mapper";
import { groupTourSchema, type GroupTourFormValues } from "@/modules/masterData/groupTour/schemas/group-tour.schema";
import type { GroupTour } from "@/modules/masterData/groupTour/types/group-tour.type";
import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";

interface GroupTourFormProps {
  defaultValues?: GroupTour | undefined;
  onSubmit: (values: GroupTourFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  isEdit?: boolean;
}

export default function GroupTourForm({ defaultValues, onSubmit, onCancel, isSubmitting, isEdit }: GroupTourFormProps) {
  const form = useForm<GroupTourFormValues>({
    resolver: zodResolver(groupTourSchema),
    defaultValues: mapGroupTourDataToFormValues(defaultValues),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <GroupTourLocationSection />
        <GroupTourBasicInfoSection />
        <GroupTourContentSection />

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
