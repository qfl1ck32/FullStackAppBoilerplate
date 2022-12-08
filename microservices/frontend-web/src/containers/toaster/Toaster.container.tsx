import { ToastContainer } from 'react-toastify'

export const ToasterContainer = () => {
   return <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        draggable={false}
        closeOnClick
        pauseOnHover
      />
}