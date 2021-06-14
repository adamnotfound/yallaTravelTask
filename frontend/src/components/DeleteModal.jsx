import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

function DeleteModal({
  itemName,
  modalStatus,
  setModalStatus,
  deleteFunction,
}) {
  const [loading, setLoading] = useState(false);
  function hideModal() {
    setLoading(true);
    deleteFunction()
      .then((result) => {
        setLoading(false);
        setModalStatus(false);
        toast.success(result);
      })
      .catch((err) => {
        setLoading(false);
        setModalStatus(false);
        toast.error(err);
      });
  }

  return (
    <Modal
      animation={true}
      size="md"
      show={modalStatus}
      onHide={() => setModalStatus(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirmation message</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete this {itemName}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setModalStatus(false)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={hideModal} disabled={loading}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteModal;
