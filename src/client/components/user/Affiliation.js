import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAffiliations, updateAffiliations } from "../../store/affiliation";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import { toast } from "react-toastify";

function arrayEquals(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  a.sort();
  b.sort();

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function Affiliation() {
  const { affiliationOptions, storeAffiliations } = useSelector((state) => ({
    affiliationOptions: state.affiliation.options,
    storeAffiliations: state.affiliation.list,
  }));

  const [affiliations, setAffiliations] = useState(storeAffiliations);
  const dispatch = useDispatch();

  // only fire once to get the state
  useEffect(() => {
    dispatch(getAffiliations());
  }, []);

  useEffect(() => {
    setAffiliations(storeAffiliations);
  }, [storeAffiliations]);

  const affilationChanged = !arrayEquals(storeAffiliations, affiliations);

  const handleSave = () => {
    if (affilationChanged) {
      dispatch(updateAffiliations(affiliations));
    }
  };

  const onChange = (affil) => (event) => {
    if (
      !affiliations.some(
        (aff) => aff.house == affil.house && aff.status == affil.status
      )
    ) {
      setAffiliations([...affiliations, affil]);
    } else {
      if (affil.house == "dabney" && affil.verified == true) {
        toast.warning(
          "Please contact the Dabney secretary if you wish to aler your membership"
        );
      }
      let filltered = affiliations.filter((aff) => {
        return aff.house + aff.status !== affil.house + affil.status;
      });
      setAffiliations(filltered);
    }
  };

  let labeledAffOptions = JSON.parse(JSON.stringify(affiliationOptions));
  affiliations.forEach((aff) => {
    let key =
      aff.house[0].toUpperCase() +
      aff.house.substr(1) +
      " " +
      aff.status[0].toUpperCase() +
      aff.status.substr(1);
    labeledAffOptions[key].checked = true;
    labeledAffOptions[key].verified = aff.verified || false;
  });

  return (
    <Accordion defaultActiveKey="1" className="mt-3">
      <Accordion.Item>
        <Accordion.Header>Select House Membership</Accordion.Header>
        <Accordion.Body>
          <Card.Body>
            {Object.keys(labeledAffOptions).map((name) => {
              const labelVer =
                labeledAffOptions[name].verified === false ? " *" : "";
              return (
                <Form.Group className="mb-0" controlId={name} key={name}>
                  <Form.Check
                    type="checkbox"
                    label={name + labelVer}
                    checked={!!labeledAffOptions[name].checked}
                    onChange={onChange(affiliationOptions[name])}
                  />
                </Form.Group>
              );
            })}

            <Card.Text>
              <small>
                An * means that your membership has not been verified yet.
              </small>
            </Card.Text>
            <Button
              className={affilationChanged ? "" : "disabled"}
              onClick={handleSave}
            >
              Save Affiliations
            </Button>
          </Card.Body>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default Affiliation;
