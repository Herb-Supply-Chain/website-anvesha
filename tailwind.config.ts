import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3d7a7a',
                'primary-dark': '#2d5a5a',
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                serif: ['var(--font-playfair)', 'serif'],
                playfair: ['var(--font-playfair)', 'serif'],
                inter: ['var(--font-inter)', 'sans-serif'],
            },
            animation: {
                blob: "blob 7s infinite",
                shimmer: "shimmer 2s linear infinite",
                'fade-in': 'fade-in 0.8s ease-out forwards',
                'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
                'fade-in-down': 'fade-in-down 0.8s ease-out forwards',
                'scale-in': 'scale-in 0.6s ease-out forwards',
                'slide-in-left': 'slide-in-left 0.8s ease-out forwards',
                'slide-in-right': 'slide-in-right 0.8s ease-out forwards',
                'float': 'float 4s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
                'shake': 'shake 0.5s ease-in-out',
                'gradient-shift': 'gradient-shift 6s ease infinite',
                'breathe': 'breathe 4s ease-in-out infinite',
            },
            keyframes: {
                blob: {
                    "0%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                    "33%": {
                        transform: "translate(30px, -50px) scale(1.1)",
                    },
                    "66%": {
                        transform: "translate(-20px, 20px) scale(0.9)",
                    },
                    "100%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                },
                shimmer: {
                    from: {
                        backgroundPosition: "0 0",
                    },
                    to: {
                        backgroundPosition: "-200% 0",
                    },
                },
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(40px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-in-down': {
                    '0%': { opacity: '0', transform: 'translateY(-40px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'scale-in': {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                'slide-in-left': {
                    '0%': { opacity: '0', transform: 'translateX(-50px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                'slide-in-right': {
                    '0%': { opacity: '0', transform: 'translateX(50px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-15px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(20, 184, 166, 0.2)' },
                    '50%': { boxShadow: '0 0 40px rgba(20, 184, 166, 0.5)' },
                },
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
                    '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
                },
                'gradient-shift': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
                breathe: {
                    '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
                    '50%': { transform: 'scale(1.05)', opacity: '1' },
                },
            },
        },
    },
    plugins: [
        function ({ addUtilities }: any) {
            addUtilities({
                '.animation-delay-2000': {
                    'animation-delay': '2s',
                },
                '.animation-delay-4000': {
                    'animation-delay': '4s',
                },
                '.animation-delay-100': {
                    'animation-delay': '100ms',
                },
                '.animation-delay-200': {
                    'animation-delay': '200ms',
                },
                '.animation-delay-300': {
                    'animation-delay': '300ms',
                },
                '.animation-delay-400': {
                    'animation-delay': '400ms',
                },
                '.animation-delay-500': {
                    'animation-delay': '500ms',
                },
                '.animation-delay-600': {
                    'animation-delay': '600ms',
                },
                '.animation-delay-700': {
                    'animation-delay': '700ms',
                },
                '.animation-delay-800': {
                    'animation-delay': '800ms',
                },
            })
        },
    ],
}
export default config
