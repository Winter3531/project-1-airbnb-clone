import React from 'react';
import { useModal } from '../../context/Modal';

import './openmodal.css'

function OpenModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (typeof onButtonClick === 'function') onButtonClick();
    if (typeof onModalClose === 'function') setOnModalClose(onModalClose);
    setModalContent(modalComponent);
  };

  if (buttonText === 'Post Your Review') {
    return  <button id='post-review-button' onClick={onClick}>{buttonText}</button>
  }
  return (
    <button id='modal-button-only' onClick={onClick}>{buttonText}</button>
  );
}

export default OpenModalButton;
