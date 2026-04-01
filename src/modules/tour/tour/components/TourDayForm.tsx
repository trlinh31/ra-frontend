interface TourDayRowProps {
  index: number;
  total: number;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function TourDayRow({ index, total, onRemove, onMoveUp, onMoveDown }: TourDayRowProps) {
  // const { control, watch } = useFormContext<TourFormValues>();
  // const days = useMemo(() => dayMockStore.getAll(), []);
  // const dayOptions = useMemo(() => days.map((d) => ({ label: d.title, value: d.id })), [days]);
  // const selectedDayId = watch(`days.${index}.dayId`);
  // const selectedDay = days.find((d) => d.id === selectedDayId);
  // const dayTotals = useMemo(() => {
  //   if (!selectedDay) return {} as Record<Currency, number>;
  //   return selectedDay.services.reduce(
  //     (acc, s) => {
  //       acc[s.currency] = (acc[s.currency] ?? 0) + s.unitPrice;
  //       return acc;
  //     },
  //     {} as Record<Currency, number>
  //   );
  // }, [selectedDay]);
  // return (
  //   <div className='flex items-center gap-3 bg-background px-3 py-2 border rounded-md'>
  //     {/* <GripVertical className='w-4 h-4 text-muted-foreground shrink-0' /> */}
  //     <span className='w-14 font-medium text-sm shrink-0'>Ngày {index + 1}</span>
  //     {selectedDay && (
  //       <Badge variant='outline' className='shrink-0'>
  //         {selectedDay.code}
  //       </Badge>
  //     )}
  //     <Controller
  //       control={control}
  //       name={`days.${index}.dayId`}
  //       render={({ field, fieldState }) => (
  //         <Field data-invalid={fieldState.invalid} className='flex-1 min-w-52'>
  //           <AppSelect options={dayOptions} value={field.value} onChange={field.onChange} placeholder='Chọn ngày hành trình' />
  //           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
  //         </Field>
  //       )}
  //     />
  //     {selectedDay && (
  //       <Badge variant='secondary' className='shrink-0'>
  //         {selectedDay.services.length} dịch vụ
  //       </Badge>
  //     )}
  //     {selectedDay &&
  //       Object.entries(dayTotals).map(([currency, total]) => (
  //         <Badge key={currency} variant='outline' className='bg-green-50 border-green-300 text-green-700 shrink-0'>
  //           {currency === "VND" ? formatNumberVN(total) : total.toLocaleString()} {currency}
  //         </Badge>
  //       ))}
  //     <div className='flex items-center gap-1 shrink-0'>
  //       {/* <Button type='button' variant='ghost' size='icon' onClick={onMoveUp} disabled={index === 0}>
  //         <ChevronUp className='w-4 h-4' />
  //       </Button>
  //       <Button type='button' variant='ghost' size='icon' onClick={onMoveDown} disabled={index === total - 1}>
  //         <ChevronDown className='w-4 h-4' />
  //       </Button> */}
  //       <ActionButton action='delete' onClick={onRemove} />
  //     </div>
  //   </div>
  // );
}

export default function TourDayForm() {
  // const { control, formState } = useFormContext<TourFormValues>();
  // const { fields, append, remove, move } = useFieldArray({ control, name: "days" });
  // const handleAdd = () => append({ dayId: "" as unknown as string, order: fields.length + 1 });
  // if (fields.length === 0) {
  //   return (
  //     <Section type='dashed' className='text-muted-foreground text-xs text-center'>
  //       <p className='mb-3'>Chưa có ngày nào. Nhấn &quot;Thêm ngày&quot; để bắt đầu.</p>
  //       <Button type='button' onClick={handleAdd}>
  //         <PlusCircle className='w-4 h-4' />
  //         Thêm ngày
  //       </Button>
  //       {formState.errors.days?.message && <p className='mt-2 font-normal text-destructive text-sm'>{formState.errors.days.message}</p>}
  //     </Section>
  //   );
  // }
  // return (
  //   <div className='space-y-4'>
  //     {fields.map((field, index) => (
  //       <TourDayRow
  //         key={field.id}
  //         index={index}
  //         total={fields.length}
  //         onRemove={() => remove(index)}
  //         onMoveUp={() => move(index, index - 1)}
  //         onMoveDown={() => move(index, index + 1)}
  //       />
  //     ))}
  //     <div className='text-center'>
  //       <Button type='button' onClick={handleAdd}>
  //         <PlusCircle className='w-4 h-4' />
  //         Thêm ngày
  //       </Button>
  //     </div>
  //     {formState.errors.days?.message && <p className='font-normal text-destructive text-sm'>{formState.errors.days.message}</p>}
  //   </div>
  // );
}
