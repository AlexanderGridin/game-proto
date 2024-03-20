export class Img {
  public element: HTMLImageElement;

  constructor(selector: string) {
    const img = document.querySelector<HTMLImageElement>(selector);

    if (!img) {
      throw new Error(
        `Unable to find img element by provided selector: ${selector}`,
      );
    }

    this.element = img;
  }
}
