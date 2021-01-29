import React from 'react';
import { Row, CardBody, Card } from 'reactstrap';
import { Colxx, Separator } from '../../components/common/CustomBootstrap';

const MasterUser = () => {
  return (
    <>
      <Row>
        <Colxx xxs="12">
          <h1 style={{ color: 'black' }}>Master User</h1>
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs="12" className="mb-4">
          <Card>
            <CardBody>Haloooo User</CardBody>
          </Card>
        </Colxx>
      </Row>
    </>
  );
};

export default MasterUser;
