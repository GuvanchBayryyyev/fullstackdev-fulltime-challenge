import { mount } from '@vue/test-utils'
import LockerComponent from '@/components/LockerComponent.vue'

describe('Locker Component unit tests', () => {
  test('is a Vue instance and button disabled', () => {
    const wrapper = mount(LockerComponent)
    // should not allow for `username` less than 7 characters, excludes whitespace
    expect(wrapper.find('btnChooseDisabled')).toBeTruthy()
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
