import { confirmedTourMockStore } from "@/modules/sales/confirmedTour/data/confirmed-tour.mock-store";
import type { ConfirmedTour } from "@/modules/sales/confirmedTour/types/confirmed-tour.type";
import { userMockStore } from "@/modules/userManagement/data/user.mock-store";
import AppSelect from "@/shared/components/common/AppSelect";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Textarea } from "@/shared/components/ui/textarea";
import { useState } from "react";

interface AssignTourDialogProps {
  tour: ConfirmedTour | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssigned: () => void;
  isReassign?: boolean;
}

const operatorOptions = userMockStore
  .getAll()
  .filter((u) => u.role === "OPERATOR" && u.isActive)
  .map((u) => ({ label: u.fullName, value: u.id }));

export default function AssignTourDialog({ tour, open, onOpenChange, onAssigned, isReassign = false }: AssignTourDialogProps) {
  const [operatorId, setOperatorId] = useState("");
  const [operationNote, setOperationNote] = useState("");
  const [operatorError, setOperatorError] = useState(false);

  const handleClose = () => {
    setOperatorId("");
    setOperationNote("");
    setOperatorError(false);
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (!operatorId) {
      setOperatorError(true);
      return;
    }
    if (!tour) return;
    confirmedTourMockStore.assign(tour.id, operatorId, operationNote);
    handleClose();
    onAssigned();
  };

  if (!tour) return null;

  const selectedOperatorName = userMockStore.getById(operatorId)?.fullName;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>{isReassign ? "Reassign Operator Vận hành" : "Assign Tour cho Vận hành"}</DialogTitle>
        </DialogHeader>

        <div className='space-y-4 py-2'>
          <div className='space-y-1 bg-muted/40 p-3 rounded-md text-sm'>
            <p>
              <span className='text-muted-foreground'>Mã tour: </span>
              <span className='font-medium'>{tour.code}</span>
            </p>
            <p>
              <span className='text-muted-foreground'>Đoàn khách: </span>
              <span className='font-medium'>{tour.customerName}</span>
            </p>
            <p>
              <span className='text-muted-foreground'>Ngày khởi hành: </span>
              <span className='font-medium'>{tour.departureDate}</span>
            </p>
          </div>

          <Field data-invalid={operatorError}>
            <FieldLabel>
              {isReassign ? "Operator mới" : "Operator phụ trách"} <span className='text-red-500'>*</span>
            </FieldLabel>
            <AppSelect
              options={operatorOptions}
              value={operatorId}
              onChange={(val) => {
                setOperatorId(String(val));
                setOperatorError(false);
              }}
              placeholder='Chọn nhân viên vận hành'
            />
            {operatorError && <FieldError errors={[{ message: "Vui lòng chọn operator" }]} />}
          </Field>

          <Field>
            <FieldLabel>Ghi chú cho Vận hành</FieldLabel>
            <Textarea
              value={operationNote}
              onChange={(e) => setOperationNote(e.target.value)}
              placeholder='Nhập lưu ý, yêu cầu đặc biệt cho operator...'
              rows={3}
            />
          </Field>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={!operatorId}>
            {selectedOperatorName ? `Assign cho ${selectedOperatorName}` : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
