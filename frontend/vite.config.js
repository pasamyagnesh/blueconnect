// // vite.config.js
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: true, // allows access from external devices
//     allowedHosts: [
//       'localhost',
//       '127.0.0.1',
//       'https://2cd6-2409-40f0-40d7-19cf-5591-6c06-2cc-961b.ngrok-free.app' // add your Ngrok domain here
//     ]
//   }
// })
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, 
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '2c49-2401-4900-6594-e65a-15bb-5225-1c92-d9e5.ngrok-free.app'
    ]
  }
})
