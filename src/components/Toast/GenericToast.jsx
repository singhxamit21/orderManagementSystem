import { Toast, ToastContainer } from "react-bootstrap"

const GenericToast = ({bg,showToast,setShowToast,msg}) => {
    return (
        <ToastContainer position="bottom-end" className="p-3">
            <Toast bg={bg} show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
                <Toast.Body>{msg}</Toast.Body>
            </Toast>
        </ToastContainer>
    )
}

export default GenericToast