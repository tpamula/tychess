import Coordinates from "./Coordinates";
import CoordinatesCalculator from "./CoordinatesCalculator";

describe("CoordinatesCalculator", () => {
  it("should add coordinates", () => {
    // arrange
    const coordinates = Coordinates.fromAlgebraicNotation("b2");
    const expected = Coordinates.fromAlgebraicNotation("a3");

    // act
    const result = CoordinatesCalculator.add(coordinates, -1, 1);

    // assert
    expect(expected.referentialEquals(result)).toBeTruthy();
  });
});
