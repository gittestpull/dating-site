declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        alt?: string;
        'auto-rotate'?: boolean;
        'camera-controls'?: boolean;
        'shadow-intensity'?: string;
        poster?: string;
        loading?: string;
        reveal?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'environment-image'?: string;
        exposure?: string;
        'field-of-view'?: string;
        'max-camera-orbit'?: string;
        'min-camera-orbit'?: string;
        'camera-orbit'?: string;
        'camera-target'?: string;
        'interaction-prompt'?: string;
        'interaction-prompt-style'?: string;
        'interaction-prompt-threshold'?: string;
      },
      HTMLElement
    >;
  }
}
