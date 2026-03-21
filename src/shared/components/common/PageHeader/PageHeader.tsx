import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className='flex items-center gap-2'>
      <Button variant='secondary' size='icon-lg' onClick={() => navigate(-1)}>
        <ArrowLeft className='w-4 h-4' />
      </Button>

      <div>
        <h1 className='font-bold text-2xl tracking-tight'>{title}</h1>
        {description && <p className='text-muted-foreground text-sm'>{description}</p>}
      </div>
    </div>
  );
}
