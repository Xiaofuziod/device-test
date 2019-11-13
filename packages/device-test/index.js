import deviceTest from './components/index.vue'

deviceTest.install = function (Vue) {
  Vue.component(deviceTest.name, deviceTest)
}
export default deviceTest