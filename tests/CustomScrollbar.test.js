import React from "react";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import CustomScrollbar from "../src/CustomScrollbar";

test("It should render the custom scrollbar component", () => {
  const { queryByTestId, debug } = render(<CustomScrollbar contentHeight={800} />);

  expect(queryByTestId("customScrollBar")).not.toBeNull();

  debug();
});
