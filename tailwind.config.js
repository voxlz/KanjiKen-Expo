/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app.d.{js,jsx,ts,tsx}',
        './App.{js,jsx,ts,tsx}',
        './src/**/*.{js,jsx,ts,tsx}',
        './app/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                forest: {
                    50: '#f3faeb',
                    100: '#e5f3d4',
                    200: '#cce8ae',
                    300: '#abd87e',
                    400: '#8bc655',
                    500: '#71b139',
                    600: '#538828',
                    700: '#406823',
                    800: '#365321',
                    900: '#2f481f',
                    950: '#16270c',
                },
                error: {
                    200: '#FFA7A7',
                    500: '#E46A6A',
                    900: '#6C2424',
                },
                ui: {
                    very_light: '#ECEAEA',
                    light: '#B8B8B8',
                    disabled: '#AEAEAE',
                    bold: '#727272',
                    text: '#000000',
                },
                highlight: {
                    gray: '#FEFEFE',
                    blue: '#EEF4FA',
                },
            },
        },
    },
    plugins: [],
}
