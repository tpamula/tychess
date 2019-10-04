import Move from "./Move";

describe("Move", () => {
  it.each<[string, string, string[]]>([
    ["a1", "a4", ["a2", "a3", "a4"]],
    ["a1", "a1", []]
  ])(
    "should return coordinates between from and to: %s to %s",
    (fromString, toString, expectedAsAlgebraicNotation) => {
      // arrange
      const move = Move.fromUciString(`${fromString}${toString}`);

      // act
      const result = move.getTraversalCoordinatesBetweenFromTo();

      // assert
      expect(result.map(r => r.toAlgebraicNotationString())).toEqual(
        expectedAsAlgebraicNotation
      );
    }
  );
});
