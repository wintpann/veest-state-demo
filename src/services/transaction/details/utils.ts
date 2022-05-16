import { ROUTES } from '@/routes';

export const getTransactionRoute = (id: string) => ROUTES.TRANSACTION.replace(':id', id);
