module.exports = {
   root: true,
   plugins: ['react-hooks'],
   extends: ['universe/native', 'plugin:react-hooks/recommended'],
   rules: {
      'react-hooks/exhaustive-deps': ['warn'],
   },
}
