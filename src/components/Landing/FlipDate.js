import React, { useRef, useEffect, useState } from "react";
import Tick from "@pqina/flip";
import "@pqina/flip/dist/flip.min.css";
import styled from "styled-components";

const StyledTimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  border-radius: 10px;
  padding: 5px;
  @media only screen and (max-width: 576px) {
    margin-right: 0px;
  }
`;

export const FlipDate = ({ value }) => {
  const divRef = useRef();
  const tickRef = useRef();

  const [tickValue, setTickValue] = useState(value);

  // Make the Tick instance and store it in the refs
  useEffect(() => {
    const didInit = (tick) => {
      tickRef.current = tick;
    };

    const currDiv = divRef.current;
    const tickValue = tickRef.current;
    Tick.DOM.create(currDiv, {
      value,
      didInit
    });
    return () => Tick.DOM.destroy(tickValue);
  }, [value]);

  // Start the Tick.down process
  useEffect(() => {
    const counter = Tick.count.down(value, {
      format: ["d", "h", "m", "s"]
    });

    // When the counter updates, update React's state value
    counter.onupdate = function (value) {
      setTickValue(value);
    };

    return () => {
      counter.timer.stop();
    };
  }, [value]);

  // When the tickValue is updated, update the Tick.DOM element
  useEffect(() => {
    if (tickRef.current) {
      tickRef.current.value = {
        days: tickValue[0],
        hours: tickValue[1],
        mins: tickValue[2],
        secs: tickValue[3]
      };
    }
  }, [tickValue]);

  return (
    <div className="tick custom-tick mb-4 mt-2">
      <div data-repeat="true" data-layout="horizontal fit">
        <div className="tick-group">
          <div ref={divRef} style={{ display: "flex" }}>
            <StyledTimeContainer>
              <div
                data-key="days"
                data-repeat="true"
                data-transform="pad(00) -> split -> delay"
              >
                <span data-view="flip"></span>
              </div>
              <p
                className="tick-text-inline"
                style={{ color: "white", margin: 0 }}
              >
                Days
              </p>
            </StyledTimeContainer>

            <StyledTimeContainer>
              <div
                data-key="hours"
                data-repeat="true"
                data-transform="pad(00) -> split -> delay"
              >
                <span data-view="flip"></span>
              </div>
              <p
                className="tick-text-inline"
                style={{ color: "white", margin: 0 }}
              >
                Hours
              </p>
            </StyledTimeContainer>

            <StyledTimeContainer>
              <div
                data-key="mins"
                data-repeat="true"
                data-transform="pad(00) -> split -> delay"
              >
                <span data-view="flip"></span>
              </div>
              <p
                className="tick-text-inline"
                style={{ color: "white", margin: 0 }}
              >
                Minutes
              </p>
            </StyledTimeContainer>

            <StyledTimeContainer>
              <div
                data-key="secs"
                data-repeat="true"
                data-transform="pad(00) -> split -> delay"
              >
                <span data-view="flip"></span>
              </div>
              <p
                className="tick-text-inline"
                style={{ color: "white", margin: 0 }}
              >
                Seconds
              </p>
            </StyledTimeContainer>
          </div>
        </div>
      </div>
    </div>
  );
};