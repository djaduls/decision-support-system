import React from 'react';
import { Row, CardBody, Card } from 'reactstrap';
import { Colxx, Separator } from '../../components/common/CustomBootstrap';

const MasterPaud = () => {
  return (
    <>
      <Row>
        <Colxx xxs="12">
          <h1 style={{ color: 'black' }}>Master Paud</h1>
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs="12" className="mb-4">
          <Card>
            <CardBody>Haloooo Paud</CardBody>
          </Card>
        </Colxx>
      </Row>
    </>
  );
};

export default MasterPaud;
