import { HeaderNotificationContextDirective } from "./header-notification-context.directive";

describe('MyContextMenuDirective', () => {
  it('should create an instance', () => {
    const directive = new HeaderNotificationContextDirective(null, null, null);
    expect(directive).toBeTruthy();
  });
});
