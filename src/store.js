class Store {
  constructor(dataKeyName = "data") {
    this._treeData = [];
    this._dataKeyName = dataKeyName;
    this.load();
  }

  load() {
    this._treeData = JSON.parse(localStorage.getItem(this._dataKeyName)) || [];
  }

  save(data) {
    let result = JSON.stringify(parse(data));
    function parse(data) {
      return {
        name: data.name,
        children: data.children.length
          ? data.children.map((c) =>
              c.children.length ? parse(c) : { name: c.name, children: [] }
            )
          : [],
      };
    }
    localStorage.setItem(this._dataKeyName, result);
  }

  get data() {
    return this._treeData;
  }
}

export const store = new Store();
