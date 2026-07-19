/**
 * OHMYTRIP design tokens — extracted verbatim from the production CSS.
 * Source of truth: src/styles/tokens.css (see docs/design-system.md).
 */
export const colors = {
  black: '#000',
  white: '#fff',
  gray1: '#f5f5f5',
  gray2: '#e0e0e0',
  gray3: '#ccc',
  gray4: '#888',
  gray5: '#666',
  gray6: '#333',
  orange: '#ef7f29', // brand primary
  green: '#008f42', // secondary (hover-secondary)
  red: '#ff0000',
  blue: '#005eff', // mobile bundle only
  disabled: '#ebebeb',
  headerBgDesktop: '#f3f3f3',
} as const;

export const fontSizes = {
  desktop: { small: 12, base: 14, medium: 16, large: 18, extra: 22, big: 26, black: 32 },
  mobile: { small: 10, base: 12, medium: 14, large: 16, extra: 18, big: 26, black: 32 },
} as const;

export const fontWeights = {
  thin: 100,
  extlight: 200,
  light: 300,
  base: 400,
  medium: 500,
  semi: 600,
  bold: 700,
  extra: 800,
  black: 900,
} as const;

export const radii = {
  thin: 5,
  light: 10,
  small: 15,
  medium: 20,
  big: 25,
} as const;

export const lineHeights = { lh140: '140%', lh150: '150%', lh160: '160%' } as const;

export const shadows = {
  card: '5px 5px 10px 0 rgba(0, 0, 0, 0.1)',
  panel: '5px 5px 15px 0 rgba(0, 0, 0, 0.1)',
  dropdown: '0 4px 8px 0 rgba(0, 0, 0, 0.1)',
  dropdownAlt: '0 3px 6px 0 rgba(0, 0, 0, 0.1)',
} as const;

export const layout = {
  contentWidthDesktop: 1200,
  headerHeightDesktop: 74,
  headerHeightMobile: 54,
  mobileBodyMinWidth: 320,
  mobileBodyMaxWidth: 768,
  zHeader: 20,
  zLayer: 100, // popovers/modals
  zTopmost: 2100,
} as const;

export const buttons = {
  sm: { height: 36, paddingX: 20, fontSize: 14, fontWeight: 500, radius: radii.light },
  md: { height: 40, paddingX: 20, fontSize: 14, fontWeight: 600, radius: radii.small },
  lg: { height: 52, paddingX: 20, fontSize: 16, fontWeight: 600, radius: radii.small },
} as const;

export const fontFamily =
  'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif';

export const bodyLetterSpacing = '-0.5px';
