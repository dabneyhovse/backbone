import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function KeyModal(props) {
  const onConfirm = () => {
    props.confirmAction();
    handleClose();
  };
  const handleClose = () => props.setShow(false);
  const buttons = props.buttons ? props.buttons : [];

  return (
    <>
      <Modal centered show={props.show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.content}</Modal.Body>
        {buttons.length == 0 ? (
          ""
        ) : (
          <Modal.Footer>
            {buttons.map((btn) => {
              return (
                <Button
                  key={btn.text}
                  variant={btn.variant}
                  onClick={btn.action}
                >
                  {btn.text}
                </Button>
              );
            })}
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
}

export default KeyModal;
