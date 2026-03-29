import Section from "@/shared/components/common/Section";
import FormRichTextEditor from "@/shared/components/form/FormRichTextEditor";
import FormTextarea from "@/shared/components/form/FormTextarea";

export default function GroupTourContentSection() {
  return (
    <Section title='2. Nội dung & Ghi chú'>
      <div className='gap-4 grid grid-cols-1'>
        <FormRichTextEditor name='content' label='Nội dung' placeholder='Nhập mô tả chi tiết về tour...' />
        <FormTextarea name='notes' label='Ghi chú' />
      </div>
    </Section>
  );
}
