import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0', // sab IPs se accessible ho jaaye
    port: 3900,       // jo port tu chahta hai
  }
})
