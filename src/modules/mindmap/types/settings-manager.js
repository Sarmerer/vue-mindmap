import Setting from './setting'

export default class SettingsManager {
  constructor(mindmap) {
    this.mindmap = mindmap

    this.settings = {}
  }

  /**
   * @param  {...import('./setting').SettingLike} settings
   */
  addSettings(...settings) {
    for (const setting of settings) {
      this.addSetting(setting)
    }
  }

  /**
   * @param {import('./setting').SettingLike} settingsLike
   */
  addSetting(settingsLike) {
    if (this.settings[settingsLike.id]) {
      console.warn('duplicate setting id', settingsLike.id)
    }

    const setting = new Setting(this.mindmap, settingsLike)
    this.settings[setting.id] = setting
    setting.changed()
  }

  get(key) {
    const setting = this.settings[key]
    if (!setting) return

    return setting.value
  }

  set(key, value) {
    const setting = this.settings[key]
    if (!setting) return

    setting.value = value
    setting.changed()
  }

  serialize() {
    const settings = {}
    for (const setting of Object.values(this.settings)) {
      settings[setting.id] = setting.serialize()
    }

    return settings
  }

  deserialize(data) {
    if (!data) return

    for (const key in data) {
      const setting = this.settings[key]
      if (!setting) continue

      setting.deserialize(data[key])
    }
  }
}

/**
 * @param  {...import('./setting').SettingLike} settings
 * @returns {import('./setting').SettingLike[]}
 */
export function defineSettings(...settings) {
  return settings
}
