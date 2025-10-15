import React from "react";
import { Tooltip } from "react-bootstrap";
import styled from "styled-components";

const AppTooltip = styled(Tooltip)`
  --bs-tooltip-opacity: 1;

  .tooltip-arrow {
    --bs-tooltip-bg: var(--bs-white);
  }

  .tooltip-inner {
    --bs-tooltip-bg: var(--bs-white);
    --bs-tooltip-color: var(--bs-black);
  }
`;

export default AppTooltip;
