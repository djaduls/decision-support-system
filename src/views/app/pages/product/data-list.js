import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import ListPageHeading from '../../../../containers/pages/ListPageHeading';
import AddNewModal from '../../../../components/Model/AddNewModal';
import ListPageListing from '../../../../components/Model/ListPageListing';
import useMousetrap from '../../../../hooks/use-mousetrap';
import {
  sumbitModel,
  deleteModel,
  publishModel,
} from '../../../../redux/actions';
import { getToken } from '../../../../helpers/Utils';
import { baseUrl } from '../../../../constants/defaultValues';

const getIndex = (value, arr, prop) => {
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i][prop] === value) {
      return i;
    }
  }
  return -1;
};

const orderOptions = [
  { column: 'title', label: 'Product Name' },
  { column: 'category', label: 'Category' },
  { column: 'status', label: 'Status' },
];
const pageSizes = [4, 8, 12, 20];

const DataListPages = ({
  match,
  submitModelAction,
  deleteModelAction,
  publishModelAction,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [displayMode, setDisplayMode] = useState('imagelist');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPageSize, setSelectedPageSize] = useState(8);
  const [selectedOrderOption, setSelectedOrderOption] = useState({
    column: 'title',
    label: 'Product Name',
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState([]);
  const [lastChecked, setLastChecked] = useState(null);

  const [state, setState] = useState({
    title: '',
    description: '',
    equivalenceModule: '',
    teacherExpertise: '',
    score: '',
    learningConcept: '',
    year: '',
    coverUrl: '',
    fileUrl: '',
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPageSize, selectedOrderOption]);

  useEffect(() => {
    const token = getToken();
    async function fetchData() {
      axios
        .get(
          `${baseUrl}/model/${selectedPageSize}/${currentPage}?search=${search}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          return res.data;
        })
        .then((data) => {
          setTotalPage(data.totalPage);
          setItems(data.data);
          setSelectedItems([]);
          setTotalItemCount(data.totalItem);
          setIsLoaded(true);
        });
    }
    fetchData();
  }, [selectedPageSize, currentPage, selectedOrderOption, search]);

  const onCheckItem = (event, id) => {
    if (
      event.target.tagName === 'A' ||
      (event.target.parentElement && event.target.parentElement.tagName === 'A')
    ) {
      return true;
    }
    if (lastChecked === null) {
      setLastChecked(id);
    }

    let selectedList = [...selectedItems];
    if (selectedList.includes(id)) {
      selectedList = selectedList.filter((x) => x !== id);
    } else {
      selectedList.push(id);
    }
    setSelectedItems(selectedList);

    if (event.shiftKey) {
      let newItems = [...items];
      const start = getIndex(id, newItems, 'id');
      const end = getIndex(lastChecked, newItems, 'id');
      newItems = newItems.slice(Math.min(start, end), Math.max(start, end) + 1);
      selectedItems.push(
        ...newItems.map((item) => {
          return item.id;
        })
      );
      selectedList = Array.from(new Set(selectedItems));
      setSelectedItems(selectedList);
    }
    document.activeElement.blur();
    return false;
  };

  const handleChangeSelectAll = (isToggle) => {
    if (selectedItems.length >= items.length) {
      if (isToggle) {
        setSelectedItems([]);
      }
    } else {
      setSelectedItems(items.map((x) => x._id));
    }
    document.activeElement.blur();
    return false;
  };

  const onContextMenuClick = (e, data) => {
    console.log('onContextMenuClick - selected items', selectedItems);
    console.log('onContextMenuClick - action : ', data.action);
  };

  const onContextMenu = (e, data) => {
    const clickedProductId = data.data;
    if (!selectedItems.includes(clickedProductId)) {
      setSelectedItems([clickedProductId]);
    }

    return true;
  };

  const onSubmit = (event, errors, values) => {
    if (errors.length === 0) {
      submitModelAction(state, (callBack) => {
        if (callBack.status === 201) {
          setModalOpen(!modalOpen);
          fetchNew();
        }
      });
    }
  };

  const fetchNew = async () => {
    axios
      .get(
        `${baseUrl}/model/${selectedPageSize}/${currentPage}?search=${search}`,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMGUwMmJiOGE0ZTI4ZDM5NGY4MzhjMyIsImVtYWlsIjoiYWRtaW5AZ29kLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTYxMTUzNDQzMH0.PiUcMSGxCF-oqp31zlew8nytZ-CV6Y1mImxzZ_cebg8`,
          },
        }
      )
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setTotalPage(data.totalPage);
        setItems(data.data);
        setSelectedItems([]);
        setTotalItemCount(data.totalItem);
        setIsLoaded(true);
      });
  };

  useMousetrap(['ctrl+a', 'command+a'], () => {
    handleChangeSelectAll(false);
  });

  useMousetrap(['ctrl+d', 'command+d'], () => {
    setSelectedItems([]);
    return false;
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const onUploadImg = (file) => {
    const img = JSON.parse(file.xhr.response);
    setState((prevState) => ({ ...prevState, coverUrl: img.fileUrl }));
  };

  const onUploadFile = (file) => {
    const img = JSON.parse(file.xhr.response);
    setState((prevState) => ({ ...prevState, fileUrl: img.fileUrl }));
  };

  const onDelete = () => {
    deleteModelAction(selectedItems, (callBack) => {
      if (callBack.status === 200) {
        fetchNew();
      }
    });
  };

  const publishModel = (id, type) => {
    publishModelAction(id, type, (callBack) => {
      if (callBack.status === 200) {
        fetchNew();
      }
    });
  };

  const startIndex = (currentPage - 1) * selectedPageSize;
  const endIndex = currentPage * selectedPageSize;

  return !isLoaded ? (
    <div className="loading" />
  ) : (
    <>
      <div className="disable-text-selection">
        <ListPageHeading
          heading="menu.data-list"
          displayMode={displayMode}
          changeDisplayMode={setDisplayMode}
          handleChangeSelectAll={handleChangeSelectAll}
          changeOrderBy={(column) => {
            setSelectedOrderOption(
              orderOptions.find((x) => x.column === column)
            );
          }}
          changePageSize={setSelectedPageSize}
          selectedPageSize={selectedPageSize}
          totalItemCount={totalItemCount}
          selectedOrderOption={selectedOrderOption}
          match={match}
          startIndex={startIndex}
          endIndex={endIndex}
          selectedItemsLength={selectedItems ? selectedItems.length : 0}
          itemsLength={items ? items.length : 0}
          onSearchKey={(e) => {
            if (e.key === 'Enter') {
              setSearch(e.target.value.toLowerCase());
            }
          }}
          orderOptions={orderOptions}
          pageSizes={pageSizes}
          toggleModal={() => setModalOpen(!modalOpen)}
          isAdmin
          onDelete={onDelete}
        />
        <AddNewModal
          modalOpen={modalOpen}
          toggleModal={() => setModalOpen(!modalOpen)}
          onSubmit={onSubmit}
          data={state}
          onChange={onChange}
          setScore={(e) => {
            setState((prevState) => ({
              ...prevState,
              score: e.toString(),
            }));
          }}
          onUploadImg={onUploadImg}
          onUploadFile={onUploadFile}
        />
        <ListPageListing
          items={items}
          displayMode={displayMode}
          selectedItems={selectedItems}
          onCheckItem={onCheckItem}
          currentPage={currentPage}
          totalPage={totalPage}
          onContextMenuClick={onContextMenuClick}
          onContextMenu={onContextMenu}
          onChangePage={setCurrentPage}
          publishModel={publishModel}
          isAdmin
        />
      </div>
    </>
  );
};

export default connect(null, {
  submitModelAction: sumbitModel,
  deleteModelAction: deleteModel,
  publishModelAction: publishModel,
})(DataListPages);
