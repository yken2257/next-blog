import { parseISO, format } from 'date-fns';

interface FormattedDateProps {
  dateString: string;
}

export default function FormattedDate({ dateString }: FormattedDateProps) {
  const date = parseISO(dateString);
  return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>;
}