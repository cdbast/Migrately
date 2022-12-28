import React from "react";
import { Card } from "react-bootstrap";
import PropTypes from "prop-types";
import "./resourcestyles.css";
import debug from "sabio-debug";

const _logger = debug.extend("ResourceCard");

const ResourceCard = (props) => {
  const singleResource = props.resourceData;
  const singleLocation = singleResource.locationId;
  _logger(props, "look over here");

  return (
    <React.Fragment>
      <Card className="resourceCard">
        <Card.Body>
          <Card.Title className="card-subtitle">
            {singleResource.resourceCategoryId.name}
          </Card.Title>
          <Card.Title classsName="card-title">{singleResource.name}</Card.Title>
          <Card.Subtitle>{singleResource.logo}</Card.Subtitle>
          <Card.Text>{singleResource.description}</Card.Text>
        </Card.Body>
        {singleLocation.city !== null || undefined ? (
          <Card.Body>
            <Card.Subtitle classsName="card-subtitle">
              {singleLocation.locationType.name}
            </Card.Subtitle>
            <Card.Text className="resource-address">
              {singleLocation.lineOne} {singleLocation.lineTwo}
            </Card.Text>
            <Card.Text>
              {singleLocation.city}, {singleLocation.state.name},{" "}
              {singleLocation.zip}
            </Card.Text>
          </Card.Body>
        ) : (
          <div></div>
        )}
        <Card.Text>{singleResource.contactName}</Card.Text>
        <Card.Text>{singleResource.contactEmail}</Card.Text>
        <Card.Text>{singleResource.phone}</Card.Text>
        <Card.Link href={singleResource.siteUrl}>Site Link</Card.Link>
      </Card>
    </React.Fragment>
  );
};

ResourceCard.propTypes = {
  resourceData: PropTypes.shape({
    id: PropTypes.number,
    resourceCategoryId: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    logo: PropTypes.string,
    locationId: PropTypes.shape({
      id: PropTypes.number,
      locationType: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
      lineOne: PropTypes.string,
      lineTwo: PropTypes.string,
      city: PropTypes.string,
      zip: PropTypes.string,
      state: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }),
    contactName: PropTypes.string,
    contactEmail: PropTypes.string,
    phone: PropTypes.string,
    siteUrl: PropTypes.string,
  }),
};

export default ResourceCard;
