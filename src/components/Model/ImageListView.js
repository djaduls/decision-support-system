import React from 'react';
import {
  Row,
  Card,
  CardBody,
  CardSubtitle,
  CardImg,
  CardText,
  CustomInput,
  Badge,
  Button,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Colxx } from '../../components/common/CustomBootstrap';

const ImageListView = ({
  product,
  isSelect,
  collect,
  onCheckItem,
  publishModel,
  isAdmin,
}) => {
  return (
    <Colxx sm="6" lg="4" xl="3" className="mb-3" key={product._id}>
      <ContextMenuTrigger id="menu_id" data={product._id} collect={collect}>
        <Card
          onClick={(event) => onCheckItem(event, product._id)}
          className={classnames({
            active: isSelect,
          })}
        >
          <div className="position-relative">
            <NavLink to={`?p=${product._id}`} className="w-40 w-sm-100">
              <CardImg top alt={product.title} src={product.coverUrl} />
            </NavLink>
            {isAdmin && (
              <Badge
                color={product.isPublish ? 'primary' : 'secondary'}
                pill
                className="position-absolute badge-top-left"
              >
                {product.isPublish ? 'PUBLISH' : 'ON HOLD'}
              </Badge>
            )}
          </div>
          <CardBody>
            <Row>
              <Colxx xxs="2">
                <CustomInput
                  className="item-check mb-0"
                  type="checkbox"
                  id={`check_${product._id}`}
                  checked={isSelect}
                  onChange={() => {}}
                  label=""
                />
              </Colxx>
              <Colxx xxs="10" className="mb-3">
                <CardSubtitle>{product.title}</CardSubtitle>
                <CardText className="text-muted text-small mb-0 font-weight-light">
                  {product.year}
                </CardText>
              </Colxx>
              {isAdmin && (
                <>
                  <Button
                    color="primary"
                    size="lg"
                    block
                    className="mb-1"
                    onClick={() =>
                      publishModel(
                        product._id,
                        product.isPublish ? 'unpublish' : 'publish'
                      )
                    }
                  >
                    {product.isPublish ? 'HOLD' : 'PUBLISH'}
                  </Button>{' '}
                  <Button color="secondary" size="lg" block outline>
                    Update
                  </Button>{' '}
                </>
              )}
            </Row>
          </CardBody>
        </Card>
      </ContextMenuTrigger>
    </Colxx>
  );
};

/* React.memo detail : https://reactjs.org/docs/react-api.html#reactpurecomponent  */
export default React.memo(ImageListView);
