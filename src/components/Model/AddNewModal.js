import React, { useRef } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Label } from 'reactstrap';
import {
  AvForm,
  AvField,
  AvGroup,
  AvInput,
  AvFeedback,
  AvRadioGroup,
  AvRadio,
} from 'availity-reactstrap-validation';
import IntlMessages from '../../helpers/IntlMessages';
import DropzoneExample from '../../containers/forms/DropzoneExample';
import { SliderTooltip } from '../../components/common/SliderTooltips';

const AddNewModal = ({
  modalOpen,
  toggleModal,
  data,
  onChange,
  onSubmit,
  setScore,
  onUploadImg,
  onUploadFile,
}) => {
  const dropzone = useRef();

  return (
    <Modal
      isOpen={modalOpen}
      toggle={toggleModal}
      wrapClassName="modal-right"
      backdrop="static"
    >
      <ModalHeader toggle={toggleModal}>Tambah Model Pembelajaran</ModalHeader>
      <ModalBody>
        <AvForm
          className="av-tooltip tooltip-label-right"
          onSubmit={(event, errors, values) => onSubmit(event, errors, values)}
        >
          <AvGroup>
            <Label>Judul</Label>
            <AvInput
              required
              value={data.title}
              name="title"
              onChange={onChange}
            />

            <AvFeedback>Judul wajib di isi!</AvFeedback>
          </AvGroup>
          <AvGroup>
            <Label>Tahun</Label>
            <AvInput
              required
              value={data.year}
              name="year"
              type="number"
              onChange={onChange}
            />
            <AvFeedback>Tahun wajib di isi!</AvFeedback>
          </AvGroup>

          <AvGroup>
            <AvField
              type="select"
              name="equivalenceModule"
              required
              label="Kesetaraan Modul"
              errorMessage="Please select an option!"
              onChange={onChange}
            >
              <option value="" />
              <option>Tidak Ada</option>
              <option>Kurang</option>
              <option>Cukup</option>
            </AvField>
          </AvGroup>

          <AvGroup>
            <AvField
              type="select"
              name="teacherExpertise"
              required
              label="Keahlian Guru"
              errorMessage="Please select an option!"
              onChange={onChange}
            >
              <option value="" />
              <option>Tidak Ada</option>
              <option>Kurang</option>
              <option>Cukup</option>
            </AvField>
          </AvGroup>
          <AvGroup>
            <Label>Deskripsi</Label>
            <AvInput
              type="textarea"
              name="description"
              id="description"
              required
              onChange={onChange}
            />
            <AvFeedback>Please enter some description!</AvFeedback>
          </AvGroup>
          <Label className="mt-3">Score</Label>
          <SliderTooltip
            min={0}
            max={100}
            defaultValue={0}
            className="mb-5"
            step={1}
            onChange={setScore}
          />

          <AvRadioGroup
            className="error-l-150 "
            name="learningConcept"
            required
          >
            <Label className="d-block mt-4">Konsep Pembelajaran</Label>
            <AvRadio
              customInput
              onChange={onChange}
              label="Kontekstual"
              value="Kontekstual"
            />
            <AvRadio
              customInput
              onChange={onChange}
              label="Tekstual"
              value="Tekstual"
            />
          </AvRadioGroup>
          <Label className="mt-4">Cover Model</Label>
          <DropzoneExample ref={dropzone} onUpload={onUploadImg} />
          <Label className="mt-3">File Model</Label>
          <DropzoneExample ref={dropzone} onUpload={onUploadFile} />

          <Button color="primary" className="mt-5 mr-5 ml-4">
            Submit
          </Button>
          <Button
            color="secondary"
            outline
            className="mt-5 ml-5"
            onClick={toggleModal}
          >
            <IntlMessages id="pages.cancel" />
          </Button>
        </AvForm>
      </ModalBody>
    </Modal>
  );
};

export default AddNewModal;
