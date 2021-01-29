import React, { useRef, useState } from 'react';
import { Row, CardBody, Card, Button, Label } from 'reactstrap';
import { connect } from 'react-redux';
import {
  AvForm,
  AvGroup,
  AvInput,
  AvFeedback,
} from 'availity-reactstrap-validation';
import { Colxx, Separator } from '../../components/common/CustomBootstrap';
import DropzoneExample from '../../containers/forms/DropzoneExample';
import { updateCurriculum } from '../../redux/actions';

import { NotificationManager } from '../../components/common/react-notifications';

const BlankPage = ({ match, updateCurriculumAction }) => {
  const [state, setState] = useState({
    title: '',
    fileUrl: '',
  });

  const dropzone = useRef();

  const onChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const onUploadFile = (file) => {
    const img = JSON.parse(file.xhr.response);
    setState((prevState) => ({ ...prevState, fileUrl: img.fileUrl }));
  };

  const createNotification = (type, className) => {
    const cName = className || '';
    switch (type) {
      case 'success':
        NotificationManager.success(
          'Sukses!',
          'Kurikulum berhasil di update',
          3000,
          null,
          null,
          cName
        );
        break;
      case 'error':
        NotificationManager.error(
          'Error message',
          'Terjadi Kesalahan!',
          5000,
          () => {
            alert('callback');
          },
          null,
          cName
        );
        break;
      default:
        NotificationManager.info('Info message');
        break;
    }
  };

  const onSubmit = async () => {
    updateCurriculumAction(state.title, state.fileUrl, (callBack) => {
      if (callBack.status === 200) {
        setState((prevState) => ({ ...prevState, title: '' }));
        setState((prevState) => ({ ...prevState, fileUrl: '' }));
        createNotification('success');
      } else {
        createNotification('error');
      }
    });
  };

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <h1 style={{ color: 'black' }}>Update Kurikulum</h1>
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs="12" className="mb-4">
          <Card>
            <CardBody>
              <AvForm
                className="av-tooltip tooltip-label-right"
                onSubmit={(event, errors, values) =>
                  onSubmit(event, errors, values)
                }
              >
                <AvGroup>
                  <Label>Name</Label>
                  <AvInput
                    required
                    value={state.title}
                    name="title"
                    onChange={onChange}
                  />

                  <AvFeedback>Judul wajib di isi!</AvFeedback>
                </AvGroup>
                <Label>File Kurikulum</Label> <span>(wajib diisi)</span>
                <DropzoneExample ref={dropzone} onUpload={onUploadFile} />
                <Button color="primary" className="mt-4">
                  UPDATE
                </Button>
              </AvForm>
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    </>
  );
};

export default connect(null, {
  updateCurriculumAction: updateCurriculum,
})(BlankPage);
