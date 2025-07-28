import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Executive Design System Colors
				executive: {
					navy: 'hsl(var(--executive-navy))',
					charcoal: 'hsl(var(--executive-charcoal))',
					platinum: 'hsl(var(--executive-platinum))',
					crimson: 'hsl(var(--executive-crimson))',
					gold: 'hsl(var(--executive-gold))',
					emerald: 'hsl(var(--executive-emerald))',
					sapphire: 'hsl(var(--executive-sapphire))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			spacing: {
				'hero': 'var(--space-hero)',
				'section': 'var(--space-section)',
				'component': 'var(--space-component)',
				'element': 'var(--space-element)',
				'tight': 'var(--space-tight)'
			},
			maxWidth: {
				'narrow': 'var(--width-narrow)',
				'content': 'var(--width-content)',
				'wide': 'var(--width-wide)',
				'container': 'var(--width-container)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					from: { opacity: '0', transform: 'translateY(20px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-scale': {
					from: { opacity: '0', transform: 'scale(0.95)' },
					to: { opacity: '1', transform: 'scale(1)' }
				},
				'slide-up-elegant': {
					from: { opacity: '0', transform: 'translateY(40px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'executive-pulse': {
					'0%, 100%': { boxShadow: '0 0 20px hsl(var(--executive-navy) / 0.3)' },
					'50%': { boxShadow: '0 0 40px hsl(var(--executive-navy) / 0.6)' }
				},
				'authority-glow': {
					'0%, 100%': { boxShadow: '0 0 30px hsl(var(--executive-crimson) / 0.4)' },
					'50%': { boxShadow: '0 0 60px hsl(var(--executive-crimson) / 0.8)' }
				},
				'luxury-shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'fade-in-scale': 'fade-in-scale 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
				'slide-up-elegant': 'slide-up-elegant 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
				'executive-pulse': 'executive-pulse 3s ease-in-out infinite',
				'authority-glow': 'authority-glow 2.5s ease-in-out infinite',
				'luxury-shimmer': 'luxury-shimmer 2s ease-in-out infinite'
			},
			fontFamily: {
				'editorial': ['Playfair Display', 'Georgia', 'serif'],
				'executive': ['Inter', 'Helvetica Neue', 'sans-serif'],
				'accent': ['Crimson Text', 'Times New Roman', 'serif'],
				'display': ['Libre Baskerville', 'Georgia', 'serif']
			},
			boxShadow: {
				'executive': 'var(--shadow-executive)',
				'authority': 'var(--shadow-authority)',
				'luxury': 'var(--shadow-luxury)',
				'depth-1': 'var(--shadow-depth-1)',
				'depth-2': 'var(--shadow-depth-2)',
				'depth-3': 'var(--shadow-depth-3)',
				'depth-4': 'var(--shadow-depth-4)'
			}
		}
	},
	plugins: [require("tailwindcss-animate"), require('@tailwindcss/line-clamp')],
} satisfies Config;
