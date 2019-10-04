type File = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
export default File;

export const files: File[] = ["a", "b", "c", "d", "e", "f", "g", "h"];

export const isFile = (potentialFile: string | File): potentialFile is File => {
  return files.map(f => f.toString()).includes(potentialFile);
};
