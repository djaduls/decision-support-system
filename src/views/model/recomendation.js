import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  UncontrolledDropdown,
} from 'reactstrap';
import classnames from 'classnames';
import { scroller } from 'react-scroll';
import { saveAs } from 'file-saver';
import Headroom from 'react-headroom';
import { baseUrl } from '../../constants/defaultValues';
import axios from 'axios';
import { getCurriculumService } from '../../redux/model/services';
import ListPageHeading from '../../containers/pages/ListPageHeading';
import AddNewModal from '../../containers/pages/AddNewModal';
import ListPageListing from '../../components/Model/ListPageListing';
import useMousetrap from '../../hooks/use-mousetrap';

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
const pageSizes = [8, 12];

const categories = [
  { label: 'Cakes', value: 'Cakes', key: 0 },
  { label: 'Cupcakes', value: 'Cupcakes', key: 1 },
  { label: 'Desserts', value: 'Desserts', key: 2 },
];

const Home = ({ match }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const refRowHome = useRef(null);
  const refSectionHome = useRef(null);
  const refSectionFooter = useRef(null);
  const [data, setData] = useState({});
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

  useEffect(() => {
    window.addEventListener('scroll', onWindowScroll);
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('click', onWindowClick);
    fetch();
    document.body.classList.add('no-footer');
    return () => {
      window.removeEventListener('scroll', onWindowScroll);
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('click', onWindowClick);
      document.body.classList.remove('no-footer');
    };
  }, []);

  const fetch = async () => {
    const data = await getCurriculumService();
    setData(data.data[0]);
  };

  const onWindowResize = (event) => {
    const homeRect = refRowHome.current.getBoundingClientRect();

    const homeSection = refSectionHome.current;
    homeSection.style.backgroundPositionX = homeRect.x - 580 + 'px';

    const footerSection = refSectionFooter.current;
    footerSection.style.backgroundPositionX =
      event.target.innerWidth - homeRect.x - 2000 + 'px';

    if (event.target.innerWidth >= 992) {
      setShowMobileMenu(false);
    }
  };

  const onWindowClick = () => {
    setShowMobileMenu(false);
  };

  const onWindowScroll = () => {
    setShowMobileMenu(false);
  };

  const scrollTo = (event, target) => {
    event.preventDefault();
    scroller.scrollTo(target, {
      duration: 500,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset: -100,
    });
    return false;
  };

  const onDownload = () => {
    saveAs(data.fileUrl, `${data.title}.pdf`);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPageSize, selectedOrderOption]);

  useEffect(() => {
    async function fetchData() {
      axios
        .get(
          `${baseUrl}/model/public/${selectedPageSize}/${currentPage}?search=${search}`
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
      setSelectedItems(items.map((x) => x.id));
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

  useMousetrap(['ctrl+a', 'command+a'], () => {
    handleChangeSelectAll(false);
  });

  useMousetrap(['ctrl+d', 'command+d'], () => {
    setSelectedItems([]);
    return false;
  });

  const startIndex = (currentPage - 1) * selectedPageSize;
  const endIndex = currentPage * selectedPageSize;

  return (
    <div
      className={classnames('landing-page', {
        'show-mobile-menu': showMobileMenu,
      })}
    >
      <div className="mobile-menu" onClick={(event) => event.stopPropagation()}>
        <img
          style={{ cursor: 'pointer' }}
          src="/assets/logos/white-full.png"
          height="10%"
          alt="Logo"
          href="/"
          onClick={(event) => scrollTo(event, 'home')}
        />
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink to="/">HOME</NavLink>
          </li>
          <li className="nav-item">
            <a className="c-pointer" onClick={onDownload}>
              KURIKULUM PAUD
            </a>
          </li>

          <li className="nav-item">
            <span style={{ color: '#3a3a3a' }}>
              <UncontrolledDropdown setActiveFromChild>
                <DropdownToggle tag="a" className="nav-link" caret>
                  MODEL PEMBELAJARAN
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem tag="a" href="/download">
                    Download
                  </DropdownItem>
                  <DropdownItem tag="a" href="/recomendation">
                    Rekomendasi
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </span>
          </li>
          <li className="nav-item">
            <NavLink to="/login">LOGIN</NavLink>
          </li>
        </ul>
      </div>

      <div className="main-container">
        <Headroom className="landing-page-nav">
          <nav>
            <div className="container d-flex align-items-center justify-content-between">
              <React.Fragment>
                <img
                  style={{ cursor: 'pointer' }}
                  src="/assets/logos/white-full.png"
                  height="50%"
                  alt="Logo"
                  href="/"
                  onClick={(event) => scrollTo(event, 'home')}
                />
              </React.Fragment>

              <ul className="navbar-nav d-none d-lg-flex flex-row">
                <li className="nav-item">
                  <NavLink to="/">HOME</NavLink>
                </li>
                <li className="nav-item">
                  <a className="c-pointer" onClick={onDownload}>
                    KURIKULUM PAUD
                  </a>
                </li>
                <li className="nav-item">
                  <span style={{ color: 'white' }}>
                    <UncontrolledDropdown setActiveFromChild>
                      <DropdownToggle tag="a" className="nav-link" caret>
                        MODEL PEMBELAJARAN
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem tag="a" href="/download">
                          Download
                        </DropdownItem>
                        <DropdownItem tag="a" href="/recomendation">
                          Rekomendasi
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </span>
                </li>
                <li className="nav-item">
                  <NavLink to="/login">LOGIN</NavLink>
                </li>
              </ul>
              <span
                className="mobile-menu-button"
                onClick={(event) => {
                  setShowMobileMenu(!showMobileMenu);
                  event.stopPropagation();
                }}
              >
                <i className="simple-icon-menu"></i>
              </span>
            </div>
          </nav>
        </Headroom>
        <div className="content-container">
          <div className="section home" ref={refSectionHome}>
            <div className="container">
              <div className="row home-row" ref={refRowHome}>
                {!isLoaded ? (
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
                        selectedItemsLength={
                          selectedItems ? selectedItems.length : 0
                        }
                        itemsLength={items ? items.length : 0}
                        onSearchKey={(e) => {
                          if (e.key === 'Enter') {
                            setSearch(e.target.value.toLowerCase());
                          }
                        }}
                        orderOptions={orderOptions}
                        pageSizes={pageSizes}
                        toggleModal={() => setModalOpen(!modalOpen)}
                      />
                      <AddNewModal
                        modalOpen={modalOpen}
                        toggleModal={() => setModalOpen(!modalOpen)}
                        categories={categories}
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
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="section footer mb-0" ref={refSectionFooter}>
          <div className="container">
            <div className="row footer-row">
              <div className="col-12 text-right">
                <a
                  className="btn btn-circle btn-outline-semi-light footer-circle-button c-pointer"
                  href="#scroll"
                  onClick={(event) => scrollTo(event, 'home')}
                >
                  <i className="simple-icon-arrow-up"></i>
                </a>
              </div>
              <div className="col-12 text-center footer-content">
                <a
                  className="c-pointer"
                  href="#scroll"
                  onClick={(event) => scrollTo(event, 'home')}
                >
                  <img
                    className="footer-logo"
                    alt="footer logo"
                    src="/assets/logos/white-full.png"
                  />
                </a>
              </div>
            </div>
          </div>
          <div className="container copyright pt-5 pb-5">
            <div className="row">
              <div className="col-12"></div>
              <div className="col-12 text-center">
                <p className="mb-0">2020 © djaduls</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
