class Document {
  constructor(
    fullName,
    schema = {},
    options = { rawName: false, unique: false }
  ) {
    this._name = fullName ? fullName : `mindmapdocument-${Date.now()}`; //${fullName ? `-${fullName}` : ""}
    this._schema = schema;
    this._options = options;
    const { lastEdit, data } = this.load();
    this._lastEdit = lastEdit;
    this._data = data;
  }

  save(data) {
    if (!data) data = this._data;
    const result = JSON.stringify({ lastEdit: Date.now(), data: data });
    localStorage.setItem(this._name, result);
  }

  load() {
    if (!localStorageHas(this._name))
      localStorage.setItem(
        this._name,
        JSON.stringify({ lastEdit: 0, data: this._schema })
      );
    return (
      JSON.parse(localStorage.getItem(this._name)) || {
        lastEdit: Date.now(),
        data: [],
      }
    );
  }

  set(key, value) {
    this._data[key] = value;
  }

  get(key) {
    return this._data[key];
  }

  get name() {
    return this._name;
  }
}

class Store {
  constructor() {
    this._documents = [];
    this._document = null;
    this._settings = null;
    this._loaded = false;
    this.load();
  }

  load() {
    this.getDocumentsList();
    this._settings = new Document(
      "settings",
      { lastDocument: "" },
      { rawName: true, unique: true }
    );

    this._document = new Document(this._settings.get("lastDocument"), {
      name: "",
      children: [],
    });
    this._settings.set("lastDocument", this._document._name);
    this._loaded = true;
  }

  save(data) {
    if (!this._loaded) return;
    this._settings.save();
    this._document.save(data);
  }

  setDocument(name) {
    if (!name) return;
    if (localStorageHas(name)) {
      this.document = name;
      return this.data;
    }
  }

  newDocument() {
    this._document = new Document(undefined, { name: "", children: [] });
    this._settings.set("lastDocument", this._document._name);
    this.getDocumentsList();
    return this._document._data;
  }

  deleteDocument(name) {
    if (!name) return;
    if (localStorageHas(name)) {
      localStorage.removeItem(name);
      this.getDocumentsList();
      if (this._document.name === name)
        if (this._documents.length)
          this._document = this._documents[this._documents.length - 1];
        else this.document = "mindmapdocument-1";
      this._settings.set("lastDocument", this._document.name);
      this.getDocumentsList();
      return this.data;
    }
  }

  getDocumentsList() {
    this._documents = Object.keys(localStorage)
      .filter((i) => i.startsWith("mindmapdocument"))
      .map((doc) => new Document(doc));
  }

  get data() {
    return this._document._data;
  }

  get documents() {
    return this._documents;
  }

  set lastDocument(value) {
    if (this._settings) this._settings.set("lastDocument", value);
  }

  set document(name) {
    this._document = new Document(name, { lastEdit: 0, children: [] });
  }
}

function localStorageHas(key) {
  return localStorage.getItem(key) !== null;
}

// function localStorageGet(key) {
//   if (localStorageHas(key)) return JSON.parse(localStorage.getItem(key));
// }

export const store = new Store();
