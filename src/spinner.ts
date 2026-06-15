export interface SpinnerParams {
  size: number;
  color: string;
}

/**
 * Creates spinner (loader) for given rect.
 * Returns a function that removes the spinner from the DOM.
 */
export function insertSpinner(rect: DOMRect, params: SpinnerParams) {
  const { scrollTop, scrollLeft } = document.documentElement;
  const container = createSpinner(params);
  Object.assign(container.style, {
    top: rect.top + scrollTop + "px",
    left: rect.left + scrollLeft + "px",
    width: rect.width + "px",
    height: rect.height + "px",
    position: "absolute",
    display: "grid",
    placeContent: "center",
    transition: "opacity .23s ease-out",
  });

  document.body.appendChild(container);

  return () => {
    container.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(container);
    }, 500);
  };
}

/**
 * Creates div with svg spinner inside.
 */
export function createSpinner(params: SpinnerParams): HTMLDivElement {
  const container = document.createElement("div");
  container.innerHTML =
    '<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">' +
    '<circle cx="50" cy="50" r="35" stroke-width="10" fill="none" stroke-dasharray="90 60">' +
    "</circle>" +
    "</svg>";

  const svg = container.firstElementChild as SVGElement;
  Object.assign(svg.style, {
    width: params.size,
    height: params.size,
  });

  const circle = svg.firstElementChild as SVGElement;
  circle.style.stroke = params.color;

  svg.animate([{ transform: "rotate(0turn)" }, { transform: "rotate(1turn)" }], {
    duration: 850,
    iterations: Infinity,
  });

  return container;
}
