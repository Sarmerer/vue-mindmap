class Document {
  constructor(
    fullName,
    schema = {},
    options = { rawName: false, unique: false }
  ) {
    this._id = fullName ? fullName : `mindmapdocument-${Date.now()}`;
    this._schema = schema;
    this._options = options;
    const { lastEdit, name, data } = this.load();
    this._lastEdit = lastEdit;
    this._data = data;
    this._name = name;
  }

  save(data) {
    if (!data) data = this._data;
    const result = JSON.stringify(defaultSchema(this._name, data));
    localStorage.setItem(this._id, result);
  }

  load() {
    if (!localStorageHas(this._id))
      localStorage.setItem(this._id, JSON.stringify(this._schema));
    return JSON.parse(localStorage.getItem(this._id));
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

  get id() {
    return this._id;
  }

  get lastEdit() {
    return this._lastEdit;
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
      defaultSchema("settings", { lastDocument: "" }),
      { rawName: true, unique: true }
    );

    this._document = new Document(
      this._settings.get("lastDocument"),
      defaultSchema()
    );
    this._settings.set("lastDocument", this._document.id);
    this._loaded = true;
  }

  save(data) {
    if (!this._loaded) return;
    this._settings.save();
    this._document.save(data);
  }

  setDocument(id) {
    if (!id) return;
    if (localStorageHas(id)) {
      this.document = id;
      return this.data;
    }
  }

  newDocument() {
    this._document = new Document(
      undefined,
      defaultSchema(`document-${this._documents.length}`)
    );
    this._settings.set("lastDocument", this._document.id);
    this.getDocumentsList();
    return this._document._data;
  }

  deleteDocument(id) {
    if (!id) return;
    if (localStorageHas(id)) {
      localStorage.removeItem(id);
      this.getDocumentsList();
      if (this._document.id === id)
        if (this._documents.length)
          this._document = this._documents[this._documents.length - 1];
        else this._document = new Document(undefined, defaultSchema());
      this._settings.set("lastDocument", this._document.id);
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

  get document() {
    return this._document;
  }

  get documents() {
    return this._documents;
  }

  set lastDocument(value) {
    if (this._settings) this._settings.set("lastDocument", value);
  }

  set document(id) {
    this._document = new Document(id, defaultSchema());
  }
}

function localStorageHas(key) {
  return localStorage.getItem(key) !== null;
}

function defaultSchema(name, data) {
  return { lastEdit: Date.now(), name: name || "document", data: data || {} };
}

export const store = new Store();
