import { toast } from 'react-toastify';
import { service, inject, countRenderedTimes } from '@/veest';
import { NotificationService } from '@services/notification/type';

export const createNotificationService = service((): NotificationService => {
    const apiRequestError = () =>
        toast.error('Something went wrong. Please contact your administrator');
    countRenderedTimes('service');

    const info = (message: string) => toast.info(message);
    const warn = (message: string) => toast.warn(message);
    const success = (message: string) => toast.success(message);

    return { apiRequestError, info, warn, success };
});

export const injectNotificationService = () => inject<NotificationService>()('notificationService');
