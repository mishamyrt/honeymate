type ParamsBuilder = (initial: AnimationParams) => AnimationParams;
enum AnimationDirection {
    top = "top",
    right = "right",
    bottom = "bottom",
    left = "left"
}
type AnimationEffect = 'zoom' | 'helix' | 'slide' | 'relax';
export interface AnimationParams {
    direction: AnimationDirection;
    duration: number;
    effect: AnimationEffect;
    expose: boolean;
    delay: number;
    scale: number;
    await: string;
    origin: AnimationDirection;
    offset: number;
    spin: boolean;
    spinSize: number;
    continue: boolean;
}
export function animate(target?: ParentNode, prepareParams?: ParamsBuilder): Promise<unknown>;
export function reset(target?: ParentNode): void;

//# sourceMappingURL=index.d.ts.map
