/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backdropFilter: {
                'none': 'none',
                'sm': 'blur(4px)',
                // 추가적인 사이즈 설정 가능
            },
        },
    },
    plugins: [],
}