import React from "react";
import styled from "styled-components";
import { Block, Shell, Grid, Opener, PlateSurface, role } from "./_dossier";
import ErrorBoundary from "./ErrorBoundary";
import Orchestrator from "./Orchestrator";

// The working sandbox as a section of its own: the heading beside the plate on
// a wide screen, above it on a narrow one.
const Cols = styled(Grid)`
  > .head,
  > .plate {
    grid-column: 1 / -1;
  }

  @media (min-width: ${(p) => p.theme.bp.hero}) {
    align-items: start;

    /* the heading stays in view beside the plate, as "What I do" does */
    > .head {
      grid-column: 1 / span 4;
      position: sticky;
      top: calc(${(p) => p.theme.layout.nav} + ${(p) => p.theme.space.xl});
    }
    > .plate {
      grid-column: 5 / span 8;
    }
  }
`;

const SandboxPlate = styled(PlateSurface)`
  padding: ${(p) => p.theme.space.md};

  @media (min-width: ${(p) => p.theme.bp.grid2}) {
    padding: ${(p) => p.theme.space.lg};
  }
`;

const Down = styled.p`
  ${role("lead")}
  max-width: 30ch;
  padding-block: ${(p) => p.theme.space["2xl"]};
`;

// Shown in the plate if the sandbox throws. The error itself goes to the log.
const SandboxDown = () => (
  <Down role="status">The sandbox could not start. The work above shows the same systems.</Down>
);

/**
 * The orchestrator sandbox: pick a request and watch it route.
 *
 * @param {{sandbox: React.ReactNode}} props The live piece on the plate;
 *     defaults to the Orchestrator. Tests and the preview pass their own.
 * @returns {React.ReactElement}
 */
const Sandbox = ({ sandbox = <Orchestrator /> }) => (
  <Block id="sandbox" aria-labelledby="sandbox-h" $gap="l">
    <Shell>
      <Cols>
        <div className="head">
          <Opener
            id="sandbox-h"
            title="The orchestrator"
            lede="Pick a request and watch it route through the system."
          />
        </div>
        <SandboxPlate className="plate" tone="field">
          <ErrorBoundary fallback={<SandboxDown />}>{sandbox}</ErrorBoundary>
        </SandboxPlate>
      </Cols>
    </Shell>
  </Block>
);

export default Sandbox;
