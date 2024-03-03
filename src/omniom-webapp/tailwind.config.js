/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      typography: {
        'title-large': {
          css: {
            fontWeight: '400',
            fontSize: '22px',
            lineHeight: '28px',
          }
        }
      },
      fontSize: {
        'display-large': [ '57px', { lineHeight: '64px', letterSpacing: '-0.25px' } ],
        'display-medium': [ '45px', { lineHeight: '52px' } ],
        'display-small': [ '36px', { lineHeight: '44px' } ],
        'headline-large': [ '32px', { lineHeight: '40px' } ],
        'headline-medium': [ '28px', { lineHeight: '36px' } ],
        'headline-small': [ '24px', { lineHeight: '32px' } ],
        'title-large': [ '22px', { lineHeight: '28px' }, ],
        'title-medium': [ '16px', { lineHeight: '24px', letterSpacing: '0.15px' } ],
        'title-small': [ '14px', { lineHeight: '20px', letterSpacing: '0.1px' } ],
        'label-large': [ '14px', { lineHeight: '20px', letterSpacing: '0.1px' } ],
        'label-medium': [ '12px', { lineHeight: '16px', letterSpacing: '0.5px' } ],
        'label-small': [ '11px', { lineHeight: '16px', letterSpacing: '0.5px' } ],
        'body-large': [ '16px', { lineHeight: '24px', letterSpacing: '0.5px' } ],
        'body-medium': [ '14px', { lineHeight: '20px', letterSpacing: '0.25px' } ],
        'body-small': [ '12px', { lineHeight: '16px', letterSpacing: '0.4px' } ],
        'icon-xs': '12px',
        'icon-sm': '16px',
        'icon-base': '20px',
        'icon-lg': '24px',
        'icon-xl': '32px',
        'icon-2xl': '48px',
        'icon-3xl': '64px',
      },
      fontWeight: {
        'title-large': [ 400 ]
      },
      fontFamily: {
        'roboto': [ 'Roboto', 'sans-serif' ],
      },
    },
  },
  plugins: [],
};