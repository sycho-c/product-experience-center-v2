import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  safelist: [
    // Dynamic device-grid column starts/ends (computed in DeviceGrid layout)
    ...Array.from({ length: 9 }, (_, i) => `col-start-${i + 1}`),
    ...Array.from({ length: 10 }, (_, i) => `col-end-${i}`),
    'row-start-1',
    'row-start-2',
    'row-end-2',
    'row-end-3',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#4F46E5',
          primaryHover: '#4338CA',
          primarySoft: '#EEF2FF',
          accent: '#22D3EE',
          sidebar: '#1B1F3A',
          sidebarHover: '#252A4A',
          sidebarActive: '#2E3357',
          sidebarText: '#B8BCD0',
          sidebarTextActive: '#FFFFFF',
        },
        surface: {
          canvas: '#F7F7FA',
          card: '#FFFFFF',
          subtle: '#F1F2F6',
          border: '#E5E7EB',
        },
        ink: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
          subtle: '#CBD5E1',
        },
        accent: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
        },
        kakao: {
          bg: '#B2C7DA',
          bubble: '#FEE500',
          bubbleAlt: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          '"Apple SD Gothic Neo"',
          '"Noto Sans KR"',
          'sans-serif',
        ],
      },
      borderRadius: {
        xl: '0.875rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 1px rgba(15, 23, 42, 0.03)',
        elev: '0 8px 24px -8px rgba(15, 23, 42, 0.12), 0 2px 6px rgba(15, 23, 42, 0.04)',
        spotlight: '0 0 0 4px rgba(79, 70, 229, 0.12)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(8%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.92)', opacity: '0.6' },
          '50%': { transform: 'scale(1.08)', opacity: '0.2' },
          '100%': { transform: 'scale(0.92)', opacity: '0.6' },
        },
        'dot-travel': {
          '0%': { offsetDistance: '0%' },
          '100%': { offsetDistance: '100%' },
        },
      },
      animation: {
        'fade-in': 'fade-in 220ms ease-out',
        'slide-in-right': 'slide-in-right 260ms cubic-bezier(0.22, 1, 0.36, 1)',
        'pulse-ring': 'pulse-ring 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [animate],
};

export default config;
