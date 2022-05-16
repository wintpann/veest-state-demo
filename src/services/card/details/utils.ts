import { ROUTES } from '@/routes';

export const getCardRoute = (id: string) => ROUTES.CARD.replace(':id', id);
