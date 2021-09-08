import { Jovo } from '@jovotech/framework';
import { PermissionStatus } from '../interfaces';
import { Alexa } from '../Alexa';

function permissionStatus(jovo: Jovo, type: 'reminders' | 'timers', status: PermissionStatus) {
  if (!(jovo instanceof Alexa)) {
    return false;
  }
  const request = (jovo as Alexa).$request;

  return (
    request.request?.type === 'Connections.Response' &&
    request.request.name === 'AskFor' &&
    request.request.payload?.permissionScope === `alexa::alerts:${type}:skill:readwrite` &&
    request.request.payload?.status === status
  );
}

export function isRemindersPermissionRequest(jovo: Jovo, status: PermissionStatus): boolean {
  return permissionStatus(jovo, 'reminders', status);
}

export function isRemindersPermissionAcceptedRequest(jovo: Jovo): boolean {
  return isRemindersPermissionRequest(jovo, 'ACCEPTED');
}

export function isRemindersPermissionDeniedRequest(jovo: Jovo): boolean {
  return isRemindersPermissionRequest(jovo, 'DENIED');
}
export function isRemindersPermissionNotAnsweredRequest(jovo: Jovo): boolean {
  if (!(jovo instanceof Alexa)) {
    return false;
  }
  const request = (jovo as Alexa).$request;

  return (
    request.request?.type === 'Connections.Response' &&
    request.request.name === 'AskFor' &&
    request.request.status?.code === '204'
  );
}

export function isTimersPermissionRequest(jovo: Jovo, status: PermissionStatus): boolean {
  return permissionStatus(jovo, 'timers', status);
}
export function isTimersPermissionAcceptedRequest(jovo: Jovo): boolean {
  return isTimersPermissionRequest(jovo, 'ACCEPTED');
}

export function isTimersPermissionDeniedRequest(jovo: Jovo): boolean {
  return isTimersPermissionRequest(jovo, 'DENIED');
}
export function isTimersPermissionNotAnsweredRequest(jovo: Jovo): boolean {
  return isTimersPermissionRequest(jovo, 'NOT_ANSWERED');
}
