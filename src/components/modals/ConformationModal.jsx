import {
    Button,
    Modal
} from "react-bootstrap";

export default function ConformationModal({ confirm, setConfirm, applyStatus }) {
    return (
        <Modal
            show={confirm.open}
            onHide={() => setConfirm({ open: false, ids: [], target: null })}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Confirm Status Update</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to mark {confirm.ids.length} order
                {confirm.ids.length > 1 ? "s" : ""} as <strong>{confirm.target}</strong>?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setConfirm({ open: false, ids: [], target: null })}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={applyStatus}>Yes, Update</Button>
            </Modal.Footer>
        </Modal>
    );
}
