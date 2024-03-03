import { generateId } from "../../utils";

type UINotification = {
  id: string;
  text: string;
};

const WRAPPER_SELECTOR = ".notifications";

const wrapper = document.querySelector<HTMLDivElement>(WRAPPER_SELECTOR);

if (!wrapper) {
  throw new Error(
    `Notifications wrapper not found! QuerySelector: ${WRAPPER_SELECTOR}`,
  );
}

let notificationsToRender: UINotification[] = [];

const render = () => {
  if (!notificationsToRender.length) {
    wrapper.innerHTML = "";
    wrapper.style.display = "none";
    return;
  }

  const notifications = notificationsToRender.map(
    (notification) => `<li>${notification.text}</li>`,
  );

  if (wrapper.style.display === "none") {
    wrapper.style.display = "block";
  }

  wrapper.innerHTML = `<ul>${notifications.join("")}</ul>`;
};

const push = (text: string): void => {
  const notification: UINotification = {
    id: generateId(),
    text,
  };

  notificationsToRender.push(notification);
  render();

  setTimeout(() => {
    notificationsToRender = notificationsToRender.filter(
      (n) => n.id !== notification.id,
    );
    render();
  }, 3000);
};

export const UINotifications = {
  push,
};
