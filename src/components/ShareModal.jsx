import Tippy from "@tippyjs/react";
import React from "react";
import { Modal } from "react-bootstrap";
import {
  FacebookIcon,
  FacebookShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

const ShareModal = ({ showShareModal, closeShareModal }) => {
  return (
    <>
      <Modal show={showShareModal} onHide={closeShareModal}>
        <Modal.Header closeButton>
          <Modal.Title>Share</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tippy arrow={false} content="Share with Facebook">
            <FacebookShareButton url="https://youtu.be/6d2wzfx4sRs">
              <FacebookIcon size={42} round className="m-2"></FacebookIcon>
            </FacebookShareButton>
          </Tippy>
          <Tippy arrow={false} content="Share with Whatsapp">
            <WhatsappShareButton url="http://localhost:3000/single">
              <WhatsappIcon size={42} className="m-2" round></WhatsappIcon>
            </WhatsappShareButton>
          </Tippy>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ShareModal;
