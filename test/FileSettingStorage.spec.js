const {FileSettingStorage} = require("../main");
const assert = require('assert');

describe('FileSettingStorage', function() {
  it('should be able to get settings', async function() {
    const settingStorage = new FileSettingStorage();
    const settings = await settingStorage.getSettings('my-shop', '5555');
    assert.notEqual(settings, undefined);
    assert.equal(settings.getBoolean("isEnabled"), true);
    assert.equal(settings.getNumber("maxWords"), 5);
    assert.equal(settings.getString("label"), "Shopping");
  });

  it('should be able to set settings', async function() {
    const settingStorage = new FileSettingStorage();
    await settingStorage.setSettings('my-shop', '4444', {
      isEnabled: false,
      maxWords: 2
    });
    const settings = await settingStorage.getSettings('my-shop', '4444');
    assert.notEqual(settings, undefined);
    assert.equal(settings.getBoolean("isEnabled"), false);
    assert.equal(settings.getNumber("maxWords"), 2);
  });

  it('should delete settings', async function() {
    const settingStorage = new FileSettingStorage();
    await settingStorage.setSettings('my-shop', '4444', {
      isEnabled: false,
      maxWords: 2
    });
    await settingStorage.deleteSettings('my-shop', '4444');
    const settings = await settingStorage.getSettings('my-shop', '4444');
    assert.notEqual(settings, undefined);
    assert.equal(settings.getBoolean('isEnabled'), undefined);
  });
});