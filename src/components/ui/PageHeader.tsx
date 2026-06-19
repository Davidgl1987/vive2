import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PageHeader = ({
  title,
  subtitle,
  backTo,
}: {
  title: string;
  subtitle?: string;
  backTo?: string;
}) => (
  <div className="mb-6 flex items-start gap-4">
    {backTo ? (
      <Link
        className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-ink shadow-sm ring-1 ring-line"
        to={backTo}
      >
        <ArrowLeft size={18} />
      </Link>
    ) : null}
    <div>
      <h1 className="page-title text-[2rem]">{title}</h1>
      {subtitle ? <p className="page-subtitle mt-2">{subtitle}</p> : null}
    </div>
  </div>
);
