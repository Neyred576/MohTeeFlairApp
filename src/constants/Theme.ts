export const Colors = {
    // === ROSE-GOLD BRAND PALETTE ===
    primary: '#D49B85',          // Brightened Rose-gold
    primaryLight: '#F2C1B4',     // Softer Rose-gold light
    primaryDark: '#B8735A',      // Richer Rose-gold dark
    primaryCream: '#F7DCD3',

    // Backgrounds (dark screens)
    background: '#060505',       // True black background
    dark: '#0E0C0C',             // Card backgrounds
    dark2: '#1C1918',            // Secondary dark surfaces

    // Backgrounds (light screens)
    cream: '#FBF5EF',            // Light screen backgrounds
    warmWhite: '#FCF8F2',
    muted: '#AA9590',            // Brightened for transition visibility

    // Glass effects
    glass: 'rgba(255,255,255,0.06)',
    glassBorder: 'rgba(255,255,255,0.10)',
    glassRose: 'rgba(201,133,106,0.08)',
    glassRoseBorder: 'rgba(201,133,106,0.15)',

    // Text
    text: '#FBF5EF',             // Primary text on dark
    textDark: '#0E0C0C',         // Primary text on light
    textSecondary: 'rgba(212,155,133,0.85)',
    textMuted: '#AA9590',

    // Aliases for backward compat
    surface: 'rgba(28,25,24,0.85)',
    surfaceLight: 'rgba(242,208,196,0.08)',
    overlay: 'rgba(6,5,5,0.5)',
    border: 'rgba(255,255,255,0.08)',
    white: '#FBF5EF',
    black: '#060505',
    gray: '#8A7570',
    error: '#FF5252',
    success: '#4CAF50',

    // Gradients
    gradientBg: ['#060505', '#0E0C0C', '#1C1918'] as string[],
    gradientCard: ['rgba(201,133,106,0.10)', 'rgba(14,12,12,0.80)'] as string[],
    gradientButton: ['#A8634F', '#E8A99A'] as string[],
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

// Typography families (loaded via system or bundled fonts)
export const Fonts = {
    display: 'Cinzel',                  // Brand name, titles, monogram
    editorial: 'CormorantGaramond',     // Product names, prices, hero text
    ui: 'Montserrat',                   // Buttons, labels, nav, captions
};

// Spring easing curve
export const SPRING_EASING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
export const SMOOTH_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';

