import {format, formatDistanceToNow, isValid, parseISO} from 'date-fns';

export const formatTaskDate = (iso: string): string => {
  const date = parseISO(iso);
  return isValid(date) ? format(date, 'MMM d, yyyy h:mm a') : '';
};

export const formatRelativeDate = (iso: string): string => {
  const date = parseISO(iso);
  return isValid(date) ? formatDistanceToNow(date, {addSuffix: true}) : '';
};
