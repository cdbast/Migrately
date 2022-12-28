import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import debug from "sabio-debug";

import { logLocation } from "../../services/locationService";
import lookUpService from "../../services/lookUpService";
import resourceServices from "../../services/resourceServices";

import { Container, Col, Row, Button } from "react-bootstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import toastr from "toastr";
import { resourceFormSchema } from "../../schemas/resourceSchema";
import "./resourcestyles.css";
import Footer from "components/landing/Footer";
import NavigateBar from "components/landing/NavigateBar";
import PropTypes, { string } from "prop-types";

const _logger = debug.extend("ResourceForm");

function ResourceForm(props) {
  const [resourceFormData, setResourceFormData] = useState({
    id: 0,
    resourceCategoryId: 0,
    name: "",
    description: "",
    logo: "",
    locationId: 0,
    locationTypeId: 0,
    lineOne: "",
    lineTwo: "",
    city: "",
    zip: "",
    stateId: 0,
    latitude: 0,
    longitude: 0,
    createdBy: 0,
    modifiedBy: 0,
    contactName: "",
    contactEmail: "",
    phone: "",
    siteUrl: "",
  });

  const [mappedResourceCategories, setResourceCategoryData] = useState([]);
  const [mappedLocationTypesData, setLocationTypesData] = useState([]);
  const [mappedStates, setStates] = useState([]);

  const location = useLocation();

  useEffect(() => {
    const locationState = location.state;
    if (locationState !== null && locationState.resource !== null) {
      const resource = { ...locationState.resource };
      setResourceFormData(resource);
    }
  }, [location]);

  useEffect(() => {
    lookUpService
      .LookUp(["ResourceCategories"])
      .then(onLookUpRCSuccess)
      .catch(onLookUpRCError);
    lookUpService
      .LookUp(["LocationTypes"])
      .then(onLookUpLTSuccess)
      .catch(onLookUpLTError);
    lookUpService
      .LookUp(["States"])
      .then(onLookUpStateSuccess)
      .catch(onLookUpStateError);
  }, []);

  const onLookUpRCSuccess = (data) => {
    let returned = data.item.resourceCategories;
    setResourceCategoryData(() => {
      const mappedCategories = returned.map(mapResourceCategories);
      return mappedCategories;
    });
  };

  const onLookUpRCError = (error) => {
    _logger("ResourceCategories Error", error);
  };

  const mapResourceCategories = (rCategories) => {
    return (
      <option key={rCategories.id} value={rCategories.id}>
        {rCategories.name}
      </option>
    );
  };

  const onLookUpLTSuccess = (data) => {
    let returned = data.item.locationTypes;
    setLocationTypesData(() => {
      const mappedlocationTypesData = returned.map(mapLocationTypes);
      return mappedlocationTypesData;
    });
  };

  const onLookUpLTError = (error) => {
    _logger("LocationTypes Error", error);
  };

  const mapLocationTypes = (lTypes) => {
    return (
      <option key={lTypes.id} value={lTypes.id}>
        {lTypes.name}
      </option>
    );
  };

  const onLookUpStateSuccess = (data) => {
    _logger(data, "hey look here");
    let returned = data.item.states;
    setStates(() => {
      const mappedStates = returned.map(mapStates);
      return mappedStates;
    });
  };

  const onLookUpStateError = (error) => {
    toastr.error("Unable to States", "Select Error");
    _logger("StatesId Error", error);
  };

  const mapStates = (states) => {
    _logger(states, "look over here");
    return (
      <option key={states.id} value={states.id}>
        {states.name}
      </option>
    );
  };

  const handleSubmit = async (values) => {
    const locationPayload = {
      locationTypeId: values.locationTypeId,
      lineOne: values.lineOne,
      lineTwo: values.lineTwo,
      city: values.city,
      zip: values.zip,
      stateId: values.stateId,
      latitude: values.latitude,
      longitude: values.longitude,
      createdBy: values.createdBy,
      modifiedBy: values.modifiedBy,
    };
    const resourcePayload = {
      resourceCategoryId: values.resourceCategoryId,
      name: values.name,
      description: values.description,
      logo: values.logo,
      locationId: resourceFormData.locationId,
      contactName: values.contactName,
      contactEmail: values.contactEmail,
      phone: values.phone,
      siteUrl: values.siteUrl,
    };
    if (!resourceFormData.id) {
      try {
        logLocation(locationPayload)
          .then((res) => locationAddSuccess(res, resourcePayload))
          .catch(resourceAddError);
      } catch (err) {
        resourceAddError(err);
        locationAddError(err);
      }
    } else {
      resourceServices
        .update(resourceFormData.id, values)
        .then(resourceUpdateSuccess)
        .catch(resourceUpdateError);
    }
  };

  const locationAddSuccess = (response, resourcePayload) => {
    if (response?.data?.item) {
      resourcePayload.locationId = response.data.item;
      setResourceFormData((prevState) => {
        const locationId = { ...prevState };
        locationId.locationId = response.data.item;
        return locationId;
      });
      resourceServices
        .add(resourcePayload)
        .then(resourceAddSuccess)
        .catch(resourceUpdateError);
    }
  };

  const locationAddError = () => {
    toastr.error("Location Failed", "Submission Error");
  };

  const resourceAddSuccess = useCallback(
    (response, values) => {
      toastr.success("Resource Successfully Added", "Submission Success");
      setResourceFormData((prevState) => {
        const newRes = { ...prevState, ...values };
        newRes.id = response.data.item;
        return newRes;
      });
    },
    [setResourceFormData]
  );

  const resourceAddError = () => {
    toastr.error("Resource Failed", "Submission Error");
  };

  const resourceUpdateSuccess = () => {
    toastr.success("Resource Successfully Updated", "Submission Success");
  };

  const resourceUpdateError = () => {
    toastr.error("Resource Failed", "Update Error");
  };

  return (
    <React.Fragment>
      <div className="bg-light-gradient-bottom bg-white">
        <NavigateBar currentUser={props.currentUser} />
        <Container>
          <div className="align-items-center justify-content-center g-0 min-vh-100 row">
            <div className="py-xl-0 col-lg-8 col-md-8">
              <div className="card">
                <div className="card-body">
                  {resourceFormData.id === 0 ? (
                    <h1 className="mb-1 fw-bold text-center">Add A Resource</h1>
                  ) : (
                    <h1 className="mb-1 fw-bold text-center">
                      Update Resource
                    </h1>
                  )}
                  <Row>
                    <Col xl={8} lg={8} md={12} sm={12} className="mb-2"></Col>
                    <Formik
                      enableReinitialize={true}
                      initialValues={resourceFormData}
                      onSubmit={handleSubmit}
                      validationSchema={resourceFormSchema}
                    >
                      <Form>
                        <Row>
                          <Col>
                            <ErrorMessage
                              name="resourceCategoryId"
                              component="div"
                              className="resource-form-error"
                            />
                            <label
                              htmlFor="resourceCategoryId"
                              className="resource-form-label"
                            >
                              Resource Category
                            </label>
                            <Field
                              as="select"
                              name="resourceCategoryId"
                              className="form-select resource-form-select"
                            >
                              <option value={parseInt(0)}>Select</option>
                              {mappedResourceCategories}
                            </Field>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <ErrorMessage
                              name="name"
                              component="div"
                              className="resource-form-error"
                            />
                            <label
                              htmlFor="name"
                              className="resource-form-label"
                            >
                              Name
                            </label>
                            <Field
                              type="text"
                              name="name"
                              className="form-control resource-form-input"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <label
                              htmlFor="description"
                              className="resource-form-label"
                            >
                              Description
                            </label>
                            <Field
                              type="text"
                              name="description"
                              className="form-control resource-form-desc"
                              as="textarea"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <label
                              htmlFor="logo"
                              className="resource-form-label"
                            >
                              Logo
                            </label>
                            <Field
                              type="text"
                              name="logo"
                              className="form-control resource-form-input"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <label
                              htmlFor="contactName"
                              className="resource-form-label"
                            >
                              Contact Name
                            </label>
                            <Field
                              type="text"
                              name="contactName"
                              className="form-control resource-form-input"
                            />
                          </Col>
                          <Col>
                            <ErrorMessage
                              name="contactEmail"
                              component="div"
                              className="resource-form-error"
                            />
                            <label
                              htmlFor="contactEmail"
                              className="resource-form-label"
                            >
                              Contact Email
                            </label>
                            <Field
                              type="email"
                              name="contactEmail"
                              className="form-control resource-form-input"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <label
                              htmlFor="phone"
                              className="resource-form-label"
                            >
                              Phone
                            </label>
                            <Field
                              type="text"
                              name="phone"
                              className="form-control resource-form-input"
                            />
                          </Col>
                          <Col>
                            <label
                              htmlFor="siteUrl"
                              className="resource-form-label"
                            >
                              Site Url
                            </label>
                            <Field
                              type="text"
                              name="siteUrl"
                              className="form-control resource-form-input"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <ErrorMessage
                              name="locationTypeId"
                              component="div"
                              className="resource-form-error"
                            />
                            <label
                              htmlFor="locationTypeId"
                              className="resource-form-label"
                            >
                              Location Type
                            </label>
                            <Field
                              as="select"
                              name="locationTypeId"
                              className="form-select resource-form-select"
                            >
                              <option value={parseInt(0)}>Select</option>
                              {mappedLocationTypesData}
                            </Field>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <ErrorMessage
                              name="lineOne"
                              component="div"
                              className="resource-form-error"
                            />
                            <label
                              htmlFor="lineOne"
                              className="resource-form-label"
                            >
                              {" "}
                              Address{" "}
                            </label>
                            <Field
                              type="text"
                              name="lineOne"
                              className="form-control resource-form-input"
                              placeholder="1234 Main St"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <label
                              htmlFor="lineTwo"
                              className="resource-form-label"
                            >
                              {" "}
                              Address 2{" "}
                            </label>
                            <Field
                              type="text"
                              name="lineTwo"
                              className="form-control resource-form-input"
                              placeholder="Apartment, studio, or floor"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <ErrorMessage
                              name="city"
                              component="div"
                              className="resource-form-error-address"
                            />
                            <label
                              htmlFor="city"
                              className="resource-form-label"
                            >
                              {" "}
                              City{" "}
                            </label>
                            <Field
                              type="text"
                              name="city"
                              className="form-control resource-form-input"
                            />
                          </Col>
                          <Col>
                            <ErrorMessage
                              name="stateId"
                              component="div"
                              className="resource-form-error-address"
                            />
                            <label
                              htmlFor="stateId"
                              className="resource-form-label"
                            >
                              State
                            </label>
                            <Field
                              as="select"
                              name="stateId"
                              className="form-select"
                            >
                              <option value={parseInt(0)}>Select</option>
                              {mappedStates}
                            </Field>
                          </Col>
                          <Col>
                            <ErrorMessage
                              name="zip"
                              component="div"
                              className="resource-form-error-address"
                            />
                            <label
                              htmlFor="zip"
                              className="resource-form-label"
                            >
                              {" "}
                              Zipcode{" "}
                            </label>
                            <Field
                              type="text"
                              name="zip"
                              className="form-control resource-form-input"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <label
                              htmlFor="latitude"
                              className="resource-form-label"
                            >
                              {" "}
                              Latitude{" "}
                            </label>
                            <Field
                              type="number"
                              name="latitude"
                              className="form-control resource-form-input"
                            />
                          </Col>
                          <Col>
                            <label
                              htmlFor="longitude"
                              className="resource-form-label"
                            >
                              Longitude
                            </label>
                            <Field
                              type="number"
                              name="longitude"
                              className="form-control resource-form-input"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <div className="resource-form-button" align="right">
                            <Button variant="primary" type="submit">
                              {resourceFormData.id === 0 ? "Submit" : "Update"}
                            </Button>
                          </div>
                        </Row>
                      </Form>
                    </Formik>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </React.Fragment>
  );
}
export default ResourceForm;

ResourceForm.propTypes = {
  id: PropTypes.number,
  resourceCategoryId: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string,
  logo: PropTypes.string,
  locationId: PropTypes.number,
  locationTypeId: PropTypes.number,
  lineOne: PropTypes.string,
  lineTwo: PropTypes.string,
  city: PropTypes.string,
  zip: PropTypes.string,
  stateId: PropTypes.number,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  createdBy: PropTypes.number,
  modifiedBy: PropTypes.number,
  contactName: PropTypes.string,
  contactEmail: PropTypes.string,
  phone: PropTypes.string,
  siteUrl: PropTypes.string,
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    roles: PropTypes.arrayOf(string).isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    email: PropTypes.string,
  }),
};
