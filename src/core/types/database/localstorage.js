import { Database } from "./generic";

export class LocalStorage extends Database {
  createTree(tree) {
    this.setTree(tree.id, tree);
  }

  getTrees() {
    const trees = localStorage.getItem("trees");
    if (!trees) return {};

    return JSON.parse(trees);
  }

  getTree(id) {
    if (!id) return null;

    return this.getTrees()[id] ?? null;
  }

  setTree(id, tree) {
    const trees = this.getTrees();
    trees[id] = tree;
    localStorage.setItem("trees", JSON.stringify(trees));
  }

  updateTree(id, properties) {
    const tree = this.getTree(id);
    if (!tree) return;

    const newTree = { ...tree, ...properties };
    this.setTree(id, newTree);
  }

  deleteTree(id) {
    const trees = this.getTrees();

    if (this.getLastTreeId() === id) {
      const treeIds = Object.keys(trees);

      if (treeIds.length > 1) {
        const index = treeIds.indexOf(id);
        const newLastTreeId = treeIds[index === 0 ? 1 : index - 1];
        this.setLastTreeId(newLastTreeId);
      } else {
        this.setLastTreeId(null);
      }
    }

    delete trees[id];
    localStorage.setItem("trees", JSON.stringify(trees));
  }

  getLastTreeId() {
    return localStorage.getItem("lastTree") ?? null;
  }

  setLastTreeId(id) {
    localStorage.setItem("lastTree", id);
  }
}
