// import React, { useRef, useState } from "react";
// import Modal from "react-bootstrap/Modal";
// import Button from "react-bootstrap/Button";
// import Form from "react-bootstrap/Form";
// import AvatarEditor from "react-avatar-editor";
// import Dropzone from "react-dropzone";
// import { useDispatch, useSelector } from "react-redux";

// import { updateUser } from "../../store/user";
// import { Row, Col, Card } from "react-bootstrap";

// function DarbAvatarEditor(props) {
//   const { photo } = useSelector((state) => ({
//     photo: state.user.data.profile.photo,
//   }));
//   const [image, setImage] = useState(photo);
//   const [scale, setScale] = useState(100);
//   const dispatch = useDispatch();
//   const editor = useRef(null);

//   const handleSave = () => {
//     if (editor) {
//       const canvas = editor.current.getImage();
//       dispatch(updateUser({ profile: { photo: canvas.toDataURL() } }));
//     }

//     props.hide();
//   };

//   return (
//     <Modal
//       {...props}
//       onHide={props.hide}
//       size="lg"
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//     >
//       <Modal.Header closeButton>
//         <Modal.Title id="contained-modal-title-vcenter">
//           Update your profile icon:
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Row>
//           <Col lg="6" sm="12">
//             <Card className="d-flex flex-column align-items-center p-3">
//               <AvatarEditor
//                 ref={editor}
//                 width={250}
//                 height={250}
//                 image={image}
//                 scale={scale / 100}
//                 borderRadius={125}
//               />
//               <Form.Range
//                 label="Zoom"
//                 value={scale}
//                 onChange={(e) => {
//                   if (e.target.value >= 100 && e.target.value <= 300)
//                     setScale(e.target.value);
//                 }}
//                 min={100}
//                 max={300}
//               />
//             </Card>
//           </Col>
//           <Col lg="6" sm="12" className="d-flex justify-content-center">
//             <Dropzone
//               onDrop={(dropped) => setImage(dropped[0])}
//               noKeyboard
//               style={{
//                 width: "250px",
//                 height: "250px",
//                 backgroundColor: "black",
//               }}
//               inputContent="Drag profie picture here, or click to upload"
//             >
//               {({ getRootProps, getInputProps }) => {
//                 return (
//                   <section
//                     style={{ backgroundColor: "#eee", width: "250px" }}
//                     className="border m-3 p-5 rounded "
//                   >
//                     <div {...getRootProps({ className: "dropzone" })}>
//                       <input {...getInputProps()} />
//                       <p className="text-muted">
//                         Drag and drop pfp file here, or click to select
//                       </p>
//                     </div>
//                   </section>
//                 );
//               }}
//             </Dropzone>
//           </Col>
//         </Row>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button onClick={handleSave}>Save</Button>
//         <Button onClick={props.hide}>Close</Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }

// export default DarbAvatarEditor;
