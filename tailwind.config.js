module.exports = {
  purge: ['index.html', 'client/script/**/*.ts'],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [
    require('@tailwindcss/ui'),
  ]
};
