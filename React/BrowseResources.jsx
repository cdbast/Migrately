import React, { useState, useEffect } from "react";
import resourceServices from "services/resourceServices";
import ResourceCard from "./ResourceCard";
import debug from "sabio-debug";
import {
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Container,
  Button,
  Nav,
} from "react-bootstrap";
import lookUpService from "../../services/lookUpService";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
import toastr from "toastr";
import "./resourcestyles.css";
import Footer from "components/landing/Footer";
import NavigateBar from "components/landing/NavigateBar";
import PropTypes, { string } from "prop-types";

const _logger = debug.extend("BrowseResources");

function BrowseResources(props) {
  const [browseResources, setBrowseResources] = useState({
    resources: [],
    resourceComponents: [],
    resourceCategoryId: "",
    locationTypeId: "",
    pageIndex: 0,
    pageSize: "5",
    total: 0,
    current: 1,
  });
  const [resourceSearch, setResourceSearch] = useState("");
  const [mappedResourceCategories, setMappedResourceCategory] = useState([]);
  const [mappedlocationTypesData, setMappedLocationTypes] = useState([]);

  useEffect(() => {
    if (browseResources.resourceCategoryId) {
      resourceServices
        .getByResourceType(
          browseResources.pageIndex,
          browseResources.pageSize,
          browseResources.resourceCategoryId
        )
        .then(getResourceCategoryTypesSuccess)
        .catch(getResourceCategoryTypesError);
    } else if (browseResources.locationTypeId) {
      resourceServices
        .getByLocationType(
          browseResources.pageIndex,
          browseResources.pageSize,
          browseResources.locationTypeId
        )
        .then(getLocationTypesSuccess)
        .catch(getLocationTypesError);
    } else {
      resourceServices
        .getAll(browseResources.pageIndex, browseResources.pageSize)
        .then(onGetAllSuccess)
        .catch(onGetAllError);
    }
  }, [
    browseResources.pageIndex,
    browseResources.pageSize,
    browseResources.locationTypeId,
    browseResources.resourceCategoryId,
    resourceSearch,
  ]);

  useEffect(() => {
    lookUpService
      .LookUp(["ResourceCategories"])
      .then(onLookUpRCSuccess)
      .catch(onLookUpRCError);
    lookUpService
      .LookUp(["LocationTypes"])
      .then(onLookUpLTSuccess)
      .catch(onLookUpLTError);
  }, []);

  const onLookUpRCSuccess = (data) => {
    let returned = data.item.resourceCategories;
    setMappedResourceCategory(() => {
      const mappedCategories = returned.map(mapResourceCategories);
      return mappedCategories;
    });
  };

  const onLookUpRCError = (err) => {
    toastr.error("Unable to get location types", "Select Error");
    _logger(err, "Mistakes were made");
  };

  const mapResourceCategories = (rCategories) => {
    return (
      <Dropdown.Item key={rCategories.id} eventKey={rCategories.id}>
        {rCategories.name}
      </Dropdown.Item>
    );
  };

  const onLookUpLTSuccess = (data) => {
    let returned = data.item.locationTypes;
    setMappedLocationTypes(() => {
      const mappedlocationTypesData = returned.map(mapLocationTypes);
      return mappedlocationTypesData;
    });
  };

  const onLookUpLTError = (err) => {
    toastr.error("Unable to get location types", "Select Error");
    _logger(err, "Mistakes were made");
  };

  const mapLocationTypes = (lTypes) => {
    return (
      <Dropdown.Item key={lTypes.id} eventKey={lTypes.id}>
        {lTypes.name}
      </Dropdown.Item>
    );
  };

  const onAllResources = () => {
    resourceServices
      .getAll(0, browseResources.pageSize)
      .then(onGetAllSuccess)
      .catch(onGetAllError);
  };

  const onGetAllSuccess = (response) => {
    let arrayOfResources = response.data.item.pagedItems;
    setBrowseResources((prevState) => {
      const resData = { ...prevState };
      resData.total = response.data.item.totalCount;
      resData.resourceCategoryId = "";
      resData.locationTypeId = "";
      resData.resources = arrayOfResources;
      resData.resourceComponents = arrayOfResources.map(mapResources);
      return resData;
    });
  };

  const onGetAllError = (err) => {
    toastr.error("Unable to get all resources", "Select Error");
    _logger(err, "Mistakes were made");
  };

  const handleSearchChange = (e) => {
    const target = e.target;
    const value = target.value;
    setResourceSearch(value);
  };

  const handleSubmit = () => {
    resourceServices
      .getBySearchDetails(
        browseResources.pageIndex,
        browseResources.pageSize,
        resourceSearch
      )
      .then(searchDetailsSuccess)
      .catch(searchDetailsError);
  };

  const searchDetailsSuccess = (response) => {
    let arrayOfResources = response.data.item.pagedItems;
    setBrowseResources((prevState) => {
      const pageData = { ...prevState };
      pageData.total = response.data.item.totalCount;
      pageData.resources = arrayOfResources;
      pageData.locationTypeId = "";
      pageData.resourceCategoryId = "";
      pageData.resourceComponents = arrayOfResources.map(mapResources);
      return pageData;
    });
  };

  const searchDetailsError = (err) => {
    toastr.error("Unable to bring up search", "Search Error");
    _logger(err, "Mistakes were made");
  };

  const getResourceCategoryTypesSuccess = (response) => {
    let arrayOfResources = response.data.item.pagedItems;
    setBrowseResources((prevState) => {
      const pageData = { ...prevState };
      pageData.total = response.data.item.totalCount;
      pageData.resources = arrayOfResources;
      pageData.locationTypeId = "";
      pageData.resourceCategoryId = arrayOfResources[0].resourceCategoryId.id;
      pageData.resourceComponents = arrayOfResources.map(mapResources);
      return pageData;
    });
  };

  const getResourceCategoryTypesError = (err) => {
    toastr.error("Unable to get Resource Categories", "Search Error");
    _logger(err, "mistakes were made");
  };

  const getLocationTypesSuccess = (response) => {
    let arrayOfResources = response.data.item.pagedItems;
    setBrowseResources((prevState) => {
      const pageData = { ...prevState };
      pageData.total = response.data.item.totalCount;
      pageData.resources = arrayOfResources;
      pageData.resourceCategoryId = arrayOfResources[0].locationId.id;
      pageData.resourceCategoryId = "";
      pageData.resourceComponents = arrayOfResources.map(mapResources);
      return pageData;
    });
  };

  const getLocationTypesError = (err) => {
    toastr.error("Unable to get Location types", "Search Error");
    _logger(err, "mistakes were made");
    setBrowseResources((prevState) => {
      const noData = { ...prevState };
      noData.resourceComponents = (
        <div className="location-type-error text-primary" align="center">
          Unfortunately, there are no resources by this location type available.
        </div>
      );
      return noData;
    });
  };

  const handleSelectResource = (e) => {
    setBrowseResources((prevState) => {
      const pageData = { ...prevState };
      pageData.pageIndex = 0;
      pageData.resourceCategoryId = e;
      pageData.locationTypeId = "";
      return pageData;
    });
  };

  const handleSelectLocation = (e) => {
    setBrowseResources((prevState) => {
      const pageData = { ...prevState };
      pageData.pageIndex = 0;
      pageData.locationTypeId = e;
      pageData.resourceCategoryId = "";
      return pageData;
    });
  };

  const handlePageSize = (e) => {
    const target = e.target;
    const value = target.value;
    setBrowseResources((prevState) => {
      const pageSize = { ...prevState };
      pageSize.pageSize = value;
      return pageSize;
    });
  };

  const mapResources = (resources) => {
    return (
      <ResourceCard resourceData={resources} key={"ListA-" + resources.id} />
    );
  };

  const onPageChange = (page) => {
    setBrowseResources((prevState) => {
      let newResPage = { ...prevState };
      newResPage.current = page;
      newResPage.pageIndex = page - 1;
      newResPage.total = browseResources.total;
      return newResPage;
    });
  };

  return (
    <React.Fragment>
      <div className="py-8 py-lg-16 bg-light-gradient-bottom bg-white align-items-center">
        <NavigateBar currentUser={props.currentUser} />
        <Nav variant="pills" as="ul">
          <Nav.Item as="li" className="resourceSearch">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search Resources"
                aria-label="Search"
                aria-describedby="button-addon2"
                id="searchResourcesInput"
                onChange={handleSearchChange}
              />
              <button
                className="btn btn-primary"
                type="button"
                id="searchResources"
                onChange={handleSearchChange}
                onClick={handleSubmit}
              >
                Search
              </button>
            </div>
          </Nav.Item>
          <Nav.Item as="li" className="resourceNavTab">
            <Button variant="primary" className="me-1" onClick={onAllResources}>
              All Resources
            </Button>
          </Nav.Item>
          <Nav.Item as="li" className="resourceNavTab">
            <DropdownButton
              title="Category Types"
              onSelect={handleSelectResource}
            >
              {mappedResourceCategories}
            </DropdownButton>
          </Nav.Item>
          <Nav.Item as="li" className="resourceNavTab">
            <DropdownButton
              title="Location Types"
              onSelect={handleSelectLocation}
            >
              {mappedlocationTypesData}
            </DropdownButton>
          </Nav.Item>
          <Nav.Item as="li" className="resourcePageSize">
            <div className="col-md-12 list">
              <div className="mt-3">
                {"Items per Page: "}
                <select
                  onChange={handlePageSize}
                  value={browseResources.pageSize}
                  id="pageSize"
                >
                  <option key="5" value="5">
                    5
                  </option>
                  <option key="10" value="10">
                    10
                  </option>
                  <option key="15" value="15">
                    15
                  </option>
                </select>
              </div>
            </div>
          </Nav.Item>
        </Nav>
        <Container fluid>
          {browseResources.pageSize !== "5" ? (
            <Row>
              <div className="resources-pagination" align="right">
                <Pagination
                  onChange={onPageChange}
                  current={browseResources.current}
                  pageSize={browseResources.pageSize}
                  total={browseResources.total}
                  locale={locale}
                />
              </div>
            </Row>
          ) : (
            <div></div>
          )}
          <Row>
            <Col>
              <div className="row justify-content-center">
                {browseResources.resourceComponents}
              </div>
            </Col>
          </Row>
          <Row>
            <div className="resources-pagination" align="right">
              <Pagination
                variant="primary"
                onChange={onPageChange}
                current={browseResources.current}
                pageSize={browseResources.pageSize}
                total={browseResources.total}
                locale={locale}
              />
            </div>
          </Row>
        </Container>
      </div>
      <Footer />
    </React.Fragment>
  );
}

BrowseResources.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    roles: PropTypes.arrayOf(string).isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    email: PropTypes.string,
  }),
};
export default BrowseResources;
