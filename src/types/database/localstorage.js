import { Database } from "./generic";

export class LocalStorage extends Database {
  readTrees() {
    const trees = localStorage.getItem("trees");
    if (!trees) return {};

    return JSON.parse(trees);
  }

  readTree(id) {
    const tree = this.readTrees()[id];
    return tree ?? null;
  }

  writeTree(id, tree) {
    const defer = () => {
      localStorage.setItem("trees", JSON.stringify(trees));
    };

    const trees = this.readTrees();
    const lastTree = trees[id];

    if (!lastTree || lastTree.id === tree.id) {
      trees[id] = tree;
      return defer();
    }

    trees[lastTree.id] = lastTree;
    trees[id] = tree;
    return defer();
  }
}
