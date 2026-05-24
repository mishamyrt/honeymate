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
  const container = document.createElement("div");
  const spinner = getSpinner(params);
  container.appendChild(spinner);
  Object.assign(container.style, {
    top: `${rect.top + scrollTop}px`,
    left: `${rect.left + scrollLeft}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    willChange: "opacity",
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
 * Creates an SVG spinner element with the specified size and color
 */
export function getSpinner(params: SpinnerParams): SVGElement {
  const spinner: SVGElement = createSvgElement("svg", {
    width: params.size,
    height: params.size,
    viewBox: "0 0 100 100",
    preserveAspectRatio: "xMidYMid",
    style: "animation: honeySpin 1.7s linear infinite",
  });

  const circle: SVGElement = createSvgElement("circle", {
    cx: 50,
    cy: 50,
    r: 35,
    "stroke-width": 10,
    fill: "none",
    stroke: params.color,
    "stroke-dasharray": "90 60",
  });
  spinner.appendChild(circle);

  return spinner;
}

/**
 * Creates an SVG element with the specified tag and attributes
 */
export function createSvgElement(
  tag: string,
  attrs: Record<string, string | number>,
): SVGElement {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [key, value] of Object.entries(attrs)) {
    element.setAttribute(key, value.toString());
  }
  return element;
}
